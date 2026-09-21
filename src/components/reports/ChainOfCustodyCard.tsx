import React from "react";
import type { ChainOfCustody } from "@/types/report";
import { ShieldCheck, Hash, UserCheck, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChainOfCustodyCardProps {
  data: ChainOfCustody;
  className?: string;
}

export const ChainOfCustodyCard: React.FC<ChainOfCustodyCardProps> = ({ data, className = "" }) => {
  return (
    <div
      className={`rounded-lg border border-slate-200 bg-slate-50/80 p-4 text-xs text-slate-800 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-emerald-600" />
          <span className="font-bold tracking-wide uppercase text-[11px] text-slate-900">
            Cryptographic Chain of Custody
          </span>
        </div>
        <Badge
          variant="outline"
          className="bg-emerald-50 text-emerald-700 border-emerald-300 text-[10px] font-mono font-semibold px-2"
        >
          VERIFIED DETERMINISTIC
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Hash className="size-3.5 text-slate-400" />
            <span>Document Checksum (SHA-256):</span>
          </div>
          <p className="font-mono text-[10px] break-all bg-white p-1.5 rounded border border-slate-200 text-slate-900 select-all font-semibold">
            {data.hashSha256}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1">
              <Calendar className="size-3.5 text-slate-400" /> Generated At:
            </span>
            <span className="font-medium text-slate-900">
              {new Date(data.generatedAt).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1">
              <UserCheck className="size-3.5 text-slate-400" /> Signed By:
            </span>
            <span className="font-medium text-slate-900">
              {data.generatorName} ({data.generatorRole})
            </span>
          </div>
          {data.reviewerSignOff && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-200">
              <span className="text-slate-500">Reviewing Sign-Off:</span>
              <span className="font-semibold text-emerald-800">
                {data.reviewerSignOff.reviewerName} [{data.reviewerSignOff.verdict}]
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
