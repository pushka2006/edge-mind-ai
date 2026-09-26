'use client';

import React from 'react';
import {
  LayoutDashboard,
  Brain,
  Search,
  Bot,
  Cpu,
  RefreshCw,
  AlertTriangle,
  GitBranch,
  BarChart3,
  Activity,
  Settings,
  ShieldAlert,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'memory'
  | 'search'
  | 'assistant'
  | 'devices'
  | 'sync'
  | 'conflicts'
  | 'graph'
  | 'analytics'
  | 'activity'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  unresolvedConflictsCount: number;
  pendingSyncCount: number;
  totalMemoriesCount: number;
}

export function Sidebar({
  currentTab,
  onSelectTab,
  unresolvedConflictsCount,
  pendingSyncCount,
  totalMemoriesCount,
}: SidebarProps) {
  const navItems: Array<{
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeColor?: string;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'memory',
      label: 'Memory Explorer',
      icon: Brain,
      badge: totalMemoriesCount > 0 ? totalMemoriesCount : undefined,
    },
    { id: 'search', label: 'Semantic Search', icon: Search },
    { id: 'assistant', label: 'AI Assistant (EdgeMind)', icon: Bot },
    { id: 'devices', label: 'Edge Devices', icon: Cpu, badge: 5 },
    {
      id: 'sync',
      label: 'Sync Center',
      icon: RefreshCw,
      badge: pendingSyncCount > 0 ? pendingSyncCount : undefined,
      badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    },
    {
      id: 'conflicts',
      label: 'Conflict Center',
      icon: AlertTriangle,
      badge: unresolvedConflictsCount > 0 ? unresolvedConflictsCount : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30 font-bold animate-pulse',
    },
    { id: 'graph', label: 'Memory Graph', icon: GitBranch },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'activity', label: 'Audit & Activity', icon: Activity },
    { id: 'settings', label: 'Settings & Policy', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-white/[0.08] bg-[#07090e] flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-white/[0.08]">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-amber-300 flex items-center justify-center shadow-[0_0_16px_rgba(249,115,22,0.4)]">
              <Brain className="w-5 h-5 text-zinc-950 font-black" />
            </div>
            <div>
              <div className="text-sm font-black tracking-wider uppercase bg-gradient-to-r from-orange-400 via-amber-300 to-amber-100 bg-clip-text text-transparent">
                EDGE MIND AI
              </div>
              <div className="text-[10px] font-mono tracking-tight text-zinc-500 uppercase">
                Edge Memory & Intelligence
              </div>
            </div>
          </div>
          <div className="mt-3 text-[11px] font-medium text-zinc-400 border-l-2 border-orange-500/60 pl-2 leading-relaxed italic">
            &ldquo;Local intelligence. Persistent memory. Cloud synchronization.&rdquo;
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
            Platform Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                id={`nav-tab-${item.id}`}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30 shadow-[0_0_12px_rgba(249,115,22,0.12)] font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-orange-400' : 'text-zinc-500'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`ml-2 px-1.5 py-0.2 rounded text-[10px] font-mono border ${
                      item.badgeColor || 'bg-white/[0.06] text-zinc-400 border-white/[0.08]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Tenant Context */}
      <div className="p-4 border-t border-white/[0.08] bg-black/20 text-xs text-zinc-400">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Organization
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
            ORG-804
          </span>
        </div>
        <div className="font-semibold text-zinc-200 truncate">
          AeroTech Industrial Dynamics
        </div>
        <div className="mt-2 pt-2 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
          <span>Qdrant Edge: v1.11</span>
          <span className="text-orange-400">Offline-First</span>
        </div>
      </div>
    </aside>
  );
}
