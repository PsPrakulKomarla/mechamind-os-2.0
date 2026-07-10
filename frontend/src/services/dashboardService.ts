import { api } from "@/lib/api";

export const dashboardService = {
  async getExecutiveKPIs(organizationId?: string, factoryId?: string) {
    const params = new URLSearchParams();
    if (organizationId) params.append("organization_id", organizationId);
    if (factoryId) params.append("factory_id", factoryId);
    
    const res = await api.get(`/analytics/dashboard/kpis?${params.toString()}`);
    return res.data.data;
  },

  async getAiInsights() {
    const res = await api.get("/brain/insights/recent");
    return res.data.data;
  },

  async getLiveAlerts(limit: number = 10) {
    const res = await api.get(`/maintenance/alerts?limit=${limit}`);
    return res.data.data;
  },

  async getPerformanceCharts(timeframe: string = "7d") {
    const res = await api.get(`/analytics/performance?timeframe=${timeframe}`);
    return res.data.data;
  }
};
