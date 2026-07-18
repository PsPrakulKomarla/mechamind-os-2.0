import React from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/Card";
import { useMaintenanceDashboardStats } from "@/hooks/useMaintenanceQueries";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export const MaintenanceDashboardPage = () => {
  const { data: stats, isLoading } = useMaintenanceDashboardStats();

  const completionData = [
    { month: "Jan", completed: 28, opened: 32 },
    { month: "Feb", completed: 35, opened: 30 },
    { month: "Mar", completed: 42, opened: 38 },
    { month: "Apr", completed: 38, opened: 40 },
    { month: "May", completed: 45, opened: 36 },
    { month: "Jun", completed: 50, opened: 42 },
  ];

  const failureData = [
    { name: "Bearing Wear", count: 18 },
    { name: "Lubrication", count: 14 },
    { name: "Overheating", count: 11 },
    { name: "Misalignment", count: 9 },
    { name: "Electrical", count: 7 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Maintenance Management</h1>
          <p className="text-sm text-gray-500 mt-1">CMMS Overview & Key Metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Open Work Orders" value={stats?.openWos || "42"} trend={-5} isLoading={isLoading} />
        <StatCard title="Critical Backlog" value={stats?.criticalWos || "3"} trend={0} isLoading={isLoading} />
        <StatCard title="MTTR (Hours)" value={stats?.mttr || "4.2"} trend={-12.5} isLoading={isLoading} />
        <StatCard title="MTBF (Days)" value={stats?.mtbf || "142"} trend={8.1} isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <h3 className="text-sm font-bold text-white mb-4">Work Order Completion Trend</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={completionData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
        <Card>
          <h3 className="text-sm font-bold text-white mb-4">Top Repeating Failures</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={failureData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
      </div>
    </div>
  );
};
