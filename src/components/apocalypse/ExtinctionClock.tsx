import React from 'react';
import { SkillObsolescenceMonitor } from '../../apocalypse/extinction';
import { Hourglass, AlertTriangle, ArrowUpRight } from 'lucide-react';

export function ExtinctionClock() {
  const metrics = SkillObsolescenceMonitor.getObsolescenceMetrics();

  return (
    <div className="bg-[#111118] border border-[#232336] rounded-xl p-5 text-gray-200 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4 border-b border-[#232336] pb-3">
        <div className="flex items-center gap-2">
          <Hourglass className="w-5 h-5 text-red-400" />
          <h3 className="font-semibold text-lg text-white">Skill Extinction Clock & Obsolescence Horizon</h3>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-800 text-red-300 font-mono text-xs">
          CRITICAL THREAT TELEMETRY
        </span>
      </div>

      <div className="space-y-3">
        {metrics.map(m => (
          <div key={m.skill_name} className="p-3.5 rounded-xl bg-[#0d0d14] border border-[#1e1e2c] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white text-sm">{m.skill_name}</span>
              </div>
              <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                <span>Successor Tech:</span>
                <span className="text-purple-300 font-medium flex items-center gap-0.5">
                  {m.replacement_technology} <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-[10px] uppercase text-gray-500 font-semibold">Half-Life</div>
                <div className="font-mono text-xs font-bold text-purple-300">{m.half_life_months} Months</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase text-gray-500 font-semibold">Extinction Risk</div>
                <div className="font-mono text-sm font-bold text-red-400">{m.extinction_risk_percentage}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
