import React from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { useDocumentDashboardStats } from "@/hooks/useDocumentQueries";

export const DocumentDashboardPage = () => {
  const { data: stats, isLoading } = useDocumentDashboardStats();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Document Intelligence</h1>
          <p className="text-sm text-gray-500 mt-1">Enterprise Library & OCR Processing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Documents" value={stats?.total || "1,492"} trend={5.2} isLoading={isLoading} />
        <StatCard title="Pending Review" value={stats?.pending || "24"} trend={-1.5} isLoading={isLoading} />
        <StatCard title="OCR Success Rate" value={`${stats?.ocrRate || "99.2"}%`} trend={0.1} isLoading={isLoading} />
        <StatCard title="Knowledge Nodes" value={stats?.nodes || "18,401"} trend={12.4} isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
         {/* Placeholder for Analytics Charts requested in the prompt */}
         <div className="bg-secondary-bg border border-gray-800 rounded-lg p-6 h-72 flex flex-col items-center justify-center">
            <span className="text-gray-500">Uploads Over Time (Chart Component)</span>
         </div>
         <div className="bg-secondary-bg border border-gray-800 rounded-lg p-6 h-72 flex flex-col items-center justify-center">
            <span className="text-gray-500">Category Distribution (Chart Component)</span>
         </div>
      </div>
    </div>
  );
};
