import React from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/Badge";
import { useNetworkHealth, useAlarmFeed } from "@/hooks/useIotQueries";
import { Activity, Wifi, Camera, AlertTriangle, Bell } from "lucide-react";
import { Link } from "react-router-dom";

const mockAlarms = [
  { id: "alm-001", severity: "critical", message: "M-201 Bearing temp exceeded threshold (95°C)", sensor: "Temp-102", timestamp: "2 min ago", status: "active" },
  { id: "alm-002", severity: "warning", message: "C-401 Vibration anomaly detected on Drive End", sensor: "Vib-205", timestamp: "15 min ago", status: "active" },
  { id: "alm-003", severity: "info", message: "P-101 Pressure恢复正常", sensor: "Pres-301", timestamp: "1 hr ago", status: "acknowledged" },
];

export const LiveDashboardPage = () => {
  const { data: health, isLoading } = useNetworkHealth();
  const { data: alarms } = useAlarmFeed();

  const alarmList = alarms?.length ? alarms : mockAlarms;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="text-accent animate-pulse" /> Live Operations Center
          </h1>
          <p className="text-sm text-gray-500 mt-1">Real-time factory floor monitoring</p>
        </div>
        <Link to="/iot/alarms" className="flex items-center gap-2 px-3 py-1.5 bg-secondary-bg hover:bg-gray-800 border border-gray-700 text-white rounded text-sm transition-colors">
          <Bell size={14} /> View All Alarms
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Active Sensors" value={health?.activeSensors ?? 48} trend={health?.activeSensors_trend} isLoading={isLoading} />
        <StatCard title="Live Cameras" value={health?.activeCameras ?? 12} trend={health?.activeCameras_trend} isLoading={isLoading} />
        <StatCard title="Network Health" value={health?.networkHealth ?? "98.5%"} trend={health?.networkHealth_trend} isLoading={isLoading} />
        <StatCard title="Critical Alarms" value={health?.criticalAlarms ?? alarmList.filter((a: any) => a.severity === "critical").length} trend={health?.criticalAlarms_trend} isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <Link to="/iot/sensors" className="bg-secondary-bg border border-gray-800 hover:border-accent transition-colors rounded-lg p-6 flex flex-col items-center justify-center text-center group">
          <Wifi size={48} className="text-gray-500 group-hover:text-accent transition-colors mb-4" />
          <h3 className="text-lg font-bold text-white">Sensor Telemetry</h3>
          <p className="text-sm text-gray-400 mt-2">View live streaming charts and gauges for connected PLCs and gateways.</p>
        </Link>

        <Link to="/iot/vision" className="bg-secondary-bg border border-gray-800 hover:border-accent transition-colors rounded-lg p-6 flex flex-col items-center justify-center text-center group">
          <Camera size={48} className="text-gray-500 group-hover:text-accent transition-colors mb-4" />
          <h3 className="text-lg font-bold text-white">Vision AI</h3>
          <p className="text-sm text-gray-400 mt-2">Monitor camera grids with real-time bounding box defect detection.</p>
        </Link>

        <Link to="/digital-twin" className="bg-secondary-bg border border-gray-800 hover:border-accent transition-colors rounded-lg p-6 flex flex-col items-center justify-center text-center group">
          <Activity size={48} className="text-gray-500 group-hover:text-accent transition-colors mb-4" />
          <h3 className="text-lg font-bold text-white">Digital Twin</h3>
          <p className="text-sm text-gray-400 mt-2">Interact with the 2D layout overlaying live telemetry data on machines.</p>
        </Link>
      </div>

      {alarmList.length > 0 && (
        <div className="bg-secondary-bg border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2"><Bell size={18} className="text-warning" /> Recent Alarms</h2>
            <Link to="/iot/alarms" className="text-sm text-accent hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-gray-500 uppercase border-b border-gray-800">
                  <th className="pb-3 font-semibold">Severity</th>
                  <th className="pb-3 font-semibold">Message</th>
                  <th className="pb-3 font-semibold">Sensor</th>
                  <th className="pb-3 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {alarmList.slice(0, 5).map((alarm: any) => (
                  <tr key={alarm.id} className="text-sm hover:bg-secondary-bg/50 transition-colors">
                    <td className="py-3 pr-4">
                      <Badge variant={alarm.severity === "critical" ? "danger" : alarm.severity === "warning" ? "warning" : "info"} className="text-[10px] py-0">
                        <AlertTriangle size={10} className="inline mr-1" />{alarm.severity}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-gray-300">{alarm.message}</td>
                    <td className="py-3 pr-4 text-gray-500 font-mono text-xs">{alarm.sensor}</td>
                    <td className="py-3 text-gray-500 text-xs">{alarm.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
