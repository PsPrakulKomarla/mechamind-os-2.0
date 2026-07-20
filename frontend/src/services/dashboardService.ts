import { api } from "@/lib/api";

const MOCK_KPIs = {
  oee: 87.3,
  oee_trend: 2.4,
  work_orders: 42,
  total_machines: 156,
  compliance_score: 94.2,
  downtime_hours: 12.5,
  mttr: 4.2,
  mtbf: 142,
  energy_consumption: 2847,
  safety_incidents: 0,
};

const MOCK_AI_INSIGHTS = [
  {
    id: "insight-1",
    type: "warning" as const,
    title: "Spindle Bearing Degradation Detected",
    description: "AI analysis of vibration data from Stamping Press M-201 indicates bearing degradation progressing 18% faster than expected. Recommend scheduling replacement within 72 hours.",
    confidence: 0.94,
  },
  {
    id: "insight-2",
    type: "recommendation" as const,
    title: "Energy Optimization Opportunity",
    description: "Running Assembly Line 4 at 85% capacity during off-peak hours (10PM-6AM) could reduce energy costs by approximately $12,400/month based on current tariff structures.",
    confidence: 0.87,
  },
  {
    id: "insight-3",
    type: "optimization" as const,
    title: "PM Schedule Consolidation",
    description: "Three machines in Zone B have overlapping PM windows. Consolidating maintenance could reduce planned downtime by 6 hours per quarter without impacting reliability.",
    confidence: 0.82,
  },
];

const MOCK_ALERTS = [
  {
    id: "alert-1",
    severity: "critical" as const,
    source: "Stamping Press M-201",
    message: "Vibration threshold exceeded: 2.4 mm/s (limit: 1.8 mm/s)",
    timestamp: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: "alert-2",
    severity: "high" as const,
    source: "HVAC Unit 3",
    message: "Compressor discharge pressure trending upward - 15% above nominal",
    timestamp: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: "alert-3",
    severity: "medium" as const,
    source: "Conveyor C-12",
    message: "Motor temperature approaching upper limit (78°C / 85°C max)",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "alert-4",
    severity: "low" as const,
    source: "CNC Mill M-105",
    message: "Scheduled oil change due in 48 hours",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "alert-5",
    severity: "medium" as const,
    source: "Welding Station W-03",
    message: "Wire feed speed variance detected - may indicate spool depletion",
    timestamp: new Date(Date.now() - 5400000).toISOString(),
  },
];

const generateTimeSeries = (days: number, base: number, variance: number) => {
  return Array.from({ length: days }, (_, i) => ({
    time: new Date(Date.now() - (days - i) * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: Math.round((base + (Math.random() - 0.5) * variance) * 10) / 10,
  }));
};

const MOCK_PERFORMANCE = {
  oee_history: generateTimeSeries(30, 85, 8),
  energy_history: generateTimeSeries(30, 2800, 400),
};

export const dashboardService = {
  async getExecutiveKPIs(_organizationId?: string, _factoryId?: string) {
    try {
      const params = new URLSearchParams();
      if (_organizationId) params.append("organization_id", _organizationId);
      if (_factoryId) params.append("factory_id", _factoryId);
      const res = await api.get(`/analytics/dashboard/kpis?${params.toString()}`);
      return res.data.data;
    } catch {
      return MOCK_KPIs;
    }
  },

  async getAiInsights() {
    try {
      const res = await api.get("/brain/insights/recent");
      return res.data.data;
    } catch {
      return MOCK_AI_INSIGHTS;
    }
  },

  async getLiveAlerts(limit: number = 10) {
    try {
      const res = await api.get(`/maintenance/alerts?limit=${limit}`);
      return res.data.data;
    } catch {
      return MOCK_ALERTS.slice(0, limit);
    }
  },

  async getPerformanceCharts(timeframe: string = "7d") {
    try {
      const res = await api.get(`/analytics/performance?timeframe=${timeframe}`);
      return res.data.data;
    } catch {
      return MOCK_PERFORMANCE;
    }
  },
};
