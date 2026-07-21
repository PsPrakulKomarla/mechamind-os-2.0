import React from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/Card";
import { useMaintenanceDashboardStats } from "@/hooks/useMaintenanceQueries";
import { useOnboardingStore } from "@/store/onboarding";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Wrench, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MaintenanceDashboardPage = () => {
  const { data: stats, isLoading } = useMaintenanceDashboardStats();
  const { hasDocuments } = useOnboardingStore();
  const navigate = useNavigate();

  const isEmpty = !hasDocuments && !stats;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Maintenance Management</h1>
          <p className="text-sm text-gray-500 mt-1">CMMS Overview & Key Metrics</p>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#111827] border border-gray-800 flex items-center justify-center mb-4">
            <Wrench size={28} className="text-gray-600" />
          </div>
          <h3 className="text-white font-semibold text-sm mb-1">No Maintenance Data</h3>
          <p className="text-gray-500 text-xs max-w-xs mb-4">Upload maintenance records or load demo data to see metrics.</p>
          <button
            onClick={() => navigate("/onboarding")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs font-medium hover:bg-[#3B82F6]/15 transition-colors"
          >
            <Upload size={12} />
            Setup Data
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard title="Open Work Orders" value={stats?.openWos ?? "—"} trend={stats?.openWos_trend} isLoading={isLoading} />
            <StatCard title="Critical Backlog" value={stats?.criticalWos ?? "—"} trend={stats?.criticalWos_trend} isLoading={isLoading} />
            <StatCard title="MTTR (Hours)" value={stats?.mttr ?? "—"} trend={stats?.mttr_trend} isLoading={isLoading} />
            <StatCard title="MTBF (Days)" value={stats?.mtbf ?? "—"} trend={stats?.mtbf_trend} isLoading={isLoading} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {stats?.completionHistory ? (
              <Card>
                <h3 className="text-sm font-bold text-white mb-4">Work Order Completion Trend</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.completionHistory} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="openedGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
                      <YAxis stroke="#6b7280" fontSize={11} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "6px" }}
                        labelStyle={{ color: "#9ca3af" }}
                      />
                      <Area type="monotone" dataKey="completed" stroke="#10b981" fill="url(#completedGrad)" strokeWidth={2} />
                      <Area type="monotone" dataKey="opened" stroke="#6366f1" fill="url(#openedGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            ) : (
              <Card>
                <h3 className="text-sm font-bold text-white mb-4">Work Order Completion Trend</h3>
                <div className="h-56 flex items-center justify-center text-gray-500 text-sm">
                  No completion data available
                </div>
              </Card>
            )}

            {stats?.failureBreakdown ? (
              <Card>
                <h3 className="text-sm font-bold text-white mb-4">Top Repeating Failures</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.failureBreakdown} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
                      <YAxis stroke="#6b7280" fontSize={11} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "6px" }}
                        labelStyle={{ color: "#9ca3af" }}
                      />
                      <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            ) : (
              <Card>
                <h3 className="text-sm font-bold text-white mb-4">Top Repeating Failures</h3>
                <div className="h-56 flex items-center justify-center text-gray-500 text-sm">
                  No failure data available
                </div>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
};
