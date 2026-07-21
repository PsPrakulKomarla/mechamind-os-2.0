import { api } from "@/lib/api";

export const dashboardService = {
  async getExecutiveKPIs(_organizationId?: string, _factoryId?: string) {
    try {
      const params = new URLSearchParams();
      if (_organizationId) params.append("organization_id", _organizationId);
      if (_factoryId) params.append("factory_id", _factoryId);
      const res = await api.get(`/analytics/dashboard/kpis?${params.toString()}`);
      return res.data.data;
    } catch {
      return null;
    }
  },

  async getAiInsights() {
    try {
      const res = await api.get("/brain/insights/recent");
      return res.data.data;
    } catch {
      return [];
    }
  },

  async getLiveAlerts(limit: number = 10) {
    try {
      const res = await api.get(`/maintenance/alerts?limit=${limit}`);
      return res.data.data;
    } catch {
      return [];
    }
  },

  async getPerformanceCharts(timeframe: string = "7d") {
    try {
      const res = await api.get(`/analytics/performance?timeframe=${timeframe}`);
      return res.data.data;
    } catch {
      return null;
    }
  },
};
