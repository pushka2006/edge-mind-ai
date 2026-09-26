'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Shield,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  HardDrive,
  Brain,
  Lock,
} from 'lucide-react';
import { AuditLog } from '@/types';

export function ActivityView() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('ALL');

  const fetchLogs = () => {
    setLoading(true);
    fetch(`/api/audit-logs?action=${actionFilter}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setLogs(data.logs || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-orange-400 mb-1">
            <Shield className="w-4 h-4" />
            <span>Immutable Cryptographic Audit Trail</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Audit & System Activity Logs
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Tamper-evident log of memory lifecycle modifications, local searches, delta synchronizations, and conflict resolutions.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-zinc-900 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-orange-500 font-mono"
          >
            <option value="ALL">All Actions</option>
            <option value="MEMORY_CREATE">MEMORY_CREATE</option>
            <option value="MEMORY_UPDATE">MEMORY_UPDATE</option>
            <option value="SEARCH_LOCAL">SEARCH_LOCAL</option>
            <option value="SYNC_INITIATE">SYNC_INITIATE</option>
            <option value="CONFLICT_RESOLVE">CONFLICT_RESOLVE</option>
            <option value="OFFLINE_ENGAGE">OFFLINE_ENGAGE</option>
            <option value="ONLINE_RESTORE">ONLINE_RESTORE</option>
          </select>

          <button
            onClick={fetchLogs}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-white/[0.08]"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Log Feed */}
      <div className="glass-panel rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/40 text-zinc-400 font-mono uppercase text-[10px] tracking-wider border-b border-white/[0.08]">
              <tr>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Resource</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Device</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        log.action.includes('CREATE')
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                          : log.action.includes('CONFLICT')
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                          : log.action.includes('OFFLINE')
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-orange-400 whitespace-nowrap">
                    {log.resource}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-zinc-400 whitespace-nowrap">
                    {log.userId}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-zinc-400 whitespace-nowrap">
                    {log.deviceId}
                  </td>

                  <td className="py-3.5 px-4 text-zinc-200 font-sans max-w-md">
                    <div>{log.details}</div>
                    {log.previousState && log.newState && (
                      <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                        Diff: <span className="text-rose-400">{log.previousState}</span> →{' '}
                        <span className="text-emerald-400">{log.newState}</span>
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono text-zinc-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
