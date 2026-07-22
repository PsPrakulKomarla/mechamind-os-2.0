import { api } from "@/lib/api";

export const maintenanceService = {
  async getDashboardStats() {
    const res = await api.get("/maintenance/dashboard/stats");
    return res.data.data;
  },

  async getWorkOrders(filters: any = {}) {
    const params = new URLSearchParams(filters);
    const res = await api.get(`/workflow/work-orders?${params.toString()}`);
    return res.data;
  },

  async getWorkOrderDetails(workOrderId: string) {
    const res = await api.get(`/workflow/work-orders/${workOrderId}`);
    return res.data;
  },

  async createWorkOrder(data: any) {
    const res = await api.post("/workflow/work-orders", data);
    return res.data;
  },

  async getPredictiveAlerts() {
    const res = await api.get("/maintenance/predictive/alerts");
    return res.data.data;
  },

  async getRcaDetails(workOrderId: string) {
    const res = await api.get(`/workflow/work-orders/${workOrderId}/rca`);
    return res.data.data;
  },

  async updateWorkOrderStatus(workOrderId: string, status: string) {
    const res = await api.patch(`/workflow/work-orders/${workOrderId}/status?new_status=${status}`);
    return res.data;
  }
};
