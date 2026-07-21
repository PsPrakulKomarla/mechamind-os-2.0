import React, { useState } from "react";
import { KpiCard } from "@/components/analytics/KpiCard";
import { AdvancedChart } from "@/components/analytics/AdvancedChart";
import { useExecutiveKpis } from "@/hooks/useAnalyticsQueries";
import { useOnboardingStore } from "@/store/onboarding";
import { Filter, Calendar, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ExecutiveDashboardPage = () => {
  const [dateRange, setDateRange] = useState("30d");
  const { data: kpis, isLoading } = useExecutiveKpis({ range: dateRange });
  const { hasDocuments } = useOnboardingStore();
  const navigate = useNavigate();

  const isEmpty = !hasDocuments && !kpis;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-800 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Executive Intelligence</h1>
          <p className="text-sm text-gray-500 mt-1">C-Suite overview of operational performance</p>
        </div>
        
        {!isEmpty && (
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
        )}
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#111827] border border-gray-800 flex items-center justify-center mb-4">
            <BarChart3 size={28} className="text-gray-600" />
          </div>
          <h3 className="text-white font-semibold text-sm mb-1">No Analytics Data</h3>
          <p className="text-gray-500 text-xs max-w-xs mb-4">Upload documents or load demo data to see executive analytics.</p>
          <button
            onClick={() => navigate("/onboarding")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs font-medium hover:bg-[#3B82F6]/15 transition-colors"
          >
            Setup Data
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <KpiCard title="Overall OEE" value={kpis?.oee ?? "—"} trend={kpis?.oee_trend} target={kpis?.oee_target} sparklineData={kpis?.oee_sparkline} color="accent" isLoading={isLoading} />
            <KpiCard title="MTTR" value={kpis?.mttr ?? "—"} trend={kpis?.mttr_trend} target={kpis?.mttr_target} sparklineData={kpis?.mttr_sparkline} color="success" isLoading={isLoading} />
            <KpiCard title="Carbon Emissions" value={kpis?.emissions ?? "—"} trend={kpis?.emissions_trend} target={kpis?.emissions_target} sparklineData={kpis?.emissions_sparkline} color="info" isLoading={isLoading} />
            <KpiCard title="AI Cost Savings" value={kpis?.cost_savings ?? "—"} trend={kpis?.cost_savings_trend} target={kpis?.cost_savings_target} sparklineData={kpis?.cost_savings_sparkline} color="warning" isLoading={isLoading} />
          </div>

          {kpis?.oeeHistory && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AdvancedChart 
                title="OEE Breakdown (Availability vs Performance)" 
                type="area" 
                data={kpis.oeeHistory} 
                series={[
                  { key: "availability", name: "Availability %", color: "#3b82f6" },
                  { key: "performance", name: "Performance %", color: "#14F195" }
                ]} 
              />
              
              {kpis.maintenanceCosts && (
                <AdvancedChart 
                  title="Maintenance Cost Shift (Reactive vs Predictive)" 
                  type="bar" 
                  data={kpis.maintenanceCosts} 
                  series={[
                    { key: "reactive", name: "Reactive Cost ($)", color: "#ef4444" },
                    { key: "predictive", name: "Predictive Cost ($)", color: "#f59e0b" }
                  ]} 
                />
              )}
            </div>
          )}

          {kpis?.emissionsByFactory && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <AdvancedChart 
                  title="Emissions by Factory" 
                  type="pie" 
                  data={kpis.emissionsByFactory} 
                  series={[
                    { key: "emissions", name: "Emissions", color: "#3b82f6" },
                  ]} 
                />
              </div>
              {kpis.factoryRadar && (
                <div className="lg:col-span-2">
                  <AdvancedChart 
                    title="Factory Performance Radar" 
                    type="radar" 
                    data={kpis.factoryRadar.data} 
                    xAxisKey={kpis.factoryRadar.xAxisKey}
                    series={kpis.factoryRadar.series} 
                  />
                </div>
              )}
            </div>
          )}

          {!kpis?.oeeHistory && (
            <div className="bg-secondary-bg border border-gray-800 rounded-xl p-8 text-center">
              <p className="text-gray-500 text-sm">Analytics charts will appear once data is available.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
