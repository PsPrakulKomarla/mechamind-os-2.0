import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/adminService";

export const useSystemHealth = () => {
  return useQuery({
    queryKey: ["systemHealth"],
    queryFn: adminService.getSystemHealth,
    refetchInterval: 30000,
  });
};

export const useUsers = (filters: any) => {
  return useQuery({
    queryKey: ["adminUsers", filters],
    queryFn: () => adminService.getUsers(filters),
  });
};

export const useRoles = () => {
  return useQuery({
    queryKey: ["adminRoles"],
    queryFn: adminService.getRoles,
  });
};

export const useAuditLogs = (filters: any) => {
  return useQuery({
    queryKey: ["auditLogs", filters],
    queryFn: () => adminService.getAuditLogs(filters),
  });
};

export const useSystemSettings = () => {
  return useQuery({
    queryKey: ["systemSettings"],
    queryFn: adminService.getSystemSettings,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => adminService.createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    }
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: any }) => adminService.updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    }
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    }
  });
};
