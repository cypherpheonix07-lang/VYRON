import React from "react";
import type { MetricDefinition } from "@/types/report";
import { MetricSourceTooltip } from "./MetricSourceTooltip";
import { Badge } from "@/components/ui/badge";

interface MetricStatusTableProps {
  metrics: MetricDefinition[];
}

export const MetricStatusTable: React.FC<MetricStatusTableProps> = ({ metrics }) => {
  return (
    <div className="overflow-x-auto my-3">
      <table className="report-table">
        <thead>
          <tr>
            <th className="w-16">ID</th>
            <th>Performance Metric</th>
            <th>Category</th>
            <th>Target Spec</th>
            <th>Achieved Value</th>
            <th>Verification Status</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((m) => (
            <tr key={m.id}>
              <td className="font-mono font-bold text-slate-800">{m.id}</td>
              <td className="font-medium text-slate-900">{m.name}</td>
              <td>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                  {m.category}
                </span>
              </td>
              <td className="font-mono text-slate-600">{m.target}</td>
              <td>
                <MetricSourceTooltip
                  value={m.achieved}
                  source={m.selectorSource}
                  className="font-mono font-semibold"
                />
              </td>
              <td>
                {m.status === "ACHIEVED" ? (
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-300 font-mono text-[10px] font-bold py-0"
                  >
                    ACHIEVED
                  </Badge>
                ) : m.status === "TARGET" ? (
                  <Badge
                    variant="outline"
                    className="bg-sky-50 text-sky-700 border-sky-300 font-mono text-[10px] font-bold py-0"
                  >
                    TARGET
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-700 border-amber-300 font-mono text-[10px] font-bold py-0"
                  >
                    PENDING (App. D)
                  </Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
