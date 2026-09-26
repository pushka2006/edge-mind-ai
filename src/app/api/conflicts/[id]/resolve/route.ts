import { NextResponse } from 'next/server';
import { syncEngine } from '@/lib/sync';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { strategy, customContent } = body;

    if (!strategy) {
      return NextResponse.json(
        { success: false, error: 'Resolution strategy must be specified' },
        { status: 400 }
      );
    }

    const resolved = await syncEngine.resolveConflict(id, strategy, customContent);

    return NextResponse.json({
      success: true,
      conflict: resolved,
      message: `Conflict ${id} resolved via strategy ${strategy}.`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error resolving conflict';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
