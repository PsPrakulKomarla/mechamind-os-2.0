import React, { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { useMachinesList } from "@/hooks/useAssetQueries";
import { Badge } from "@/components/ui/Badge";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { Search, Filter, Activity } from "lucide-react";
import { ResponsiveContainer, LineChart, Line } from "recharts";

// Generate a random sparkline for the machine
const generateSparkline = (base: number) => {
  return Array.from({ length: 20 }, (_, i) => ({
    name: i,
    value: base + (Math.random() - 0.5) * 15,
  }));
};

const Sparkline = ({ value, color }: { value: number, color: string }) => {
  const data = React.useMemo(() => generateSparkline(value), [value]);
  return (
    <div className="h-8 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const MachineListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: machines, isLoading } = useMachinesList({ search: searchTerm });

  const columns = [
    { header: "Serial Number", accessorKey: "serial_number", cell: (row: any) => <span className="font-mono text-xs">{row.serial_number || `SN-${row.id.substring(0,6)}`}</span> },
    { header: "Machine Name", accessorKey: "name", cell: (row: any) => <Link to={`/assets/machines/${row.id}`} className="text-accent hover:underline font-medium">{row.name}</Link> },
    { header: "Category", accessorKey: "category" },
    { header: "Live Telemetry", accessorKey: "telemetry", cell: (row: any) => (
       <div className="flex items-center gap-2">
         <Sparkline 
            value={row.health_score} 
            color={row.health_score > 80 ? "#10B981" : row.health_score > 50 ? "#F59E0B" : "#EF4444"} 
         />
       </div>
    )},
    { header: "Health", accessorKey: "health_score", cell: (row: any) => (
      <Badge variant={row.health_score > 80 ? "success" : row.health_score > 50 ? "warning" : "danger"}>
        {row.health_score}%
      </Badge>
    )},
    { header: "Status", accessorKey: "status", cell: (row: any) => (
      <Badge variant={row.status === "running" ? "success" : row.status === "stopped" ? "danger" : "warning"}>
        {row.status.toUpperCase()}
      </Badge>
    )}
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity size={24} className="text-[#3B82F6]" />
            Machine Directory & Live Monitoring
          </h1>
          <p className="text-sm text-gray-500 mt-1">Real-time status and telemetry for all factory assets</p>
        </div>
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

      <div className="bg-primary-bg rounded-lg border border-gray-800 overflow-hidden shadow-2xl">
         <DataTable columns={columns} data={machines || []} isLoading={isLoading} />
      </div>
    </div>
  );
};
