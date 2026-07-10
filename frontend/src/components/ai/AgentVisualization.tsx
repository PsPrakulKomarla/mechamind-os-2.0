import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Search, Database, Camera, Activity, Settings } from "lucide-react";
import { clsx } from "clsx";

export interface AgentStatus {
  id: string;
  name: string;
  type: "vision" | "iot" | "knowledge" | "maintenance" | "search";
  status: "idle" | "thinking" | "complete" | "error";
  message?: string;
}

export const AgentVisualization = ({ agents }: { agents: AgentStatus[] }) => {
  if (!agents || agents.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "vision": return <Camera size={14} />;
      case "iot": return <Activity size={14} />;
      case "knowledge": return <Database size={14} />;
      case "maintenance": return <Settings size={14} />;
      default: return <Search size={14} />;
    }
  };

  return (
    <div className="flex flex-wrap gap-3 my-2 items-center p-3 bg-primary-bg border border-gray-800 rounded-lg">
      <span className="text-xs font-semibold text-gray-400 mr-2 uppercase tracking-wider">Agents Processing:</span>
      {agents.map(agent => (
        <div key={agent.id} className={clsx("flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-all", {
          "bg-accent/10 border-accent/30 text-accent animate-pulse": agent.status === "thinking",
          "bg-success/10 border-success/30 text-success": agent.status === "complete",
          "bg-danger/10 border-danger/30 text-danger": agent.status === "error",
          "bg-gray-800 border-gray-700 text-gray-500": agent.status === "idle",
        })}>
          {getIcon(agent.type)}
          <span className="font-medium">{agent.name}</span>
          {agent.status === "thinking" && <span className="text-[10px] ml-1 opacity-75">{agent.message || "Working..."}</span>}
        </div>
      ))}
    </div>
  );
};
