import {
  MemoryItem,
  MemoryVersion,
  SearchResult,
  SearchFilter,
  SyncStatus,
  ConflictItem,
  SyncJob,
  SyncActivityEvent,
  AuditLog,
  DeviceInfo,
} from '@/types';
import { generateEmbedding, cosineSimilarity, calculateKeywordScore } from '@/lib/vector';
import {
  generateSeedMemories,
  INITIAL_DEVICES,
  INITIAL_CONFLICTS,
  INITIAL_SYNC_ACTIVITIES,
  INITIAL_AUDIT_LOGS,
} from '@/lib/data/seed';

export interface IMemoryStore {
  search(query: string, filter?: Partial<SearchFilter>): Promise<SearchResult[]>;
  getById(id: string): Promise<MemoryItem | null>;
  save(item: MemoryItem): Promise<void>;
  update(id: string, updates: Partial<MemoryItem>): Promise<MemoryItem>;
  delete(id: string): Promise<boolean>;
  getVersions(memoryId: string): Promise<MemoryVersion[]>;
  getAll(): Promise<MemoryItem[]>;
}

// In-Memory Persistent State Singleton
class EdgeMemoryRepository {
  private static instance: EdgeMemoryRepository;
  public memories: Map<string, MemoryItem> = new Map();
  public versions: Map<string, MemoryVersion[]> = new Map();
  public conflicts: Map<string, ConflictItem> = new Map();
  public devices: Map<string, DeviceInfo> = new Map();
  public syncQueue: SyncJob[] = [];
  public syncActivities: SyncActivityEvent[] = [];
  public auditLogs: AuditLog[] = [];
  public isOfflineModeSimulated: boolean = false;
  public qdrantEdgeConnected: boolean = true;
  public qdrantServerConnected: boolean = true;

  private constructor() {
    this.init();
  }

  public static getInstance(): EdgeMemoryRepository {
    if (!EdgeMemoryRepository.instance) {
      EdgeMemoryRepository.instance = new EdgeMemoryRepository();
    }
    return EdgeMemoryRepository.instance;
  }

  private init() {
    const seed = generateSeedMemories();
    for (const mem of seed) {
      this.memories.set(mem.id, mem);

      // Pre-seed initial version history
      this.versions.set(mem.id, [
        {
          id: `VER-${mem.id}-1`,
          memoryId: mem.id,
          version: 1,
          author: mem.userId,
          deviceId: mem.deviceId,
          timestamp: mem.createdAt,
          content: mem.content,
          diffDescription: 'Initial memory capture and local vector indexing',
          source: mem.source,
          syncStatus: mem.syncStatus,
        },
      ]);
    }

    // Add extra version history for M-1024 to illustrate version tree
    const m1024Versions: MemoryVersion[] = [
      {
        id: 'VER-M1024-1',
        memoryId: 'M-1024',
        version: 1,
        author: 'USR-OPERATOR',
        deviceId: 'DEV-001',
        timestamp: '2026-09-25T14:32:00Z',
        content: 'Machine Edge #01 spindle bearing temperature registered 75.0°C nominal baseline.',
        diffDescription: 'Initial calibration capture',
        source: 'sensor_telemetry',
        syncStatus: 'SYNCED',
      },
      {
        id: 'VER-M1024-2',
        memoryId: 'M-1024',
        version: 2,
        author: 'CLOUD-ANALYTICS',
        deviceId: 'CLOUD-SERVER',
        timestamp: '2026-09-25T16:10:00Z',
        content: 'Machine Edge #01 primary spindle bearing operating temperature reported at 79.1°C during milling cycle #4402.',
        diffDescription: 'Cloud smoothing model telemetry revision',
        source: 'cloud_sync',
        syncStatus: 'SYNCED',
      },
      {
        id: 'VER-M1024-3',
        memoryId: 'M-1024',
        version: 3,
        author: 'USR-OPERATOR',
        deviceId: 'DEV-001',
        timestamp: '2026-09-25T18:40:00Z',
        content:
          'Machine Edge #01 primary spindle bearing ceramic cage registered elevated operating temperature at 82.4°C during high-torque milling cycle #4402. Threshold is 75°C. Cooling lubricant flow nominal at 3.2 L/min.',
        diffDescription: 'On-device physical sensor thermocouple verification override',
        source: 'sensor_telemetry',
        syncStatus: 'CONFLICT',
      },
    ];
    this.versions.set('M-1024', m1024Versions);

    for (const dev of INITIAL_DEVICES) {
      this.devices.set(dev.id, dev);
    }

    for (const conf of INITIAL_CONFLICTS) {
      this.conflicts.set(conf.id, conf);
    }

    this.syncActivities = [...INITIAL_SYNC_ACTIVITIES];
    this.auditLogs = [...INITIAL_AUDIT_LOGS];
  }
}

