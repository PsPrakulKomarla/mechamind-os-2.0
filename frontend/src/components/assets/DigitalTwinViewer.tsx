import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Activity } from "lucide-react";

interface SensorNode {
  id: string;
  x: number; // Percentage X
  y: number; // Percentage Y
  metric: string;
  value: string;
  status: "normal" | "warning" | "critical";
}

export const DigitalTwinViewer = ({ machineId, sensors, isLoading }: { machineId: string, sensors?: SensorNode[], isLoading?: boolean }) => {
  if (isLoading) {
    return <Card className="animate-pulse h-[500px] flex items-center justify-center text-gray-500">Connecting to Digital Twin...</Card>;
  }

  return (
    <Card className="h-[500px] relative overflow-hidden bg-primary-bg p-0">
      {/* Background blueprint/schematic placeholder */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDIwaDQwTTIwIDB2NDAiIHN0cm9rZT0iIzM3NDE1MSIgc3Ryb2tlLXdpZHRoPSIuNSIvPjwvc3ZnPg==')] opacity-50"></div>
      
      {/* Machine Vector Placeholder */}
      <div className="absolute inset-20 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center">
        <span className="text-gray-600 font-bold uppercase tracking-[0.3em]">Machine Physical Asset Boundary</span>
      </div>

      {/* Sensor Overlays */}
      {sensors?.map((sensor) => (
        <div 
          key={sensor.id} 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
          style={{ left: `${sensor.x}%`, top: `${sensor.y}%` }}
        >
          {/* Node Blip */}
          <div className="relative flex items-center justify-center">
            <span className={`animate-ping absolute inline-flex h-4 w-4 rounded-full opacity-75 ${
              sensor.status === "critical" ? "bg-danger" : sensor.status === "warning" ? "bg-warning" : "bg-success"
            }`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${
              sensor.status === "critical" ? "bg-danger" : sensor.status === "warning" ? "bg-warning" : "bg-success"
            }`}></span>
          </div>

          {/* Hover Metric Panel */}
          <div className="absolute top-4 left-4 bg-secondary-bg border border-gray-700 p-2 rounded shadow-xl hidden group-hover:block z-10 w-32">
            <div className="flex items-center gap-1 text-xs font-bold text-white mb-1">
              <Activity size={12} className="text-accent" />
              {sensor.metric}
            </div>
            <div className="text-sm font-mono text-gray-300">{sensor.value}</div>
          </div>
        </div>
      ))}
      
      {/* HUD Controls */}
      <div className="absolute bottom-4 left-4 flex gap-2">
        <Badge variant="secondary">Live Telemetry Active</Badge>
        <Badge variant="info">Digital Twin Synced</Badge>
      </div>
    </Card>
  );
};
