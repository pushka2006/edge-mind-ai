import { NextResponse } from 'next/server';
import { repo } from '@/lib/storage';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const deviceId = searchParams.get('deviceId');

    let logs = [...repo.auditLogs];

    if (action && action !== 'ALL') {
      logs = logs.filter((l) => l.action === action);
    }
    if (deviceId && deviceId !== 'ALL') {
      logs = logs.filter((l) => l.deviceId === deviceId);
    }

    return NextResponse.json({
      success: true,
      total: logs.length,
      logs: logs.slice(0, 100),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching audit logs';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
