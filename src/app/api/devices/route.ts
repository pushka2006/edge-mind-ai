import { NextResponse } from 'next/server';
import { repo } from '@/lib/storage';
import { DeviceInfo } from '@/types';

export async function GET() {
  try {
    const devices = Array.from(repo.devices.values());
    return NextResponse.json({
      success: true,
      total: devices.length,
      devices,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching devices';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newId = `DEV-${String(repo.devices.size + 1).padStart(3, '0')}`;

    const newDevice: DeviceInfo = {
      id: newId,
      name: body.name || `Edge Device #${repo.devices.size + 1}`,
      type: body.type || 'EDGE_MACHINE',
      organization: 'AeroTech Industrial Dynamics',
      owner: body.owner || 'Field Operator',
      registrationDate: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      status: 'ONLINE',
      ipAddress: body.ipAddress || `192.168.10.${50 + repo.devices.size}`,
      firmwareVersion: body.firmwareVersion || 'v4.19.0-edge',
      storageUsedGb: 1.2,
      storageTotalGb: body.storageTotalGb || 16.0,
      memoryCount: 0,
      vectorCount: 0,
      pendingSyncCount: 0,
      conflictCount: 0,
      cpuUsage: 18,
      ramUsage: 32,
      temperatureC: 48.0,
      networkLatencyMs: 45,
    };

    repo.devices.set(newId, newDevice);

    repo.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'USR-ADMIN',
      deviceId: newId,
      action: 'DEVICE_REGISTER',
      resource: newId,
      details: `Registered edge device ${newDevice.name} (${newDevice.type}).`,
    });

    return NextResponse.json({
      success: true,
      device: newDevice,
      message: 'New edge device successfully registered.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error registering device';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
