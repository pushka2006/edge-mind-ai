'use client';

import React, { useState } from 'react';
import {
  X,
  Brain,
  Shield,
  Layers,
  Clock,
  HardDrive,
  Cpu,
  Trash2,
  Lock,
  GitBranch,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Tag,
  Share2,
} from 'lucide-react';
import { MemoryItem, MemoryVersion } from '@/types';

interface MemoryInspectorModalProps {
  memory: MemoryItem | null;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<MemoryItem>) => void;
  onDelete: (id: string) => void;
  versions?: MemoryVersion[];
}

export function MemoryInspectorModal({
  memory,
  onClose,
  onUpdate,
  onDelete,
  versions = [],
}: MemoryInspectorModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'vector' | 'history'>('details');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');

  if (!memory) return null;

  const handleStartEdit = () => {
    setEditedTitle(memory.title);
    setEditedContent(memory.content);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    onUpdate(memory.id, {
      title: editedTitle,
      content: editedContent,
    });
    setIsEditing(false);
  };

  const handleToggleLocalOnly = () => {
    onUpdate(memory.id, {
      isLocalOnly: !memory.isLocalOnly,
      sensitivity: !memory.isLocalOnly ? 'LOCAL_ONLY' : 'INTERNAL',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-3xl rounded-2xl border border-white/[0.12] bg-[#0c101a] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between bg-black/30">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold font-mono text-orange-400">
                  {memory.id}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-medium">
                  {memory.type}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-mono font-semibold uppercase ${
                    memory.syncStatus === 'SYNCED'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : memory.syncStatus === 'CONFLICT'
                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30 animate-pulse'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {memory.syncStatus}
                </span>
              </div>
              <div className="text-xs text-zinc-500 font-mono mt-0.5">
                Device: {memory.deviceId} • Version {memory.version} • Created {new Date(memory.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-white/[0.08] flex space-x-6 text-xs font-medium">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 border-b-2 transition-all ${
              activeTab === 'details'
                ? 'border-orange-500 text-orange-400 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Memory Details & Metadata
          </button>
          <button
            onClick={() => setActiveTab('vector')}
            className={`py-3 border-b-2 transition-all ${
              activeTab === 'vector'
                ? 'border-orange-500 text-orange-400 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Vector Embeddings (128-dim)
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 border-b-2 transition-all ${
              activeTab === 'history'
                ? 'border-orange-500 text-orange-400 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Version History ({versions.length || memory.version})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {activeTab === 'details' && (
            <>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">Title</label>
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/[0.1] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">Content</label>
                    <textarea
                      rows={5}
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/[0.1] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveEdit}
                      className="px-3 py-1.5 rounded-lg bg-orange-600 text-white text-xs font-semibold hover:bg-orange-500"
                    >
                      Save Version {memory.version + 1}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs hover:bg-zinc-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">
                      Title
                    </div>
                    <div className="text-lg font-bold text-white tracking-tight">
                      {memory.title}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">
                      Content
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] text-zinc-200 leading-relaxed font-sans">
                      {memory.content}
                    </div>
                  </div>
                </div>
              )}

              {/* Memory Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-black/30 border border-white/[0.05]">
                  <div className="text-[10px] font-mono uppercase text-zinc-500">Importance</div>
                  <div className="font-semibold text-zinc-200 mt-0.5">{memory.importance}</div>
                </div>
                <div className="p-3 rounded-lg bg-black/30 border border-white/[0.05]">
                  <div className="text-[10px] font-mono uppercase text-zinc-500">Sensitivity</div>
                  <div className="font-semibold text-orange-400 mt-0.5">{memory.sensitivity}</div>
                </div>
                <div className="p-3 rounded-lg bg-black/30 border border-white/[0.05]">
                  <div className="text-[10px] font-mono uppercase text-zinc-500">Confidence</div>
                  <div className="font-semibold text-emerald-400 mt-0.5">
                    {(memory.confidence * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-black/30 border border-white/[0.05]">
                  <div className="text-[10px] font-mono uppercase text-zinc-500">Storage Mode</div>
                  <div className="font-semibold text-zinc-300 mt-0.5">
                    {memory.isLocalOnly ? 'Local Only' : 'Replicated'}
                  </div>
                </div>
              </div>

              {/* Tags */}
              {memory.tags.length > 0 && (
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5 flex items-center space-x-1">
                    <Tag className="w-3 h-3" />
                    <span>Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {memory.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-xs bg-white/[0.05] border border-white/[0.08] text-zinc-300 font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quality Attributes (Section 44) */}
              {memory.qualityScore && (
                <div className="p-4 rounded-xl bg-zinc-950/70 border border-white/[0.08] space-y-2">
                  <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                    <span>Memory Quality Metrics</span>
                    <span className="text-emerald-400 font-bold">Verified Edge Quality</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2 text-center text-xs">
                    <div>
                      <div className="text-zinc-500 text-[10px]">Source</div>
                      <div className="font-mono text-zinc-200 mt-0.5">
                        {(memory.qualityScore.sourceAvailability * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-zinc-500 text-[10px]">Confidence</div>
                      <div className="font-mono text-zinc-200 mt-0.5">
                        {(memory.qualityScore.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-zinc-500 text-[10px]">Recency</div>
                      <div className="font-mono text-zinc-200 mt-0.5">
                        {(memory.qualityScore.recency * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-zinc-500 text-[10px]">Verification</div>
                      <div className="font-mono text-zinc-200 mt-0.5">
                        {(memory.qualityScore.verification * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-zinc-500 text-[10px]">Completeness</div>
                      <div className="font-mono text-zinc-200 mt-0.5">
                        {(memory.qualityScore.completeness * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'vector' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Qdrant Edge Vector Representation</div>
                  <div className="text-xs text-zinc-400">128-dimensional dense semantic embedding</div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  L2 Normalized • Cosine Space
                </span>
              </div>

              {/* Vector array visual preview */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/[0.08] font-mono text-[11px] text-zinc-300 max-h-60 overflow-y-auto leading-relaxed">
                [{memory.embedding.map((val, idx) => (
                  <span
                    key={idx}
                    className={`inline-block mr-1.5 ${
                      val > 0.1
                        ? 'text-orange-400 font-bold'
                        : val < -0.1
                        ? 'text-indigo-400'
                        : 'text-zinc-500'
                    }`}
                  >
                    {val.toFixed(4)}{idx < memory.embedding.length - 1 ? ',' : ''}
                  </span>
                ))}]
              </div>

              <div className="text-xs text-zinc-400">
                Indexed in collection <code className="text-orange-400">edge_memories</code>. Optimized for sub-millisecond on-device similarity search.
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase text-zinc-500">
                Memory Version Audit History
              </div>
              {versions.length > 0 ? (
                versions.map((ver) => (
                  <div
                    key={ver.id}
                    className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/[0.06] space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-orange-400">Version {ver.version}</span>
                      <span className="text-zinc-500">{new Date(ver.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-zinc-300">{ver.diffDescription}</div>
                    <div className="text-[11px] text-zinc-500 font-mono">
                      Author: {ver.author} ({ver.deviceId}) • Source: {ver.source}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-zinc-500 italic">No previous versions. Current is v{memory.version}.</div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/[0.08] bg-black/30 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleLocalOnly}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                memory.isLocalOnly
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-white/[0.08]'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{memory.isLocalOnly ? 'Local-Only (Strict)' : 'Allow Cloud Sync'}</span>
            </button>

            {!isEditing && (
              <button
                onClick={handleStartEdit}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-white/[0.08]"
              >
                Edit Content
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (confirm(`Delete memory ${memory.id}? This will remove it from the edge index.`)) {
                  onDelete(memory.id);
                  onClose();
                }
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 border border-rose-500/20"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