export const repo = EdgeMemoryRepository.getInstance();

/**
 * EdgeMemoryStore: Manages fast local memory on device using Qdrant Edge semantics
 */
export class EdgeMemoryStore implements IMemoryStore {
  async search(query: string, filter?: Partial<SearchFilter>): Promise<SearchResult[]> {
    const queryVec = generateEmbedding(query);
    const all = Array.from(repo.memories.values());
    const results: SearchResult[] = [];

    for (const mem of all) {
      // Filter out non-matching device if filtered
      if (filter?.deviceId && filter.deviceId !== 'ALL' && mem.deviceId !== filter.deviceId) {
        continue;
      }
      // Filter by type
      if (filter?.type && filter.type !== 'ALL' && mem.type !== filter.type) {
        continue;
      }
      // Filter by importance
      if (filter?.importance && filter.importance !== 'ALL' && mem.importance !== filter.importance) {
        continue;
      }
      // Filter by sensitivity
      if (filter?.sensitivity && filter.sensitivity !== 'ALL' && mem.sensitivity !== filter.sensitivity) {
        continue;
      }

      const vecSim = cosineSimilarity(queryVec, mem.embedding);
      const kwScore = calculateKeywordScore(query, mem.content, mem.title, mem.tags);

      // Hybrid rank = 65% vector similarity + 35% keyword match
      const hybridScore = Number((vecSim * 0.65 + kwScore * 0.35).toFixed(4));

      if (hybridScore > (filter?.minSimilarity || 0.15)) {
        const matchedFields: string[] = [];
        if (kwScore > 0.2) matchedFields.push('title', 'content');
        if (vecSim > 0.4) matchedFields.push('vector_semantic');

        results.push({
          memory: mem,
          score: hybridScore,
          vectorSimilarity: Number(vecSim.toFixed(4)),
          keywordScore: Number(kwScore.toFixed(4)),
          sourceOrigin: 'LOCAL_EDGE',
          matchedFields,
        });
      }
    }

    // Sort by hybrid score descending
    return results.sort((a, b) => b.score - a.score);
  }

  async getById(id: string): Promise<MemoryItem | null> {
    const item = repo.memories.get(id);
    if (!item) return null;
    // update access timestamp
    item.lastAccessedAt = new Date().toISOString();
    return item;
  }

