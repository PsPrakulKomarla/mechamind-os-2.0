import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { maintenanceService } from "@/services/maintenanceService";

export const useMaintenanceDashboardStats = () => {
  return useQuery({
    queryKey: ["maintenanceStats"],
    queryFn: maintenanceService.getDashboardStats,
  });
};

export const useWorkOrdersList = (filters: any) => {
  return useQuery({
    queryKey: ["workOrders", filters],
    queryFn: () => maintenanceService.getWorkOrders(filters),
    refetchInterval: 30000, // Refresh every 30s for live CMMS feel
  });
};

export const useWorkOrderDetails = (workOrderId: string) => {
  return useQuery({
    queryKey: ["workOrder", workOrderId],
    queryFn: () => maintenanceService.getWorkOrderDetails(workOrderId),
    enabled: !!workOrderId,
  });
};

export const usePredictiveAlerts = () => {
  return useQuery({
    queryKey: ["predictiveAlerts"],
    queryFn: maintenanceService.getPredictiveAlerts,
    refetchInterval: 60000, 
  });
};

export const useRcaDetails = (workOrderId: string) => {
  return useQuery({
    queryKey: ["workOrderRca", workOrderId],
    queryFn: () => maintenanceService.getRcaDetails(workOrderId),
    enabled: !!workOrderId,
  });
};

export const useCreateWorkOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => maintenanceService.createWorkOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
      queryClient.invalidateQueries({ queryKey: ["maintenanceStats"] });
    }
  });
};

export const useUpdateWorkOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => maintenanceService.updateWorkOrderStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
      queryClient.invalidateQueries({ queryKey: ["workOrder", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["maintenanceStats"] });
    }
  });
};
