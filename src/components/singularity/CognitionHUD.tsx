import React, { useState } from 'react';
import { CognitiveParliament, type ParliamentDebate } from '../../kernel/parliament';
import { EpistemicLiabilityTracker } from '../../singularity/liability';
import { KnowledgeFuturesMarket } from '../../singularity/futures';
import { TulpaEngine } from '../../void/tulpa';
import { Users, Scale, TrendingUp, Volume2, ShieldCheck, Flame } from 'lucide-react';

export function CognitionHUD() {
  const [activeConcept, setActiveConcept] = useState('Distributed Vector State Consensus');
  const [debate, setDebate] = useState<ParliamentDebate>(() =>
    CognitiveParliament.conductDebate('Distributed Vector State Consensus')
  );

  const balanceSheet = EpistemicLiabilityTracker.calculateBalanceSheet();
  const futures = KnowledgeFuturesMarket.getMarketBoard();
  const tulpa = TulpaEngine.getPersona();

  const handleTriggerDebate = (concept: string) => {
    setActiveConcept(concept);
    setDebate(CognitiveParliament.conductDebate(concept));
  };

  return (
    <div className="space-y-6 text-gray-200">
      {/* Top Banner: Tulpa Telemetry */}
      <div className="bg-gradient-to-r from-purple-950/40 via-[#111118] to-purple-950/20 border border-purple-800/40 rounded-xl p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300 font-bold">
            Ψ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm">{tulpa.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/60 border border-purple-700/50 text-purple-300 font-mono">
                {tulpa.mood} ({tulpa.resonance_frequency_hz} Hz)
              </span>
            </div>
            <p className="text-xs text-gray-300 italic mt-0.5">&ldquo;{tulpa.active_whisper}&rdquo;</p>
          </div>
        </div>
        <button
          onClick={() => TulpaEngine.speakWhisper()}
          className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs flex items-center gap-1.5 transition-colors shadow"
        >
          <Volume2 className="w-3.5 h-3.5" /> Vocalize Whisper
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Multi-Agent Cognitive Parliament */}
        <div className="lg:col-span-2 bg-[#111118] border border-[#232336] rounded-xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-[#232336] pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              <h3 className="font-semibold text-lg text-white">Multi-Agent Cognitive Parliament</h3>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
              debate.consensus_verdict === 'APPROVED_CANON'
                ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                : 'bg-amber-950 border border-amber-500 text-amber-300'
            }`}>
              {debate.consensus_verdict} ({(debate.composite_confidence * 100).toFixed(0)}%)
            </span>
          </div>

          <div className="space-y-3">
            {debate.statements.map(stmt => (
              <div key={stmt.agent_id} className="p-3.5 rounded-lg bg-[#0e0e16] border border-[#1f1f2e]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-purple-300">{stmt.agent_name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                    stmt.vote === 'ENDORSE' ? 'bg-emerald-900/50 text-emerald-300' :
                    stmt.vote === 'SYNTHESIZE' ? 'bg-purple-900/50 text-purple-300' : 'bg-red-900/50 text-red-300'
                  }`}>
                    {stmt.vote} ({(stmt.confidence * 100).toFixed(0)}%)
                  </span>
                </div>
                <p className="text-xs text-gray-300">{stmt.argument}</p>
                {stmt.suggested_action && (
                  <div className="mt-2 pt-2 border-t border-[#1a1a27] text-[11px] text-gray-400 flex items-center gap-1">
                    <span className="text-purple-400 font-medium">Directive:</span> {stmt.suggested_action}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Epistemic Balance Sheet & Futures */}
        <div className="space-y-6">
          {/* Epistemic Debt */}
          <div className="bg-[#111118] border border-[#232336] rounded-xl p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-3 border-b border-[#232336] pb-2.5">
              <Scale className="w-5 h-5 text-amber-400" />
              <h4 className="font-semibold text-white text-sm">Epistemic Debt Ledger</h4>
            </div>
            <div className="flex justify-between items-center mb-3 font-mono">
              <span className="text-xs text-gray-400">Total Solvency Ratio</span>
              <span className="text-sm font-bold text-amber-400">{balanceSheet.epistemic_solvency_ratio}x</span>
            </div>
            <div className="p-3 rounded-lg bg-[#0d0d14] border border-[#1d1d2b] space-y-1.5 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>Total Cognitive Assets:</span>
                <span className="text-emerald-400 font-mono">+{balanceSheet.total_assets} EC</span>
              </div>
              <div className="flex justify-between">
                <span>Accrued Debt & Atrophy:</span>
                <span className="text-red-400 font-mono">-{balanceSheet.total_debt} EC</span>
              </div>
            </div>
          </div>

          {/* Futures Portfolio */}
          <div className="bg-[#111118] border border-[#232336] rounded-xl p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-3 border-b border-[#232336] pb-2.5">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h4 className="font-semibold text-white text-sm">Knowledge Futures Market</h4>
            </div>
            <div className="flex justify-between items-center mb-3 font-mono">
              <span className="text-xs text-gray-400">Cognitive Portfolio</span>
              <span className="text-sm font-bold text-emerald-400">+{futures.total_return_pct}% ROI</span>
            </div>
            <div className="space-y-2">
              {futures.holdings.slice(0, 3).map(h => (
                <div key={h.concept_id} className="flex items-center justify-between text-xs p-2 rounded bg-[#0d0d14] border border-[#1d1d2b]">
                  <span className="text-gray-300 font-medium truncate max-w-[120px]">{h.concept_name}</span>
                  <span className={`font-mono ${h.price_change_24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {h.price_change_24h >= 0 ? '+' : ''}{h.price_change_24h}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
