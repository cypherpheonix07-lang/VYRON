import React from 'react';
import { Sparkles, Layers, ShieldCheck } from 'lucide-react';

interface HeatmapCell {
  hour: string;
  track: string;
  conceptCount: number;
  evidenceStrength: number;
  technicalDepth: number;
}

export function InsightHeatmap() {
  const tracks = ['Distributed Systems', 'Kernel & WASM', 'State & Telemetry', 'AI Engineering'];
  const hours = ['09:00', '11:00', '13:00', '15:00', '17:00'];

  const cells: HeatmapCell[] = [
    { hour: '09:00', track: 'Distributed Systems', conceptCount: 8, evidenceStrength: 0.95, technicalDepth: 0.9 },
    { hour: '11:00', track: 'Distributed Systems', conceptCount: 5, evidenceStrength: 0.85, technicalDepth: 0.75 },
    { hour: '13:00', track: 'Kernel & WASM', conceptCount: 11, evidenceStrength: 0.98, technicalDepth: 0.95 },
    { hour: '15:00', track: 'State & Telemetry', conceptCount: 6, evidenceStrength: 0.88, technicalDepth: 0.8 },
    { hour: '17:00', track: 'AI Engineering', conceptCount: 9, evidenceStrength: 0.72, technicalDepth: 0.85 },
  ];

  const getCellData = (track: string, hour: string) => {
    return cells.find(c => c.track === track && c.hour === hour) || {
      hour,
      track,
      conceptCount: 2,
      evidenceStrength: 0.6,
      technicalDepth: 0.5
    };
  };

  return (
    <div className="bg-[#111118] border border-[#232336] rounded-xl p-5 text-gray-200 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4 border-b border-[#232336] pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-400" />
          <h3 className="font-semibold text-lg text-white">Insight Density & Evidence Heatmap</h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-purple-900/60 inline-block"></span> Low</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-purple-600 inline-block"></span> Medium</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-purple-400 inline-block"></span> High Peak</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr>
              <th className="py-2 px-3 text-gray-500 font-medium">Track / Time</th>
              {hours.map(h => (
                <th key={h} className="py-2 px-3 text-gray-400 font-mono font-medium text-center">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e2d]">
            {tracks.map(track => (
              <tr key={track}>
                <td className="py-3 px-3 font-medium text-gray-300">{track}</td>
                {hours.map(hour => {
                  const data = getCellData(track, hour);
                  const intensity = Math.min(1.0, data.conceptCount / 10);
                  const bgColor = intensity > 0.8
                    ? 'bg-purple-500/80 text-white border-purple-400/50'
                    : intensity > 0.5
                    ? 'bg-purple-700/60 text-purple-100 border-purple-600/40'
                    : 'bg-[#181824] text-gray-400 border-[#252538]';

                  return (
                    <td key={hour} className="py-2 px-2 text-center">
                      <div
                        className={`p-2.5 rounded-lg border flex flex-col items-center justify-center transition-all hover:scale-105 cursor-pointer ${bgColor}`}
                        title={`${track} at ${hour}: ${data.conceptCount} Concepts, ${(data.evidenceStrength * 100).toFixed(0)}% Evidence`}
                      >
                        <span className="font-bold font-mono">{data.conceptCount} concepts</span>
                        <span className="text-[10px] opacity-75 flex items-center gap-0.5 mt-0.5">
                          <ShieldCheck className="w-2.5 h-2.5" /> {(data.evidenceStrength * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