  async save(item: MemoryItem): Promise<void> {
    if (!item.embedding || item.embedding.length === 0) {
      item.embedding = generateEmbedding(`${item.title} ${item.content} ${item.tags.join(' ')}`);
    }
    repo.memories.set(item.id, item);

    // Save initial version
    const existingVersions = repo.versions.get(item.id) || [];
    repo.versions.set(item.id, [
      ...existingVersions,
      {
        id: `VER-${item.id}-${item.version}`,
        memoryId: item.id,
        version: item.version,
        author: item.userId || 'USR-OPERATOR',
        deviceId: item.deviceId,
        timestamp: item.updatedAt || new Date().toISOString(),
        content: item.content,
        diffDescription: `Created version ${item.version}`,
        source: item.source,
        syncStatus: item.syncStatus,
      },
    ]);

    // Add audit log
    repo.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: item.userId || 'USR-OPERATOR',
      deviceId: item.deviceId,
      action: 'MEMORY_CREATE',
      resource: item.id,
      newState: `v${item.version} (${item.title})`,
      details: `Created new ${item.type} memory item with importance ${item.importance}.`,
    });
  }

  async update(id: string, updates: Partial<MemoryItem>): Promise<MemoryItem> {
    const existing = repo.memories.get(id);
    if (!existing) throw new Error(`Memory ${id} not found on edge`);

    const prevContent = existing.content;
    const newVersionNum = existing.version + 1;

    const updated: MemoryItem = {
      ...existing,
      ...updates,
      version: newVersionNum,
      updatedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
    };

    if (updates.title || updates.content || updates.tags) {
      updated.embedding = generateEmbedding(`${updated.title} ${updated.content} ${updated.tags.join(' ')}`);
    }

    // Set sync status to PENDING or CONFLICT depending on connectivity
    if (updated.isLocalOnly) {
      updated.syncStatus = 'DEFERRED';
    } else {
      updated.syncStatus = repo.isOfflineModeSimulated ? 'PENDING' : 'QUEUED';
    }

    repo.memories.set(id, updated);

    // Track Version history
    const versions = repo.versions.get(id) || [];
    versions.push({
      id: `VER-${id}-${newVersionNum}`,
      memoryId: id,
      version: newVersionNum,
      author: updates.userId || 'USR-OPERATOR',
      deviceId: updated.deviceId,
      timestamp: updated.updatedAt,
      content: updated.content,
      diffDescription: updates.content !== prevContent ? 'Content modified' : 'Metadata updated',
      source: updated.source,
      syncStatus: updated.syncStatus,
    });
    repo.versions.set(id, versions);

    // Audit log
    repo.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: updates.userId || 'USR-OPERATOR',
      deviceId: updated.deviceId,
      action: 'MEMORY_UPDATE',
      resource: id,
      previousState: `v${existing.version}`,
      newState: `v${newVersionNum}`,
      details: `Updated memory ${id} to version ${newVersionNum}.`,
    });

    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const existing = repo.memories.get(id);
    if (!existing) return false;

    repo.memories.delete(id);

    repo.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'USR-OPERATOR',
      deviceId: existing.deviceId,
      action: 'MEMORY_DELETE',
      resource: id,
      previousState: `v${existing.version}`,
      details: `Deleted memory record ${id}.`,
    });

    return true;
  }

  async getVersions(memoryId: string): Promise<MemoryVersion[]> {
    return repo.versions.get(memoryId) || [];
  }

  async getAll(): Promise<MemoryItem[]> {
    return Array.from(repo.memories.values());
  }
}

/**
 * CloudMemoryStore: Represents centralized Qdrant Server & cloud knowledge base
 */
