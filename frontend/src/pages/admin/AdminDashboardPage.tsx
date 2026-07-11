import React from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { useSystemHealth } from "@/hooks/useAdminQueries";
import { ShieldCheck, Server, Users, Activity } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const AdminDashboardPage = () => {
  const { data: health, isLoading } = useSystemHealth();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="text-info" /> Platform Administration
          </h1>
          <p className="text-sm text-gray-500 mt-1">Global settings, RBAC, and System Health</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={health?.totalUsers || "1,248"} trend={5} isLoading={isLoading} />
        <StatCard title="Active Sessions" value={health?.activeSessions || "342"} trend={12} isLoading={isLoading} />
        <StatCard title="System Uptime" value={health?.uptime || "99.99%"} trend={0} isLoading={isLoading} />
        <StatCard title="Pending Audits" value={health?.pendingAudits || "0"} trend={0} isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <Card className="lg:col-span-2">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="text-accent" size={18} /> API Traffic & Latency
          </h3>
          <div className="h-64 flex items-center justify-center border border-gray-800 border-dashed rounded bg-secondary-bg/30 text-gray-500">
            [Timeseries Chart: Requests per minute / Avg Latency]
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Server className="text-info" size={18} /> Infrastructure Health
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300 font-medium">PostgreSQL Database</span>
                <span className="text-success font-mono">OK (12ms)</span>
              </div>
              <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-success w-1/3 h-full"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300 font-medium">Redis Cache</span>
                <span className="text-success font-mono">OK (2ms)</span>
              </div>
              <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-success w-1/4 h-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300 font-medium">AI Inference Engine</span>
                <span className="text-warning font-mono">HIGH LOAD (84%)</span>
              </div>
              <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-warning w-[84%] h-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300 font-medium">S3 Storage Bucket</span>
                <span className="text-success font-mono">OK (4.2 TB)</span>
              </div>
              <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-success w-1/2 h-full"></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
