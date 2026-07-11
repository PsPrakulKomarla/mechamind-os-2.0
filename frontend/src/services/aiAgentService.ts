import { api } from "@/lib/api";

export interface AgentInfo {
  id: string;
  name: string;
  description: string;
  avatarUrl?: string;
  capabilities: string[];
  status: "idle" | "busy" | "offline";
}

export const aiAgentService = {
  async getAgents(): Promise<AgentInfo[]> {
    const response = await api.get("/agents");
    return response.data.data;
  },

  async startChat(agentId: string, initialMessage: string): Promise<{ chatId: string }> {
    const response = await api.post(`/agents/${agentId}/chat`, { message: initialMessage });
    return response.data.data;
  },
  
  async sendMessage(chatId: string, message: string): Promise<any> {
    const response = await api.post(`/agents/chat/${chatId}/message`, { message });
    return response.data.data;
  }
};
