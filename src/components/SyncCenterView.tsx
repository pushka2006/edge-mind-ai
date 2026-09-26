'use client';

import React, { useState } from 'react';
import {
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  HardDrive,
  Layers,
  Wifi,
  WifiOff,
  Filter,
  ArrowUpRight,
  Play,
  RotateCcw,
} from 'lucide-react';
import { SyncActivityEvent } from '@/types';
import { NavTab } from './Sidebar';

interface SyncCenterViewProps {
  isOffline: boolean;
  totalMemories: number;
  syncedCount: number;
  pendingCount: number;
  conflictsCount: number;
  failedCount: number;
  activities: SyncActivityEvent[];
  onTriggerSync: () => void;
  onToggleOffline: () => void;
  onNavigate: (tab: NavTab) => void;
  syncing: boolean;
}

export function SyncCenterView({
  isOffline,
  totalMemories,
  syncedCount,
  pendingCount,
  conflictsCount,
  failedCount,
  activities,
  onTriggerSync,
  onToggleOffline,
  onNavigate,
  syncing,
}: SyncCenterViewProps) {
  const [filterOp, setFilterOp] = useState('ALL');

  const syncPercentage = totalMemories > 0 ? Math.round((syncedCount / totalMemories) * 100) : 100;

  const filteredActivities = activities.filter((act) => {
    if (filterOp !== 'ALL' && act.operation !== filterOp) return false;
    return true;
  });

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-orange-400 mb-1">
            <RefreshCw className="w-4 h-4" />
            <span>Edge-to-Cloud Delta Synchronization Engine</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Sync Center
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manages priority queues, delta tracking, and conflict detection between local edge daemons and Qdrant Cloud.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleOffline}
            className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
              isOffline
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                : 'bg-zinc-900 border-white/[0.08] text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            {isOffline ? <WifiOff className="w-4 h-4 text-rose-400" /> : <Wifi className="w-4 h-4 text-emerald-400" />}
            <span>{isOffline ? 'Resume Connection' : 'Pause Sync (Offline)'}</span>
          </button>

          <button
            onClick={onTriggerSync}
            disabled={syncing || isOffline}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-lg transition-all ${
              isOffline
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/[0.05]'
                : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      <div className="glass-panel p-6 rounded-2xl border-orange-500/20 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-500">
              Fleet Synchronization Progress
            </div>
            <div className="text-3xl font-black font-mono text-white mt-1">
              {syncPercentage}% <span className="text-sm font-normal text-zinc-400">Aligned with Cloud</span>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs font-mono">
            <div>
              <div className="text-zinc-500 text-[10px]">Pending Queue</div>
              <div className="text-lg font-bold text-amber-400">{pendingCount}</div>
            </div>
            <div>
              <div className="text-zinc-500 text-[10px]">Synced</div>
              <div className="text-lg font-bold text-emerald-400">{syncedCount}</div>
            </div>
            <div>
              <div className="text-zinc-500 text-[10px]">Conflicts</div>
              <div className="text-lg font-bold text-rose-400">{conflictsCount}</div>
            </div>
            <div>
              <div className="text-zinc-500 text-[10px]">Failed Retries</div>
              <div className="text-lg font-bold text-zinc-400">{failedCount}</div>
            </div>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden p-0.5 border border-white/[0.08]">
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${syncPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>Delta Tracking: ON</span>
            <span>Cloud Target: Qdrant Cloud Central [edge_memories]</span>
          </div>
        </div>

        {/* Quick action buttons row */}
        <div className="flex items-center flex-wrap gap-3 pt-2">
          {conflictsCount > 0 && (
            <button
              onClick={() => onNavigate('conflicts')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 flex items-center space-x-1.5 animate-pulse"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Review {conflictsCount} Unresolved Conflicts</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onTriggerSync}
            disabled={isOffline || syncing}
            className="px-3.5 py-1.5 rounded-lg text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/[0.08] flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
            <span>Retry Failed Items</span>
          </button>
        </div>
      </div>

      {/* Sync Activity Event Log */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Synchronization Event Log
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Immutable audit stream of delta uploads, downloads, and conflict detections
            </p>
          </div>

          {/* Operation Filter */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-mono text-zinc-500">Filter Operation:</span>
            <select
              value={filterOp}
              onChange={(e) => setFilterOp(e.target.value)}
              className="bg-zinc-900 border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-zinc-300 focus:outline-none focus:border-orange-500 font-mono"
            >
              <option value="ALL">All Operations</option>
              <option value="UPLOAD">UPLOAD</option>
              <option value="DELTA_SYNC">DELTA_SYNC</option>
              <option value="CONFLICT_DETECTED">CONFLICT_DETECTED</option>
              <option value="CONFLICT_RESOLVED">CONFLICT_RESOLVED</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-white/[0.04] text-xs">
          {filteredActivities.map((act) => (
            <div key={act.id} className="py-3.5 flex items-start justify-between gap-4">
              <div className="flex items-start space-x-3">
                <span
                  className={`mt-0.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase shrink-0 ${
                    act.status === 'SUCCESS'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      : act.status === 'WARNING'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {act.operation}
                </span>

                <div className="space-y-0.5">
                  <div className="text-zinc-200 font-medium">{act.details}</div>
                  <div className="text-[11px] text-zinc-500 font-mono flex items-center space-x-2">
                    <span>Memory: <strong className="text-orange-400">{act.memoryId}</strong></span>
                    <span>•</span>
                    <span>Device: {act.deviceId}</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-mono text-zinc-500 shrink-0 whitespace-nowrap">
                {new Date(act.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
