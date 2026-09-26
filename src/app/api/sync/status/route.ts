import { NextResponse } from 'next/server';
import { syncEngine } from '@/lib/sync';
import { repo } from '@/lib/storage';

export async function GET() {
  try {
    const summary = syncEngine.getSummary();
    const activities = repo.syncActivities.slice(0, 50);

    return NextResponse.json({
      success: true,
      summary,
      activities,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching sync status';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
