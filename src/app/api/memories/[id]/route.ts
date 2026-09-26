import { NextResponse } from 'next/server';
import { repo, memoryManager } from '@/lib/storage';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const memory = await memoryManager.edgeStore.getById(id);
    if (!memory) {
      return NextResponse.json({ success: false, error: 'Memory not found' }, { status: 404 });
    }

    const versions = await memoryManager.edgeStore.getVersions(id);

    return NextResponse.json({
      success: true,
      memory,
      versions,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching memory';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();

    const updated = await memoryManager.edgeStore.update(id, updates);

    return NextResponse.json({
      success: true,
      memory: updated,
      message: `Memory ${id} updated to version ${updated.version}.`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error updating memory';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await memoryManager.edgeStore.delete(id);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Memory not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Memory ${id} successfully removed from edge memory store.`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error deleting memory';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
