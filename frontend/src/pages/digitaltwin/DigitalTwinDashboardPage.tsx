import React from "react";
import { InteractiveFactoryMap3D } from "@/components/digitaltwin/InteractiveFactoryMap3D";
import { MachineStatusCard } from "@/components/digitaltwin/MachineStatusCard";
import { useFactoryOverview } from "@/hooks/useDigitalTwinQueries";
import { useOnboardingStore } from "@/store/onboarding";
import { MonitorPlay, ArrowRight, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const DigitalTwinDashboardPage = () => {
  const { data: overview, isLoading } = useFactoryOverview();
  const { hasDocuments } = useOnboardingStore();
  const navigate = useNavigate();

  const isEmpty = !hasDocuments && (!overview || !overview.machines || overview.machines.length === 0);
  const machines = overview?.machines || [];

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

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#111827] border border-gray-800 flex items-center justify-center mb-4">
            <MonitorPlay size={28} className="text-gray-600" />
          </div>
          <h3 className="text-white font-semibold text-sm mb-1">No Digital Twin Data</h3>
          <p className="text-gray-500 text-xs max-w-xs mb-4">
            Upload machine configurations and IoT data to build the digital twin.
          </p>
          <button
            onClick={() => navigate("/onboarding")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs font-medium hover:bg-[#3B82F6]/15 transition-colors"
          >
            <Upload size={12} />
            Upload Documents
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* 3D Map Area */}
            <div className="xl:col-span-2 h-[500px]">
              <InteractiveFactoryMap3D />
            </div>

            {/* Live Event Feed / Alarms */}
            <div className="xl:col-span-1 border border-gray-800 bg-secondary-bg/20 rounded-lg overflow-hidden flex flex-col h-[500px]">
              <div className="p-4 border-b border-gray-800 font-bold text-white bg-secondary-bg/50">Live Event Feed</div>
              <div className="p-4 overflow-y-auto flex-1 space-y-4">
                {overview?.events && overview.events.length > 0 ? (
                  overview.events.map((event: any, i: number) => (
                    <div key={i} className={`p-3 rounded-lg border ${
                      event.severity === "critical" ? "bg-danger/10 border-danger/30" :
                      event.severity === "warning" ? "bg-warning/10 border-warning/30" :
                      "bg-info/10 border-info/30"
                    }`}>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm font-bold ${
                          event.severity === "critical" ? "text-danger" :
                          event.severity === "warning" ? "text-warning" : "text-info"
                        }`}>{event.title || "EVENT"}</h4>
                        <span className="text-xs text-gray-500">{event.time || ""}</span>
                      </div>
                      <p className="text-sm text-gray-300">{event.message || ""}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 text-sm py-8">No recent events</div>
                )}
              </div>
            </div>
          </div>

          {/* Machine Cards */}
          {machines.length > 0 && (
            <>
              <h2 className="text-xl font-bold text-white mt-8 mb-4">Monitored Equipment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {machines.map((m: any) => (
                  <MachineStatusCard key={m.id} {...m} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
