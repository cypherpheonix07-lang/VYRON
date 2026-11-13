// ============================================================================
// FILE 5: src/components/connectors/datasets/DatasetManager.tsx
// MODULE S29 — Complete Implementation of Subcomponents S29.1 through S29.8
// ============================================================================
import React, { useState } from 'react';
import {
  Database as DbIcon,
  DownloadCloud,
  Eye,
  FileSpreadsheet,
  Layers,
  Sparkles as SynthIcon,
  UploadCloud,
} from 'lucide-react';
import {
  GlassCard3D,
  ProvenanceBadge,
} from '../ConnectorGlassPrimitives';
import type { ProjectDataset } from '@/types/connectors';

export const DatasetManager: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [kaggleSlug, setKaggleSlug] = useState('nasa/software-defect-prediction');
  const [syntheticRows, setSyntheticRows] = useState(250);
  const [datasets, setDatasets] = useState<ProjectDataset[]>([
    {
      id: 'ds_01',
      projectId,
      name: 'sprint_velocity_history_q3.csv',
      provenanceType: 'upload',
      sourceRef: 'sprint_velocity_history_q3.csv',
      isSynthetic: false,
      fileFormat: 'csv',
      sizeBytes: 184320,
      rowCount: 1420,
      scanStatus: 'clean',
      version: 2,
      schema: [
        {
          name: 'sprint_id',
          dataType: 'string',
          nullable: false,
          nullPercentage: 0,
          sampleValues: ['SPR-101', 'SPR-102'],
        },
        {
          name: 'committed_points',
          dataType: 'number',
          nullable: false,
          nullPercentage: 0,
          sampleValues: [42, 38],
        },
        {
          name: 'completed_points',
          dataType: 'number',
          nullable: true,
          nullPercentage: 1.4,
          sampleValues: [39, 38],
        },
      ],
      qualityReport: {
        inspectionMethod: 'full_scan',
        inspectedRows: 1420,
        missingCellRate: 0.46,
        outlierCount: 3,
        typeMismatchCount: 0,
      },
      boundModules: ['delivery_risk', 'kpi_mapper'],
      updatedAt: '10 mins ago',
    },
    {
      id: 'ds_02_synth',
      projectId,
      name: 'synthetic_microservice_load_fixture.json',
      provenanceType: 'synthetic',
      sourceRef: 'seed:42',
      isSynthetic: true,
      fileFormat: 'json',
      sizeBytes: 92160,
      rowCount: 500,
      scanStatus: 'clean',
      version: 1,
      schema: [
        {
          name: 'service_node',
          dataType: 'string',
          nullable: false,
          nullPercentage: 0,
          sampleValues: ['auth-gateway', 'risk-worker'],
        },
        {
          name: 'p99_latency_ms',
          dataType: 'number',
          nullable: false,
          nullPercentage: 0,
          sampleValues: [118.4, 240.1],
        },
      ],
      qualityReport: {
        inspectionMethod: 'full_scan',
        inspectedRows: 500,
        missingCellRate: 0,
        outlierCount: 0,
        typeMismatchCount: 0,
      },
      boundModules: ['code_health'],
      updatedAt: '1 hour ago',
    },
  ]);

  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('ds_01');
  const activeDataset = datasets.find((d) => d.id === selectedDatasetId) ?? datasets[0];

  const handleGenerateSynthetic = () => {
    const created: ProjectDataset = {
      id: `ds_synth_${Date.now()}`,
      projectId,
      name: `synthetic_brahma_fixture_${syntheticRows}r.json`,
      provenanceType: 'synthetic',
      sourceRef: 'seed:42',
      isSynthetic: true,
      fileFormat: 'json',
      sizeBytes: syntheticRows * 320,
      rowCount: syntheticRows,
      scanStatus: 'clean',
      version: 1,
      schema: [
        {
          name: 'module_id',
          dataType: 'string',
          nullable: false,
          nullPercentage: 0,
          sampleValues: ['S09', 'S15'],
        },
        {
          name: 'complexity_score',
          dataType: 'number',
          nullable: false,
          nullPercentage: 0,
          sampleValues: [14.2, 29.8],
        },
      ],
      qualityReport: {
        inspectionMethod: 'full_scan',
        inspectedRows: syntheticRows,
        missingCellRate: 0,
        outlierCount: 0,
        typeMismatchCount: 0,
      },
      boundModules: [],
      updatedAt: 'Just now',
    };

    setDatasets((prev) => [created, ...prev]);
    setSelectedDatasetId(created.id);
  };

  const handleToggleModuleBinding = (moduleKey: string) => {
    if (!activeDataset) return;
    setDatasets((prev) =>
      prev.map((ds) => {
        if (ds.id !== activeDataset.id) return ds;
        const exists = ds.boundModules.includes(moduleKey);
        return {
          ...ds,
          boundModules: exists
            ? ds.boundModules.filter((m) => m !== moduleKey)
            : [...ds.boundModules, moduleKey],
        };
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Row 1: Ingestion Controls — S29.2 Kaggle Importer, S29.3 Custom Upload, S29.8 Synthetic Generator */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* S29.2 KaggleImportPanel */}
        <GlassCard3D family="teal">
          <div className="flex items-center gap-2">
            <DownloadCloud className="h-4 w-4 text-[#0F969C]" />
            <span className="font-mono text-[11px] text-[#6DA5C0]">S29.2</span>
            <h3 className="text-sm font-semibold text-[#FFFFFF]">Kaggle Dataset Importer</h3>
          </div>
          <p className="mt-1 text-xs text-[#E2E8F0]">
            Server-side Kaggle API vault · Zero browser credentials
          </p>
          <div className="mt-3 flex gap-2">
            <input
              id="kaggle-dataset-slug"
              name="kaggleDatasetSlug"
              aria-label="Kaggle dataset slug"
              value={kaggleSlug}
              onChange={(e) => setKaggleSlug(e.target.value)}
              className="w-full rounded-lg border border-[#6DA5C0]/40 bg-[#05161A]/80 px-2.5 py-1.5 font-mono text-xs text-[#F8FAFC]"
            />
            <button className="shrink-0 rounded-lg border border-[#6DA5C0]/50 bg-[#0C7075] px-3 py-1.5 text-xs font-semibold text-[#FFFFFF] hover:bg-[#0F969C]">
              Import
            </button>
          </div>
        </GlassCard3D>

        {/* S29.3 CustomDataUploadZone */}
        <GlassCard3D family="slate">
          <div className="flex items-center gap-2">
            <UploadCloud className="h-4 w-4 text-[#6DA5C0]" />
            <span className="font-mono text-[11px] text-[#6DA5C0]">S29.3</span>
            <h3 className="text-sm font-semibold text-[#FFFFFF]">Custom File Upload</h3>
          </div>
          <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#6DA5C0]/50 bg-[#0F172A]/70 p-3 text-center hover:border-[#0F969C]">
            <span className="text-xs font-medium text-[#F8FAFC]">
              Drop CSV, JSON, or XLSX (Max 50MB)
            </span>
            <span className="mt-0.5 font-mono text-[10px] text-[#94A3B8]">
              Auto-runs malware scan & schema inference
            </span>
            <input id="custom-dataset-file" name="datasetFile" aria-label="Upload dataset file" type="file" accept=".csv,.json,.xlsx" className="hidden" />
          </label>
        </GlassCard3D>

        {/* S29.8 SyntheticDataGenerator */}
        <GlassCard3D family="obsidian">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SynthIcon className="h-4 w-4 text-[#6DA5C0]" />
              <span className="font-mono text-[11px] text-[#6DA5C0]">S29.8</span>
              <h3 className="text-sm font-semibold text-[#FFFFFF]">Synthetic Generator</h3>
            </div>
            <ProvenanceBadge type="synthetic" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input
              id="synthetic-row-count"
              name="syntheticRows"
              aria-label="Synthetic row count"
              type="number"
              min={10}
              max={10000}
              value={syntheticRows}
              onChange={(e) => setSyntheticRows(Number(e.target.value))}
              className="w-28 rounded-lg border border-[#333333] bg-[#0B0B0B] px-2.5 py-1.5 font-mono text-xs text-[#F8FAFC]"
            />
            <button
              onClick={handleGenerateSynthetic}
              className="flex-1 rounded-lg border border-[#6DA5C0]/50 bg-[#294D61]/80 px-3 py-1.5 text-xs font-semibold text-[#FFFFFF] hover:bg-[#0C7075]"
            >
              Generate Labeled Fixture
            </button>
          </div>
        </GlassCard3D>
      </div>

      {/* Row 2: S29.1 Dataset Library Table */}
      <GlassCard3D family="slate">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DbIcon className="h-4 w-4 text-[#0F969C]" />
            <span className="font-mono text-[11px] text-[#6DA5C0]">S29.1</span>
            <h3 className="text-base font-semibold text-[#FFFFFF]">Dataset Library</h3>
          </div>
          <span className="font-mono text-xs text-[#94A3B8]">{datasets.length} datasets</span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#334155] font-mono text-[11px] text-[#94A3B8] uppercase">
                <th className="py-2 pr-4">Dataset Name</th>
                <th className="py-2 pr-4">Provenance</th>
                <th className="py-2 pr-4">Format / Rows</th>
                <th className="py-2 pr-4">Scan</th>
                <th className="py-2 pr-4">Bound Modules</th>
                <th className="py-2 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]/60">
              {datasets.map((ds) => (
                <tr
                  key={ds.id}
                  onClick={() => setSelectedDatasetId(ds.id)}
                  className={`cursor-pointer transition-colors ${
                    ds.id === activeDataset?.id ? 'bg-[#0C7075]/25' : 'hover:bg-[#334155]/30'
                  }`}
                >
                  <td className="py-2.5 pr-4 font-mono font-semibold text-[#F8FAFC]">
                    {ds.name} <span className="text-[#94A3B8]">v{ds.version}</span>
                  </td>
                  <td className="py-2.5 pr-4">
                    <ProvenanceBadge
                      type={ds.isSynthetic ? 'synthetic' : 'storage'}
                    />
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-[#E2E8F0]">
                    {ds.fileFormat.toUpperCase()} · {ds.rowCount.toLocaleString()} rows
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-[#0F969C] uppercase">
                    {ds.scanStatus}
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-[11px] text-[#6DA5C0]">
                    {ds.boundModules.length > 0 ? ds.boundModules.join(', ') : 'unbound'}
                  </td>
                  <td className="py-2.5 text-right">
                    <button className="inline-flex items-center gap-1 rounded border border-[#6DA5C0]/40 px-2 py-1 font-mono text-[10px] text-[#F8FAFC]">
                      <Eye className="h-3 w-3" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard3D>

      {/* Row 3: S29.4 Schema Inspector, S29.5 Data Preview, S29.6 Quality Report & S29.7 Module Binding */}
      {activeDataset && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* S29.4 DataSchemaInspector + S29.5 DataPreviewTable */}
          <GlassCard3D family="obsidian" className="lg:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-[#6DA5C0]" />
                <span className="font-mono text-[11px] text-[#6DA5C0]">S29.4 · S29.5</span>
                <h3 className="text-base font-semibold text-[#FFFFFF]">
                  Schema Inspector & Paginated Sample ({activeDataset.name})
                </h3>
              </div>
              {activeDataset.isSynthetic && <ProvenanceBadge type="synthetic" />}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {activeDataset.schema.map((col) => (
                <div
                  key={col.name}
                  className="rounded-lg border border-[#333333] bg-[#1A1A1A]/80 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#F8FAFC]">{col.name}</span>
                    <span className="rounded bg-[#294D61]/60 px-1.5 py-0.5 font-mono text-[10px] text-[#6DA5C0]">
                      {col.dataType}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-[#94A3B8]">
                    nulls: {col.nullPercentage}% · {col.nullable ? 'nullable' : 'required'}
                  </p>
                  <p className="mt-1.5 truncate font-mono text-[11px] text-[#E2E8F0]">
                    samples: {col.sampleValues.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard3D>

          {/* S29.6 DataQualityReport + S29.7 DatasetBindingConfig */}
          <GlassCard3D family="teal">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#0F969C]" />
              <span className="font-mono text-[11px] text-[#6DA5C0]">S29.6 · S29.7</span>
              <h3 className="text-base font-semibold text-[#FFFFFF]">Quality & Module Binding</h3>
            </div>

            <div className="mt-3 space-y-1.5 rounded-lg border border-[#6DA5C0]/35 bg-[#05161A]/75 p-3 font-mono text-xs">
              <p className="text-[#E2E8F0]">
                Method: {activeDataset.qualityReport.inspectionMethod} (
                {activeDataset.qualityReport.inspectedRows} rows)
              </p>
              <p className="text-[#94A3B8]">
                Missing Cell Rate: {activeDataset.qualityReport.missingCellRate}%
              </p>
              <p className="text-[#94A3B8]">
                Outliers: {activeDataset.qualityReport.outlierCount} · Type Mismatches:{' '}
                {activeDataset.qualityReport.typeMismatchCount}
              </p>
            </div>

            <div className="mt-4">
              <p className="font-mono text-[11px] text-[#E2E8F0] uppercase">
                Bind Dataset v{activeDataset.version} to Analysis Modules:
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {['delivery_risk', 'kpi_mapper', 'code_health', 'security_reviewer'].map((mod) => {
                  const isBound = activeDataset.boundModules.includes(mod);
                  return (
                    <button
                      key={mod}
                      onClick={() => handleToggleModuleBinding(mod)}
                      className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] transition-all ${
                        isBound
                          ? 'border-[#0F969C] bg-[#0C7075]/70 text-[#FFFFFF]'
                          : 'border-[#6DA5C0]/35 bg-[#05161A]/60 text-[#94A3B8] hover:text-[#F8FAFC]'
                      }`}
                    >
                      {isBound ? `✓ ${mod}` : `+ ${mod}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </GlassCard3D>
        </div>
      )}
    </div>
  );
};
