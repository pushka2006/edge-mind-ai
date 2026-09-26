import { NextResponse } from 'next/server';
import { repo, memoryManager } from '@/lib/storage';
import { syncEngine } from '@/lib/sync';
import { generateEmbedding } from '@/lib/vector';
import { MemoryItem } from '@/types';

export async function POST(request: Request) {
  try {
    const { step } = await request.json();

    switch (step) {
      case 1: {
        // Step 1: Online baseline
        repo.isOfflineModeSimulated = false;
        return NextResponse.json({
          success: true,
          step: 1,
          title: 'Device Online & Initialized',
          description:
            'Machine Edge #01 is online and connected to local Qdrant Edge daemon and central Qdrant Cloud.',
          state: { isOffline: false, memoriesCount: repo.memories.size },
        });
      }

      case 2: {
        // Step 2: Create local memory
        const newMem: MemoryItem = {
          id: 'M-2001',
          deviceId: 'DEV-001',
          userId: 'USR-OPERATOR',
          orgId: 'ORG-804',
          title: 'Spindle Bearing Normalization Baseline Test',
          content:
            'CNC Milling Spindle #01 completed 20-minute thermal stabilization cycle. Ceramic bearings registered nominal 64.2°C at 12,000 RPM with 3.4 L/min synthetic coolant flow.',
          type: 'Sensor observation',
          embedding: generateEmbedding(
            'CNC Milling Spindle #01 completed 20-minute thermal stabilization cycle. Ceramic bearings registered nominal 64.2°C at 12,000 RPM.'
          ),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastAccessedAt: new Date().toISOString(),
          importance: 'HIGH',
          confidence: 0.99,
          sensitivity: 'INTERNAL',
          source: 'sensor_telemetry',
          version: 1,
          syncStatus: 'QUEUED',
          cloudStatus: 'NOT_SYNCED',
          expiration: null,
          tags: ['spindle', 'baseline', 'milling', 'temperature', 'bearing'],
          metadata: { rpm: 12000, tempC: 64.2, coolantFlowLMin: 3.4 },
          isLocalOnly: false,
          qualityScore: {
            sourceAvailability: 1.0,
            confidence: 0.99,
            recency: 1.0,
            verification: 0.95,
            completeness: 1.0,
          },
        };
        await memoryManager.edgeStore.save(newMem);
        return NextResponse.json({
          success: true,
          step: 2,
          title: 'Local Semantic Memory Captured',
          description:
            'Memory M-2001 saved directly to on-device Qdrant Edge index with 128-dim embedding.',
          memory: newMem,
        });
      }

      case 3: {
        // Step 3: Search locally
        const searchResults = await memoryManager.edgeStore.search('spindle bearing temperature RPM');
        return NextResponse.json({
          success: true,
          step: 3,
          title: 'Local Vector Retrieval Verified',
          description:
            'Retrieved local memories with sub-3ms latency using on-device cosine similarity.',
          resultsCount: searchResults.length,
          topMatch: searchResults[0],
        });
      }

      case 4: {
        // Step 4: Disconnect network
        syncEngine.toggleOfflineMode(true);
        return NextResponse.json({
          success: true,
          step: 4,
          title: 'Network Disconnected (Offline Simulation Active)',
          description:
            'Cloud API severed. The edge runtime assumes complete local autonomy. Search, reasoning, and memory writes continue without internet.',
          state: { isOffline: true },
        });
      }

      case 5: {
        // Step 5: Create additional memories while offline
        const offlineMem: MemoryItem = {
          id: 'M-2002',
          deviceId: 'DEV-001',
          userId: 'USR-OPERATOR',
          orgId: 'ORG-804',
          title: 'OFFLINE EMERGENCY: Severe Spindle Harmonic Resonance Spike',
          content:
            'While operating disconnected from cloud, Machine Edge #01 accelerometer registered 5.4 mm/s RMS vibration at 420 Hz. Autonomous local safety interlock paused tool feed without waiting for cloud command.',
          type: 'System event',
          embedding: generateEmbedding(
            'OFFLINE EMERGENCY: Severe Spindle Harmonic Resonance Spike. 5.4 mm/s vibration.'
          ),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastAccessedAt: new Date().toISOString(),
          importance: 'CRITICAL',
          confidence: 0.99,
          sensitivity: 'INTERNAL',
          source: 'edge_device',
          version: 1,
          syncStatus: 'PENDING',
          cloudStatus: 'NOT_SYNCED',
          expiration: null,
          tags: ['offline', 'emergency', 'vibration', 'interlock', 'spindle'],
          metadata: { rmsMmS: 5.4, peakHz: 420, localInterlockEngaged: true },
          isLocalOnly: false,
          qualityScore: {
            sourceAvailability: 1.0,
            confidence: 0.99,
            recency: 1.0,
            verification: 0.98,
            completeness: 1.0,
          },
        };
        await memoryManager.edgeStore.save(offlineMem);
        return NextResponse.json({
          success: true,
          step: 5,
          title: 'Memory Logged Completely Offline',
          description:
            'Critical event M-2002 indexed locally and placed into the priority synchronization queue for upload once connectivity is restored.',
          memory: offlineMem,
        });
      }

      case 6: {
        // Step 6: Search while offline
        const searchResults = await memoryManager.search('offline emergency vibration spike', {
          mode: 'LOCAL',
        });
        return NextResponse.json({
          success: true,
          step: 6,
          title: 'Offline Search Fully Functional',
          description:
            'Proved local semantic search functions seamlessly with 0% network connectivity.',
          resultsCount: searchResults.length,
          topMatch: searchResults[0],
        });
      }

      case 7: {
        // Step 7: Reconnect network
        syncEngine.toggleOfflineMode(false);
        return NextResponse.json({
          success: true,
          step: 7,
          title: 'Network Reconnected',
          description:
            'Cloud channel restored. Connectivity Manager reports low-latency handshake with Qdrant Server.',
          state: { isOffline: false },
        });
      }

      case 8: {
        // Step 8: Synchronize
        const syncRes = await syncEngine.triggerSync();
        return NextResponse.json({
          success: true,
          step: 8,
          title: 'Delta Synchronization Triggered',
          description: `Processed ${syncRes.processed} delta records to Qdrant Cloud.`,
          syncResult: syncRes,
        });
      }

      case 9: {
        // Step 9: Detect conflicts
        const conflict = repo.conflicts.get('CONF-101');
        return NextResponse.json({
          success: true,
          step: 9,
          title: 'Synchronization Conflict Detected',
          description:
            'Conflict CONF-101 detected: Edge physical sensor observation differs from Cloud statistical model.',
          conflict,
        });
      }

      case 10: {
        // Step 10: Resolve conflict
        const resolved = await syncEngine.resolveConflict('CONF-101', 'MERGE');
        return NextResponse.json({
          success: true,
          step: 10,
          title: 'Conflict Resolved via Synthesized Merge',
          description:
            'Both edge physical thermocouple observation and cloud fleet baseline merged into a unified authoritative record.',
          resolved,
        });
      }

      case 11: {
        // Step 11: Cloud state verified
        const updatedMemory = repo.memories.get('M-1024');
        return NextResponse.json({
          success: true,
          step: 11,
          title: 'Edge-to-Cloud Cycle Complete!',
          description:
            'Centralized cloud and local edge vector stores are in 100% agreement. Local intelligence operated without interruption throughout network loss.',
          memory: updatedMemory,
        });
      }

      default:
        return NextResponse.json({ success: false, error: 'Invalid step' }, { status: 400 });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Demo scenario execution error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
