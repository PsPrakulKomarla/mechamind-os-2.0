import React from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { useAlarmFeed } from "@/hooks/useIotQueries";
import { Bell, AlertTriangle } from "lucide-react";

export const AlarmCenterPage = () => {
  const { data: alarms, isLoading } = useAlarmFeed();

  const mockAlarms = alarms || [
    { id: "AL-1001", source: "Sensor: vib-m1", type: "Threshold Exceeded", severity: "Critical", time: new Date().toLocaleTimeString(), message: "Vibration exceeded 4.5 mm/s limit for > 10s" },
    { id: "AL-1002", source: "Camera: cam-201", type: "Vision AI Anomaly", severity: "High", time: new Date(Date.now() - 300000).toLocaleTimeString(), message: "Surface scratch defect detected on product." },
    { id: "AL-1003", source: "System: edge-gw-2", type: "Network Disconnect", severity: "Medium", time: new Date(Date.now() - 1800000).toLocaleTimeString(), message: "Gateway dropped connection. Using fallback." },
  ];

  const columns = [
    { header: "Time", accessorKey: "time", cell: (row: any) => <span className="font-mono text-gray-400 text-xs">{row.time}</span> },
    { header: "Severity", accessorKey: "severity", cell: (row: any) => (
      <Badge variant={
        row.severity === "Critical" ? "danger" : 
        row.severity === "High" ? "warning" : "info"
      } className="uppercase text-[10px]">
        {row.severity}
      </Badge>
    )},
    { header: "Source", accessorKey: "source", cell: (row: any) => <span className="font-bold text-gray-300">{row.source}</span> },
    { header: "Type", accessorKey: "type" },
    { header: "Message", accessorKey: "message", cell: (row: any) => <span className="text-gray-400">{row.message}</span> },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bell className="text-danger animate-bounce" /> Unified Alarm Center
          </h1>
          <p className="text-sm text-gray-500 mt-1">Live feed of all IoT, Vision, and System alerts</p>
        </div>
      </div>

      <div className="bg-danger/5 border border-danger/30 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="text-danger shrink-0 mt-0.5" size={20} />
        <div>
          <h3 className="text-sm font-bold text-danger mb-1">Critical Alarms Active</h3>
          <p className="text-sm text-gray-300">1 machine is currently reporting critical threshold violations. Acknowledge the alarm or dispatch a work order immediately.</p>
        </div>
      </div>

      <DataTable columns={columns} data={mockAlarms} isLoading={isLoading} />
    </div>
  );
};
