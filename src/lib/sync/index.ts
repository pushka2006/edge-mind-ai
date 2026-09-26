import { repo } from '@/lib/storage';
import {
  ConflictItem,
  MemoryItem,
  SyncActivityEvent,
  SyncPriority,
} from '@/types';
import { cosineSimilarity } from '@/lib/vector';

export interface SyncStatusSummary {
  isOffline: boolean;
  totalMemories: number;
  syncedCount: number;
  pendingCount: number;
  queuedCount: number;
  failedCount: number;
  conflictCount: number;
  lastSyncTimestamp: string;
  storageUsedGb: number;
  storageTotalGb: number;
  storagePercent: number;
  networkLatencyMs: number;
}

export class SyncEngine {
  /**
   * Evaluate connectivity and sync statistics
   */
  getSummary(): SyncStatusSummary {
    const all = Array.from(repo.memories.values());
    let synced = 0;
    let pending = 0;
    let queued = 0;
    let failed = 0;

    for (const m of all) {
      if (m.syncStatus === 'SYNCED') synced++;
      else if (m.syncStatus === 'PENDING') pending++;
      else if (m.syncStatus === 'QUEUED') queued++;
      else if (m.syncStatus === 'FAILED') failed++;
    }

    const unresolvedConflicts = Array.from(repo.conflicts.values()).filter(
      (c) => c.status === 'UNRESOLVED'
    ).length;

    // Default primary edge device DEV-001 stats
    const dev = repo.devices.get('DEV-001');
    const storageUsed = dev ? dev.storageUsedGb : 4.8;
    const storageTotal = dev ? dev.storageTotalGb : 16.0;

    return {
      isOffline: repo.isOfflineModeSimulated,
      totalMemories: all.length,
      syncedCount: synced,
      pendingCount: pending,
      queuedCount: queued,
      failedCount: failed,
      conflictCount: unresolvedConflicts,
      lastSyncTimestamp: repo.syncActivities[0]?.timestamp || new Date().toISOString(),
      storageUsedGb: storageUsed,
      storageTotalGb: storageTotal,
      storagePercent: Math.round((storageUsed / storageTotal) * 100),
      networkLatencyMs: repo.isOfflineModeSimulated ? 0 : 42,
    };
  }

