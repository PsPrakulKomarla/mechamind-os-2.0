import { api } from "@/lib/api";

export interface ModelMetrics {
  id: string;
  modelName: string;
  version: string;
  accuracy: number;
  driftDetected: boolean;
  lastTrained: string;
  status: "active" | "training" | "failed";
}

export const mlOpsService = {
  async getMetrics(): Promise<ModelMetrics[]> {
    const response = await api.get("/mlops/metrics");
    return response.data.data;
  },

  async triggerTraining(modelId: string): Promise<{ jobId: string }> {
    const response = await api.post(`/mlops/train/${modelId}`);
    return response.data.data;
  }
};
