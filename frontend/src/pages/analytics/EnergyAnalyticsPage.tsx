import React, { useState } from "react";
import { AdvancedChart } from "@/components/analytics/AdvancedChart";
import { useEnergyAnalytics } from "@/hooks/useAnalyticsQueries";
import { Zap, Filter } from "lucide-react";

export const EnergyAnalyticsPage = () => {
  const [dateRange, setDateRange] = useState("7d");
  const { data: analytics, isLoading } = useEnergyAnalytics(dateRange);

  const powerTrend = analytics?.powerTrend || [
    { name: "Mon", consumption: 4200, peak: 5100 },
    { name: "Tue", consumption: 4500, peak: 5300 },
    { name: "Wed", consumption: 4100, peak: 4900 },
    { name: "Thu", consumption: 4800, peak: 5600 },
    { name: "Fri", consumption: 4600, peak: 5400 },
  ];

  const deptComparison = analytics?.dept || [
    { name: "Stamping", usage: 45 },
    { name: "Assembly", usage: 30 },
    { name: "Packaging", usage: 15 },
    { name: "Office", usage: 10 },
  ];

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
    </div>
  );
};
