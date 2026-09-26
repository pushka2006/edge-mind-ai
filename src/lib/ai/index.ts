import { memoryManager, repo } from '@/lib/storage';
import { ChatMessage, SearchResult } from '@/types';

export interface RAGAnswerResponse {
  answer: string;
  sources: SearchResult[];
  citedMemoryIds: string[];
  offlineGenerated: boolean;
  modelUsed: string;
  reasoningNotes: string;
}

export class EdgeMindAIEngine {
  /**
   * Router to pick AI execution tier
   */
  routeModel(task: string, containsSensitiveData: boolean, isOffline: boolean): {
    provider: 'LOCAL_EDGE_RUNTIME' | 'CLOUD_AI_SERVICE' | 'HYBRID_AI';
    model: string;
    reason: string;
  } {
    if (isOffline || containsSensitiveData) {
      return {
        provider: 'LOCAL_EDGE_RUNTIME',
        model: 'EdgeMind-Nano-8B (Local Quantized)',
        reason: isOffline
          ? 'Network is offline. Operating with zero-latency on-device Edge AI Runtime.'
          : 'Memory classification is SENSITIVE / LOCAL_ONLY. Retained on-device per Privacy Policy.',
      };
    }

    if (repo.qdrantServerConnected && !repo.isOfflineModeSimulated) {
      return {
        provider: 'CLOUD_AI_SERVICE',
        model: 'EdgeMind-Titan-Cloud (Qdrant Cloud RAG)',
        reason: 'Online connectivity verified. Utilizing centralized cloud fleet reasoning.',
      };
    }

    return {
      provider: 'LOCAL_EDGE_RUNTIME',
      model: 'EdgeMind-Nano-8B (Local)',
      reason: 'Local execution preferred by default edge-first principle.',
    };
  }

  /**
   * Memory-Aware RAG Pipeline
   */
  async processQuery(
    userQuery: string,
    retrievalMode: 'LOCAL' | 'CLOUD' | 'HYBRID' = 'HYBRID'
  ): Promise<RAGAnswerResponse> {
    const isOffline = repo.isOfflineModeSimulated;
    const effectiveMode = isOffline ? 'LOCAL' : retrievalMode;

    // 1. Retrieve relevant memories via Storage Abstraction Layer
    const searchResults = await memoryManager.search(userQuery, {
      mode: effectiveMode,
      minSimilarity: 0.18,
    });

    const topResults = searchResults.slice(0, 4);
    const citedMemoryIds = topResults.map((r) => r.memory.id);

    const routing = this.routeModel(userQuery, false, isOffline);

    // 2. Synthesize contextual answer based on retrieved memories
    let answer = '';
    const qLower = userQuery.toLowerCase();

    if (topResults.length === 0) {
      answer = `I analyzed the ${effectiveMode.toLowerCase()} memory store across ${repo.memories.size} records, but found no direct historical incidents or observations matching "${userQuery}". You can log a new observation or adjust search parameters.`;
    } else {
      const primary = topResults[0].memory;
      const citations = citedMemoryIds.join(', ');

      if (qLower.includes('overheat') || qLower.includes('temperature') || qLower.includes('spindle')) {
        answer = `Based on records for **${primary.deviceId}**, spindle bearing operating temperatures spiked to **82.4°C** during milling cycle #4402 (threshold: 75.0°C), triggering safety feed hold interlocks.\n\nTechnician Dan Kovacs intervened, finding particulate debris in micro-nozzle filter B-2, cleaned the assembly, and replenished Mobil SHC 626 synthetic oil.\n\n⚠️ **Sync Alert**: There is an unresolved conflict on [M-1024] between local physical thermocouple readings (82.4°C) and cloud-smoothed estimations (79.1°C).\n\n**Sources:** ${citedMemoryIds.map((id) => `[${id}]`).join(' ')}`;
      } else if (qLower.includes('conflict') || qLower.includes('sync')) {
        answer = `There are currently **${repo.conflicts.size} unresolved synchronization conflicts** between edge devices and the cloud. Most notable is **M-1024** (Spindle Temperature Drift) and **M-1035** (Maintenance Window Discrepancy).\n\nLocal changes are safely buffered in the offline priority queue and will not be overwritten without explicit resolution.\n\n**Sources:** ${citedMemoryIds.map((id) => `[${id}]`).join(' ')}`;
      } else if (qLower.includes('vibration') || qLower.includes('bearing')) {
        answer = `High-frequency piezoelectric telemetry logged **3.8 mm/s RMS vibration** at 420 Hz harmonic frequency on Machine Edge #01. This correlates with outer race wear on the front angular contact bearing.\n\nRecommended Action: Schedule bearing replacement during next planned maintenance window.\n\n**Sources:** ${citedMemoryIds.map((id) => `[${id}]`).join(' ')}`;
      } else if (qLower.includes('drone') || qLower.includes('lidar') || qLower.includes('pipeline')) {
        answer = `Autonomous Drone #09 logged LiDAR point-cloud terrain alerts in the Northern Pipeline sector. An onboard decision lowered altitude to 45m due to fog and microbursts, which is currently flagged for synchronization review against standard 90m FAA corridors.\n\n**Sources:** ${citedMemoryIds.map((id) => `[${id}]`).join(' ')}`;
      } else {
        answer = `I retrieved ${topResults.length} relevant memories from ${effectiveMode.toLowerCase()} storage.\n\n**Key Finding**: "${primary.title}"\n${primary.content}\n\n• Device: **${primary.deviceId}**\n• Type: **${primary.type}**\n• Importance: **${primary.importance}**\n• Confidence: **${(primary.confidence * 100).toFixed(0)}%**\n\n**Sources:** ${citedMemoryIds.map((id) => `[${id}]`).join(' ')}`;
      }
    }

    return {
      answer,
      sources: topResults,
      citedMemoryIds,
      offlineGenerated: isOffline,
      modelUsed: routing.model,
      reasoningNotes: routing.reason,
    };
  }

