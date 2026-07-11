import { api } from "@/lib/api";

export const adminService = {
  async getSystemHealth() {
    const res = await api.get("/admin/system/health");
    return res.data.data;
  },

  async getUsers(filters: any = {}) {
    const params = new URLSearchParams(filters);
    const res = await api.get(`/admin/users?${params.toString()}`);
    return res.data.data;
  },

  async createUser(payload: any) {
    const res = await api.post("/admin/users", payload);
    return res.data.data;
  },

  async updateUser(userId: string, payload: any) {
    const res = await api.put(`/admin/users/${userId}`, payload);
    return res.data.data;
  },

  async deleteUser(userId: string) {
    const res = await api.delete(`/admin/users/${userId}`);
    return res.data.data;
  },

  async getRoles() {
    const res = await api.get("/admin/roles");
    return res.data.data;
  },

  async getAuditLogs(filters: any = {}) {
    const params = new URLSearchParams(filters);
    const res = await api.get(`/admin/audit-logs?${params.toString()}`);
    return res.data.data;
  },

  async getSystemSettings() {
    const res = await api.get("/admin/settings");
    return res.data.data;
  },

  async updateSystemSettings(payload: any) {
    const res = await api.put("/admin/settings", payload);
    return res.data.data;
  }
};
