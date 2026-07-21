import React, { useState } from "react";
import { AdvancedChart } from "@/components/analytics/AdvancedChart";
import { useFailureAnalytics } from "@/hooks/useAnalyticsQueries";
import { useOnboardingStore } from "@/store/onboarding";
import { AlertTriangle, Filter, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const FailureAnalyticsPage = () => {
  const [dateRange, setDateRange] = useState("30d");
  const { data: analytics, isLoading } = useFailureAnalytics(dateRange);
  const { hasDocuments } = useOnboardingStore();
  const navigate = useNavigate();

  const isEmpty = !hasDocuments && !analytics;
  const topFailures = analytics?.topFailures || [];
  const failureTrend = analytics?.trend || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="text-danger" /> Failure Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">Identify bottlenecks and recurring machine failures</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-secondary-bg border border-gray-700 text-gray-300 rounded hover:text-white transition-colors">
          <Filter size={14} /> Filter Dept/Line
        </button>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#111827] border border-gray-800 flex items-center justify-center mb-4">
            <AlertTriangle size={28} className="text-gray-600" />
          </div>
          <h3 className="text-white font-semibold text-sm mb-1">No Failure Data</h3>
          <p className="text-gray-500 text-xs max-w-xs mb-4">
            Upload maintenance records and failure reports to analyze failure patterns.
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
            title="Top Failures by Count" 
            type="bar" 
            data={topFailures} 
            series={[
              { key: "count", name: "Incident Count", color: "#ef4444" }
            ]} 
          />
          
          <AdvancedChart 
            title="Failure Trend by Severity" 
            type="area" 
            data={failureTrend} 
            series={[
              { key: "critical", name: "Critical", color: "#ef4444" },
              { key: "high", name: "High", color: "#f59e0b" },
              { key: "medium", name: "Medium", color: "#3b82f6" }
            ]} 
          />
        </div>
      )}
    </div>
  );
};
