import { NextResponse } from 'next/server';
import { syncEngine } from '@/lib/sync';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const newOfflineState = syncEngine.toggleOfflineMode(body.enableOffline);

    return NextResponse.json({
      success: true,
      isOffline: newOfflineState,
      message: newOfflineState
        ? 'Offline simulation mode engaged. Edge operates completely autonomously.'
        : 'Online connectivity restored. Edge-to-cloud synchronization resumed.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error toggling offline mode';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