  /**
   * Initial greeting / history for EdgeMind assistant
   */
  getInitialConversation(): ChatMessage[] {
    return [
      {
        id: 'msg-1',
        role: 'assistant',
        content:
          "Greetings, Engineer. I am **EdgeMind AI**, your local-first edge memory assistant. I operate directly on-device with zero cloud dependency, maintaining semantic vectors, indexing telemetry, and managing synchronization with Qdrant Cloud. What would you like to inspect?",
        timestamp: '2026-09-26T00:40:00Z',
        retrievalMode: 'HYBRID',
        offlineGenerated: false,
      },
      {
        id: 'msg-2',
        role: 'user',
        content: 'What happened to Machine Edge #01 yesterday during high-torque milling?',
        timestamp: '2026-09-26T00:41:00Z',
      },
      {
        id: 'msg-3',
        role: 'assistant',
        content:
          'I found 4 local records from yesterday. The latest observation reports elevated spindle bearing temperature at **82.4°C** at 14:32 UTC, exceeding the 75°C threshold. Interlock feed hold engaged safely, and technician Dan Kovacs cleared micro-nozzle filter debris before replenishing Mobil SHC 626 lubricant.\n\nNote: Memory **[M-1024]** currently has an active edge-cloud conflict regarding temperature smoothing.\n\n**Sources:** [M-1024] [M-1025] [M-1026] [M-1027]',
        timestamp: '2026-09-26T00:41:05Z',
        retrievalMode: 'LOCAL',
        sources: ['M-1024', 'M-1025', 'M-1026', 'M-1027'],
        offlineGenerated: false,
        reasoningNotes: 'Retrieved 4 high-relevance records via Local Qdrant Edge Cosine Similarity (avg similarity: 0.94).',
      },
    ];
  }
}

export const aiEngine = new EdgeMindAIEngine();
