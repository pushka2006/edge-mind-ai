'use client';

import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Layers,
  HardDrive,
  Cloud,
  Cpu,
  Lock,
  CheckCircle2,
  Sliders,
  Save,
  Plus,
} from 'lucide-react';
import { INITIAL_POLICIES } from '@/lib/data/seed';
import { RoutingPolicy } from '@/types';

export function SettingsView() {
  const [policies, setPolicies] = useState<RoutingPolicy[]>(INITIAL_POLICIES);
  const [savedNotice, setSavedNotice] = useState(false);

  const togglePolicy = (id: string) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-orange-400 mb-1">
            <Settings className="w-4 h-4" />
            <span>Policy Engine & Infrastructure Configuration</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            System Settings & Routing Policies
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure intelligent memory lifecycle routing, Qdrant Edge storage limits, and privacy isolation boundaries.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2 font-mono">
          <CheckCircle2 className="w-4 h-4" />
          <span>Policies and engine configuration successfully updated!</span>
        </div>
      )}

      {/* Section 1: Memory Routing Engine Policies */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-orange-400" />
              <span>Intelligent Local vs Cloud Memory Routing Engine</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Determines whether captured memories remain strictly on-device, replicate to Qdrant Cloud, or expire locally.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {policies.map((pol) => (
            <div
              key={pol.id}
              className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-xs text-orange-400">{pol.id}</span>
                  <span className="font-semibold text-xs text-zinc-200">{pol.name}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      pol.target === 'LOCAL_ONLY'
                        ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                        : pol.target === 'HIGH_PRIORITY_SYNC'
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                        : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {pol.target}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{pol.description}</p>
                <div className="text-[10px] font-mono text-zinc-500">
                  Condition: <code className="text-zinc-400">{pol.condition}</code> • Priority:{' '}
                  {pol.priority}
                </div>
              </div>

              <button
                onClick={() => togglePolicy(pol.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all shrink-0 ${
                  pol.enabled
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-zinc-800 text-zinc-500 border-white/[0.05]'
                }`}
              >
                {pol.enabled ? 'ACTIVE' : 'DISABLED'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Qdrant Edge & Qdrant Cloud Storage Endpoints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Qdrant Edge */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-white">
            <HardDrive className="w-4 h-4 text-orange-400" />
            <span>Qdrant Edge Configuration</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-mono text-zinc-400 block mb-1">Local Daemon Endpoint</label>
              <input
                type="text"
                readOnly
                value="http://127.0.0.1:6333 (Embedded Edge Client)"
                className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-zinc-300 font-mono"
              />
            </div>
            <div>
              <label className="font-mono text-zinc-400 block mb-1">Primary Edge Collection</label>
              <input
                type="text"
                readOnly
                value="edge_memories (128-dim, Cosine Distance)"
                className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-zinc-300 font-mono"
              />
            </div>
            <div>
              <label className="font-mono text-zinc-400 block mb-1">Storage Allocation Cap</label>
              <input
                type="text"
                readOnly
                value="16.0 GB (30% consumed by active telemetry)"
                className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-zinc-300 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Qdrant Cloud */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-white">
            <Cloud className="w-4 h-4 text-emerald-400" />
            <span>Qdrant Cloud Central Replica</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-mono text-zinc-400 block mb-1">Cloud Cluster URI</label>
              <input
                type="text"
                readOnly
                value="https://qdrant.cloud.internal:6333"
                className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-zinc-300 font-mono"
              />
            </div>
            <div>
              <label className="font-mono text-zinc-400 block mb-1">Cloud Cluster ID</label>
              <input
                type="text"
                readOnly
                value="us-east-industrial-fleet-01"
                className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-zinc-300 font-mono"
              />
            </div>
            <div>
              <label className="font-mono text-zinc-400 block mb-1">Authentication Handshake</label>
              <input
                type="password"
                readOnly
                value="••••••••••••••••••••••••••••••••"
                className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-zinc-300 font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: AI Model Routing & Privacy */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center space-x-2 text-sm font-bold text-white">
          <Cpu className="w-4 h-4 text-orange-400" />
          <span>Edge AI Model Routing & Cryptographic Privacy</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-black/30 border border-white/[0.05] space-y-2">
            <div className="font-semibold text-zinc-200">Local AI Engine</div>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              Active: <strong className="text-orange-400">EdgeMind-Nano-8B (INT4 Quantized)</strong>. Executes inference directly on edge CPU/NPU with sub-10ms token generation while totally offline.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/30 border border-white/[0.05] space-y-2">
            <div className="font-semibold text-zinc-200">Zero-Leakage Privacy Policy</div>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              Memories tagged <strong className="text-indigo-400 font-mono">LOCAL_ONLY</strong> or <strong className="text-indigo-400 font-mono">SENSITIVE</strong> are cryptographically sealed with hardware TPM keys and are blocked from network transmission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
