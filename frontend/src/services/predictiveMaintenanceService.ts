import { api } from "@/lib/api";

export const predictiveMaintenanceService = {
  async getPredictiveOverview() {
    const res = await api.get("/predictive/overview");
    return res.data.data;
  },

  async getFailurePredictions(machineId?: string) {
    const url = machineId ? `/predictive/failures?machineId=${machineId}` : "/predictive/failures";
    const res = await api.get(url);
    return res.data.data;
  },

  async getRulData(machineId: string) {
    const res = await api.get(`/predictive/rul/${machineId}`);
    return res.data.data;
  },

  async getRiskMatrix() {
    const res = await api.get("/predictive/risk-matrix");
    return res.data.data;
  },

  async simulateWhatIf(payload: any) {
    const res = await api.post("/predictive/simulate", payload);
    return res.data.data;
  }
};
