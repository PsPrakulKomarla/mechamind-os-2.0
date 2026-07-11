import { api } from "@/lib/api";

export const digitalTwinService = {
  async getFactoryOverview() {
    const res = await api.get("/digital-twin/overview");
    return res.data.data;
  },

  async getMachineLayout() {
    // Expected to return coordinates, IDs, and types of machines in the factory map
    const res = await api.get("/digital-twin/layout");
    return res.data.data;
  },

  async getMachineStatus(machineId: string) {
    const res = await api.get(`/digital-twin/machines/${machineId}/status`);
    return res.data.data;
  },

  async getAlarms(filters: any = {}) {
    const params = new URLSearchParams(filters);
    const res = await api.get(`/digital-twin/alarms?${params.toString()}`);
    return res.data.data;
  },
  
  async acknowledgeAlarm(alarmId: string) {
    const res = await api.post(`/digital-twin/alarms/${alarmId}/acknowledge`);
    return res.data.data;
  }
};
