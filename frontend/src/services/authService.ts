import { api } from "@/lib/api";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  organization_name?: string;
}

export const authService = {
  async login(payload: LoginPayload) {
    const res = await api.post("/auth/login", payload);
    return res.data;
  },

  async register(payload: RegisterPayload) {
    const res = await api.post("/auth/register", payload);
    return res.data;
  },

  async logout() {
    const res = await api.post("/auth/logout");
    return res.data;
  },

  async getProfile() {
    const res = await api.get("/auth/me");
    return res.data.data;
  },

  async forgotPassword(payload: { email: string }) {
    const res = await api.post("/auth/forgot-password", payload);
    return res.data;
  },

  async resetPassword(payload: { token: string; new_password: string }) {
    const res = await api.post("/auth/reset-password", payload);
    return res.data;
  },

  async verifyEmail(token: string) {
    const res = await api.post("/auth/verify-email", { token });
    return res.data;
  },
};
