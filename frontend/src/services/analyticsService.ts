import { api } from "@/lib/api";

export const analyticsService = {
  async getExecutiveKpis(filters: any = {}) {
    const params = new URLSearchParams(filters);
    const res = await api.get(`/analytics/executive/kpis?${params.toString()}`);
    return res.data.data;
  },

  async getFailureAnalytics(timeRange: string = "30d") {
    const res = await api.get(`/analytics/failures?range=${timeRange}`);
    return res.data.data;
  },

  async getEnergyAnalytics(timeRange: string = "7d") {
    const res = await api.get(`/analytics/energy?range=${timeRange}`);
    return res.data.data;
  },

  async getCustomDashboards() {
    const res = await api.get("/analytics/dashboards/custom");
    return res.data.data;
  },

  async saveCustomDashboard(payload: any) {
    const res = await api.post("/analytics/dashboards/custom", payload);
    return res.data.data;
  }
};
