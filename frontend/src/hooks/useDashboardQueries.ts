import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";

export const useExecutiveKPIs = () => {
  const currentOrg = localStorage.getItem("selected_org_id") || undefined;
  const currentFactory = localStorage.getItem("selected_factory_id") || undefined;

  return useQuery({
    queryKey: ["executiveKPIs", currentOrg, currentFactory],
    queryFn: () => dashboardService.getExecutiveKPIs(currentOrg, currentFactory),
    refetchInterval: 30000, // Refresh every 30s for live feel
  });
};

export const useAiInsights = () => {
  return useQuery({
    queryKey: ["aiInsights"],
    queryFn: dashboardService.getAiInsights,
    refetchInterval: 60000,
  });
};

export const useLiveAlerts = (limit = 10) => {
  return useQuery({
    queryKey: ["liveAlerts", limit],
    queryFn: () => dashboardService.getLiveAlerts(limit),
    refetchInterval: 15000,
  });
};

export const usePerformanceCharts = (timeframe = "7d") => {
  return useQuery({
    queryKey: ["performanceCharts", timeframe],
    queryFn: () => dashboardService.getPerformanceCharts(timeframe),
  });
};
