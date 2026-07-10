import React from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { useMachinesList } from "@/hooks/useAssetQueries";
import { Link } from "react-router-dom";

export const AssetDashboardPage = () => {
  const { data: machines, isLoading } = useMachinesList({});

  const columns = [
    { header: "ID", accessorKey: "id" },
    { header: "Machine Name", accessorKey: "name", cell: (row: any) => <Link to={`/assets/machines/${row.id}`} className="text-accent hover:underline font-medium">{row.name}</Link> },
    { header: "Category", accessorKey: "category" },
    { header: "Health Score", accessorKey: "health_score", cell: (row: any) => (
      <Badge variant={row.health_score > 80 ? "success" : row.health_score > 50 ? "warning" : "danger"}>
        {row.health_score}%
      </Badge>
    )},
    { header: "Status", accessorKey: "status", cell: (row: any) => (
      <Badge variant={row.status === "running" ? "success" : "secondary"}>
        {row.status}
      </Badge>
    )}
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight">Enterprise Asset Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Assets" value={machines?.length || "0"} isLoading={isLoading} />
        <StatCard title="Healthy Assets" value={machines?.filter((m: any) => m.health_score > 80).length || "0"} trend={2.4} isLoading={isLoading} />
        <StatCard title="Critical Assets" value={machines?.filter((m: any) => m.health_score <= 50).length || "0"} trend={-1.2} isLoading={isLoading} />
        <StatCard title="Maintenance Due" value="12" isLoading={isLoading} />
      </div>

      <div>
        <h2 className="text-lg font-bold text-white mb-4">Asset Directory</h2>
        <DataTable columns={columns} data={machines || []} isLoading={isLoading} />
      </div>
    </div>
  );
};
