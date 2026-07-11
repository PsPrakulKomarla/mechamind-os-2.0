import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Activity, AlertTriangle, Settings, Power } from "lucide-react";
import { Link } from "react-router-dom";

interface MachineStatusCardProps {
  id: string;
  name: string;
  status: "healthy" | "warning" | "critical" | "offline";
  healthScore: number;
  operatingMode: string;
  activeAlarms: number;
}

export const MachineStatusCard = ({ id, name, status, healthScore, operatingMode, activeAlarms }: MachineStatusCardProps) => {
  const isDanger = status === "critical";
  const isWarning = status === "warning";
  const isOffline = status === "offline";

  return (
    <Card className={`p-5 flex flex-col justify-between overflow-hidden relative group hover:border-gray-600 transition-colors ${
      isDanger ? "border-danger/50 bg-danger/5" : 
      isWarning ? "border-warning/50 bg-warning/5" : ""
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-white tracking-tight">{name}</h3>
            <Badge variant="secondary" className="text-[10px] uppercase font-mono">{id}</Badge>
          </div>
          <p className="text-sm text-gray-400 flex items-center gap-1">
            <Power size={12} className={isOffline ? "text-gray-500" : "text-success"} /> {operatingMode}
          </p>
        </div>
        
        <div className={`p-2 rounded-full ${
          isDanger ? "bg-danger/20 text-danger" : 
          isWarning ? "bg-warning/20 text-warning" : 
          isOffline ? "bg-gray-800 text-gray-500" : "bg-success/20 text-success"
        }`}>
          {isDanger ? <AlertTriangle size={20} /> : isWarning ? <AlertTriangle size={20} /> : <Settings size={20} />}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-primary-bg rounded p-3 border border-gray-800">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Health Score</p>
          <div className="flex items-end gap-2">
            <span className={`text-2xl font-mono font-bold ${healthScore < 50 ? "text-danger" : healthScore < 80 ? "text-warning" : "text-white"}`}>
              {healthScore}
            </span>
            <span className="text-xs text-gray-500 mb-1">/100</span>
          </div>
        </div>
        
        <div className="bg-primary-bg rounded p-3 border border-gray-800">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Active Alarms</p>
          <div className="flex items-end gap-2">
            <span className={`text-2xl font-mono font-bold ${activeAlarms > 0 ? "text-danger" : "text-white"}`}>
              {activeAlarms}
            </span>
            {activeAlarms > 0 && <Activity size={14} className="text-danger mb-1.5 animate-pulse" />}
          </div>
        </div>
      </div>

      <Link 
        to={`/digital-twin/machines/${id}`}
        className="w-full py-2 bg-secondary-bg hover:bg-gray-800 border border-gray-700 text-white rounded text-sm font-bold transition-colors flex justify-center items-center gap-2"
      >
        <Activity size={14} /> Open Live Monitor
      </Link>
    </Card>
  );
};
