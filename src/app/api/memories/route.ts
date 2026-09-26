import { NextResponse } from 'next/server';
import { repo, memoryManager } from '@/lib/storage';
import { MemoryItem } from '@/types';
import { generateEmbedding } from '@/lib/vector';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('deviceId');
    const type = searchParams.get('type');
    const sensitivity = searchParams.get('sensitivity');
    const syncStatus = searchParams.get('syncStatus');
    const search = searchParams.get('q');

    let all = await memoryManager.edgeStore.getAll();

    if (deviceId && deviceId !== 'ALL') {
      all = all.filter((m) => m.deviceId === deviceId);
    }
    if (type && type !== 'ALL') {
      all = all.filter((m) => m.type === type);
    }
    if (sensitivity && sensitivity !== 'ALL') {
      all = all.filter((m) => m.sensitivity === sensitivity);
    }
    if (syncStatus && syncStatus !== 'ALL') {
      all = all.filter((m) => m.syncStatus === syncStatus);
    }
    if (search) {
      const q = search.toLowerCase();
      all = all.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.content.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Default sort by created timestamp descending
    all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      total: all.length,
      memories: all,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch memories';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newId = `M-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const isLocalOnly =
      body.sensitivity === 'LOCAL_ONLY' || body.isLocalOnly === true;

    const newMemory: MemoryItem = {
      id: newId,
      deviceId: body.deviceId || 'DEV-001',
      userId: body.userId || 'USR-OPERATOR',
      orgId: body.orgId || 'ORG-804',
      title: body.title || 'Untitled Edge Memory',
      content: body.content || '',
      type: body.type || 'Observation',
      embedding: generateEmbedding(`${body.title} ${body.content} ${(body.tags || []).join(' ')}`),
      createdAt: now,
      updatedAt: now,
      lastAccessedAt: now,
      importance: body.importance || 'NORMAL',
      confidence: body.confidence !== undefined ? body.confidence : 0.95,
      sensitivity: body.sensitivity || 'INTERNAL',
      source: body.source || 'human_manual',
      version: 1,
      syncStatus: isLocalOnly
        ? 'DEFERRED'
        : repo.isOfflineModeSimulated
        ? 'PENDING'
        : 'QUEUED',
      cloudStatus: 'NOT_SYNCED',
      expiration: body.expiration || null,
      tags: Array.isArray(body.tags) ? body.tags : [],
      metadata: body.metadata || {},
      isLocalOnly,
      qualityScore: {
        sourceAvailability: 1.0,
        confidence: 0.95,
        recency: 1.0,
        verification: 0.9,
        completeness: 0.95,
      },
    };

    await memoryManager.edgeStore.save(newMemory);

    return NextResponse.json({
      success: true,
      memory: newMemory,
      message: 'Memory created and indexed in Qdrant Edge local vector storage.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create memory';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
