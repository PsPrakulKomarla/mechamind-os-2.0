import React, { useState } from "react";
import { KpiCard } from "@/components/analytics/KpiCard";
import { AdvancedChart } from "@/components/analytics/AdvancedChart";
import { useExecutiveKpis } from "@/hooks/useAnalyticsQueries";
import { Filter, Calendar } from "lucide-react";

export const ExecutiveDashboardPage = () => {
  const [dateRange, setDateRange] = useState("30d");
  const { data: kpis, isLoading } = useExecutiveKpis({ range: dateRange });

  // Mocks for charts
  const oeeTrend = [
    { name: "Mon", oee: 82, availability: 90, performance: 85 },
    { name: "Tue", oee: 84, availability: 92, performance: 86 },
    { name: "Wed", oee: 79, availability: 85, performance: 82 },
    { name: "Thu", oee: 85, availability: 94, performance: 88 },
    { name: "Fri", oee: 88, availability: 95, performance: 90 },
  ];

  const emissionsData = [
    { name: "Factory A", emissions: 450 },
    { name: "Factory B", emissions: 320 },
    { name: "Factory C", emissions: 210 },
  ];

  const maintenanceCosts = [
    { name: "Jan", predictive: 12000, reactive: 45000 },
    { name: "Feb", predictive: 15000, reactive: 38000 },
    { name: "Mar", predictive: 18000, reactive: 25000 },
    { name: "Apr", predictive: 22000, reactive: 15000 }, // showing predictive lowering reactive costs
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-800 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Executive Intelligence</h1>
          <p className="text-sm text-gray-500 mt-1">C-Suite overview of operational performance</p>
        </div>
        
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-secondary-bg border border-gray-700 rounded px-3 py-1.5 text-sm">
            <Calendar size={14} className="text-gray-400" />
            <select 
              className="bg-transparent text-white outline-none"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last Quarter</option>
              <option value="1y">YTD</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-secondary-bg border border-gray-700 text-gray-300 rounded hover:text-white transition-colors">
            <Filter size={14} /> Global Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard title="Overall OEE" value="84.2%" trend={2.4} target="85.0%" sparklineData={[78, 80, 79, 82, 81, 84, 84.2]} color="accent" isLoading={isLoading} />
        <KpiCard title="MTTR" value="3.1 hrs" trend={-15.2} target="< 4.0 hrs" sparklineData={[4.5, 4.2, 4.0, 3.8, 3.5, 3.2, 3.1]} color="success" isLoading={isLoading} />
        <KpiCard title="Carbon Emissions" value="980t" trend={-5.4} target="1200t limit" sparklineData={[1100, 1050, 1020, 1000, 990, 985, 980]} color="info" isLoading={isLoading} />
        <KpiCard title="AI Cost Savings" value="$142K" trend={12.5} target="$100K" sparklineData={[20, 45, 60, 90, 110, 130, 142]} color="warning" isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdvancedChart 
          title="OEE Breakdown (Availability vs Performance)" 
          type="area" 
          data={oeeTrend} 
          series={[
            { key: "availability", name: "Availability %", color: "#3b82f6" },
            { key: "performance", name: "Performance %", color: "#14F195" }
          ]} 
        />
        
        <AdvancedChart 
          title="Maintenance Cost Shift (Reactive vs Predictive)" 
          type="bar" 
          data={maintenanceCosts} 
          series={[
            { key: "reactive", name: "Reactive Cost ($)", color: "#ef4444" },
            { key: "predictive", name: "Predictive Cost ($)", color: "#f59e0b" }
          ]} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AdvancedChart 
            title="Emissions by Factory" 
            type="pie" 
            data={emissionsData} 
            series={[
              { key: "emissions", name: "Emissions", color: "#3b82f6" },
              { key: "emissions", name: "Emissions", color: "#14F195" },
              { key: "emissions", name: "Emissions", color: "#f59e0b" }
            ]} 
          />
        </div>
        <div className="lg:col-span-2">
           <AdvancedChart 
            title="Factory Performance Radar" 
            type="radar" 
            data={[
              { subject: 'Quality', A: 120, B: 110, fullMark: 150 },
              { subject: 'Speed', A: 98, B: 130, fullMark: 150 },
              { subject: 'Uptime', A: 86, B: 130, fullMark: 150 },
              { subject: 'Safety', A: 99, B: 100, fullMark: 150 },
              { subject: 'Efficiency', A: 85, B: 90, fullMark: 150 },
            ]} 
            xAxisKey="subject"
            series={[
              { key: "A", name: "Factory Alpha", color: "#14F195" },
              { key: "B", name: "Factory Beta", color: "#3b82f6" }
            ]} 
          />
        </div>
      </div>
    </div>
  );
};
