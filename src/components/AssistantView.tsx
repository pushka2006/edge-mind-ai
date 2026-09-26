'use client';

import React, { useState } from 'react';
import {
  Bot,
  User,
  Send,
  Sparkles,
  Layers,
  HardDrive,
  Cpu,
  Wifi,
  WifiOff,
  CheckCircle2,
  ExternalLink,
  Info,
} from 'lucide-react';
import { ChatMessage, MemoryItem } from '@/types';

interface AssistantViewProps {
  onSelectMemoryId: (memoryId: string) => void;
  isOffline: boolean;
}

export function AssistantView({ onSelectMemoryId, isOffline }: AssistantViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      content:
        'Greetings, Engineer. I am **EdgeMind AI**, your local-first edge memory reasoning assistant. I operate autonomously on-device with zero required cloud connectivity, performing semantic vector reasoning and citing verifiable memory IDs. How can I assist with your telemetry or operational logs today?',
      timestamp: '2026-09-26T00:40:00Z',
      retrievalMode: 'HYBRID',
      offlineGenerated: false,
    },
    {
      id: 'msg-2',
      role: 'user',
      content: 'What happened to Machine Edge #01 yesterday during high-torque milling?',
      timestamp: '2026-09-26T00:41:00Z',
    },
    {
      id: 'msg-3',
      role: 'assistant',
      content:
        'I retrieved 4 local edge records from Qdrant Edge regarding CNC Milling Spindle 01:\n\n1. At 14:32 UTC, primary spindle bearing ceramic cage reached **82.4°C** (threshold: 75.0°C), logging thermal observation **[M-1024]**.\n2. Hardware safety interlock triggered automatic emergency feed hold **[M-1026]**, safely retracting the tool without workpiece gouging.\n3. Technician Dan Kovacs inspected the assembly, cleared particulate debris in micro-nozzle filter B-2, and replenished Mobil SHC 626 synthetic oil **[M-1025]**.\n\n⚠️ **Sync Warning**: Record **[M-1024]** has an active conflict in the Conflict Center where cloud telemetry smoothing estimated 79.1°C vs on-device physical sensor reading of 82.4°C.',
      timestamp: '2026-09-26T00:41:05Z',
      retrievalMode: 'LOCAL',
      sources: ['M-1024', 'M-1025', 'M-1026', 'M-1027'],
      offlineGenerated: false,
      reasoningNotes: 'Retrieved 4 records via local Qdrant Edge Cosine Similarity (avg similarity: 0.94).',
    },
  ]);

  const [input, setInput] = useState('');
  const [retrievalMode, setRetrievalMode] = useState<'LOCAL' | 'CLOUD' | 'HYBRID'>('HYBRID');
  const [loading, setLoading] = useState(false);

  const sampleQuestions = [
    'What happened to Machine Edge #01 yesterday?',
    'List all unresolved synchronization conflicts',
    'Explain spindle bearing overheating incident',
    'Show LiDAR terrain obstacle warnings on Drone #09',
    'Summarize geothermal wellhead pressure throttling',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const queryText = textToSend !== undefined ? textToSend : input;
    if (!queryText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: queryText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          retrievalMode: isOffline ? 'LOCAL' : retrievalMode,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const assistantMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: data.answer,
          timestamp: new Date().toISOString(),
          retrievalMode: isOffline ? 'LOCAL' : retrievalMode,
          sources: data.citedMemoryIds || [],
          reasoningNotes: data.reasoningNotes,
          offlineGenerated: data.offlineGenerated,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to render text with clickable [M-xxxx] badges
  const renderMessageContent = (content: string) => {
    const parts = content.split(/(\[M-\d+\])/g);
    return parts.map((part, index) => {
      const match = part.match(/\[(M-\d+)\]/);
      if (match) {
        const memId = match[1];
        return (
          <button
            key={index}
            onClick={() => onSelectMemoryId(memId)}
            className="inline-flex items-center space-x-1 px-1.5 py-0.5 mx-0.5 rounded bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/40 font-mono text-xs font-bold transition-all"
            title={`Inspect memory ${memId}`}
          >
            <span>{memId}</span>
            <ExternalLink className="w-2.5 h-2.5 inline" />
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
      {/* Assistant Header */}
      <div className="glass-panel p-5 rounded-2xl mb-4 flex items-center justify-between flex-wrap gap-4 border-orange-500/20">
        <div className="flex items-center space-x-3.5">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-zinc-950 font-black shadow-[0_0_20px_rgba(249,115,22,0.4)]">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-white tracking-tight">EdgeMind Assistant</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-mono font-bold">
                RAG Engine v3.2
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Offline-capable conversational intelligence powered by local Qdrant Edge vector memory
            </p>
          </div>
        </div>

        {/* Retrieval Mode selector */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-mono text-zinc-400">Context:</span>
          <div className="flex rounded-lg bg-black/40 p-1 border border-white/[0.08]">
            <button
              onClick={() => setRetrievalMode('LOCAL')}
              className={`px-2.5 py-1 rounded text-xs transition-all ${
                retrievalMode === 'LOCAL' || isOffline
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Local Memory
            </button>
            <button
              disabled={isOffline}
              onClick={() => setRetrievalMode('CLOUD')}
              className={`px-2.5 py-1 rounded text-xs transition-all ${
                isOffline
                  ? 'text-zinc-600 cursor-not-allowed'
                  : retrievalMode === 'CLOUD'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Cloud Knowledge
            </button>
            <button
              disabled={isOffline}
              onClick={() => setRetrievalMode('HYBRID')}
              className={`px-2.5 py-1 rounded text-xs transition-all ${
                isOffline
                  ? 'text-zinc-600 cursor-not-allowed'
                  : retrievalMode === 'HYBRID'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Hybrid
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-orange-600 text-white'
                    : 'bg-zinc-800 text-orange-400 border border-white/[0.1]'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl max-w-2xl text-xs leading-relaxed space-y-2.5 ${
                  isUser
                    ? 'bg-orange-600/15 border border-orange-500/30 text-zinc-100 font-medium'
                    : 'glass-panel text-zinc-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{renderMessageContent(msg.content)}</div>

                {!isUser && (
                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-zinc-500 font-mono flex-wrap gap-2">
                    <div className="flex items-center space-x-2">
                      {msg.offlineGenerated ? (
                        <span className="text-rose-400 flex items-center space-x-1">
                          <WifiOff className="w-3 h-3" />
                          <span>Generated Offline (Zero Network)</span>
                        </span>
                      ) : (
                        <span className="text-emerald-400 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Edge RAG Grounded</span>
                        </span>
                      )}
                    </div>
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <span>Citations:</span>
                        {msg.sources.map((src) => (
                          <button
                            key={src}
                            onClick={() => onSelectMemoryId(src)}
                            className="text-orange-400 hover:underline font-bold"
                          >
                            [{src}]
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-zinc-800 text-orange-400 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="glass-panel p-3.5 rounded-xl text-xs text-zinc-400 flex items-center space-x-2 font-mono">
              <span className="h-2 w-2 rounded-full bg-orange-500 animate-ping" />
              <span>EdgeMind is querying local vectors and reasoning offline...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 mb-2 text-xs shrink-0">
        <span className="text-zinc-500 text-[11px] font-mono shrink-0">Prompts:</span>
        {sampleQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(q)}
            className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.06] text-[11px] whitespace-nowrap transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="glass-panel p-3 rounded-2xl border-orange-500/20 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Ask EdgeMind about maintenance, telemetry anomalies, or fleet sync..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent px-3 py-2 text-white placeholder-zinc-500 text-xs focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
