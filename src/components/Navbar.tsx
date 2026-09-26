'use client';

import React from 'react';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Play,
  Plus,
  Search,
  Server,
  HardDrive,
  Cpu,
} from 'lucide-react';

interface NavbarProps {
  isOffline: boolean;
  onToggleOffline: () => void;
  onOpenDemo: () => void;
  onNewMemory: () => void;
  onOpenSearch: () => void;
  pendingSyncCount: number;
  unresolvedConflictsCount: number;
  syncing: boolean;
  onTriggerSync: () => void;
}

export function Navbar({
  isOffline,
  onToggleOffline,
  onOpenDemo,
  onNewMemory,
  onOpenSearch,
  pendingSyncCount,
  unresolvedConflictsCount,
  syncing,
  onTriggerSync,
}: NavbarProps) {
  return (
    <header className="h-16 border-b border-white/[0.08] bg-[#0a0d14]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Device & Architecture Context */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="h-2.5 w-2.5 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-xs uppercase tracking-widest font-mono text-zinc-400">
            Active Edge Runtime:
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 font-mono">
            DEV-001 (Machine Edge #01)
          </span>
        </div>

        <div className="hidden lg:flex items-center space-x-3 text-xs text-zinc-400 border-l border-white/[0.08] pl-4">
          <span className="flex items-center space-x-1.5 font-mono">
            <HardDrive className="w-3.5 h-3.5 text-zinc-400" />
            <span>Qdrant Edge: <span className="text-emerald-400 font-semibold">Active</span></span>
          </span>
          <span className="text-zinc-600">•</span>
          <span className="flex items-center space-x-1.5 font-mono">
            <Server className="w-3.5 h-3.5 text-zinc-400" />
            <span>
              Cloud Sync:{' '}
              {isOffline ? (
                <span className="text-rose-400 font-semibold">Paused (Offline)</span>
              ) : (
                <span className="text-emerald-400 font-semibold">Online (42ms)</span>
              )}
            </span>
          </span>
          <span className="text-zinc-600">•</span>
          <span className="flex items-center space-x-1.5 font-mono">
            <Cpu className="w-3.5 h-3.5 text-orange-400" />
            <span>Local AI: <span className="text-zinc-200">EdgeMind-Nano-8B</span></span>
          </span>
        </div>
      </div>

      {/* Right Controls: Offline Toggle, Quick Search, Sync, Demo, New Memory */}
      <div className="flex items-center space-x-3">
        {/* Offline Simulation Switch */}
        <button
          onClick={onToggleOffline}
          id="offline-simulation-toggle"
          title="Toggle Edge Offline Resilience Mode"
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            isOffline
              ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
          }`}
        >
          {isOffline ? (
            <>
              <WifiOff className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
              <span>SIMULATE OFFLINE: <strong className="font-bold">ENGAGED</strong></span>
            </>
          ) : (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>NETWORK: <strong>ONLINE</strong></span>
            </>
          )}
        </button>

        {/* Sync Trigger button */}
        {!isOffline && (
          <button
            onClick={onTriggerSync}
            disabled={syncing}
            id="navbar-sync-btn"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 border border-white/[0.08] transition-all"
            title="Trigger delta synchronization with Qdrant Cloud"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-orange-400 ${syncing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
            {pendingSyncCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 font-mono font-bold">
                {pendingSyncCount}
              </span>
            )}
          </button>
        )}

        {/* Quick Search trigger */}
        <button
          onClick={onOpenSearch}
          id="navbar-search-btn"
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-white/[0.08] transition-all"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Semantic Search...</span>
          <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] rounded bg-white/[0.06] text-zinc-400 font-mono">
            /
          </kbd>
        </button>

        {/* Interactive Edge-to-Cloud Demo Button */}
        <button
          onClick={onOpenDemo}
          id="run-edge-demo-btn"
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all hover:scale-[1.02]"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Run Edge Demo</span>
        </button>

        {/* New Memory Button */}
        <button
          onClick={onNewMemory}
          id="navbar-new-memory-btn"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-white/[0.1] transition-all"
        >
          <Plus className="w-3.5 h-3.5 text-orange-400" />
          <span>New Memory</span>
        </button>
      </div>
    </header>
  );
}
