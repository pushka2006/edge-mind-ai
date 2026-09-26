import { NextResponse } from 'next/server';
import { aiEngine } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, retrievalMode = 'HYBRID' } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Query message is required' },
        { status: 400 }
      );
    }

    const response = await aiEngine.processQuery(message, retrievalMode);

    return NextResponse.json({
      success: true,
      answer: response.answer,
      sources: response.sources,
      citedMemoryIds: response.citedMemoryIds,
      offlineGenerated: response.offlineGenerated,
      modelUsed: response.modelUsed,
      reasoningNotes: response.reasoningNotes,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'AI reasoning error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
