import React from "react";
import { KPIWidget } from "@/components/production/KPIWidget";
import { JobQueue } from "@/components/production/JobQueue";
import { Activity, Zap, TrendingUp, AlertOctagon, Upload } from "lucide-react";
import { useOnboardingStore } from "@/store/onboarding";
import { useNavigate } from "react-router-dom";

export const OperationsDashboardPage: React.FC = () => {
  const { hasDocuments } = useOnboardingStore();
  const navigate = useNavigate();
  const isEmpty = !hasDocuments;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Production Operations</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time factory floor performance and job tracking</p>
        </div>
        <div className="text-xs text-gray-500 font-mono bg-card-bg px-3 py-1.5 rounded-md border border-gray-800">
          {new Date().toLocaleTimeString()}
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#111827] border border-gray-800 flex items-center justify-center mb-4">
            <Activity size={28} className="text-gray-600" />
          </div>
          <h3 className="text-white font-semibold text-sm mb-1">No Production Data</h3>
          <p className="text-gray-500 text-xs max-w-xs mb-4">
            Upload production reports and IoT data to see real-time OEE and job tracking.
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <KPIWidget 
              title="Overall Equipment Effectiveness" 
              value="—" 
              unit="%" 
              icon={Activity} 
            />
            <KPIWidget 
              title="Current Power Draw" 
              value="—" 
              unit="kW" 
              icon={Zap} 
            />
            <KPIWidget 
              title="Units Produced" 
              value="—" 
              icon={TrendingUp} 
            />
            <KPIWidget 
              title="Active Alerts" 
              value="—" 
              icon={AlertOctagon} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-card-bg border border-gray-800 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-400 mb-4">OEE Trend — Today</h3>
                <div className="h-[280px] flex items-center justify-center text-gray-500 text-sm">
                  OEE data will appear after processing production data.
                </div>
              </div>
            </div>
            <div>
              <JobQueue jobs={[]} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
