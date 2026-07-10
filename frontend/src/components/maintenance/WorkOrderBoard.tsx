import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Clock, AlertTriangle, User } from "lucide-react";

interface WorkOrder {
  id: string;
  title: string;
  machine: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "open" | "in-progress" | "review" | "closed";
  assignee?: string;
  dueDate: string;
}

export const WorkOrderBoard = ({ workOrders, isLoading }: { workOrders?: WorkOrder[], isLoading?: boolean }) => {
  if (isLoading) {
    return <div className="h-64 animate-pulse bg-secondary-bg rounded-lg"></div>;
  }

  const columns = [
    { id: "open", title: "Open / Backlog", bg: "bg-gray-800" },
    { id: "in-progress", title: "In Progress", bg: "bg-accent/20" },
    { id: "review", title: "Pending Review", bg: "bg-warning/20" },
    { id: "closed", title: "Closed", bg: "bg-success/20" }
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-250px)]">
      {columns.map(col => {
        const columnOrders = workOrders?.filter(wo => wo.status === col.id) || [];
        return (
          <div key={col.id} className="flex flex-col bg-secondary-bg/50 rounded-lg border border-gray-800 w-80 min-w-[320px]">
            <div className={`p-3 border-b border-gray-800 font-bold text-sm text-gray-200 flex justify-between items-center ${col.bg}`}>
              {col.title}
              <Badge variant="secondary" className="text-xs">{columnOrders.length}</Badge>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {columnOrders.map(wo => (
                <Card key={wo.id} className="p-3 cursor-grab active:cursor-grabbing hover:border-gray-600 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-gray-500">{wo.id}</span>
                    <Badge variant={
                      wo.priority === "critical" ? "danger" : 
                      wo.priority === "high" ? "warning" : 
                      wo.priority === "medium" ? "info" : "secondary"
                    } className="text-[10px] py-0">
                      {wo.priority}
                    </Badge>
                  </div>
                  
                  <h4 className="font-semibold text-sm text-white mb-1 line-clamp-2">{wo.title}</h4>
                  <div className="text-xs text-accent font-medium mb-3 flex items-center gap-1">
                    <AlertTriangle size={12} /> {wo.machine}
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-gray-400 pt-2 border-t border-gray-800">
                    <span className="flex items-center gap-1">
                      <User size={12} /> {wo.assignee || "Unassigned"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {new Date(wo.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </Card>
              ))}
              {columnOrders.length === 0 && (
                <div className="text-center p-4 text-xs text-gray-600 border border-dashed border-gray-800 rounded">
                  No work orders
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
