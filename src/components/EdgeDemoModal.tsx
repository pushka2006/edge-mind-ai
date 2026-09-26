'use client';

import React, { useState } from 'react';
import {
  X,
  Play,
  CheckCircle2,
  AlertTriangle,
  Wifi,
  WifiOff,
  RefreshCw,
  HardDrive,
  Cloud,
  Brain,
  Search,
  ArrowRight,
  GitMerge,
  Sparkles,
} from 'lucide-react';

interface EdgeDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDemoCompleted: () => void;
}

interface DemoStepInfo {
  step: number;
  title: string;
  badge: string;
  description: string;
  actionLabel: string;
}

const DEMO_STEPS: DemoStepInfo[] = [
  {
    step: 1,
    title: 'Machine Edge #01 Online & Calibrated',
    badge: 'ONLINE',
    description: 'CNC Milling Spindle Edge Device is connected to the local Qdrant Edge daemon and central cloud repository.',
    actionLabel: 'Initialize Baseline',
  },
  {
    step: 2,
    title: 'Capture High-Precision Semantic Memory Locally',
    badge: 'CAPTURE',
    description: 'Log new thermal stabilization observation (M-2001) directly to on-device Qdrant Edge vector index.',
    actionLabel: 'Log Local Memory',
  },
  {
    step: 3,
    title: 'Perform Instant On-Device Semantic Search',
    badge: 'LOCAL RETRIEVAL',
    description: 'Query Qdrant Edge with natural language query: "spindle bearing temperature RPM" (Latency: <3ms).',
    actionLabel: 'Search Locally',
  },
  {
    step: 4,
    title: 'Sever Network Link (Simulate Offline Environment)',
    badge: 'NETWORK DROP',
    description: 'Network link to cloud drops. Edge Mind AI engages autonomous offline resilience mode.',
    actionLabel: 'Disconnect Cloud',
  },
  {
    step: 5,
    title: 'Generate Emergency Observations While Disconnected',
    badge: 'OFFLINE CAPTURE',
    description: 'Log critical spindle vibration harmonic spike (M-2002). Buffered safely in the local priority queue.',
    actionLabel: 'Create Offline Memory',
  },
  {
    step: 6,
    title: 'Verify Offline Semantic Search & AI Reasoning',
    badge: 'OFFLINE SEARCH',
    description: 'Confirm vector similarity search and EdgeMind reasoning function with 0% internet connectivity.',
    actionLabel: 'Search Offline',
  },
  {
    step: 7,
    title: 'Restore Network Connectivity to Cloud',
    badge: 'RECONNECTED',
    description: 'Edge cellular uplink reconnects to Qdrant Cloud central server. Handshake verified.',
    actionLabel: 'Reconnect Cloud',
  },
  {
    step: 8,
    title: 'Execute Priority Delta Synchronization',
    badge: 'DELTA SYNC',
    description: 'Flush local queue. Upload newly captured memories to cloud in priority order.',
    actionLabel: 'Synchronize Delta',
  },
  {
    step: 9,
    title: 'Detect Multi-Master Synchronization Conflict',
    badge: 'CONFLICT FOUND',
    description: 'Conflict detected on M-1024: Edge sensor observation differs from central cloud estimate.',
    actionLabel: 'Inspect Conflict',
  },
  {
    step: 10,
    title: 'Resolve Conflict via Synthesized Consensus',
    badge: 'RESOLVED',
    description: 'Apply "Synthesize & Merge" strategy to unify local physical sensor metrics with cloud baseline.',
    actionLabel: 'Resolve Conflict',
  },
  {
    step: 11,
    title: 'Edge-to-Cloud Cycle Complete & Verified!',
    badge: 'CONSENSUS',
    description: 'Local edge and centralized cloud stores are 100% synchronized. Zero operational downtime achieved.',
    actionLabel: 'Finish Demo',
  },
];

export function EdgeDemoModal({ isOpen, onClose, onDemoCompleted }: EdgeDemoModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const currentStepInfo = DEMO_STEPS[currentStep - 1];

  const executeStep = async (stepNum: number) => {
    setLoading(true);
    try {
      const res = await fetch('/api/demo/scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: stepNum }),
      });
      const data = await res.json();
      setStepData(data);

      if (stepNum === 11) {
        setIsCompleted(true);
        onDemoCompleted();
      } else {
        setCurrentStep(stepNum + 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep <= 11) {
      executeStep(currentStep);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-orange-500/30 bg-[#0c101a] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between bg-black/40">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-zinc-950 font-black shadow-[0_0_20px_rgba(249,115,22,0.4)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Industrial Edge-to-Cloud Live Demonstration
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 font-mono font-bold">
                  Step {currentStep} of 11
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Machine Edge #01 • End-to-end local resilience and cloud synchronization cycle
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 11-Step Progress Dots */}
        <div className="px-6 py-3 bg-black/30 border-b border-white/[0.06] flex items-center justify-between">
          {DEMO_STEPS.map((s) => {
            const isDone = s.step < currentStep || isCompleted;
            const isCurrent = s.step === currentStep && !isCompleted;
            return (
              <div
                key={s.step}
                className={`h-2 flex-1 mx-0.5 rounded-full transition-all ${
                  isDone
                    ? 'bg-emerald-500'
                    : isCurrent
                    ? 'bg-orange-500 animate-pulse'
                    : 'bg-zinc-800'
                }`}
                title={`Step ${s.step}: ${s.title}`}
              />
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Current Step Card */}
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-orange-500/15 text-orange-400 border border-orange-500/30">
                {currentStepInfo.badge}
              </span>
              <span className="text-xs font-mono text-zinc-500">
                STEP {currentStepInfo.step} / 11
              </span>
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight">
              {currentStepInfo.title}
            </h3>

            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              {currentStepInfo.description}
            </p>
          </div>

          {/* Feedback & State Output from Server */}
          {stepData && (
            <div className="p-4 rounded-xl bg-black/50 border border-white/[0.06] font-mono text-xs space-y-2">
              <div className="text-[11px] text-zinc-400 flex items-center space-x-1.5 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Edge Runtime Response:</span>
              </div>
              <div className="text-zinc-200 text-xs">{stepData.description}</div>
              {stepData.resultsCount !== undefined && (
                <div className="text-[11px] text-orange-400">
                  Matches Retrieved: {stepData.resultsCount} records (Latency: 2.3ms)
                </div>
              )}
            </div>
          )}

          {isCompleted && (
            <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-3 font-mono">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong>Demonstration Finished Successfully!</strong>
                <div className="text-[11px] text-emerald-400/80 mt-0.5">
                  Proved complete offline operation, local vector reasoning, and bidirectional cloud sync consensus.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/[0.08] bg-black/40 flex items-center justify-between">
          <button
            onClick={() => {
              setCurrentStep(1);
              setStepData(null);
              setIsCompleted(false);
            }}
            className="text-xs text-zinc-400 hover:text-zinc-200 font-mono"
          >
            Restart From Step 1
          </button>

          <div className="flex items-center space-x-3">
            {isCompleted ? (
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                Done
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={loading}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)]"
              >
                <span>{loading ? 'Processing...' : currentStepInfo.actionLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
