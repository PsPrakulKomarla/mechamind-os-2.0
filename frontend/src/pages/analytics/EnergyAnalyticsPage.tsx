import React, { useState } from "react";
import { AdvancedChart } from "@/components/analytics/AdvancedChart";
import { useEnergyAnalytics } from "@/hooks/useAnalyticsQueries";
import { useOnboardingStore } from "@/store/onboarding";
import { Zap, Filter, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const EnergyAnalyticsPage = () => {
  const [dateRange, setDateRange] = useState("7d");
  const { data: analytics, isLoading } = useEnergyAnalytics(dateRange);
  const { hasDocuments } = useOnboardingStore();
  const navigate = useNavigate();

  const isEmpty = !hasDocuments && !analytics;
  const powerTrend = analytics?.powerTrend || [];
  const deptComparison = analytics?.dept || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Zap className="text-info" /> Energy Analytics & ESG
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track power consumption and carbon footprint</p>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#111827] border border-gray-800 flex items-center justify-center mb-4">
            <Zap size={28} className="text-gray-600" />
          </div>
          <h3 className="text-white font-semibold text-sm mb-1">No Energy Data</h3>
          <p className="text-gray-500 text-xs max-w-xs mb-4">
            Connect IoT sensors or upload energy reports to visualize consumption patterns.
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdvancedChart 
            title="Weekly Power Consumption vs Peak Demand (kW)" 
            type="line" 
            data={powerTrend} 
            series={[
              { key: "consumption", name: "Avg Consumption", color: "#14F195" },
              { key: "peak", name: "Peak Demand", color: "#ef4444" }
            ]} 
          />
          
          <AdvancedChart 
            title="Energy Usage by Department (%)" 
            type="pie" 
            data={deptComparison} 
            series={[
              { key: "usage", name: "Usage %", color: "#3b82f6" },
              { key: "usage", name: "Usage %", color: "#14F195" },
              { key: "usage", name: "Usage %", color: "#f59e0b" },
              { key: "usage", name: "Usage %", color: "#64748b" }
            ]} 
          />
        </div>
      )}
    </div>
  );
};
