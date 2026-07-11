import React from "react";
import { InteractiveFactoryMap3D } from "@/components/digitaltwin/InteractiveFactoryMap3D";
import { MachineStatusCard } from "@/components/digitaltwin/MachineStatusCard";
import { useFactoryOverview } from "@/hooks/useDigitalTwinQueries";
import { MonitorPlay, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const DigitalTwinDashboardPage = () => {
  const { data: overview, isLoading } = useFactoryOverview();

  // Mock array if API is missing
  const machines = [
    { id: "M1", name: "Alpha Spindle", status: "healthy", healthScore: 92, operatingMode: "Production", activeAlarms: 0 },
    { id: "M2", name: "Beta Lathe", status: "warning", healthScore: 75, operatingMode: "Production", activeAlarms: 1 },
    { id: "M4", name: "Main Pump", status: "critical", healthScore: 41, operatingMode: "Maintenance", activeAlarms: 3 },
    { id: "M3", name: "Conveyor Belt", status: "healthy", healthScore: 98, operatingMode: "Idle", activeAlarms: 0 },
  ] as const;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <MonitorPlay className="text-accent" /> Digital Twin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">Real-time spatial visualization and machine health tracking</p>
        </div>
        <Link to="/digital-twin/explorer" className="flex items-center gap-2 px-4 py-2 bg-secondary-bg hover:bg-gray-800 border border-gray-700 text-white rounded font-medium transition-colors text-sm">
          Factory Explorer <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 3D Map Area */}
        <div className="xl:col-span-2 h-[500px]">
          <InteractiveFactoryMap3D />
        </div>

        {/* Live Event Feed / Alarms */}
        <div className="xl:col-span-1 border border-gray-800 bg-secondary-bg/20 rounded-lg overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b border-gray-800 font-bold text-white bg-secondary-bg/50">Live Event Feed</div>
          <div className="p-4 overflow-y-auto flex-1 space-y-4">
            <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-bold text-danger">CRITICAL ALARM</h4>
                <span className="text-xs text-gray-500">Just now</span>
              </div>
              <p className="text-sm text-gray-300">Main Pump (M4) vibration exceeded safety threshold (5.2 mm/s). Emergency shutoff protocol engaged.</p>
            </div>
            
            <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-bold text-warning">WARNING</h4>
                <span className="text-xs text-gray-500">2 min ago</span>
              </div>
              <p className="text-sm text-gray-300">Beta Lathe (M2) core temperature elevated. AI predicts bearing failure in 4 days if unchecked.</p>
            </div>

            <div className="p-3 bg-info/10 border border-info/30 rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-bold text-info">SYSTEM ALERT</h4>
                <span className="text-xs text-gray-500">15 min ago</span>
              </div>
              <p className="text-sm text-gray-300">Firmware update completed for Alpha Spindle (M1).</p>
            </div>
          </div>
        </div>
      </div>

      {/* Machine Cards */}
      <h2 className="text-xl font-bold text-white mt-8 mb-4">Monitored Equipment</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {machines.map((m) => (
          <MachineStatusCard key={m.id} {...m} />
        ))}
      </div>
    </div>
  );
};
