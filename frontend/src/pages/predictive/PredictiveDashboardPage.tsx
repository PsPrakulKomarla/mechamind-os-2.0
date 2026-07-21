import React from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { useOnboardingStore } from "@/store/onboarding";
import { BrainCircuit, AlertTriangle, TrendingDown, Clock, Upload } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Link, useNavigate } from "react-router-dom";
import { DataTable } from "@/components/ui/DataTable";

export const PredictiveDashboardPage = () => {
  const { hasDocuments } = useOnboardingStore();
  const navigate = useNavigate();

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
    { header: "Action", accessorKey: "action", cell: (row: any) => (
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
        {!isEmpty && (
          <div className="flex gap-2">
            <Link to="/predictive/planner" className="px-4 py-2 bg-secondary-bg hover:bg-gray-800 border border-gray-700 text-white rounded text-sm transition-colors">
              Maintenance Planner
            </Link>
            <Link to="/predictive/simulation" className="px-4 py-2 bg-accent text-white rounded text-sm font-bold hover:bg-accent/90 transition-colors">
              What-If Simulator
            </Link>
          </div>
        )}
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#111827] border border-gray-800 flex items-center justify-center mb-4">
            <BrainCircuit size={28} className="text-gray-600" />
          </div>
          <h3 className="text-white font-semibold text-sm mb-1">No Predictive Data Available</h3>
          <p className="text-gray-500 text-xs max-w-xs mb-4">Upload maintenance records and sensor data to enable AI-driven failure predictions.</p>
          <button
            onClick={() => navigate("/onboarding")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs font-medium hover:bg-[#3B82F6]/15 transition-colors"
          >
            <Upload size={12} />
            Setup Data
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard title="At-Risk Assets (30 Days)" value="—" isLoading={false} />
            <StatCard title="Avg Fleet RUL" value="—" isLoading={false} />
            <StatCard title="Prevented Downtime" value="—" isLoading={false} />
            <StatCard title="Spare Parts Shortage" value="—" isLoading={false} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-0 overflow-hidden">
                <div className="p-4 border-b border-gray-800 bg-secondary-bg/50 flex justify-between items-center">
                  <h3 className="font-bold text-white flex items-center gap-2"><AlertTriangle size={16} className="text-warning"/> Imminent Failure Predictions</h3>
                </div>
                <div className="p-8 text-center text-gray-500 text-sm">
                  No failure predictions yet. Data will appear once sensor and maintenance data is processed.
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><TrendingDown size={16} className="text-info" /> Fleet Health</h3>
                <p className="text-gray-500 text-sm text-center py-4">No fleet health data available</p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Clock size={16} /> Maintenance Backlog</h3>
                <p className="text-gray-500 text-sm text-center py-4">No backlog data available</p>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
