import React from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { useNetworkHealth } from "@/hooks/useIotQueries";
import { Activity, Wifi, Camera } from "lucide-react";
import { Link } from "react-router-dom";

export const LiveDashboardPage = () => {
  const { data: health, isLoading } = useNetworkHealth();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="text-accent animate-pulse" /> Live Operations Center
          </h1>
          <p className="text-sm text-gray-500 mt-1">Real-time factory floor monitoring</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Active Sensors" value={health?.activeSensors || "1,042"} trend={2.1} isLoading={isLoading} />
        <StatCard title="Live Cameras" value={health?.activeCameras || "48"} trend={0} isLoading={isLoading} />
        <StatCard title="Network Health" value={health?.networkHealth || "99.9%"} trend={0.1} isLoading={isLoading} />
        <StatCard title="Critical Alarms" value={health?.criticalAlarms || "2"} trend={-50} isLoading={isLoading} />
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

        <Link to="/assets/digital-twin" className="bg-secondary-bg border border-gray-800 hover:border-accent transition-colors rounded-lg p-6 flex flex-col items-center justify-center text-center group">
          <Activity size={48} className="text-gray-500 group-hover:text-accent transition-colors mb-4" />
          <h3 className="text-lg font-bold text-white">Digital Twin</h3>
          <p className="text-sm text-gray-400 mt-2">Interact with the 2D layout overlaying live telemetry data on machines.</p>
        </Link>
      </div>
    </div>
  );
};
