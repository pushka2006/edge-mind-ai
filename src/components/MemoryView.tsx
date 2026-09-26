'use client';

import React, { useState, useMemo } from 'react';
import {
  Brain,
  Search,
  Filter,
  Layers,
  Shield,
  Clock,
  Plus,
  RefreshCw,
  AlertTriangle,
  Lock,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { MemoryItem, MemoryType, ImportanceLevel, SensitivityLevel, SyncStatus } from '@/types';

interface MemoryViewProps {
  memories: MemoryItem[];
  onSelectMemory: (memory: MemoryItem) => void;
  onNewMemory: () => void;
  onRefresh: () => void;
}

export function MemoryView({
  memories,
  onSelectMemory,
  onNewMemory,
  onRefresh,
}: MemoryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [syncFilter, setSyncFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const filteredMemories = useMemo(() => {
    return memories.filter((m) => {
      if (deviceFilter !== 'ALL' && m.deviceId !== deviceFilter) return false;
      if (typeFilter !== 'ALL' && m.type !== typeFilter) return false;
      if (syncFilter !== 'ALL' && m.syncStatus !== syncFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = m.title.toLowerCase().includes(q);
        const matchesContent = m.content.toLowerCase().includes(q);
        const matchesId = m.id.toLowerCase().includes(q);
        const matchesTag = m.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesContent && !matchesId && !matchesTag) return false;
      }

      return true;
    });
  }, [memories, deviceFilter, typeFilter, syncFilter, searchQuery]);

  const totalPages = Math.ceil(filteredMemories.length / pageSize) || 1;
  const paginatedMemories = filteredMemories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-orange-400 mb-1">
            <Brain className="w-4 h-4" />
            <span>On-Device Qdrant Edge Vector Partition</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Memory Explorer ({memories.length} records)
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Offline-native storage storing telemetry observations, kinematic events, and operational knowledge
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onRefresh}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-white/[0.08]"
            title="Reload Edge Records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onNewMemory}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Log Memory</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search memory ID, content, sensor, keywords, or tags..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-zinc-900/80 border border-white/[0.08] rounded-lg pl-9 pr-4 py-2 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Device Filter */}
          <select
            value={deviceFilter}
            onChange={(e) => {
              setDeviceFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-zinc-900 border border-white/[0.08] rounded-lg px-2.5 py-2 text-zinc-300 focus:outline-none focus:border-orange-500 font-mono"
          >
            <option value="ALL">All Devices</option>
            <option value="DEV-001">DEV-001 (Machine Edge #01)</option>
            <option value="DEV-002">DEV-002 (Robot Arm #04)</option>
            <option value="DEV-003">DEV-003 (Smart Kiosk #02)</option>
            <option value="DEV-004">DEV-004 (Drone Alpha #09)</option>
            <option value="DEV-005">DEV-005 (Sensor Hub #07)</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-zinc-900 border border-white/[0.08] rounded-lg px-2.5 py-2 text-zinc-300 focus:outline-none focus:border-orange-500"
          >
            <option value="ALL">All Types</option>
            <option value="Sensor observation">Sensor observation</option>
            <option value="Observation">Observation</option>
            <option value="Event">Event</option>
            <option value="System event">System event</option>
            <option value="Instruction">Instruction</option>
            <option value="Fact">Fact</option>
            <option value="Task">Task</option>
            <option value="Knowledge">Knowledge</option>
          </select>

          {/* Sync Status Filter */}
          <select
            value={syncFilter}
            onChange={(e) => {
              setSyncFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-zinc-900 border border-white/[0.08] rounded-lg px-2.5 py-2 text-zinc-300 focus:outline-none focus:border-orange-500"
          >
            <option value="ALL">All Sync States</option>
            <option value="SYNCED">SYNCED</option>
            <option value="PENDING">PENDING</option>
            <option value="QUEUED">QUEUED</option>
            <option value="CONFLICT">CONFLICT</option>
            <option value="DEFERRED">DEFERRED (Local Only)</option>
          </select>
        </div>
      </div>

      {/* Memory Table */}
      <div className="glass-panel rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/40 text-zinc-400 font-mono uppercase text-[10px] tracking-wider border-b border-white/[0.08]">
              <tr>
                <th className="py-3 px-4">Memory ID</th>
                <th className="py-3 px-4">Title & Context</th>
                <th className="py-3 px-4">Device</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Importance</th>
                <th className="py-3 px-4">Sync Status</th>
                <th className="py-3 px-4">Sensitivity</th>
                <th className="py-3 px-4">Ver</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {paginatedMemories.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-zinc-500">
                    No memories found matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedMemories.map((mem) => (
                  <tr
                    key={mem.id}
                    onClick={() => onSelectMemory(mem)}
                    className="hover:bg-white/[0.04] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-orange-400 whitespace-nowrap">
                      {mem.id}
                    </td>

                    <td className="py-3 px-4 max-w-md">
                      <div className="font-semibold text-zinc-200 truncate">{mem.title}</div>
                      <div className="text-[11px] text-zinc-500 truncate mt-0.5">{mem.content}</div>
                    </td>

                    <td className="py-3 px-4 font-mono text-zinc-400 whitespace-nowrap">
                      {mem.deviceId}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-medium text-[11px]">
                        {mem.type}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-mono font-semibold uppercase ${
                          mem.importance === 'CRITICAL'
                            ? 'text-rose-400'
                            : mem.importance === 'HIGH'
                            ? 'text-amber-400'
                            : 'text-zinc-400'
                        }`}
                      >
                        {mem.importance}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                          mem.syncStatus === 'SYNCED'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                            : mem.syncStatus === 'CONFLICT'
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20 animate-pulse'
                            : mem.syncStatus === 'DEFERRED'
                            ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {mem.syncStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="flex items-center space-x-1 text-zinc-400 font-mono text-[11px]">
                        {mem.isLocalOnly ? (
                          <>
                            <Lock className="w-3 h-3 text-indigo-400" />
                            <span className="text-indigo-300">LOCAL_ONLY</span>
                          </>
                        ) : (
                          <span>{mem.sensitivity}</span>
                        )}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-zinc-400 whitespace-nowrap">
                      v{mem.version}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectMemory(mem);
                        }}
                        className="text-orange-400 hover:text-orange-300 p-1 rounded hover:bg-orange-500/10"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-400">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, filteredMemories.length)} of{' '}
            {filteredMemories.length} entries
          </div>

          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg bg-zinc-900 border border-white/[0.08] text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-mono text-xs text-zinc-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg bg-zinc-900 border border-white/[0.08] text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
