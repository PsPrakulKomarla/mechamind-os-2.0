import React from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { AiInsightsPanel } from "@/components/dashboard/AiInsightsPanel";
import { LiveAlertCenter } from "@/components/dashboard/LiveAlertCenter";
import { PerformanceLineChart, EnergyAreaChart } from "@/components/dashboard/DashboardCharts";
import { useExecutiveKPIs, useAiInsights, useLiveAlerts, usePerformanceCharts } from "@/hooks/useDashboardQueries";

export const ExecutiveDashboardPage = () => {
  const { data: kpis, isLoading: kpiLoading } = useExecutiveKPIs();
  const { data: insights, isLoading: insightsLoading } = useAiInsights();
  const { data: alerts, isLoading: alertsLoading } = useLiveAlerts();
  const { data: charts, isLoading: chartsLoading } = usePerformanceCharts();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight">Executive Dashboard</h1>
        <div className="text-xs text-gray-500 font-mono">Last updated: {new Date().toLocaleTimeString()}</div>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Overall OEE" value={`${kpis?.oee || "0"}%`} trend={kpis?.oee_trend} trendLabel="vs last month" isLoading={kpiLoading} />
        <StatCard title="Active Work Orders" value={kpis?.work_orders || "0"} trend={-2} trendLabel="vs last week" isLoading={kpiLoading} />
        <StatCard title="Total Machines" value={kpis?.total_machines || "0"} isLoading={kpiLoading} />
        <StatCard title="Compliance Score" value={`${kpis?.compliance_score || "0"}%`} trend={1.5} trendLabel="vs last quarter" isLoading={kpiLoading} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceLineChart data={charts?.oee_history} isLoading={chartsLoading} />
        <EnergyAreaChart data={charts?.energy_history} isLoading={chartsLoading} />
      </div>

      {/* Intelligence Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
        <div className="lg:col-span-2 h-full">
          <AiInsightsPanel insights={insights} isLoading={insightsLoading} />
        </div>
        <div className="h-full">
          <LiveAlertCenter alerts={alerts} isLoading={alertsLoading} />
        </div>
      </div>
    </div>
  );
};
