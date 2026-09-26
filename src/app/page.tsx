'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar, NavTab } from '@/components/Sidebar';
import { DashboardView } from '@/components/DashboardView';
import { MemoryView } from '@/components/MemoryView';
import { SearchView } from '@/components/SearchView';
import { AssistantView } from '@/components/AssistantView';
import { DevicesView } from '@/components/DevicesView';
import { SyncCenterView } from '@/components/SyncCenterView';
import { ConflictCenterView } from '@/components/ConflictCenterView';
import { MemoryGraphView } from '@/components/MemoryGraphView';
import { AnalyticsView } from '@/components/AnalyticsView';
import { ActivityView } from '@/components/ActivityView';
import { SettingsView } from '@/components/SettingsView';
import { MemoryInspectorModal } from '@/components/MemoryInspectorModal';
import { NewMemoryModal } from '@/components/NewMemoryModal';
import { EdgeDemoModal } from '@/components/EdgeDemoModal';
import { MemoryItem, ConflictItem, DeviceInfo, SyncActivityEvent, MemoryVersion } from '@/types';

export default function EdgeMindApp() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isOffline, setIsOffline] = useState(false);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [conflicts, setConflicts] = useState<ConflictItem[]>([]);
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [syncActivities, setSyncActivities] = useState<SyncActivityEvent[]>([]);
  const [syncing, setSyncing] = useState(false);

  // Modal states
  const [inspectedMemory, setInspectedMemory] = useState<MemoryItem | null>(null);
  const [inspectedVersions, setInspectedVersions] = useState<MemoryVersion[]>([]);
  const [isNewMemoryModalOpen, setIsNewMemoryModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  // Load initial data
  const loadData = async () => {
    try {
      // 1. Fetch memories
      const memRes = await fetch('/api/memories');
      const memData = await memRes.json();
      if (memData.success) setMemories(memData.memories || []);

      // 2. Fetch conflicts
      const confRes = await fetch('/api/conflicts');
      const confData = await confRes.json();
      if (confData.success) setConflicts(confData.conflicts || []);

      // 3. Fetch devices
      const devRes = await fetch('/api/devices');
      const devData = await devRes.json();
      if (devData.success) setDevices(devData.devices || []);

      // 4. Fetch sync status & activities
      const syncRes = await fetch('/api/sync/status');
      const syncData = await syncRes.json();
      if (syncData.success) {
        setIsOffline(syncData.summary.isOffline);
        setSyncActivities(syncData.activities || []);
      }
    } catch (err) {
      console.error('Error loading EdgeMind state:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Offline simulation toggle
  const handleToggleOffline = async () => {
    try {
      const res = await fetch('/api/sync/toggle-offline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enableOffline: !isOffline }),
      });
      const data = await res.json();
      if (data.success) {
        setIsOffline(data.isOffline);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delta sync trigger
  const handleTriggerSync = async () => {
    if (isOffline || syncing) return;
    setSyncing(true);
    try {
      const res = await fetch('/api/sync/start', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  // Select memory to inspect
  const handleSelectMemory = async (memory: MemoryItem) => {
    setInspectedMemory(memory);
    try {
      const res = await fetch(`/api/memories/${memory.id}`);
      const data = await res.json();
      if (data.success) {
        setInspectedVersions(data.versions || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectMemoryById = (memoryId: string) => {
    const found = memories.find((m) => m.id === memoryId);
    if (found) {
      handleSelectMemory(found);
    }
  };

  // Create new memory
  const handleCreateMemory = async (memoryData: any) => {
    const res = await fetch('/api/memories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memoryData),
    });
    const data = await res.json();
    if (data.success) {
      await loadData();
      if (data.memory) {
        handleSelectMemory(data.memory);
      }
    }
  };

  // Update memory
  const handleUpdateMemory = async (id: string, updates: Partial<MemoryItem>) => {
    const res = await fetch(`/api/memories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (data.success) {
      await loadData();
      setInspectedMemory(data.memory);
    }
  };

  // Delete memory
  const handleDeleteMemory = async (id: string) => {
    const res = await fetch(`/api/memories/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      await loadData();
      setInspectedMemory(null);
    }
  };

  // Resolve Conflict
  const handleResolveConflict = async (
    conflictId: string,
    strategy: 'KEEP_LOCAL' | 'KEEP_CLOUD' | 'MERGE' | 'CUSTOM_POLICY',
    customContent?: string
  ) => {
    const res = await fetch(`/api/conflicts/${conflictId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ strategy, customContent }),
    });
    const data = await res.json();
    if (data.success) {
      await loadData();
    }
  };

  const unresolvedConflictsCount = conflicts.filter((c) => c.status === 'UNRESOLVED').length;
  const pendingSyncCount = memories.filter((m) => m.syncStatus === 'PENDING' || m.syncStatus === 'QUEUED').length;

  return (
    <div className="flex min-h-screen bg-[#080a0f] text-slate-100">
      {/* Fixed Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        unresolvedConflictsCount={unresolvedConflictsCount}
        pendingSyncCount={pendingSyncCount}
        totalMemoriesCount={memories.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Top Navbar */}
        <Navbar
          isOffline={isOffline}
          onToggleOffline={handleToggleOffline}
          onOpenDemo={() => setIsDemoModalOpen(true)}
          onNewMemory={() => setIsNewMemoryModalOpen(true)}
          onOpenSearch={() => setCurrentTab('search')}
          pendingSyncCount={pendingSyncCount}
          unresolvedConflictsCount={unresolvedConflictsCount}
          syncing={syncing}
          onTriggerSync={handleTriggerSync}
        />

        {/* View Switcher Container */}
        <main className="flex-1 pb-16">
          {currentTab === 'dashboard' && (
            <DashboardView
              isOffline={isOffline}
              totalMemories={memories.length}
              pendingSync={pendingSyncCount}
              conflictsCount={unresolvedConflictsCount}
              onNavigate={setCurrentTab}
              onTriggerSync={handleTriggerSync}
              onOpenDemo={() => setIsDemoModalOpen(true)}
              onToggleOffline={handleToggleOffline}
              syncing={syncing}
            />
          )}

          {currentTab === 'memory' && (
            <MemoryView
              memories={memories}
              onSelectMemory={handleSelectMemory}
              onNewMemory={() => setIsNewMemoryModalOpen(true)}
              onRefresh={loadData}
            />
          )}

          {currentTab === 'search' && (
            <SearchView
              onSelectMemory={handleSelectMemory}
              isOffline={isOffline}
            />
          )}

          {currentTab === 'assistant' && (
            <AssistantView
              onSelectMemoryId={handleSelectMemoryById}
              isOffline={isOffline}
            />
          )}

          {currentTab === 'devices' && (
            <DevicesView
              devices={devices}
              onFilterByDevice={(devId) => {
                setCurrentTab('memory');
              }}
              onRefresh={loadData}
            />
          )}

          {currentTab === 'sync' && (
            <SyncCenterView
              isOffline={isOffline}
              totalMemories={memories.length}
              syncedCount={memories.filter((m) => m.syncStatus === 'SYNCED').length}
              pendingCount={pendingSyncCount}
              conflictsCount={unresolvedConflictsCount}
              failedCount={memories.filter((m) => m.syncStatus === 'FAILED').length}
              activities={syncActivities}
              onTriggerSync={handleTriggerSync}
              onToggleOffline={handleToggleOffline}
              onNavigate={setCurrentTab}
              syncing={syncing}
            />
          )}

          {currentTab === 'conflicts' && (
            <ConflictCenterView
              conflicts={conflicts}
              onResolveConflict={handleResolveConflict}
              onInspectMemory={handleSelectMemoryById}
            />
          )}

          {currentTab === 'graph' && (
            <MemoryGraphView
              memories={memories}
              onSelectMemory={handleSelectMemory}
            />
          )}

          {currentTab === 'analytics' && <AnalyticsView />}

          {currentTab === 'activity' && <ActivityView />}

          {currentTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Modals */}
      <MemoryInspectorModal
        memory={inspectedMemory}
        onClose={() => setInspectedMemory(null)}
        onUpdate={handleUpdateMemory}
        onDelete={handleDeleteMemory}
        versions={inspectedVersions}
      />

      <NewMemoryModal
        isOpen={isNewMemoryModalOpen}
        onClose={() => setIsNewMemoryModalOpen(false)}
        onSubmit={handleCreateMemory}
      />

      <EdgeDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onDemoCompleted={() => loadData()}
      />
    </div>
  );
}
