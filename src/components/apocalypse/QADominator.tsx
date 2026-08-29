import React, { useState } from 'react';
import { ConferenceDominationProtocol, type LethalQuestion } from '../../apocalypse/dominator';
import { Target, Skull, CheckCircle, Copy } from 'lucide-react';
import { SensoryIntegrationLayer } from '../../void/sensory';

export function QADominator() {
  const [speaker, setSpeaker] = useState('Dr. Helena Vance (Principal Systems Architect)');
  const [questions, setQuestions] = useState<LethalQuestion[]>(() =>
    ConferenceDominationProtocol.generateLethalQuestions('Dr. Helena Vance', 'Keynote Benchmark')
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (q: LethalQuestion) => {
    navigator.clipboard?.writeText(q.question_text);
    setCopiedId(q.id);
    SensoryIntegrationLayer.triggerHaptic('subtle_pulse');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-[#111118] border border-[#232336] rounded-xl p-5 text-gray-200 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4 border-b border-[#232336] pb-3">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-red-400" />
          <h3 className="font-semibold text-lg text-white">Conference Domination Protocol — Lethal Q&A</h3>
        </div>
        <span className="text-xs text-gray-400 font-mono">Target: {speaker}</span>
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div key={q.id} className="p-4 rounded-xl bg-[#0e0e16] border border-[#222235] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-red-400">
                <Skull className="w-3.5 h-3.5" /> Vector #{idx + 1}: {q.intellectual_leverage_target}
              </span>
              <span className="px-2 py-0.5 rounded bg-red-950/60 border border-red-800 text-red-300 font-mono text-[10px]">
                {q.devastation_rating}
              </span>
            </div>

            <p className="text-sm font-medium text-white italic">&ldquo;{q.question_text}&rdquo;</p>

            <div className="pt-2 border-t border-[#1a1a28] grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-400">
              <div>
                <span className="text-purple-400 font-medium">Flaw Exploited:</span> {q.weakness_exploited}
              </div>
              <div>
                <span className="text-amber-400 font-medium">Anticipated Counter:</span> {q.expected_speaker_defense}
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => handleCopy(q)}
                className="px-2.5 py-1 text-xs rounded bg-[#1c1c2b] hover:bg-purple-600 text-gray-200 hover:text-white flex items-center gap-1 transition-colors"
              >
                {copiedId === q.id ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedId === q.id ? 'Copied to Clipboard' : 'Arm & Copy Question'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
