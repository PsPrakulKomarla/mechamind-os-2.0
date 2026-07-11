import { useQuery, useMutation } from "@tanstack/react-query";
import { predictiveMaintenanceService } from "@/services/predictiveMaintenanceService";

export const usePredictiveOverview = () => {
  return useQuery({
    queryKey: ["predictiveOverview"],
    queryFn: predictiveMaintenanceService.getPredictiveOverview,
  });
};

export const useFailurePredictions = (machineId?: string) => {
  return useQuery({
    queryKey: ["failurePredictions", machineId],
    queryFn: () => predictiveMaintenanceService.getFailurePredictions(machineId),
  });
};

export const useRulData = (machineId: string) => {
  return useQuery({
    queryKey: ["rulData", machineId],
    queryFn: () => predictiveMaintenanceService.getRulData(machineId),
  });
};

export const useRiskMatrix = () => {
  return useQuery({
    queryKey: ["riskMatrix"],
    queryFn: predictiveMaintenanceService.getRiskMatrix,
  });
};

export const useSimulateWhatIf = () => {
  return useMutation({
    mutationFn: (payload: any) => predictiveMaintenanceService.simulateWhatIf(payload),
  });
};
