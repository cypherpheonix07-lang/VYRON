import React, { useState } from 'react';
import { MemoryKernel } from '../../kernel/memory';
import { Clock, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

export function DecaySimulator() {
  const [days, setDays] = useState(14);
  const [strengthFactor, setStrengthFactor] = useState(1.5);
  const [interventions, setInterventions] = useState<string[]>(['Initial Exposure', 'Session Note Added']);

  const retention = MemoryKernel.calculateRetention(days, strengthFactor);
  const isAtrophy = retention < 0.35;

  const addIntervention = (name: string, boost: number) => {
    if (!interventions.includes(name)) {
      setInterventions([...interventions, name]);
      setStrengthFactor(prev => prev + boost);
    }
  };

  const reset = () => {
    setDays(14);
    setStrengthFactor(1.0);
    setInterventions(['Initial Exposure']);
  };

  return (
    <div className="bg-[#111118] border border-[#232336] rounded-xl p-5 text-gray-200 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4 border-b border-[#232336] pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-400" />
          <h3 className="font-semibold text-lg text-white">Ebbinghaus Memory Decay Simulator</h3>
        </div>
        <button
          onClick={reset}
          className="p-1.5 hover:bg-[#1f1f2e] rounded-lg text-gray-400 hover:text-white transition-colors"
          title="Reset Simulation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-gray-400">Time Elapsed</span>
              <span className="font-mono text-purple-300 font-bold">{days} Days</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              value={days}
              onChange={e => setDays(Number(e.target.value))}
              className="w-full accent-purple-500 bg-[#1c1c28] h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-gray-400">Active Reinforcement Multiplier</span>
              <span className="font-mono text-purple-300 font-bold">{strengthFactor.toFixed(2)}x (S)</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Reinforcement Interventions</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => addIntervention('Bookmark Added (+0.5 S)', 0.5)}
                disabled={interventions.includes('Bookmark Added (+0.5 S)')}
                className="px-2.5 py-1 text-xs rounded-md border border-[#2e2e42] bg-[#171722] hover:border-purple-500 disabled:opacity-40 transition-colors"
              >
                + Bookmark (+0.5)
              </button>
              <button
                onClick={() => addIntervention('SM-2 Spaced Review (+2.0 S)', 2.0)}
                disabled={interventions.includes('SM-2 Spaced Review (+2.0 S)')}
                className="px-2.5 py-1 text-xs rounded-md border border-[#2e2e42] bg-[#171722] hover:border-purple-500 disabled:opacity-40 transition-colors"
              >
                + SM-2 Review (+2.0)
              </button>
              <button
                onClick={() => addIntervention('Cross-Session Synthesis (+1.5 S)', 1.5)}
                disabled={interventions.includes('Cross-Session Synthesis (+1.5 S)')}
                className="px-2.5 py-1 text-xs rounded-md border border-[#2e2e42] bg-[#171722] hover:border-purple-500 disabled:opacity-40 transition-colors"
              >
                + Cross-Session (+1.5)
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center p-6 bg-[#0c0c14] border border-[#1f1f2e] rounded-xl text-center">
          <div className="relative mb-3">
            <div
              className={`w-28 h-28 rounded-full border-4 flex items-center justify-center transition-all ${
                isAtrophy ? 'border-red-500/80 shadow-[0_0_25px_rgba(239,68,68,0.3)]' : 'border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.3)]'
              }`}
            >
              <span className="text-3xl font-bold font-mono text-white">
                {Math.round(retention * 100)}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 font-medium text-sm">
            {isAtrophy ? (
              <span className="flex items-center gap-1 text-red-400">
                <ShieldAlert className="w-4 h-4" /> Severe Memory Atrophy
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-400">
                <Sparkles className="w-4 h-4" /> Strong Synaptic Retention
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Mathematical curve $R = e^{'{'}-t/S{'}'}$ running natively in browser.
          </p>
        </div>
      </div>
    </div>
  );
}
