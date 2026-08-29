import React from 'react';
import { SevenDeadlySinsEngine } from '../../inferno/sins';
import { SevenHeavenlyVirtuesEngine } from '../../inferno/virtues';
import { Scale, Flame, Shield, AlertOctagon, Award } from 'lucide-react';

export function ScalesOfJudgment() {
  const sins = SevenDeadlySinsEngine.diagnoseSins();
  const virtues = SevenHeavenlyVirtuesEngine.evaluateVirtues();

  return (
    <div className="bg-[#111118] border border-[#232336] rounded-xl p-5 text-gray-200 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4 border-b border-[#232336] pb-3">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold text-lg text-white">Scales of Judgment: Sins & Virtues</h3>
        </div>
        <span className="text-xs text-amber-400 font-mono">Cognitive Karma Balance</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sins Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400 border-b border-red-950/60 pb-2">
            <Flame className="w-4 h-4" /> Epistemic Transgressions ({sins.length})
          </div>
          {sins.length === 0 ? (
            <p className="text-xs text-gray-500 italic p-3 bg-[#0d0d14] rounded-lg">No deadly epistemic sins active.</p>
          ) : (
            sins.map(s => (
              <div key={s.sin_name} className="p-3 rounded-lg bg-red-950/10 border border-red-900/40 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-red-300">
                  <span>Sin of {s.sin_name}</span>
                  <span className="font-mono text-[10px]">Severity {s.severity_level}/10</span>
                </div>
                <p className="text-gray-300">{s.manifestation}</p>
                <div className="text-[11px] text-amber-400 font-medium pt-1">
                  Penance: {s.penance_remedy}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Virtues Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 border-b border-emerald-950/60 pb-2">
            <Shield className="w-4 h-4" /> Heavenly Epistemic Virtues ({virtues.length})
          </div>
          {virtues.map(v => (
            <div key={v.virtue_name} className="p-3 rounded-lg bg-emerald-950/10 border border-emerald-900/40 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-emerald-300">
                <span>Virtue of {v.virtue_name}</span>
                <span className="font-mono text-[10px]">{(v.attainment_level * 100).toFixed(0)}% Attainment</span>
              </div>
              <p className="text-gray-300">{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
