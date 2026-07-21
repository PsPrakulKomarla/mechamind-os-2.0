import React from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { useSystemHealth } from "@/hooks/useAdminQueries";
import { ShieldCheck, Server, Users, Activity, Database, HardDrive, Cpu, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BaseAreaChart } from "@/components/ui/Charts";

const generateTrafficData = () =>
  Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    requests: Math.round(200 + Math.random() * 300),
    latency: Math.round(10 + Math.random() * 40),
  }));

export const AdminDashboardPage = () => {
  const { data: health, isLoading } = useSystemHealth();
  const trafficData = React.useMemo(() => generateTrafficData(), []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="text-info" /> Platform Administration
          </h1>
          <p className="text-sm text-gray-500 mt-1">Global settings, RBAC, and System Health</p>
        </div>
        <Badge variant="info">Admin</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={health?.totalUsers ?? "—"} trend={health?.totalUsers_trend} isLoading={isLoading} />
        <StatCard title="Active Sessions" value={health?.activeSessions ?? "—"} trend={health?.activeSessions_trend} isLoading={isLoading} />
        <StatCard title="System Uptime" value={health?.uptime ?? "—"} trend={health?.uptime_trend} isLoading={isLoading} />
        <StatCard title="Pending Audits" value={health?.pendingAudits ?? "—"} trend={health?.pendingAudits_trend} isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="text-accent" size={18} /> API Traffic & Latency (24h)
          </h3>
          <div className="h-64 mt-4">
            <BaseAreaChart 
              data={trafficData} 
              xAxisKey="time" 
              series={[{ key: "requests", name: "Requests/min", color: "#3B82F6" }]} 
              height={256}
            />
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Server className="text-info" size={18} /> Infrastructure Health
          </h3>
          <div className="space-y-4">
            {[
              { name: "PostgreSQL Database", status: "OK", latency: "12ms", pct: 25, color: "bg-success" },
              { name: "Redis Cache", status: "OK", latency: "2ms", pct: 15, color: "bg-success" },
              { name: "AI Inference Engine", status: "HIGH LOAD", latency: "84%", pct: 84, color: "bg-warning" },
              { name: "S3 Storage Bucket", status: "OK", latency: "4.2 TB", pct: 50, color: "bg-success" },
              { name: "Celery Workers", status: "OK", latency: "12 active", pct: 60, color: "bg-success" },
            ].map((item) => (
              <div key={item.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300 font-medium">{item.name}</span>
                  <span className={`font-mono text-xs ${item.color === "bg-warning" ? "text-warning" : "text-success"}`}>
                    {item.status} ({item.latency})
                  </span>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div className={`${item.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${item.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "User Management", desc: "Manage roles and permissions", icon: Users, path: "/admin/users" },
          { title: "Audit Logs", desc: "Review system activity", icon: RefreshCw, path: "/admin/audit-logs" },
          { title: "System Settings", desc: "Configure platform settings", icon: Cpu, path: "/admin/settings" },
        ].map((item) => (
          <a key={item.title} href={item.path} className="bg-secondary-bg border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <item.icon size={18} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-white group-hover:text-accent transition-colors">{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
