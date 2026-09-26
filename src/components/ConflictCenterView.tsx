'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  GitMerge,
  CheckCircle2,
  HardDrive,
  Cloud,
  ArrowRight,
  Shield,
  Layers,
  History,
  FileCheck,
} from 'lucide-react';
import { ConflictItem, MemoryItem } from '@/types';

interface ConflictCenterViewProps {
  conflicts: ConflictItem[];
  onResolveConflict: (
    conflictId: string,
    strategy: 'KEEP_LOCAL' | 'KEEP_CLOUD' | 'MERGE' | 'CUSTOM_POLICY',
    customContent?: string
  ) => Promise<void>;
  onInspectMemory: (memoryId: string) => void;
}

export function ConflictCenterView({
  conflicts,
  onResolveConflict,
  onInspectMemory,
}: ConflictCenterViewProps) {
  const [activeTab, setActiveTab] = useState<'UNRESOLVED' | 'RESOLVED'>('UNRESOLVED');
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const displayedConflicts = conflicts.filter((c) =>
    activeTab === 'UNRESOLVED' ? c.status === 'UNRESOLVED' : c.status === 'RESOLVED'
  );

  const handleResolve = async (
    conflictId: string,
    strategy: 'KEEP_LOCAL' | 'KEEP_CLOUD' | 'MERGE'
  ) => {
    setResolvingId(conflictId);
    try {
      await onResolveConflict(conflictId, strategy);
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-rose-400 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>Multi-Master Divergence Engine</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Conflict Center
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Detects concurrent edge modifications, sensor drift, and version divergences between distributed devices and cloud.
          </p>
        </div>

        {/* Status Tab Switcher */}
        <div className="flex rounded-xl bg-black/40 p-1 border border-white/[0.08] text-xs">
          <button
            onClick={() => setActiveTab('UNRESOLVED')}
            className={`px-4 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'UNRESOLVED'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Unresolved Conflicts ({conflicts.filter((c) => c.status === 'UNRESOLVED').length})
          </button>
          <button
            onClick={() => setActiveTab('RESOLVED')}
            className={`px-4 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'RESOLVED'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Resolved History ({conflicts.filter((c) => c.status === 'RESOLVED').length})
          </button>
        </div>
      </div>

      {/* Conflict Cards */}
      <div className="space-y-6">
        {displayedConflicts.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="text-sm font-semibold text-zinc-300">
              {activeTab === 'UNRESOLVED'
                ? 'Zero Unresolved Conflicts'
                : 'No Resolution History Yet'}
            </div>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              All edge devices and cloud Qdrant replicas are in synchronized consensus.
            </p>
          </div>
        ) : (
          displayedConflicts.map((conf) => {
            const isResolving = resolvingId === conf.id;

            return (
              <div
                key={conf.id}
                className="glass-panel p-6 rounded-2xl space-y-5 border-white/[0.1] relative overflow-hidden"
              >
                {/* Conflict Header */}
                <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-white/[0.06]">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-mono font-bold text-rose-400">
                      {conf.id}
                    </span>
                    <button
                      onClick={() => onInspectMemory(conf.memoryId)}
                      className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 font-mono text-xs font-semibold hover:bg-orange-500/20"
                    >
                      {conf.memoryId}
                    </button>
                    <span className="text-xs text-zinc-400 font-mono">
                      Device: <strong className="text-zinc-300">{conf.deviceId}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px] font-bold uppercase">
                      {conf.conflictType}
                    </span>
                  </div>

                  <div className="text-xs text-zinc-500 font-mono">
                    Detected: {new Date(conf.detectedAt).toLocaleString()}
                  </div>
                </div>

                {/* Side-by-Side Comparison: Local Edge vs Cloud Server */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Left Column: Local Edge State */}
                  <div className="p-4 rounded-xl bg-orange-500/[0.04] border border-orange-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs font-semibold text-orange-400">
                        <HardDrive className="w-4 h-4" />
                        <span>LOCAL EDGE VERSION (v{conf.localVersion})</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                        On-Device Sensor
                      </span>
                    </div>

                    <div className="text-xs text-zinc-200 leading-relaxed font-sans bg-black/40 p-3 rounded-lg border border-white/[0.04]">
                      {conf.localContent}
                    </div>

                    {/* Metadata attributes */}
                    <div className="p-2.5 rounded-lg bg-black/30 font-mono text-[11px] text-zinc-400 space-y-1">
                      {Object.entries(conf.localMetadata || {}).map(([key, val]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-zinc-500">{key}:</span>
                          <span className="text-zinc-200">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Cloud Server State */}
                  <div className="p-4 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
                        <Cloud className="w-4 h-4" />
                        <span>CLOUD SERVER VERSION (v{conf.cloudVersion})</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Central Model
                      </span>
                    </div>

                    <div className="text-xs text-zinc-200 leading-relaxed font-sans bg-black/40 p-3 rounded-lg border border-white/[0.04]">
                      {conf.cloudContent}
                    </div>

                    {/* Metadata attributes */}
                    <div className="p-2.5 rounded-lg bg-black/30 font-mono text-[11px] text-zinc-400 space-y-1">
                      {Object.entries(conf.cloudMetadata || {}).map(([key, val]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-zinc-500">{key}:</span>
                          <span className="text-zinc-200">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Resolution Action Bar */}
                {conf.status === 'UNRESOLVED' ? (
                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between flex-wrap gap-3">
                    <div className="text-xs text-zinc-400 flex items-center space-x-1.5">
                      <Shield className="w-3.5 h-3.5 text-orange-400" />
                      <span>Choose authoritative resolution policy:</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleResolve(conf.id, 'KEEP_LOCAL')}
                        disabled={isResolving}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/30 transition-all"
                      >
                        Keep Local (Edge Wins)
                      </button>

                      <button
                        onClick={() => handleResolve(conf.id, 'KEEP_CLOUD')}
                        disabled={isResolving}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-all"
                      >
                        Keep Cloud (Server Wins)
                      </button>

                      <button
                        onClick={() => handleResolve(conf.id, 'MERGE')}
                        disabled={isResolving}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)] flex items-center space-x-1.5"
                      >
                        <GitMerge className="w-3.5 h-3.5" />
                        <span>Synthesize & Merge</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
                    <div className="flex items-center space-x-2 text-emerald-400 font-mono">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Resolved via {conf.resolutionStrategy} by {conf.resolvedBy}</span>
                    </div>
                    <div className="font-mono text-[11px] text-zinc-500">
                      {conf.resolvedAt && new Date(conf.resolvedAt).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
