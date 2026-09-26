'use client';

import React, { useState } from 'react';
import { X, Brain, Plus, Sparkles } from 'lucide-react';
import { MemoryType, ImportanceLevel, SensitivityLevel } from '@/types';

interface NewMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (memoryData: any) => Promise<void>;
  currentDeviceId?: string;
}

const MEMORY_TYPES: MemoryType[] = [
  'Observation',
  'Sensor observation',
  'Event',
  'System event',
  'Fact',
  'Instruction',
  'Preference',
  'Document',
  'Task',
  'Knowledge',
];

export function NewMemoryModal({
  isOpen,
  onClose,
  onSubmit,
  currentDeviceId = 'DEV-001',
}: NewMemoryModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<MemoryType>('Observation');
  const [importance, setImportance] = useState<ImportanceLevel>('NORMAL');
  const [sensitivity, setSensitivity] = useState<SensitivityLevel>('INTERNAL');
  const [deviceId, setDeviceId] = useState(currentDeviceId);
  const [tagsInput, setTagsInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      await onSubmit({
        title,
        content,
        type,
        importance,
        sensitivity,
        deviceId,
        tags,
        source: 'human_manual',
        isLocalOnly: sensitivity === 'LOCAL_ONLY',
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const fillIndustrialTemplate = () => {
    setTitle('Spindle Secondary Lubrication Pressure Drop');
    setContent('Sensor transducer P-402 on Machine Edge #01 logged 18% fluid pressure drop on auxiliary cooling line B. Recommend inspecting manifold seal before next 8-hour shift.');
    setType('Sensor observation');
    setImportance('HIGH');
    setTagsInput('cooling, pressure, spindle, maintenance');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-white/[0.12] bg-[#0c101a] shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Capture Edge Memory
              </h2>
              <p className="text-xs text-zinc-400">
                Instantly indexed in Qdrant Edge local vector store
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={fillIndustrialTemplate}
              className="text-xs text-orange-400 hover:text-orange-300 flex items-center space-x-1 px-2.5 py-1 rounded bg-orange-500/10 border border-orange-500/20"
            >
              <Sparkles className="w-3 h-3" />
              <span>Fill Template</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="font-mono text-zinc-400 block mb-1">Target Edge Device</label>
            <select
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              className="w-full bg-zinc-900 border border-white/[0.1] rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-orange-500 font-mono"
            >
              <option value="DEV-001">DEV-001 (Machine Edge #01 - CNC Spindle)</option>
              <option value="DEV-002">DEV-002 (Robotic Arm Delta #04 - Welder)</option>
              <option value="DEV-003">DEV-003 (Smart Kiosk #02 - Field Terminal)</option>
              <option value="DEV-004">DEV-004 (Drone Alpha #09 - LiDAR Surveyor)</option>
              <option value="DEV-005">DEV-005 (Sensor Hub #07 - Geothermal Wellhead)</option>
            </select>
          </div>

          <div>
            <label className="font-mono text-zinc-400 block mb-1">Memory Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Spindle Bearing Thermal Observation Overheat"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-900 border border-white/[0.1] rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>

          <div>
            <label className="font-mono text-zinc-400 block mb-1">Content / Observation Details</label>
            <textarea
              required
              rows={4}
              placeholder="Describe observation, physical symptoms, numerical metrics, actions taken..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-zinc-900 border border-white/[0.1] rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-mono text-zinc-400 block mb-1">Memory Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as MemoryType)}
                className="w-full bg-zinc-900 border border-white/[0.1] rounded-lg px-2.5 py-2 text-zinc-200 focus:outline-none focus:border-orange-500"
              >
                {MEMORY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-mono text-zinc-400 block mb-1">Importance</label>
              <select
                value={importance}
                onChange={(e) => setImportance(e.target.value as ImportanceLevel)}
                className="w-full bg-zinc-900 border border-white/[0.1] rounded-lg px-2.5 py-2 text-zinc-200 focus:outline-none focus:border-orange-500"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="NORMAL">NORMAL</option>
                <option value="LOW">LOW</option>
              </select>
            </div>

            <div>
              <label className="font-mono text-zinc-400 block mb-1">Sensitivity / Privacy</label>
              <select
                value={sensitivity}
                onChange={(e) => setSensitivity(e.target.value as SensitivityLevel)}
                className="w-full bg-zinc-900 border border-white/[0.1] rounded-lg px-2.5 py-2 text-zinc-200 focus:outline-none focus:border-orange-500"
              >
                <option value="INTERNAL">INTERNAL</option>
                <option value="LOCAL_ONLY">LOCAL_ONLY (No Sync)</option>
                <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                <option value="SENSITIVE">SENSITIVE</option>
                <option value="PUBLIC">PUBLIC</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-mono text-zinc-400 block mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              placeholder="spindle, temperature, bearing, maintenance"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-zinc-900 border border-white/[0.1] rounded-lg px-3 py-2 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold flex items-center space-x-1.5 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
            >
              <Brain className="w-3.5 h-3.5" />
              <span>{loading ? 'Embedding...' : 'Save & Vectorize'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
