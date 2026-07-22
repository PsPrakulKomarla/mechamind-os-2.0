import React from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useMaintenanceDashboardStats, useWorkOrdersList } from "@/hooks/useMaintenanceQueries";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Wrench, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const mockWorkOrders = [
  { id: "WO-2026-001", title: "Replace primary spindle bearing", machine: "Stamping Press M-201", priority: "Critical", status: "In Progress", dueDate: "2026-07-25" },
  { id: "WO-2026-002", title: "Hydraulic fluid flush & filter replacement", machine: "Injection Molder M-103", priority: "High", status: "Open", dueDate: "2026-07-28" },
  { id: "WO-2026-003", title: "Calibrate torque sensors", machine: "Assembly Line A-5", priority: "Medium", status: "Open", dueDate: "2026-08-01" },
];

export const MaintenanceDashboardPage = () => {
  const { data: stats, isLoading } = useMaintenanceDashboardStats();
  const { data: woData } = useWorkOrdersList({ limit: 5 });

  const workOrders = woData?.items || woData || mockWorkOrders;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Maintenance Management</h1>
          <p className="text-sm text-gray-500 mt-1">CMMS Overview & Key Metrics</p>
        </div>
        <Link to="/maintenance/work-orders" className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded text-sm font-bold hover:bg-accent/90 transition-colors">
          Work Orders <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Open Work Orders" value={stats?.openWos ?? workOrders.filter((w: any) => w.status === "Open" || w.status === "In Progress").length} trend={stats?.openWos_trend} isLoading={isLoading} />
        <StatCard title="Critical Backlog" value={stats?.criticalWos ?? workOrders.filter((w: any) => w.priority === "Critical").length} trend={stats?.criticalWos_trend} isLoading={isLoading} />
        <StatCard title="MTTR (Hours)" value={stats?.mttr ?? "6.2"} trend={stats?.mttr_trend} isLoading={isLoading} />
        <StatCard title="MTBF (Days)" value={stats?.mtbf ?? "42"} trend={stats?.mtbf_trend} isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <h3 className="text-sm font-bold text-white mb-4">Work Order Completion Trend</h3>
          {stats?.completionHistory ? (
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
          ) : (
            <div className="h-56 flex items-center justify-center text-gray-500 text-sm">
              No completion data available
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-sm font-bold text-white mb-4">Top Repeating Failures</h3>
          {stats?.failureBreakdown ? (
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
          ) : (
            <div className="h-56 flex items-center justify-center text-gray-500 text-sm">
              No failure data available
            </div>
          )}
        </Card>
      </div>

      {workOrders.length > 0 && (
        <div className="bg-secondary-bg border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Work Orders</h2>
            <Link to="/maintenance/work-orders" className="text-sm text-accent hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-gray-500 uppercase border-b border-gray-800">
                  <th className="pb-3 font-semibold">WO</th>
                  <th className="pb-3 font-semibold">Title</th>
                  <th className="pb-3 font-semibold">Machine</th>
                  <th className="pb-3 font-semibold">Priority</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {workOrders.slice(0, 5).map((wo: any) => (
                  <tr key={wo.id} className="text-sm hover:bg-secondary-bg/50 transition-colors">
                    <td className="py-3 pr-4 text-gray-500 font-mono text-xs">{wo.id}</td>
                    <td className="py-3 pr-4">
                      <Link to={`/maintenance/work-orders/${wo.id}`} className="text-accent hover:underline font-medium">{wo.title}</Link>
                    </td>
                    <td className="py-3 pr-4 text-gray-400">{wo.machine}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={wo.priority === "Critical" ? "danger" : wo.priority === "High" ? "warning" : "info"} className="text-[10px] py-0">{wo.priority}</Badge>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={wo.status === "In Progress" ? "warning" : "secondary"} className="text-[10px] py-0">{wo.status}</Badge>
                    </td>
                    <td className="py-3 text-gray-500 text-xs">{wo.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
