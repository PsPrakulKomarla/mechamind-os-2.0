import React from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { useMaintenanceDashboardStats } from "@/hooks/useMaintenanceQueries";

export const MaintenanceDashboardPage = () => {
  const { data: stats, isLoading } = useMaintenanceDashboardStats();

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
         {/* Placeholder for Analytics Charts */}
         <div className="bg-secondary-bg border border-gray-800 rounded-lg p-6 h-72 flex flex-col items-center justify-center">
            <span className="text-gray-500">Work Order Completion Trend Chart</span>
         </div>
         <div className="bg-secondary-bg border border-gray-800 rounded-lg p-6 h-72 flex flex-col items-center justify-center">
            <span className="text-gray-500">Top Repeating Failures Bar Chart</span>
         </div>
      </div>
    </div>
  );
};
