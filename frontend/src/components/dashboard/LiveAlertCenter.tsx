import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Activity, BellRing } from "lucide-react";

interface Alert {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  source: string;
  message: string;
  timestamp: string;
}

export const LiveAlertCenter = ({ alerts, isLoading }: { alerts?: Alert[], isLoading?: boolean }) => {
  if (isLoading) {
    return <Card className="animate-pulse h-64"><div className="h-full bg-gray-800/50 rounded"></div></Card>;
  }

  return (
    <Card className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-800">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BellRing className="text-danger" size={18} /> 
          Live Alert Center
        </h3>
        <Badge variant="secondary">{alerts?.length || 0} Active</Badge>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {alerts?.length === 0 && (
          <p className="text-sm text-gray-500 text-center mt-4">No active alerts. System healthy.</p>
        )}
        {alerts?.map(alert => (
          <div key={alert.id} className="flex items-start gap-3 p-3 bg-primary-bg rounded border-l-4" style={{
            borderColor: alert.severity === "critical" ? "#EF4444" : alert.severity === "high" ? "#F59E0B" : "#3B82F6"
          }}>
            <Activity size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-300">{alert.source}</span>
                <span className="text-[10px] text-gray-500 font-mono">{new Date(alert.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
