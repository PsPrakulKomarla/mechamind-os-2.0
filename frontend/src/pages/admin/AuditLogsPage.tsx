import React from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { useAuditLogs } from "@/hooks/useAdminQueries";
import { Search, Download, FileText } from "lucide-react";

export const AuditLogsPage = () => {
  const { data: logs, isLoading } = useAuditLogs({});

  const mockLogs = logs || [
    { id: "log-001", timestamp: "2026-07-10 14:32:01", user: "Alice Chen", action: "UPDATE_ROLE", target: "Bob Smith", status: "Success", ip: "192.168.1.45" },
    { id: "log-002", timestamp: "2026-07-10 14:15:22", user: "System", action: "BACKUP_DB", target: "PostgreSQL", status: "Success", ip: "Internal" },
    { id: "log-003", timestamp: "2026-07-10 13:45:10", user: "Charlie Davis", action: "LOGIN", target: "Auth Service", status: "Failed", ip: "203.0.113.42" },
    { id: "log-004", timestamp: "2026-07-10 12:10:05", user: "Alice Chen", action: "DELETE_ASSET", target: "Milling Machine Beta", status: "Success", ip: "192.168.1.45" },
  ];

  const columns = [
    { header: "Timestamp", accessorKey: "timestamp", cell: (row: any) => <span className="font-mono text-gray-400 text-xs">{row.timestamp}</span> },
    { header: "User / Actor", accessorKey: "user", cell: (row: any) => <span className="font-bold text-white">{row.user}</span> },
    { header: "Action", accessorKey: "action", cell: (row: any) => <span className="font-mono text-accent text-xs">{row.action}</span> },
    { header: "Target", accessorKey: "target", cell: (row: any) => <span className="text-gray-300">{row.target}</span> },
    { header: "IP Address", accessorKey: "ip", cell: (row: any) => <span className="font-mono text-gray-500 text-xs">{row.ip}</span> },
    { header: "Status", accessorKey: "status", cell: (row: any) => (
      <Badge variant={row.status === "Success" ? "success" : "danger"}>{row.status}</Badge>
    )},
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="text-gray-400" /> Security Audit Logs
          </h1>
          <p className="text-sm text-gray-500 mt-1">Immutable record of system changes and access events</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="pl-9 pr-4 py-1.5 bg-secondary-bg border border-gray-700 rounded text-sm text-white focus:border-accent outline-none w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-secondary-bg hover:bg-gray-800 border border-gray-700 text-white rounded transition-colors">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      <DataTable columns={columns} data={mockLogs} isLoading={isLoading} />
    </div>
  );
};
