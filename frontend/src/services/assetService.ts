import { api } from "@/lib/api";

export const assetService = {
  async getHierarchy(organizationId?: string, factoryId?: string) {
    const params = new URLSearchParams();
    if (organizationId) params.append("organization_id", organizationId);
    if (factoryId) params.append("factory_id", factoryId);
    
    const res = await api.get(`/assets/hierarchy?${params.toString()}`);
    return res.data.data;
  },

  async getMachines(filters: any = {}) {
    const params = new URLSearchParams(filters);
    const res = await api.get(`/assets/machines?${params.toString()}`);
    return res.data.data;
  },

  async getMachineDetails(machineId: string) {
    const res = await api.get(`/assets/machines/${machineId}`);
    return res.data.data;
  },

  async getDigitalTwin(machineId: string) {
    const res = await api.get(`/digital-twin/machines/${machineId}`);
    return res.data.data;
  },
  
  async getMachineHealth(machineId: string) {
    const res = await api.get(`/assets/machines/${machineId}/health`);
    return res.data.data;
  }
};
