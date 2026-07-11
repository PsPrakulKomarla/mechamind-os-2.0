import { api } from "@/lib/api";

export const aiKnowledgeService = {
  async getAiStats() {
    const res = await api.get("/ai/stats");
    return res.data.data;
  },

  async getKnowledgeGraph() {
    const res = await api.get("/ai/knowledge-graph");
    return res.data.data;
  },

  async getPrompts() {
    const res = await api.get("/ai/prompts");
    return res.data.data;
  },

  async savePrompt(payload: any) {
    const res = await api.post("/ai/prompts", payload);
    return res.data.data;
  },

  async searchVectors(query: string) {
    // For local prototype simulation, we hit a dummy endpoint or return mock directly inside the hook.
    // In production, this hits the vector DB wrapper endpoint.
    const res = await api.post("/ai/vectors/search", { query });
    return res.data.data;
  },

  async getFeedbackQueue() {
    const res = await api.get("/ai/feedback");
    return res.data.data;
  },

  async updateFeedbackStatus(id: string, status: string) {
    const res = await api.patch(`/ai/feedback/${id}`, { status });
    return res.data.data;
  },

  async getModelConfig() {
    const res = await api.get("/ai/config");
    return res.data.data;
  },

  async updateModelConfig(payload: any) {
    const res = await api.put("/ai/config", payload);
    return res.data.data;
  }
};
