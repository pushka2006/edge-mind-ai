import { NextResponse } from 'next/server';
import { syncEngine } from '@/lib/sync';

export async function POST() {
  try {
    const result = await syncEngine.triggerSync();
    return NextResponse.json({
      success: true,
      result,
      message: `Delta synchronization processed ${result.processed} items. Found ${result.conflictsFound} conflicts.`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Sync failed';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
