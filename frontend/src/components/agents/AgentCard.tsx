import React from "react";
import { Bot, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AgentInfo } from "@/services/aiAgentService";

interface AgentCardProps {
  agent: AgentInfo;
  onStartChat: (agentId: string) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onStartChat }) => {
  return (
    <Card className="flex flex-col h-full hover:border-brand-agent transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-brand-agent/10 rounded-lg text-brand-agent">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground">{agent.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${agent.status === 'idle' ? 'bg-green-500' : agent.status === 'busy' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
              <span className="text-xs text-muted-foreground capitalize">{agent.status}</span>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4 flex-grow">
        {agent.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {agent.capabilities.map((cap) => (
          <Badge key={cap} variant="secondary" className="text-xs font-normal">
            {cap}
          </Badge>
        ))}
      </div>

      <div className="mt-auto">
        <Button 
          variant="secondary" 
          className="w-full justify-center border-brand-agent text-brand-agent hover:bg-brand-agent hover:text-white"
          onClick={() => onStartChat(agent.id)}
        >
          <MessageSquare size={16} className="mr-2" />
          Start Chat
        </Button>
      </div>
    </Card>
  );
};
