import React, { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { useMachinesList } from "@/hooks/useAssetQueries";
import { Badge } from "@/components/ui/Badge";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { Search, Filter } from "lucide-react";

export const MachineListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: machines, isLoading } = useMachinesList({ search: searchTerm });

  const columns = [
    { header: "Serial Number", accessorKey: "serial_number", cell: (row: any) => <span className="font-mono text-xs">{row.serial_number || `SN-${row.id.substring(0,6)}`}</span> },
    { header: "Machine Name", accessorKey: "name", cell: (row: any) => <Link to={`/assets/machines/${row.id}`} className="text-accent hover:underline font-medium">{row.name}</Link> },
    { header: "Category", accessorKey: "category" },
    { header: "Manufacturer", accessorKey: "manufacturer", cell: () => "Siemens" },
    { header: "Health", accessorKey: "health_score", cell: (row: any) => (
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
        <h1 className="text-2xl font-bold text-white tracking-tight">Machine Directory</h1>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-500" />
          </div>
          <Input 
            type="text" 
            placeholder="Search by machine name, serial number, or QR..." 
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary-bg border border-gray-800 rounded-md text-sm text-gray-300 hover:text-white transition-colors">
          <Filter size={16} /> Filters
        </button>
      </div>

      <DataTable columns={columns} data={machines || []} isLoading={isLoading} />
    </div>
  );
};
