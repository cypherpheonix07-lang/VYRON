import React from "react";
import { Bookmark, ListTree } from "lucide-react";

interface TocItem {
  id: string;
  title: string;
  page: number;
}

const TOC_ITEMS: TocItem[] = [
  { id: "sec-s1", title: "S1. Cover & Platform Metadata Block", page: 1 },
  { id: "sec-s2", title: "S2. Executive Summary & Research Lineage", page: 2 },
  { id: "sec-s3", title: "S3. Key Performance Dashboard & Longitudinal Charts", page: 2 },
  { id: "sec-s4", title: "S4. Problem Statement & Tooling Gap Analysis", page: 3 },
  { id: "sec-s5", title: "S5. System Architecture & Module Pipeline (M1–M8)", page: 3 },
  { id: "sec-s6", title: "S6. Core Technical Innovations & Mathematical Explainability", page: 4 },
  { id: "sec-s7", title: "S7. Technology Stack & Architectural Decision Register", page: 5 },
  { id: "sec-s8", title: "S8. Systematic Performance Metrics (Target vs. Achieved)", page: 6 },
  { id: "sec-s9", title: "S9. Comparative Analysis (Cohort & Industry Matrices)", page: 7 },
  { id: "sec-s10", title: "S10. Security Posture, Row-Level Security & Compliance", page: 8 },
  { id: "sec-s11", title: "S11. Empirical Evaluation, Study Design & Evidence", page: 9 },
  { id: "sec-s12", title: "S12. Academic Publication & Competency Placement Strategy", page: 10 },
  { id: "sec-s13", title: "S13. Future Research Scope & Roadmap (FS-1 to FS-6)", page: 11 },
  { id: "sec-s14", title: "S14. Conclusion & Key Achievement Register", page: 11 },
  { id: "sec-app-a", title: "Appendix A. Comprehensive Platform Route Map", page: 12 },
  { id: "sec-app-b", title: "Appendix B. UI Component & Visualizer Inventory", page: 12 },
  {
    id: "sec-app-c",
    title: "Appendix C. PostgreSQL Database Schema & Security Policies",
    page: 12,
  },
  { id: "sec-app-d", title: "Appendix D. Evidence Gaps & Pending Measurement Plans", page: 12 },
];

interface ReportTOCProps {
  onNavigate?: (id: string) => void;
}

export const ReportTOC: React.FC<ReportTOCProps> = ({ onNavigate }) => {
  const handleClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 my-4">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-3">
        <ListTree className="size-4 text-cyan-700" />
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
          Table of Contents
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
        {TOC_ITEMS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleClick(item.id, e)}
            className="flex items-center justify-between py-1 text-slate-700 hover:text-cyan-800 hover:underline transition-colors group"
          >
            <span className="flex items-center gap-1.5 truncate">
              <Bookmark className="size-3 text-slate-400 group-hover:text-cyan-700 shrink-0" />
              <span className="truncate">{item.title}</span>
            </span>
            <span className="font-mono text-slate-400 text-[11px] shrink-0 ml-2">
              p. {item.page}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};
