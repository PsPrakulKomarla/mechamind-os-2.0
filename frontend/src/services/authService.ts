import { api } from "@/lib/api";

export const authService = {
  async login(payload: any) {
    const res = await api.post("/auth/login", payload);
    return res.data;
  },

  async register(payload: any) {
    const res = await api.post("/auth/register", payload);
    return res.data;
  },

  async logout() {
    const res = await api.post("/auth/logout");
    return res.data;
  },

  async forgotPassword(payload: { email: string }) {
    const res = await api.post("/auth/forgot-password", payload);
    return res.data;
  },

  async resetPassword(payload: any) {
    const res = await api.post("/auth/reset-password", payload);
    return res.data;
  }
};
