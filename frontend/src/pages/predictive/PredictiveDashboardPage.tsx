import React from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { useOnboardingStore } from "@/store/onboarding";
import { BrainCircuit, AlertTriangle, TrendingDown, Clock, Upload } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Link, useNavigate } from "react-router-dom";
import { useFailurePredictions, usePredictiveOverview } from "@/hooks/usePredictiveMaintenanceQueries";
import { DataTable } from "@/components/ui/DataTable";

const mockPredictions = [
  { assetId: "M-201", name: "Stamping Press", mode: "Bearing Wear", predictedDate: "2026-08-15", prob: 87 },
  { assetId: "C-401", name: "Air Compressor", mode: "Valve Leak", predictedDate: "2026-09-02", prob: 72 },
  { assetId: "P-101", name: "Coolant Pump", mode: "Seal Failure", predictedDate: "2026-09-20", prob: 64 },
  { assetId: "TG-301", name: "Steam Turbine", mode: "Blade Erosion", predictedDate: "2026-10-05", prob: 45 },
];

export const PredictiveDashboardPage = () => {
  const { hasDocuments } = useOnboardingStore();
  const { data: predictions } = useFailurePredictions();
  const { data: overview } = usePredictiveOverview();
  const navigate = useNavigate();

  const failurePredictions = predictions?.length ? predictions : mockPredictions;
  const isEmpty = !hasDocuments;

  const columns = [
    { header: "Asset", accessorKey: "name", cell: (row: any) => <span className="font-bold text-white">{row.name} ({row.assetId})</span> },
    { header: "Failure Mode", accessorKey: "mode", cell: (row: any) => <span className="text-gray-400">{row.mode}</span> },
    { header: "Est. Failure Date", accessorKey: "predictedDate", cell: (row: any) => <span className="text-gray-300 font-mono">{row.predictedDate}</span> },
    { header: "Probability", accessorKey: "prob", cell: (row: any) => (
      <div className="flex items-center gap-2">
        <div className="w-16 h-2 bg-gray-800 rounded overflow-hidden">
          <div className={`h-full ${row.prob > 75 ? 'bg-danger' : row.prob > 50 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${row.prob}%` }}></div>
        </div>
        <span className="text-xs font-mono text-gray-400">{row.prob}%</span>
      </div>
    )},
    { header: "Action", accessorKey: "assetId", cell: (row: any) => (
       <Link to={`/predictive/failures/${row.assetId}`} className="text-xs text-info hover:text-white transition-colors">Analyze</Link>
    )}
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BrainCircuit className="text-accent" /> Predictive Maintenance
          </h1>
          <p className="text-sm text-gray-500 mt-1">AI-driven Remaining Useful Life (RUL) and Failure Forecasting</p>
        </div>
        <div className="flex gap-2">
          <Link to="/predictive/planner" className="px-4 py-2 bg-secondary-bg hover:bg-gray-800 border border-gray-700 text-white rounded text-sm transition-colors">
            Maintenance Planner
          </Link>
          <Link to="/predictive/simulation" className="px-4 py-2 bg-accent text-white rounded text-sm font-bold hover:bg-accent/90 transition-colors">
            What-If Simulator
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="At-Risk Assets (30 Days)" value={overview?.atRiskAssets ?? (failurePredictions.filter((p: any) => p.prob > 70).length || "—")} isLoading={false} />
        <StatCard title="Avg Fleet RUL" value={overview?.avgRul ?? "186 days"} isLoading={false} />
        <StatCard title="Prevented Downtime" value={overview?.preventedDowntime ?? "320 hrs"} isLoading={false} />
        <StatCard title="Spare Parts Shortage" value={overview?.partsShortage ?? "3 items"} isLoading={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-800 bg-secondary-bg/50 flex justify-between items-center">
              <h3 className="font-bold text-white flex items-center gap-2"><AlertTriangle size={16} className="text-warning"/> Imminent Failure Predictions</h3>
            </div>
            {failurePredictions.length > 0 ? (
              <DataTable columns={columns} data={failurePredictions} isLoading={false} />
            ) : (
              <div className="p-8 text-center text-gray-500 text-sm">
                No failure predictions yet. Data will appear once sensor and maintenance data is processed.
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2"><TrendingDown size={16} className="text-info" /> Fleet Health</h3>
            {failurePredictions.length > 0 ? (
              <div className="space-y-3">
                {failurePredictions.slice(0, 3).map((p: any) => (
                  <div key={p.assetId} className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">{p.name}</span>
                    <Badge variant={p.prob > 75 ? "danger" : p.prob > 50 ? "warning" : "success"} className="text-[10px]">
                      {p.prob}% risk
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">No fleet health data available</p>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Clock size={16} /> Maintenance Backlog</h3>
            <div className="space-y-3">
              {["PM-001: Bearing replacement", "PM-002: Oil change", "PM-003: Calibration"].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">{item}</span>
                  <Badge variant="warning" className="text-[10px]">Overdue</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
