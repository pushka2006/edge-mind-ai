export type MemoryType =
  | 'Fact'
  | 'Event'
  | 'Observation'
  | 'Instruction'
  | 'Preference'
  | 'Sensor observation'
  | 'Document'
  | 'Conversation'
  | 'Image description'
  | 'Device state'
  | 'Task'
  | 'Knowledge'
  | 'System event';

export type ImportanceLevel = 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';

export type SensitivityLevel =
  | 'PUBLIC'
  | 'INTERNAL'
  | 'CONFIDENTIAL'
  | 'SENSITIVE'
  | 'LOCAL_ONLY';

export type SyncStatus =
  | 'PENDING'
  | 'QUEUED'
  | 'SYNCING'
  | 'SYNCED'
  | 'FAILED'
  | 'CONFLICT'
  | 'DEFERRED';

export type CloudStatus =
  | 'NOT_SYNCED'
  | 'SYNCED'
  | 'MODIFIED_IN_CLOUD'

  | 'OUT_OF_SYNC';

export type SyncPriority = 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW' | 'BACKGROUND';

export interface MemoryMetadata {
  machineId?: string;
  component?: string;
  metric?: string;
  unit?: string;
  value?: number | string;
  threshold?: number;
  anomalyDetected?: boolean;
  location?: string;
  sensorModel?: string;
  rawPayload?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface MemoryItem {
  id: string; // e.g. M-1024
  deviceId: string; // e.g. DEV-001
  userId: string;
  orgId: string;
  title: string;
  content: string;
  type: MemoryType;
  embedding: number[]; // 128-dim dense semantic vector
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  lastAccessedAt: string; // ISO date string
  importance: ImportanceLevel;
  confidence: number; // 0.0 - 1.0
  sensitivity: SensitivityLevel;
  source: 'edge_device' | 'sensor_telemetry' | 'technician' | 'ai_inference' | 'cloud_sync' | 'human_manual';
  version: number;
  syncStatus: SyncStatus;
  cloudStatus: CloudStatus;
  expiration: string | null; // ISO date or null
  tags: string[];
  metadata: MemoryMetadata;
  isLocalOnly: boolean;
  routingTarget?: 'LOCAL_ONLY' | 'SYNC_CLOUD' | 'HIGH_PRIORITY_SYNC' | 'LOCAL_WITH_EXPIRATION';
  qualityScore?: {
    sourceAvailability: number;
    confidence: number;
    recency: number;
    verification: number;
    completeness: number;
  };
}

export interface MemoryVersion {
  id: string;
  memoryId: string;
  version: number;
  author: string;
  deviceId: string;
  timestamp: string;
  content: string;
  diffDescription: string;
  source: string;
  syncStatus: SyncStatus;
  metadataSnapshot?: MemoryMetadata;
}

export interface ConflictItem {
  id: string; // e.g. CONF-101
  memoryId: string;
  deviceId: string;
  localVersion: number;
  cloudVersion: number;
  changedFields: string[];
  conflictType:
  | 'CONTENT_DRIFT'
  | 'VERSION_MISMATCH'
  | 'TIMESTAMP_DISCREPANCY'
  | 'DELETED_MODIFIED';
  status: 'UNRESOLVED' | 'RESOLVED';
  localContent: string;
  cloudContent: string;
  localMetadata: MemoryMetadata;
  cloudMetadata: MemoryMetadata;
  detectedAt: string;
  resolutionStrategy?: 'KEEP_LOCAL' | 'KEEP_CLOUD' | 'MERGE' | 'CUSTOM_POLICY';
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionSummary?: string;
}

export interface DeviceInfo {
  id: string; // e.g. DEV-001
  name: string;
  type:
  | 'INDUSTRIAL_ROBOT'
  | 'EDGE_MACHINE'
  | 'SMART_KIOSK'
  | 'AUTONOMOUS_VEHICLE'
  | 'DRONE'
  | 'SENSOR_HUB';
  organization: string;
  owner: string;
  registrationDate: string;
  lastSeen: string;
  status: 'ONLINE' | 'OFFLINE' | 'SYNCING' | 'MAINTENANCE';
  ipAddress: string;
  firmwareVersion: string;
  storageUsedGb: number;
  storageTotalGb: number;
  memoryCount: number;
  vectorCount: number;
  pendingSyncCount: number;
  conflictCount: number;
  cpuUsage: number; // percentage
  ramUsage: number; // percentage
  temperatureC: number;
  batteryPct?: number;
  networkLatencyMs: number;
}

export interface SyncJob {
  id: string;
  memoryId: string;
  deviceId: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  priority: SyncPriority;
  createdAt: string;
  retryCount: number;
  lastAttempt: string | null;
  status: SyncStatus;
  error?: string;
  cloudVersion?: number;
  localVersion?: number;
}

export interface SyncActivityEvent {
  id: string;
  timestamp: string;
  memoryId: string;
  deviceId: string;
  operation: 'UPLOAD' | 'DOWNLOAD' | 'CONFLICT_DETECTED' | 'CONFLICT_RESOLVED' | 'DELTA_SYNC' | 'EXPIRED_PURGE';
  status: 'SUCCESS' | 'WARNING' | 'FAILED' | 'IN_PROGRESS';
  details: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  deviceId: string;
  action:
  | 'MEMORY_CREATE'
  | 'MEMORY_UPDATE'
  | 'MEMORY_DELETE'
  | 'SEARCH_LOCAL'
  | 'SEARCH_HYBRID'
  | 'SYNC_INITIATE'
  | 'CONFLICT_RESOLVE'
  | 'OFFLINE_ENGAGE'
  | 'ONLINE_RESTORE'
  | 'POLICY_CHANGE'
  | 'DEVICE_REGISTER';
  resource: string;
  previousState?: string;
  newState?: string;
  details: string;
}

export interface RoutingPolicy {
  id: string;
  name: string;
  description: string;
  condition: string;
  target: 'LOCAL_ONLY' | 'SYNC_CLOUD' | 'HIGH_PRIORITY_SYNC' | 'LOCAL_WITH_EXPIRATION' | 'ENCRYPT_SYNC';
  priority: SyncPriority;
  enabled: boolean;
}

export interface SearchFilter {
  query: string;
  mode: 'LOCAL' | 'CLOUD' | 'HYBRID';
  type?: string;
  importance?: string;
  sensitivity?: string;
  deviceId?: string;
  dateRange?: string;
  minSimilarity?: number;
}

export interface SearchResult {
  memory: MemoryItem;
  score: number; // 0.0 - 1.0 combined hybrid relevance
  vectorSimilarity: number;
  keywordScore: number;
  sourceOrigin: 'LOCAL_EDGE' | 'CLOUD_KNOWLEDGE' | 'HYBRID_MERGED';
  matchedFields: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  retrievalMode?: 'LOCAL' | 'CLOUD' | 'HYBRID';
  sources?: string[]; // array of memory IDs
  reasoningNotes?: string;
  offlineGenerated?: boolean;
}
