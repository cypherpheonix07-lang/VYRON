import React, { useState, useEffect } from 'react';
import { Search, Terminal, Zap, Shield, Sparkles, X } from 'lucide-react';
import { starkDB, type ConceptRecord } from '../../kernel/db';
import { JailbreakProtocol } from '../../anti/jailbreak';
import { SensoryIntegrationLayer } from '../../void/sensory';
import { copilotDispatcher } from '../../services/copilot/copilotDispatcher';
import { copilotStore } from '../../state/copilot/copilotStore';

interface CognitiveCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConcept?: (conceptId: string) => void;
}

export function CognitiveCommandPalette({ isOpen, onClose, onSelectConcept }: CognitiveCommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const concepts = starkDB.select<ConceptRecord>('concepts');
  const filteredConcepts = query
    ? concepts.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.category?.toLowerCase().includes(query.toLowerCase()))
    : concepts.slice(0, 6);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (query.startsWith(':')) {
      const res = JailbreakProtocol.executeCommand(query);
      setTerminalOutput(res.output);
      SensoryIntegrationLayer.triggerHaptic('warning_shock');
      SensoryIntegrationLayer.playCognitiveChime(520, 0.3);
    } else {
      const naturalQuery = query.trim();
      copilotStore.setDrawerOpen(true);
      onClose();
      void copilotDispatcher.dispatch(naturalQuery);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#111118] border border-[#2e2e46] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Input Bar */}
        <form onSubmit={handleCommandSubmit} className="flex items-center px-4 py-3.5 border-b border-[#232336] bg-[#141420]">
          <Search className="w-5 h-5 text-purple-400 mr-3 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setTerminalOutput(null);
            }}
            placeholder="Search concepts, execute runes (:matrix, :godmode, :apocalypse, :exorcism)..."
            className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-gray-500 font-mono"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-[#202030] rounded-md text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </form>

        {/* Terminal Output */}
        {terminalOutput && (
          <div className="p-4 bg-[#09090f] border-b border-[#1f1f2e] font-mono text-xs text-emerald-400 flex items-start gap-2">
            <Terminal className="w-4 h-4 shrink-0 mt-0.5" />
            <pre className="whitespace-pre-wrap">{terminalOutput}</pre>
          </div>
        )}

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 flex items-center justify-between">
            <span>Verified Knowledge Nodes</span>
            <span>{filteredConcepts.length} entries</span>
          </div>

          {filteredConcepts.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">
              No matching concept nodes found in local Knowledge Core.
            </div>
          ) : (
            filteredConcepts.map(c => (
              <div
                key={c.id}
                onClick={() => {
                  onSelectConcept?.(c.id);
                  onClose();
                }}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-lg hover:bg-[#1c1c2b] text-gray-200 cursor-pointer group transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-purple-400 group-hover:scale-125 transition-transform" />
                  <div>
                    <div className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">
                      {c.name}
                    </div>
                    <div className="text-xs text-gray-400">{c.category || 'Core Paradigm'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-mono text-emerald-400">
                    {Math.round((c.retention_score || 0.9) * 100)}% retention
                  </span>
                  <span className="px-2 py-0.5 bg-[#252538] text-gray-300 rounded font-mono text-[10px]">
                    {(c.evidence_strength || 0.85).toFixed(2)} EV
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#0e0e16] border-t border-[#1e1e2d] text-[11px] text-gray-500 flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <span>Navigation: <kbd className="px-1.5 py-0.5 bg-[#1a1a27] rounded text-gray-300">↑↓</kbd></span>
            <span>Select: <kbd className="px-1.5 py-0.5 bg-[#1a1a27] rounded text-gray-300">↵</kbd></span>
          </div>
          <span className="text-purple-400">STARK Browser-Native Kernel</span>
        </div>
      </div>
    </div>
  );
}
