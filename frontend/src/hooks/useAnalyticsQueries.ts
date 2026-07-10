import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { analyticsService } from "@/services/analyticsService";

export const useExecutiveKpis = (filters: any) => {
  return useQuery({
    queryKey: ["executiveKpis", filters],
    queryFn: () => analyticsService.getExecutiveKpis(filters),
    staleTime: 60000, // Cache for 1 min
  });
};

export const useFailureAnalytics = (timeRange: string) => {
  return useQuery({
    queryKey: ["failureAnalytics", timeRange],
    queryFn: () => analyticsService.getFailureAnalytics(timeRange),
    staleTime: 300000, // 5 mins
  });
};

export const useEnergyAnalytics = (timeRange: string) => {
  return useQuery({
    queryKey: ["energyAnalytics", timeRange],
    queryFn: () => analyticsService.getEnergyAnalytics(timeRange),
    staleTime: 300000,
  });
};

export const useCustomDashboards = () => {
  return useQuery({
    queryKey: ["customDashboards"],
    queryFn: analyticsService.getCustomDashboards,
  });
};

export const useSaveCustomDashboard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => analyticsService.saveCustomDashboard(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customDashboards"] });
    }
  });
};
