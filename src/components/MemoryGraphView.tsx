'use client';

import React, { useState } from 'react';
import {
  GitBranch,
  Brain,
  Cpu,
  Layers,
  Search,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { MemoryItem } from '@/types';

interface MemoryGraphViewProps {
  memories: MemoryItem[];
  onSelectMemory: (memory: MemoryItem) => void;
}

interface GraphNode {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
  memoryId?: string;
  color: string;
}

interface GraphLink {
  from: string;
  to: string;
  relation: string;
}

export function MemoryGraphView({ memories, onSelectMemory }: MemoryGraphViewProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-spindle');

  // Realistic knowledge graph nodes around CNC Machine Edge #01 and Spindle Overheat incident
  const nodes: GraphNode[] = [
    { id: 'node-machine1', label: 'Machine Edge #01 (CNC Milling)', type: 'Device', x: 400, y: 220, color: '#f97316' },
    { id: 'node-spindle', label: 'Spindle Bearing (B-2 Ceramic)', type: 'Component', x: 220, y: 140, color: '#fb923c' },
    { id: 'node-temp', label: 'M-1024: 82.4°C Thermal Incident', type: 'Sensor Memory', x: 120, y: 280, memoryId: 'M-1024', color: '#ef4444' },
    { id: 'node-vibration', label: 'M-1027: 3.8mm/s RMS Harmonics', type: 'Sensor Memory', x: 140, y: 420, memoryId: 'M-1027', color: '#f59e0b' },
    { id: 'node-cutoff', label: 'M-1026: Emergency Feed Hold', type: 'Event Memory', x: 300, y: 360, memoryId: 'M-1026', color: '#ec4899' },
    { id: 'node-tech', label: 'M-1025: Dan Kovacs Maintenance', type: 'Observation', x: 440, y: 460, memoryId: 'M-1025', color: '#10b981' },
    { id: 'node-lubricant', label: 'Mobil SHC 626 Synthetic Oil', type: 'Consumable', x: 620, y: 440, color: '#06b6d4' },
    { id: 'node-cloud-sync', label: 'Qdrant Cloud Central Replica', type: 'Cloud Store', x: 650, y: 200, color: '#6366f1' },
    { id: 'node-workorder', label: 'Work Order #WO-9941', type: 'ERP Entity', x: 600, y: 320, color: '#8b5cf6' },
  ];

  const links: GraphLink[] = [
    { from: 'node-machine1', to: 'node-spindle', relation: 'subsystem_of' },
    { from: 'node-spindle', to: 'node-temp', relation: 'logged_telemetry' },
    { from: 'node-spindle', to: 'node-vibration', relation: 'acoustic_signature' },
    { from: 'node-temp', to: 'node-cutoff', relation: 'triggered_interlock' },
    { from: 'node-cutoff', to: 'node-tech', relation: 'dispatched_technician' },
    { from: 'node-tech', to: 'node-lubricant', relation: 'replenished' },
    { from: 'node-machine1', to: 'node-cloud-sync', relation: 'delta_synchronizes' },
    { from: 'node-tech', to: 'node-workorder', relation: 'fulfills' },
  ];

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-orange-400 mb-1">
            <GitBranch className="w-4 h-4" />
            <span>Semantic Relationship & Memory Association Graph</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Memory Graph Explorer
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Interactive topology connecting physical machine components, sensor observations, technician interventions, and cloud replicas.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-zinc-400 font-mono">
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Telemetry Incident</span>
          </span>
          <span className="flex items-center space-x-1.5 ml-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Maintenance</span>
          </span>
          <span className="flex items-center space-x-1.5 ml-3">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span>Device</span>
          </span>
        </div>
      </div>

      {/* Main Canvas + Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SVG Interactive Graph */}
        <div className="lg:col-span-3 glass-panel p-4 rounded-2xl relative min-h-[520px] overflow-hidden flex flex-col justify-between border-white/[0.1]">
          <div className="absolute top-4 left-4 z-10 text-[11px] font-mono text-zinc-500 bg-black/60 px-3 py-1.5 rounded-lg border border-white/[0.08]">
            Interactive Topology • Click any node to inspect semantic memory associations
          </div>

          <svg className="w-full h-[520px]">
            {/* Draw Links */}
            {links.map((link, idx) => {
              const fromNode = nodes.find((n) => n.id === link.from);
              const toNode = nodes.find((n) => n.id === link.to);
              if (!fromNode || !toNode) return null;

              const isConnected =
                selectedNodeId === link.from || selectedNodeId === link.to;

              const midX = (fromNode.x + toNode.x) / 2;
              const midY = (fromNode.y + toNode.y) / 2;

              return (
                <g key={idx}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={isConnected ? '#f97316' : 'rgba(255,255,255,0.12)'}
                    strokeWidth={isConnected ? 2.5 : 1.2}
                    strokeDasharray={isConnected ? 'none' : '4 4'}
                  />
                  <text
                    x={midX}
                    y={midY - 4}
                    fill={isConnected ? '#fdba74' : '#71717a'}
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {link.relation}
                  </text>
                </g>
              );
            })}

            {/* Draw Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;

              return (
                <g
                  key={node.id}
                  onClick={() => {
                    setSelectedNodeId(node.id);
                    if (node.memoryId) {
                      const found = memories.find((m) => m.id === node.memoryId);
                      if (found) onSelectMemory(found);
                    }
                  }}
                  className="cursor-pointer transition-all"
                >
                  {/* Outer halo */}
                  {isSelected && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="28"
                      fill={node.color}
                      opacity="0.25"
                      className="animate-pulse"
                    />
                  )}
                  {/* Node Body */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 18 : 14}
                    fill="#0c101a"
                    stroke={node.color}
                    strokeWidth={isSelected ? 3 : 2}
                  />
                  <text
                    x={node.x}
                    y={node.y + 4}
                    fill={node.color}
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {node.type[0]}
                  </text>

                  {/* Label */}
                  <text
                    x={node.x}
                    y={node.y + (isSelected ? 32 : 26)}
                    fill={isSelected ? '#ffffff' : '#d4d4d8'}
                    fontSize="11"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    textAnchor="middle"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Node Inspector Drawer */}
        <div className="glass-panel p-6 rounded-2xl border-white/[0.1] space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-500">
              Selected Entity
            </div>

            {selectedNode ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] space-y-1">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase">
                    {selectedNode.type}
                  </div>
                  <div className="text-sm font-bold text-white tracking-tight">
                    {selectedNode.label}
                  </div>
                </div>

                {selectedNode.memoryId ? (
                  <div className="space-y-2">
                    <div className="text-xs text-zinc-400">
                      Directly mapped to verified edge memory record{' '}
                      <strong className="text-orange-400 font-mono">
                        {selectedNode.memoryId}
                      </strong>
                    </div>

                    <button
                      onClick={() => {
                        const found = memories.find((m) => m.id === selectedNode.memoryId);
                        if (found) onSelectMemory(found);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition-all flex items-center justify-center space-x-1.5 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                    >
                      <Brain className="w-3.5 h-3.5" />
                      <span>Inspect Memory {selectedNode.memoryId}</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-zinc-400 leading-relaxed">
                    Physical subsystem anchor. Connects high-frequency acoustic harmonics, bearing temperatures, and lubrication dispatches.
                  </div>
                )}

                {/* Graph Link associations */}
                <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                  <div className="text-[10px] font-mono uppercase text-zinc-500">
                    Connected Graph Links
                  </div>
                  <div className="space-y-1 text-xs font-mono text-zinc-300">
                    {links
                      .filter((l) => l.from === selectedNode.id || l.to === selectedNode.id)
                      .map((l, i) => (
                        <div key={i} className="p-1.5 rounded bg-white/[0.03] text-[11px] truncate">
                          • {l.relation}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-zinc-500 italic">Click a node to inspect its relations</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
