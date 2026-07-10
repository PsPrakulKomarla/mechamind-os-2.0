import React from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { usePredictiveAlerts } from "@/hooks/useMaintenanceQueries";
import { AlertTriangle, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";

export const PredictiveMaintenancePage = () => {
  const { data: alerts, isLoading } = usePredictiveAlerts();

  const mockAlerts = alerts || [
    { id: "p-1", machine: "Stamping Press M-201", component: "Spindle Bearing", failureProbability: 0.88, rul: "4 Days", costRisk: "$45,000", status: "Work Order Created" },
    { id: "p-2", machine: "Conveyor C-12", component: "Drive Motor", failureProbability: 0.65, rul: "12 Days", costRisk: "$8,000", status: "Monitoring" },
    { id: "p-3", machine: "HVAC Unit 3", component: "Compressor", failureProbability: 0.45, rul: "45 Days", costRisk: "$12,000", status: "Monitoring" },
  ];

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

      <div className="bg-warning/5 border border-warning/30 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="text-warning shrink-0 mt-0.5" size={20} />
        <div>
          <h3 className="text-sm font-bold text-warning mb-1">Attention Required</h3>
          <p className="text-sm text-gray-300">MechaMind AI has detected 1 asset with a critical failure probability (&gt;80%) within the next 7 days. It is highly recommended to schedule maintenance immediately to prevent unplanned downtime.</p>
        </div>
      </div>

      <DataTable columns={columns} data={mockAlerts} isLoading={isLoading} />
    </div>
  );
};
