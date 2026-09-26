'use client';

import React, { useState } from 'react';
import {
  Cpu,
  HardDrive,
  Wifi,
  WifiOff,
  Battery,
  Thermometer,
  Activity,
  Layers,
  Brain,
  AlertTriangle,
  RefreshCw,
  Plus,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { DeviceInfo } from '@/types';

interface DevicesViewProps {
  devices: DeviceInfo[];
  onFilterByDevice: (deviceId: string) => void;
  onRefresh: () => void;
}

export function DevicesView({ devices, onFilterByDevice, onRefresh }: DevicesViewProps) {
  const [selectedDevice, setSelectedDevice] = useState<DeviceInfo | null>(devices[0] || null);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-orange-400 mb-1">
            <Cpu className="w-4 h-4" />
            <span>Industrial Edge Hardware Management</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Edge Fleet Devices ({devices.length})
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Distributed physical systems operating standalone Qdrant Edge local semantic memory nodes
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/[0.08] text-xs transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5 text-orange-400" />
          <span>Refresh Hardware States</span>
        </button>
      </div>

      {/* Grid of Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {devices.map((device) => {
          const isSelected = selectedDevice?.id === device.id;
          const storagePct = Math.round((device.storageUsedGb / device.storageTotalGb) * 100);

          return (
            <div
              key={device.id}
              onClick={() => setSelectedDevice(device)}
              className={`glass-panel p-6 rounded-2xl cursor-pointer transition-all space-y-4 ${
                isSelected
                  ? 'border-orange-500/60 shadow-[0_0_20px_rgba(249,115,22,0.15)] bg-orange-500/[0.03]'
                  : 'glass-panel-hover'
              }`}
            >
              {/* Header with status badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-mono text-xs font-bold">
                    {device.id.slice(-3)}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">{device.id}</span>
                    <div className="text-xs font-bold text-white tracking-tight truncate max-w-[160px]">
                      {device.name.split('(')[0]}
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    device.status === 'ONLINE'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {device.status}
                </span>
              </div>

              {/* Hardware Telemetry Counters */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.05]">
                  <div className="text-[10px] text-zinc-500 flex items-center justify-center space-x-1 font-mono">
                    <Cpu className="w-3 h-3 text-zinc-400" />
                    <span>CPU</span>
                  </div>
                  <div className="font-mono font-bold text-zinc-200 mt-1">{device.cpuUsage}%</div>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.05]">
                  <div className="text-[10px] text-zinc-500 flex items-center justify-center space-x-1 font-mono">
                    <Activity className="w-3 h-3 text-zinc-400" />
                    <span>RAM</span>
                  </div>
                  <div className="font-mono font-bold text-zinc-200 mt-1">{device.ramUsage}%</div>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.05]">
                  <div className="text-[10px] text-zinc-500 flex items-center justify-center space-x-1 font-mono">
                    <Thermometer className="w-3 h-3 text-zinc-400" />
                    <span>Temp</span>
                  </div>
                  <div
                    className={`font-mono font-bold mt-1 ${
                      device.temperatureC > 70 ? 'text-rose-400' : 'text-zinc-200'
                    }`}
                  >
                    {device.temperatureC}°C
                  </div>
                </div>
              </div>

              {/* Storage Gauge */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span className="flex items-center space-x-1">
                    <HardDrive className="w-3 h-3 text-zinc-500" />
                    <span>Edge Storage:</span>
                  </span>
                  <span>
                    {device.storageUsedGb} GB / {device.storageTotalGb} GB ({storagePct}%)
                  </span>
                </div>
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      storagePct > 80 ? 'bg-rose-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${storagePct}%` }}
                  />
                </div>
              </div>

              {/* Memory count & Conflict counts */}
              <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-[11px] font-mono">
                <div className="text-zinc-400">
                  Memories: <strong className="text-zinc-200">{device.memoryCount}</strong>
                </div>
                {device.conflictCount > 0 ? (
                  <div className="text-rose-400 font-bold flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{device.conflictCount} Conflicts</span>
                  </div>
                ) : (
                  <div className="text-emerald-400 font-medium">In Sync</div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFilterByDevice(device.id);
                  }}
                  className="w-full text-xs text-center py-1.5 rounded-lg bg-white/[0.04] hover:bg-orange-500/10 hover:text-orange-300 text-zinc-300 border border-white/[0.06] transition-all flex items-center justify-center space-x-1"
                >
                  <span>Inspect Memories</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
