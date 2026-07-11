import { useQuery, useMutation } from "@tanstack/react-query";
import { mlOpsService } from "@/services/mlOpsService";

export const useModelMetrics = () => {
  return useQuery({
    queryKey: ["mlops-metrics"],
    queryFn: mlOpsService.getMetrics
  });
};

export const useTriggerTraining = () => {
  return useMutation({
    mutationFn: (modelId: string) => mlOpsService.triggerTraining(modelId)
  });
};
