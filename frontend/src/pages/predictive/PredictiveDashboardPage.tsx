import React from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { BrainCircuit, AlertTriangle, TrendingDown, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Link } from "react-router-dom";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";

export const PredictiveDashboardPage = () => {
  // Mock data for predictions
  const predictions = [
    { assetId: "M4", name: "Main Pump", prob: 85, predictedDate: "2026-07-15", mode: "Bearing Seizure" },
    { assetId: "M2", name: "Beta Lathe", prob: 62, predictedDate: "2026-07-28", mode: "Thermal Overload" },
    { assetId: "M1", name: "Alpha Spindle", prob: 12, predictedDate: "2026-11-04", mode: "Vibration Wear" },
  ];

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
        <StatCard title="At-Risk Assets (30 Days)" value="2" trend={-1} isLoading={false} />
        <StatCard title="Avg Fleet RUL" value="8.4 mos" trend={0.2} isLoading={false} />
        <StatCard title="Prevented Downtime" value="42 hrs" trend={14} isLoading={false} />
        <StatCard title="Spare Parts Shortage" value="1" trend={0} isLoading={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-800 bg-secondary-bg/50 flex justify-between items-center">
              <h3 className="font-bold text-white flex items-center gap-2"><AlertTriangle size={16} className="text-warning"/> Imminent Failure Predictions</h3>
            </div>
            <DataTable columns={columns} data={predictions} isLoading={false} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
             <h3 className="font-bold text-white mb-4 flex items-center gap-2"><TrendingDown size={16} className="text-info" /> Fleet Health Degradation</h3>
             <div className="space-y-4">
               <div>
                 <div className="flex justify-between text-xs mb-1">
                   <span className="text-gray-400">Pumps</span>
                   <span className="text-warning font-bold">64% Avg Health</span>
                 </div>
                 <div className="w-full h-1.5 bg-gray-800 rounded"><div className="h-full bg-warning w-[64%]"></div></div>
               </div>
               <div>
                 <div className="flex justify-between text-xs mb-1">
                   <span className="text-gray-400">Spindles</span>
                   <span className="text-success font-bold">92% Avg Health</span>
                 </div>
                 <div className="w-full h-1.5 bg-gray-800 rounded"><div className="h-full bg-success w-[92%]"></div></div>
               </div>
               <div>
                 <div className="flex justify-between text-xs mb-1">
                   <span className="text-gray-400">Conveyors</span>
                   <span className="text-success font-bold">88% Avg Health</span>
                 </div>
                 <div className="w-full h-1.5 bg-gray-800 rounded"><div className="h-full bg-success w-[88%]"></div></div>
               </div>
             </div>
          </Card>

          <Card className="p-6 bg-accent/5 border-accent/20">
             <h3 className="font-bold text-accent mb-2 flex items-center gap-2"><Clock size={16} /> Maintenance Backlog</h3>
             <p className="text-3xl font-black text-white mb-1">14 <span className="text-sm font-normal text-gray-400">Open WOs</span></p>
             <p className="text-xs text-gray-300">3 critical work orders need scheduling before next week to avoid unplanned downtime.</p>
             <button className="mt-4 w-full py-2 bg-secondary-bg hover:bg-gray-800 border border-gray-700 text-white rounded text-xs font-bold transition-colors">
               Go to Planner
             </button>
          </Card>
        </div>
      </div>
    </div>
  );
};
