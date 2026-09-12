import React from "react";
import type { ReportDocument } from "@/types/report";
import { ChainOfCustodyCard } from "./ChainOfCustodyCard";
import { Shield } from "lucide-react";

interface ReportCoverPageProps {
  doc: ReportDocument;
  pageNumber: number;
  totalPages: number;
}

export const ReportCoverPage: React.FC<ReportCoverPageProps> = ({
  doc,
  pageNumber,
  totalPages,
}) => {
  return (
    <div className="report-paper-page">
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-wider">
            PB
          </div>
          <div>
            <h4 className="text-xs font-black tracking-widest uppercase text-slate-900">
              Project Brahma Platform
            </h4>
            <p className="text-[10px] text-slate-500 font-mono">
              Engineering Intelligence & Governance System
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-block bg-slate-100 text-slate-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-slate-300">
            {doc.institution.classification}
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
            Build: {doc.version} | Hash: {doc.chainOfCustody.hashSha256.slice(0, 10)}...
          </p>
        </div>
      </div>

      {/* Main Title Area */}
      <div className="my-auto py-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-semibold">
          <Shield className="size-3.5 text-cyan-600" />
          <span>Automated Architectural Governance & Release Gating</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 font-sans">
            {doc.title}
          </h1>
          <h2 className="text-lg font-medium text-slate-700 max-w-xl mx-auto">{doc.subtitle}</h2>
          <p className="text-xs italic text-slate-500 font-serif max-w-lg mx-auto pt-2">
            “{doc.tagline}”
          </p>
        </div>

        {/* Team Members */}
        <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-lg p-4 text-left space-y-2.5">
          <p className="text-[11px] uppercase font-bold tracking-wider text-slate-500 border-b border-slate-200 pb-1">
            Project Authors & Investigators (Team 19)
          </p>
          <div className="grid grid-cols-1 gap-2 text-xs">
            {doc.team.map((member) => (
              <div key={member.regNo} className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900">{member.name}</span>
                  <span className="text-[11px] text-slate-500 block">{member.role}</span>
                </div>
                <span className="font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                  {member.regNo}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Institutional Block */}
        <div className="text-xs text-slate-600 space-y-1">
          <p className="font-bold text-slate-800">{doc.institution.institution}</p>
          <p>{doc.institution.department}</p>
          <p className="text-slate-500">
            {doc.institution.course} &bull; {doc.institution.cohort} &bull; AY{" "}
            {doc.institution.academicYear}
          </p>
        </div>

        {/* Chain of Custody Box */}
        <div className="max-w-xl mx-auto pt-2 text-left">
          <ChainOfCustodyCard data={doc.chainOfCustody} />
        </div>
      </div>

      {/* Page Footer */}
      <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-[10px] font-mono text-slate-400">
        <span>PROJECT BRAHMA — Executive Summary Report 2026–2027</span>
        <span>
          Page {pageNumber} of {totalPages}
        </span>
      </div>
    </div>
  );
};