  /**
   * Toggle simulated offline mode
   */
  toggleOfflineMode(enableOffline?: boolean): boolean {
    if (enableOffline !== undefined) {
      repo.isOfflineModeSimulated = enableOffline;
    } else {
      repo.isOfflineModeSimulated = !repo.isOfflineModeSimulated;
    }

    const mode = repo.isOfflineModeSimulated;

    repo.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'USR-OPERATOR',
      deviceId: 'DEV-001',
      action: mode ? 'OFFLINE_ENGAGE' : 'ONLINE_RESTORE',
      resource: 'ConnectivityManager',
      details: mode
        ? 'Offline simulation mode engaged. Cloud synchronization paused; local edge intelligence autonomous.'
        : 'Online connectivity restored. Resuming synchronization engine and priority queue.',
    });

    if (!mode) {
      // Automatically resume and flush pending queue when coming back online
      this.triggerSync();
    }

    return repo.isOfflineModeSimulated;
  }

  /**
   * Trigger delta synchronization process
   */
  async triggerSync(): Promise<{
    processed: number;
    conflictsFound: number;
    failed: number;
  }> {
    if (repo.isOfflineModeSimulated) {
      throw new Error('Cannot synchronize while offline. Connect to network first.');
    }

    const all = Array.from(repo.memories.values());
    const eligibleToSync = all.filter(
      (m) =>
        (m.syncStatus === 'PENDING' || m.syncStatus === 'QUEUED' || m.syncStatus === 'FAILED') &&
        !m.isLocalOnly &&
        m.sensitivity !== 'LOCAL_ONLY'
    );

    let processed = 0;
    let conflictsFound = 0;
    let failed = 0;

    // Sort by priority (CRITICAL -> HIGH -> NORMAL -> LOW -> BACKGROUND)
    const priorityWeight: Record<SyncPriority, number> = {
      CRITICAL: 5,
      HIGH: 4,
      NORMAL: 3,
      LOW: 2,
      BACKGROUND: 1,
    };

    eligibleToSync.sort((a, b) => {
      const pA = priorityWeight[a.importance as SyncPriority] || 3;
      const pB = priorityWeight[b.importance as SyncPriority] || 3;
      return pB - pA;
    });

    for (const mem of eligibleToSync) {
      // Simulate conflict detection if memory is M-1024 or M-1035
      if (mem.id === 'M-1024' || mem.id === 'M-1035') {
        mem.syncStatus = 'CONFLICT';
        conflictsFound++;
        repo.syncActivities.unshift({
          id: `ACT-${Date.now()}-${mem.id}`,
          timestamp: new Date().toISOString(),
          memoryId: mem.id,
          deviceId: mem.deviceId,
          operation: 'CONFLICT_DETECTED',
          status: 'WARNING',
          details: `Conflict detected for ${mem.id} during delta sync: Cloud version diverged from local edge state.`,
        });
      } else {
        mem.syncStatus = 'SYNCED';
        mem.cloudStatus = 'SYNCED';
        processed++;
        repo.syncActivities.unshift({
          id: `ACT-${Date.now()}-${mem.id}`,
          timestamp: new Date().toISOString(),
          memoryId: mem.id,
          deviceId: mem.deviceId,
          operation: 'UPLOAD',
          status: 'SUCCESS',
          details: `Synchronized memory ${mem.id} ("${mem.title.slice(0, 32)}...") to Qdrant Cloud.`,
        });
      }
    }

    // Keep sync activity log bounded to 150 items
    if (repo.syncActivities.length > 150) {
      repo.syncActivities = repo.syncActivities.slice(0, 150);
    }

    return { processed, conflictsFound, failed };
  }

  /**
   * Resolve a synchronization conflict
   */
  async resolveConflict(
    conflictId: string,
    strategy: 'KEEP_LOCAL' | 'KEEP_CLOUD' | 'MERGE' | 'CUSTOM_POLICY',
    customContent?: string
  ): Promise<ConflictItem> {
    const conflict = repo.conflicts.get(conflictId);
    if (!conflict) throw new Error(`Conflict ${conflictId} not found`);

    const memory = repo.memories.get(conflict.memoryId);
    if (!memory) throw new Error(`Memory ${conflict.memoryId} not found`);

    const prevContent = memory.content;
    let resolvedContent = memory.content;
    let summary = '';

    if (strategy === 'KEEP_LOCAL') {
      resolvedContent = conflict.localContent;
      summary = 'Local edge observation kept as authoritative; cloud record updated.';
      memory.syncStatus = 'SYNCED';
      memory.cloudStatus = 'SYNCED';
    } else if (strategy === 'KEEP_CLOUD') {
      resolvedContent = conflict.cloudContent;
      summary = 'Cloud baseline accepted; local edge memory updated to match cloud.';
      memory.content = resolvedContent;
      memory.syncStatus = 'SYNCED';
      memory.cloudStatus = 'SYNCED';
    } else if (strategy === 'MERGE') {
      resolvedContent =
        customContent ||
        `[SYNTHESIZED MERGE - Local Observation & Cloud Baseline]\n${conflict.localContent}\n---\nCloud Context: ${conflict.cloudContent}`;
      summary = 'Synthesized unified memory incorporating both local edge sensor readings and cloud engineering specifications.';
      memory.content = resolvedContent;
      memory.syncStatus = 'SYNCED';
      memory.cloudStatus = 'SYNCED';
    } else {
      resolvedContent = customContent || conflict.localContent;
      summary = 'Custom policy applied.';
      memory.content = resolvedContent;
      memory.syncStatus = 'SYNCED';
    }

    memory.version += 1;
    memory.updatedAt = new Date().toISOString();
    repo.memories.set(memory.id, memory);

    // Update conflict status
    conflict.status = 'RESOLVED';
    conflict.resolutionStrategy = strategy;
    conflict.resolvedAt = new Date().toISOString();
    conflict.resolvedBy = 'USR-OPERATOR';
    conflict.resolutionSummary = summary;
    repo.conflicts.set(conflict.id, conflict);

    // Add version entry
    const versions = repo.versions.get(memory.id) || [];
    versions.push({
      id: `VER-${memory.id}-${memory.version}`,
      memoryId: memory.id,
      version: memory.version,
      author: 'USR-OPERATOR',
      deviceId: memory.deviceId,
      timestamp: memory.updatedAt,
      content: resolvedContent,
      diffDescription: `Conflict ${conflictId} resolved via ${strategy}`,
      source: 'conflict_resolution',
      syncStatus: 'SYNCED',
    });
    repo.versions.set(memory.id, versions);

    // Activity log
    repo.syncActivities.unshift({
      id: `ACT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      memoryId: memory.id,
      deviceId: memory.deviceId,
      operation: 'CONFLICT_RESOLVED',
      status: 'SUCCESS',
      details: `Conflict ${conflictId} resolved for ${memory.id} using strategy: ${strategy}.`,
    });

    // Audit log
    repo.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'USR-OPERATOR',
      deviceId: memory.deviceId,
      action: 'CONFLICT_RESOLVE',
      resource: conflictId,
      previousState: prevContent.slice(0, 40) + '...',
      newState: resolvedContent.slice(0, 40) + '...',
      details: summary,
    });

    return conflict;
  }

  /**
   * Detect near-duplicate memories for quality control
   */
  findDuplicates(minSimilarity: number = 0.94): Array<{
    itemA: MemoryItem;
    itemB: MemoryItem;
    similarity: number;
  }> {
    const all = Array.from(repo.memories.values()).slice(0, 80); // sample for speed
    const duplicates: Array<{
      itemA: MemoryItem;
      itemB: MemoryItem;
      similarity: number;
    }> = [];

    for (let i = 0; i < all.length; i++) {
      for (let j = i + 1; j < all.length; j++) {
        const sim = cosineSimilarity(all[i].embedding, all[j].embedding);
        if (sim >= minSimilarity) {
          duplicates.push({
            itemA: all[i],
            itemB: all[j],
            similarity: Number(sim.toFixed(4)),
          });
        }
      }
    }

    return duplicates;
  }
}

export const syncEngine = new SyncEngine();
