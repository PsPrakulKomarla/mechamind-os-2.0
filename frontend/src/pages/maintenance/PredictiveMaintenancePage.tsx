import React from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { usePredictiveAlerts } from "@/hooks/useMaintenanceQueries";
import { useOnboardingStore } from "@/store/onboarding";
import { AlertTriangle, TrendingDown, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PredictiveMaintenancePage = () => {
  const { data: alerts, isLoading } = usePredictiveAlerts();
  const { hasDocuments } = useOnboardingStore();
  const navigate = useNavigate();

  const alertList = alerts || [];
  const isEmpty = !hasDocuments && alertList.length === 0 && !isLoading;

  const columns = [
    { header: "Machine", accessorKey: "machine", cell: (row: any) => <span className="font-bold text-gray-200">{row.machine}</span> },
    { header: "Component at Risk", accessorKey: "component" },
    { header: "Failure Probability", accessorKey: "failureProbability", cell: (row: any) => (
      <div className="flex items-center gap-2">
        <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className={`h-full ${row.failureProbability > 0.8 ? "bg-danger" : row.failureProbability > 0.5 ? "bg-warning" : "bg-success"}`} 
            style={{ width: `${row.failureProbability * 100}%` }}
          ></div>
        </div>
        <span className="text-xs text-gray-400">{(row.failureProbability * 100).toFixed(0)}%</span>
      </div>
    )},
    { header: "Remaining Useful Life (RUL)", accessorKey: "rul", cell: (row: any) => (
      <span className="font-mono text-sm text-warning font-semibold flex items-center gap-1">
        <TrendingDown size={14} /> {row.rul}
      </span>
    )},
    { header: "Est. Downtime Cost Risk", accessorKey: "costRisk", cell: (row: any) => <span className="text-danger font-medium">{row.costRisk}</span> },
    { header: "Action Status", accessorKey: "status", cell: (row: any) => (
      <Badge variant={row.status === "Monitoring" ? "secondary" : "info"}>{row.status}</Badge>
    )}
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="text-warning" /> Predictive Maintenance Alerts
          </h1>
          <p className="text-sm text-gray-500 mt-1">AI-driven failure predictions across the factory floor</p>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#111827] border border-gray-800 flex items-center justify-center mb-4">
            <AlertTriangle size={28} className="text-gray-600" />
          </div>
          <h3 className="text-white font-semibold text-sm mb-1">No Predictive Alerts</h3>
          <p className="text-gray-500 text-xs max-w-xs mb-4">Upload sensor data and maintenance records to enable predictive maintenance.</p>
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
          {alertList.some((a: any) => a.failureProbability > 0.8) && (
            <div className="bg-warning/5 border border-warning/30 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertTriangle className="text-warning shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="text-sm font-bold text-warning mb-1">Attention Required</h3>
                <p className="text-sm text-gray-300">MechaMind AI has detected assets with critical failure probability (&gt;80%). Schedule maintenance immediately to prevent unplanned downtime.</p>
              </div>
            </div>
          )}

          <DataTable columns={columns} data={alertList} isLoading={isLoading} />
        </>
      )}
    </div>
  );
};
