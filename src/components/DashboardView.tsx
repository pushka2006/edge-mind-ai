'use client';

import React from 'react';
import {
  Brain,
  HardDrive,
  RefreshCw,
  AlertTriangle,
  Wifi,
  WifiOff,
  Cpu,
  Layers,
  ArrowUpRight,
  Shield,
  Activity,
  Zap,
  Play,
  Search,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { NavTab } from './Sidebar';

interface DashboardViewProps {
  isOffline: boolean;
  totalMemories: number;
  pendingSync: number;
  conflictsCount: number;
  onNavigate: (tab: NavTab) => void;
  onTriggerSync: () => void;
  onOpenDemo: () => void;
  onToggleOffline: () => void;
  syncing: boolean;
}

const MEMORY_GROWTH_DATA = [
  { day: 'Mon', local: 340, cloud: 320, total: 340 },
  { day: 'Tue', local: 395, cloud: 380, total: 395 },
  { day: 'Wed', local: 430, cloud: 410, total: 430 },
  { day: 'Thu', local: 472, cloud: 450, total: 472 },
  { day: 'Fri', local: 504, cloud: 475, total: 504 },
  { day: 'Sat', local: 518, cloud: 485, total: 518 },
  { day: 'Today', local: 520, cloud: 490, total: 520 },
];

const LOCAL_CLOUD_DATA = [
  { name: 'Cloud Synced', value: 432, color: '#10B981' },
  { name: 'Local Only (Private)', value: 48, color: '#6366F1' },
  { name: 'Pending Sync', value: 36, color: '#F59E0B' },
  { name: 'In Conflict', value: 4, color: '#EF4444' },
];

const TELEMETRY_NODES = [
  { id: 'DEV-001', name: 'Machine Edge #01', type: 'CNC Spindle', cpu: 28, temp: 62.4, status: 'ONLINE', latency: 42 },
  { id: 'DEV-002', name: 'Robot Arm #04', type: 'Welding Cell', cpu: 35, temp: 58.1, status: 'ONLINE', latency: 38 },
  { id: 'DEV-003', name: 'Smart Kiosk #02', type: 'Diagnostic Terminal', cpu: 14, temp: 45.0, status: 'OFFLINE', latency: 0 },
  { id: 'DEV-004', name: 'Drone Alpha #09', type: 'LiDAR Surveyor', cpu: 64, temp: 48.7, status: 'ONLINE', latency: 115 },
  { id: 'DEV-005', name: 'Sensor Hub #07', type: 'Geothermal Wellhead', cpu: 12, temp: 71.3, status: 'ONLINE', latency: 56 },
];

export function DashboardView({
  isOffline,
  totalMemories,
  pendingSync,
  conflictsCount,
  onNavigate,
  onTriggerSync,
  onOpenDemo,
  onToggleOffline,
  syncing,
}: DashboardViewProps) {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero Banner / Architectural Status Bar */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden border-orange-500/20 bg-gradient-to-r from-zinc-950 via-[#0e131f] to-zinc-950">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-orange-400 mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>Offline-First Semantic Memory Runtime Active</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
              Edge Mind AI Control Center
            </h1>
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
              Operating autonomous on-device Qdrant Edge vector indexing. Changes persist locally during network dropouts and execute bidirectional delta synchronization upon cloud reconnection.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-3">
            <button
              onClick={onOpenDemo}
              id="dash-run-demo-btn"
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Run Edge-to-Cloud Demo</span>
            </button>

            <button
              onClick={onTriggerSync}
              disabled={syncing || isOffline}
              id="dash-sync-btn"
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                isOffline
                  ? 'bg-zinc-900 border-white/[0.05] text-zinc-600 cursor-not-allowed'
                  : 'bg-zinc-800/80 hover:bg-zinc-700 border-white/[0.1] text-zinc-200'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 text-orange-400 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>

            <button
              onClick={onToggleOffline}
              id="dash-offline-toggle"
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                isOffline
                  ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-white/[0.08] text-zinc-300'
              }`}
            >
              {isOffline ? <WifiOff className="w-4 h-4 text-rose-400" /> : <Wifi className="w-4 h-4 text-emerald-400" />}
              <span>{isOffline ? 'Offline Mode Active' : 'Network Online'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8 Core Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        {/* Card 1: Local Memories */}
        <div
          onClick={() => onNavigate('memory')}
          className="glass-panel glass-panel-hover p-5 rounded-xl cursor-pointer"
        >
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">
            <span>Local Memories</span>
            <Brain className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tracking-tight">
            {totalMemories.toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1 flex items-center space-x-1">
            <span className="text-emerald-400 font-medium">+14 today</span>
            <span>• On-device store</span>
          </div>
        </div>

        {/* Card 2: Vector Index */}
        <div
          onClick={() => onNavigate('search')}
          className="glass-panel glass-panel-hover p-5 rounded-xl cursor-pointer"
        >
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">
            <span>Vector Index</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tracking-tight">
            {totalMemories.toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1 flex items-center space-x-1">
            <span className="text-orange-400 font-medium">128-dim</span>
            <span>• Cosine Qdrant Edge</span>
          </div>
        </div>

        {/* Card 3: Pending Sync */}
        <div
          onClick={() => onNavigate('sync')}
          className="glass-panel glass-panel-hover p-5 rounded-xl cursor-pointer"
        >
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">
            <span>Pending Sync</span>
            <RefreshCw className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tracking-tight">
            {pendingSync}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1 flex items-center space-x-1">
            {isOffline ? (
              <span className="text-rose-400 font-medium">Queued (offline)</span>
            ) : (
              <span className="text-amber-400 font-medium">Priority queue ready</span>
            )}
          </div>
        </div>

        {/* Card 4: Conflicts */}
        <div
          onClick={() => onNavigate('conflicts')}
          className={`glass-panel glass-panel-hover p-5 rounded-xl cursor-pointer ${
            conflictsCount > 0 ? 'border-rose-500/30 bg-rose-500/[0.04]' : ''
          }`}
        >
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">
            <span>Conflicts</span>
            <AlertTriangle className={`w-4 h-4 ${conflictsCount > 0 ? 'text-rose-400 animate-pulse' : 'text-zinc-500'}`} />
          </div>
          <div className="text-2xl font-bold font-mono text-white tracking-tight">
            {conflictsCount}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            {conflictsCount > 0 ? (
              <span className="text-rose-400 font-semibold underline">Review in Conflict Center</span>
            ) : (
              <span className="text-emerald-400">All synchronized</span>
            )}
          </div>
        </div>

        {/* Card 5: Device Status */}
        <div
          onClick={() => onNavigate('devices')}
          className="glass-panel glass-panel-hover p-5 rounded-xl cursor-pointer"
        >
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">
            <span>Device Status</span>
            <Wifi className={`w-4 h-4 ${isOffline ? 'text-rose-400' : 'text-emerald-400'}`} />
          </div>
          <div className="text-xl font-bold font-mono text-white tracking-tight flex items-center space-x-2">
            <span>{isOffline ? 'OFFLINE' : 'ONLINE'}</span>
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isOffline ? 'bg-rose-500' : 'bg-emerald-400 animate-ping'
              }`}
            />
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            {isOffline ? 'Zero cloud dependency' : '42 ms RTT latency'}
          </div>
        </div>

        {/* Card 6: Last Sync */}
        <div
          onClick={() => onNavigate('sync')}
          className="glass-panel glass-panel-hover p-5 rounded-xl cursor-pointer"
        >
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">
            <span>Last Sync</span>
            <Clock className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white tracking-tight">
            2 min ago
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            Delta Sync #ACT-901
          </div>
        </div>

        {/* Card 7: Local Storage */}
        <div className="glass-panel p-5 rounded-xl">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">
            <span>Local Storage</span>
            <HardDrive className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white tracking-tight">
            4.8 GB <span className="text-xs text-zinc-500 font-normal">/ 16 GB</span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-orange-500 h-full rounded-full" style={{ width: '30%' }} />
          </div>
        </div>

        {/* Card 8: AI Status */}
        <div
          onClick={() => onNavigate('assistant')}
          className="glass-panel glass-panel-hover p-5 rounded-xl cursor-pointer"
        >
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">
            <span>AI Status</span>
            <Cpu className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 tracking-tight flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>READY</span>
          </div>
          <div className="text-[11px] text-zinc-500 mt-1 font-mono">
            EdgeMind-Nano-8B
          </div>
        </div>
      </div>

      {/* Visual Charts: Memory Growth and Local vs Cloud Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Memory Growth Timeline (Area Chart) */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Edge Memory Growth & Ingestion Curve
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Continuous on-device telemetry capture and vector embedding accumulation
              </p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono text-zinc-400">
              <span className="flex items-center space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                <span>Edge Store</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Cloud Synced</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MEMORY_GROWTH_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="edgeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#52525b" fontSize={11} tickLine={false} />
                <YAxis stroke="#52525b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="local" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#edgeGrad)" />
                <Area type="monotone" dataKey="cloud" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#cloudGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Local vs Cloud Balance */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Storage Partitioning
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Breakdown by synchronization and privacy classification
            </p>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={LOCAL_CLOUD_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {LOCAL_CLOUD_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs">
            {LOCAL_CLOUD_DATA.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-zinc-300">{item.name}</span>
                </div>
                <span className="font-mono font-semibold text-zinc-200">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Industrial Fleet Monitoring & Telemetry */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Fleet Edge Nodes & Real-Time Telemetry
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              5 registered edge devices operating synchronized Qdrant Edge memory daemons
            </p>
          </div>
          <button
            onClick={() => onNavigate('devices')}
            className="text-xs text-orange-400 hover:text-orange-300 flex items-center space-x-1 font-medium"
          >
            <span>View All Devices</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {TELEMETRY_NODES.map((node) => (
            <div
              key={node.id}
              onClick={() => onNavigate('devices')}
              className="p-4 rounded-xl bg-black/30 border border-white/[0.06] hover:border-orange-500/30 transition-all cursor-pointer space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-zinc-400">{node.id}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase ${
                    node.status === 'ONLINE'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {node.status}
                </span>
              </div>

              <div>
                <div className="text-xs font-semibold text-zinc-200 truncate">{node.name}</div>
                <div className="text-[10px] text-zinc-500">{node.type}</div>
              </div>

              <div className="pt-2 border-t border-white/[0.05] grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400">
                <div>
                  <span className="text-zinc-600">CPU: </span>
                  <span className="text-zinc-200">{node.cpu}%</span>
                </div>
                <div>
                  <span className="text-zinc-600">Temp: </span>
                  <span className={node.temp > 70 ? 'text-rose-400' : 'text-zinc-200'}>{node.temp}°C</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