export class CloudMemoryStore implements IMemoryStore {
  async search(query: string, filter?: Partial<SearchFilter>): Promise<SearchResult[]> {
    // If offline simulation is active, cloud search fails or is unavailable
    if (repo.isOfflineModeSimulated) {
      throw new Error('Cloud Qdrant Server is unreachable while offline');
    }

    const queryVec = generateEmbedding(query);
    // Cloud only sees memories that are SYNCED and not LOCAL_ONLY
    const cloudMemories = Array.from(repo.memories.values()).filter(
      (m) => m.syncStatus === 'SYNCED' && !m.isLocalOnly && m.sensitivity !== 'LOCAL_ONLY'
    );

    const results: SearchResult[] = [];
    for (const mem of cloudMemories) {
      if (filter?.deviceId && filter.deviceId !== 'ALL' && mem.deviceId !== filter.deviceId) {
        continue;
      }
      const vecSim = cosineSimilarity(queryVec, mem.embedding);
      const kwScore = calculateKeywordScore(query, mem.content, mem.title, mem.tags);
      const hybridScore = Number((vecSim * 0.65 + kwScore * 0.35).toFixed(4));

      if (hybridScore > (filter?.minSimilarity || 0.15)) {
        results.push({
          memory: mem,
          score: hybridScore,
          vectorSimilarity: Number(vecSim.toFixed(4)),
          keywordScore: Number(kwScore.toFixed(4)),
          sourceOrigin: 'CLOUD_KNOWLEDGE',
          matchedFields: ['cloud_vector_index'],
        });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  async getById(id: string): Promise<MemoryItem | null> {
    if (repo.isOfflineModeSimulated) {
      throw new Error('Cloud is offline');
    }
    const mem = repo.memories.get(id);
    if (!mem || mem.isLocalOnly || mem.syncStatus !== 'SYNCED') return null;
    return mem;
  }

  async save(item: MemoryItem): Promise<void> {
    if (repo.isOfflineModeSimulated) throw new Error('Cloud offline');
    // Save to cloud Qdrant server
    item.cloudStatus = 'SYNCED';
    item.syncStatus = 'SYNCED';
    repo.memories.set(item.id, item);
  }

  async update(id: string, updates: Partial<MemoryItem>): Promise<MemoryItem> {
    if (repo.isOfflineModeSimulated) throw new Error('Cloud offline');
    const existing = repo.memories.get(id);
    if (!existing) throw new Error('Not found on cloud');
    const updated = { ...existing, ...updates, cloudStatus: 'SYNCED' as const };
    repo.memories.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    if (repo.isOfflineModeSimulated) throw new Error('Cloud offline');
    return repo.memories.delete(id);
  }

  async getVersions(memoryId: string): Promise<MemoryVersion[]> {
    return repo.versions.get(memoryId) || [];
  }

  async getAll(): Promise<MemoryItem[]> {
    if (repo.isOfflineModeSimulated) return [];
    return Array.from(repo.memories.values()).filter((m) => m.syncStatus === 'SYNCED' && !m.isLocalOnly);
  }
}

/**
 * Unified Memory System with Intelligent Routing and Edge-First Fallback
 */
export class MemoryStoreManager {
  public edgeStore: EdgeMemoryStore;
  public cloudStore: CloudMemoryStore;

  constructor() {
    this.edgeStore = new EdgeMemoryStore();
    this.cloudStore = new CloudMemoryStore();
  }

  /**
   * Hybrid Edge-First Search
   */
  async search(query: string, filter?: Partial<SearchFilter>): Promise<SearchResult[]> {
    const mode = filter?.mode || 'HYBRID';

    // 1. If mode is LOCAL: search edge only
    if (mode === 'LOCAL') {
      return this.edgeStore.search(query, filter);
    }

    // 2. If mode is CLOUD:
    if (mode === 'CLOUD') {
      if (repo.isOfflineModeSimulated) {
        return [];
      }
      return this.cloudStore.search(query, filter);
    }

    // 3. HYBRID MODE: Query Edge first, then merge Cloud knowledge if online
    const edgeResults = await this.edgeStore.search(query, filter);

    if (repo.isOfflineModeSimulated) {
      // Completely seamless offline degradation: return edge results directly
      return edgeResults;
    }

    try {
      const cloudResults = await this.cloudStore.search(query, filter);
      const seenIds = new Set(edgeResults.map((r) => r.memory.id));

      const merged = [...edgeResults];
      for (const cr of cloudResults) {
        if (!seenIds.has(cr.memory.id)) {
          merged.push(cr);
          seenIds.add(cr.memory.id);
        } else {
          // If in both, label as HYBRID_MERGED
          const existing = merged.find((m) => m.memory.id === cr.memory.id);
          if (existing) {
            existing.sourceOrigin = 'HYBRID_MERGED';
          }
        }
      }

      return merged.sort((a, b) => b.score - a.score);
    } catch {
      // Gracefully fall back to local results on any network or cloud glitch
      return edgeResults;
    }
  }
}

export const memoryManager = new MemoryStoreManager();
