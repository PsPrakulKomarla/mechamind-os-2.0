import { api } from "@/lib/api";

export const platformOperationsService = {
  async getMobileSyncQueue() {
    const res = await api.get("/platform/mobile/sync-queue");
    return res.data.data;
  },

  async getAiAgentStatus() {
    const res = await api.get("/platform/agents/status");
    return res.data.data;
  },

  async getMlOpsMetrics() {
    const res = await api.get("/platform/mlops/metrics");
    return res.data.data;
  },

  async getSystemHealth() {
    const res = await api.get("/platform/health");
    return res.data.data;
  },

  async getCiCdPipeline() {
    const res = await api.get("/platform/cicd/pipeline");
    return res.data.data;
  }
};
