import { useQuery } from "@tanstack/react-query";
import { platformOperationsService } from "@/services/platformOperationsService";

export const useMobileSyncQueue = () => {
  return useQuery({
    queryKey: ["mobileSyncQueue"],
    queryFn: platformOperationsService.getMobileSyncQueue,
  });
};

export const useAiAgentStatus = () => {
  return useQuery({
    queryKey: ["aiAgentStatus"],
    queryFn: platformOperationsService.getAiAgentStatus,
  });
};

export const useMlOpsMetrics = () => {
  return useQuery({
    queryKey: ["mlOpsMetrics"],
    queryFn: platformOperationsService.getMlOpsMetrics,
  });
};

export const usePlatformSystemHealth = () => {
  return useQuery({
    queryKey: ["systemHealth"],
    queryFn: platformOperationsService.getSystemHealth,
    refetchInterval: 30000,
  });
};

export const useCiCdPipeline = () => {
  return useQuery({
    queryKey: ["cicdPipeline"],
    queryFn: platformOperationsService.getCiCdPipeline,
  });
};
