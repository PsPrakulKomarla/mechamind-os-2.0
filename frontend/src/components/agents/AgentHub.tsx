import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import { AgentCard } from "./AgentCard";
import { AgentInfo } from "@/services/aiAgentService";

interface AgentHubProps {
  agents: AgentInfo[];
  onStartChat: (agentId: string) => void;
}

export const AgentHub: React.FC<AgentHubProps> = ({ agents, onStartChat }) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search agents..." 
            className="w-full bg-background border border-border rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-agent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-border rounded-md bg-background text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
          <Filter size={16} />
          <span>Filter</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAgents.map(agent => (
          <AgentCard key={agent.id} agent={agent} onStartChat={onStartChat} />
        ))}
        {filteredAgents.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No agents found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};
