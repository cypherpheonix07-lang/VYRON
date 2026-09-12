import React from 'react';
import { GitBranch, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { starkDB, type ConceptRecord, type ConceptRelationshipRecord } from '../../kernel/db';

export function MasteryTree() {
  const concepts = starkDB.select<ConceptRecord>('concepts');
  const relationships = starkDB.select<ConceptRelationshipRecord>('concept_relationships');

  return (
    <div className="bg-[#111118] border border-[#232336] rounded-xl p-5 text-gray-200 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4 border-b border-[#232336] pb-3">
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-purple-400" />
          <h3 className="font-semibold text-lg text-white">Prerequisite Mastery Topology</h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Mastered (&gt;80%)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Developing</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Atrophy Gap</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {concepts.slice(0, 6).map((c, idx) => {
          const retention = c.retention_score ?? 0.85;
          const statusColor = retention >= 0.8
            ? 'border-emerald-500/60 bg-emerald-950/20 text-emerald-300'
            : retention >= 0.4
            ? 'border-amber-500/60 bg-amber-950/20 text-amber-300'
            : 'border-red-500/60 bg-red-950/20 text-red-300';

          return (
            <div
              key={c.id}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all hover:scale-[1.02] shadow-lg ${statusColor}`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2 opacity-80">
                  <span className="font-mono">Tier {idx % 3 + 1} Dependency</span>
                  {retention >= 0.8 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
                </div>
                <h4 className="font-bold text-white text-base mb-1">{c.name}</h4>
                <p className="text-xs text-gray-400 line-clamp-2">{c.description || 'Core architectural prerequisite.'}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#222233] flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400">Mastery: {Math.round(retention * 100)}%</span>
                <span className="text-purple-400 flex items-center gap-0.5">
                  DAG Root <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
