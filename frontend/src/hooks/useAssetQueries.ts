import { useQuery } from "@tanstack/react-query";
import { assetService } from "@/services/assetService";

export const useAssetHierarchy = () => {
  const orgId = localStorage.getItem("selected_org_id") || undefined;
  const factoryId = localStorage.getItem("selected_factory_id") || undefined;

  return useQuery({
    queryKey: ["assetHierarchy", orgId, factoryId],
    queryFn: () => assetService.getHierarchy(orgId, factoryId),
  });
};

export const useMachinesList = (filters: any) => {
  return useQuery({
    queryKey: ["machinesList", filters],
    queryFn: () => assetService.getMachines(filters),
  });
};

export const useMachineDetails = (machineId: string) => {
  return useQuery({
    queryKey: ["machine", machineId],
    queryFn: () => assetService.getMachineDetails(machineId),
    enabled: !!machineId,
  });
};

export const useDigitalTwin = (machineId: string) => {
  return useQuery({
    queryKey: ["digitalTwin", machineId],
    queryFn: () => assetService.getDigitalTwin(machineId),
    enabled: !!machineId,
    refetchInterval: 5000, // Refresh fast for live sensors
  });
};

export const useMachineHealth = (machineId: string) => {
  return useQuery({
    queryKey: ["machineHealth", machineId],
    queryFn: () => assetService.getMachineHealth(machineId),
    enabled: !!machineId,
  });
};
