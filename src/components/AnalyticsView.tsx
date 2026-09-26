'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Brain,
  HardDrive,
  RefreshCw,
  AlertTriangle,
  Zap,
  Clock,
  Shield,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

export function AnalyticsView() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const TYPE_COLORS = ['#f97316', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-orange-400 mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>Edge Memory & Vector Telemetry Analytics</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          System Analytics
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Real-time metrics on edge memory ingestion, vector retrieval speed, storage partitioning, and synchronization convergence.
        </p>
      </div>

      {/* Latency Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-zinc-500 uppercase flex items-center justify-between">
            <span>P50 Local Latency</span>
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">2.1 ms</div>
          <div className="text-[10px] text-zinc-500">Qdrant Edge Cosine Index</div>
        </div>

        <div className="glass-panel p-5 rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-zinc-500 uppercase flex items-center justify-between">
            <span>P95 Local Latency</span>
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-200">4.8 ms</div>
          <div className="text-[10px] text-zinc-500">Includes BM25 Hybrid Rank</div>
        </div>

        <div className="glass-panel p-5 rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-zinc-500 uppercase flex items-center justify-between">
            <span>Offline Edge Speedup</span>
            <Zap className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-orange-400">14.2x</div>
          <div className="text-[10px] text-zinc-500">vs Cloud Round-Trip Latency</div>
        </div>

        <div className="glass-panel p-5 rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-zinc-500 uppercase flex items-center justify-between">
            <span>Avg Semantic Match</span>
            <Brain className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">88.4%</div>
          <div className="text-[10px] text-zinc-500">High-Fidelity Embeddings</div>
        </div>
      </div>

      {/* Main Charts */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Memory Types Breakdown (BarChart) */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Distribution by Memory Classification
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Breakdown of on-device records across sensor observations, events, facts, and tasks
              </p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.typeDistribution || []} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis
                    dataKey="name"
                    stroke="#52525b"
                    fontSize={10}
                    tickLine={false}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis stroke="#52525b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090d16',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {(data.typeDistribution || []).map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={TYPE_COLORS[index % TYPE_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 7-Day Growth Curve */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Weekly Edge Memory Growth Timeline
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Total cumulative records captured and synchronized over the last 7 operating days
              </p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.growthTimeline || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#52525b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#52525b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090d16',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#f97316"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#growthGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
