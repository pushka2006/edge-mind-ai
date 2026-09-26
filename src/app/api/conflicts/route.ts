import { NextResponse } from 'next/server';
import { repo } from '@/lib/storage';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const deviceId = searchParams.get('deviceId');

    let conflicts = Array.from(repo.conflicts.values());

    if (status && status !== 'ALL') {
      conflicts = conflicts.filter((c) => c.status === status);
    }
    if (deviceId && deviceId !== 'ALL') {
      conflicts = conflicts.filter((c) => c.deviceId === deviceId);
    }

    return NextResponse.json({
      success: true,
      total: conflicts.length,
      conflicts,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching conflicts';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
