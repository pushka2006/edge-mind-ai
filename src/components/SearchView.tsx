'use client';

import React, { useState } from 'react';
import {
  Search,
  Brain,
  Layers,
  HardDrive,
  Cloud,
  Cpu,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Lock,
  Tag,
  Clock,
} from 'lucide-react';
import { MemoryItem, SearchResult } from '@/types';

interface SearchViewProps {
  onSelectMemory: (memory: MemoryItem) => void;
  isOffline: boolean;
}

export function SearchView({ onSelectMemory, isOffline }: SearchViewProps) {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'LOCAL' | 'CLOUD' | 'HYBRID'>('HYBRID');
  const [deviceFilter, setDeviceFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const sampleQueries = [
    'Find all maintenance incidents involving overheating and bearing temperature',
    'CNC Spindle vibration harmonics and outer race bearing wear',
    'Robotic Arm joint zero-datum laser offset discrepancy',
    'Autonomous Drone LiDAR terrain altitude avoidance alerts',
    'Geothermal wellhead high pressure transducer safety throttling',
  ];

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery !== undefined ? searchQuery : query;
    if (!q.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          mode: isOffline ? 'LOCAL' : mode,
          deviceId: deviceFilter !== 'ALL' ? deviceFilter : undefined,
          type: typeFilter !== 'ALL' ? typeFilter : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResults(data.results || []);
        setLatencyMs(data.latencyMs || 3);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-orange-400 mb-1">
          <Layers className="w-4 h-4" />
          <span>Hybrid Vector & Semantic Retrieval</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
          Edge Semantic Memory Search
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Performs low-latency 128-dimensional dense vector similarity blended with keyword BM25 scoring directly on the edge.
        </p>
      </div>

      {/* Mode Selector & Search Box */}
      <div className="glass-panel p-6 rounded-2xl space-y-4 border-orange-500/20">
        {/* Mode Switcher */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-white/[0.08]">
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-mono text-zinc-400">Retrieval Target:</span>
            <div className="flex rounded-lg bg-black/40 p-1 border border-white/[0.08]">
              <button
                type="button"
                onClick={() => setMode('LOCAL')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  mode === 'LOCAL' || isOffline
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                LOCAL (Qdrant Edge)
              </button>
              <button
                type="button"
                disabled={isOffline}
                onClick={() => setMode('CLOUD')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  isOffline
                    ? 'text-zinc-600 cursor-not-allowed'
                    : mode === 'CLOUD'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                CLOUD (Qdrant Server)
              </button>
              <button
                type="button"
                disabled={isOffline}
                onClick={() => setMode('HYBRID')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  isOffline
                    ? 'text-zinc-600 cursor-not-allowed'
                    : mode === 'HYBRID'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                HYBRID (Edge + Cloud)
              </button>
            </div>
          </div>

          {isOffline && (
            <div className="text-xs text-rose-400 flex items-center space-x-1.5 font-mono">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              <span>Offline Mode: Querying 100% On-Device Edge Store</span>
            </div>
          )}
        </div>

        {/* Search Input Bar */}
        <div className="flex items-center space-x-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-orange-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ask or query in natural language (e.g. 'spindle overheating incidents and technician actions')..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              className="w-full bg-zinc-950/80 border border-white/[0.12] rounded-xl pl-12 pr-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40"
            />
          </div>

          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] shrink-0 flex items-center space-x-2"
          >
            <span>{loading ? 'Searching...' : 'Vector Search'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Suggestion Chips */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2 pt-1 text-xs">
          <span className="text-zinc-500 font-mono text-[11px] flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-orange-400" />
            <span>Sample Queries:</span>
          </span>
          {sampleQueries.map((sq, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setQuery(sq);
                handleSearch(sq);
              }}
              className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.06] text-[11px] transition-all"
            >
              {sq.slice(0, 36)}...
            </button>
          ))}
        </div>
      </div>

      {/* Latency and Results Count Bar */}
      {hasSearched && (
        <div className="flex items-center justify-between text-xs text-zinc-400 px-2 font-mono">
          <div>
            Retrieved <strong className="text-white font-bold">{results.length}</strong> matching memories
          </div>
          {latencyMs !== null && (
            <div className="flex items-center space-x-2 text-emerald-400">
              <Clock className="w-3.5 h-3.5" />
              <span>
                Search latency: <strong>{latencyMs}ms</strong> (Local Qdrant Edge)
              </span>
            </div>
          )}
        </div>
      )}

      {/* Results List */}
      <div className="space-y-4">
        {results.map((res, index) => {
          const mem = res.memory;
          return (
            <div
              key={mem.id}
              onClick={() => onSelectMemory(mem)}
              className="glass-panel glass-panel-hover p-6 rounded-2xl cursor-pointer space-y-3 relative overflow-hidden"
            >
              {/* Top Row: Origin Badge, Relevance, Memory ID */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono font-bold text-orange-400 text-sm">
                    {mem.id}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-medium">
                    {mem.type}
                  </span>

                  {/* Origin Badge */}
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                      res.sourceOrigin === 'LOCAL_EDGE'
                        ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                        : res.sourceOrigin === 'CLOUD_KNOWLEDGE'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                    }`}
                  >
                    {res.sourceOrigin === 'LOCAL_EDGE'
                      ? 'Local Edge (Qdrant Edge)'
                      : res.sourceOrigin === 'CLOUD_KNOWLEDGE'
                      ? 'Cloud Knowledge'
                      : 'Hybrid Merged'}
                  </span>
                </div>

                {/* Hybrid Relevance Score */}
                <div className="flex items-center space-x-3 text-xs font-mono">
                  <div className="text-zinc-500">
                    Vector Cosine: <strong className="text-zinc-200">{(res.vectorSimilarity * 100).toFixed(1)}%</strong>
                  </div>
                  <div className="text-zinc-500">
                    Keyword: <strong className="text-zinc-200">{(res.keywordScore * 100).toFixed(0)}%</strong>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold">
                    {(res.score * 100).toFixed(1)}% Relevance
                  </div>
                </div>
              </div>

              {/* Title & Content */}
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {mem.title}
                </h3>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  {mem.content}
                </p>
              </div>

              {/* Metadata Footer */}
              <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-zinc-500 font-mono flex-wrap gap-2">
                <div className="flex items-center space-x-3">
                  <span>Device: <strong className="text-zinc-400">{mem.deviceId}</strong></span>
                  <span>Version: <strong className="text-zinc-400">v{mem.version}</strong></span>
                  <span>Sensitivity: <strong className="text-zinc-400">{mem.sensitivity}</strong></span>
                </div>
                <div className="flex items-center space-x-1.5">
                  {mem.tags.map((t) => (
                    <span key={t} className="px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-400">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {hasSearched && results.length === 0 && !loading && (
          <div className="glass-panel p-12 rounded-2xl text-center space-y-2">
            <Brain className="w-8 h-8 text-zinc-600 mx-auto" />
            <div className="text-sm font-semibold text-zinc-300">No matching memories found</div>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              Try a broader query, adjust the retrieval target, or select a different edge device.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
