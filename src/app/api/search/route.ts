import { NextResponse } from 'next/server';
import { memoryManager, repo } from '@/lib/storage';

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const body = await request.json();
    const {
      query = '',
      mode = 'HYBRID',
      type,
      importance,
      sensitivity,
      deviceId,
      minSimilarity = 0.15,
    } = body;

    const results = await memoryManager.search(query, {
      mode,
      type,
      importance,
      sensitivity,
      deviceId,
      minSimilarity,
    });

    const elapsedMs = Date.now() - startTime;

    // Log the search action to audit logs
    repo.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'USR-OPERATOR',
      deviceId: deviceId || 'DEV-001',
      action: mode === 'LOCAL' ? 'SEARCH_LOCAL' : 'SEARCH_HYBRID',
      resource: `Search[${mode}]`,
      details: `Query "${query.slice(0, 32)}..." yielded ${results.length} results in ${elapsedMs}ms.`,
    });

    return NextResponse.json({
      success: true,
      query,
      mode,
      isOffline: repo.isOfflineModeSimulated,
      totalResults: results.length,
      latencyMs: elapsedMs,
      results,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Search failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
