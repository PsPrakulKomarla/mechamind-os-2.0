import { api } from "@/lib/api";

export const aiService = {
  async getConversations() {
    const res = await api.get("/brain/conversations");
    return res.data.data;
  },

  async getConversationHistory(conversationId: string) {
    const res = await api.get(`/brain/conversations/${conversationId}/history`);
    return res.data.data;
  },

  // Mocking streaming via a regular POST for foundation,
  // real implementation would use EventSource or WebSockets.
  async sendMessage(conversationId: string, message: string, context?: any) {
    const res = await api.post(`/brain/conversations/${conversationId}/message`, {
      message,
      context
    });
    return res.data.data; // { response, evidence, confidence, agents }
  },

  async getPromptLibrary() {
    const res = await api.get("/brain/prompts/library");
    return res.data.data;
  },

  async getKnowledgeGraphNodes(focusId?: string) {
    const params = focusId ? `?focus_id=${focusId}` : "";
    const res = await api.get(`/brain/knowledge-graph${params}`);
    return res.data.data;
  }
};
