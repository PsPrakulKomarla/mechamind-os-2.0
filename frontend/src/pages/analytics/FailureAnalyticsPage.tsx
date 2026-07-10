import React, { useState } from "react";
import { AdvancedChart } from "@/components/analytics/AdvancedChart";
import { useFailureAnalytics } from "@/hooks/useAnalyticsQueries";
import { AlertTriangle, Filter } from "lucide-react";

export const FailureAnalyticsPage = () => {
  const [dateRange, setDateRange] = useState("30d");
  const { data: analytics, isLoading } = useFailureAnalytics(dateRange);

  const topFailures = analytics?.topFailures || [
    { name: "Spindle Bearing Wear", count: 42 },
    { name: "Motor Overheat", count: 35 },
    { name: "Sensor Calibration", count: 28 },
    { name: "Belt Slippage", count: 18 },
  ];

  const failureTrend = analytics?.trend || [
    { name: "Week 1", critical: 2, high: 5, medium: 12 },
    { name: "Week 2", critical: 1, high: 4, medium: 15 },
    { name: "Week 3", critical: 3, high: 2, medium: 10 },
    { name: "Week 4", critical: 0, high: 3, medium: 8 },
  ];

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
    </div>
  );
};
