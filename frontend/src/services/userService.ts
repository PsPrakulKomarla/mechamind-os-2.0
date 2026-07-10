import { api } from "@/lib/api";

export const userService = {
  async getProfile() {
    const res = await api.get("/auth/me");
    return res.data.data;
  },

  async updateProfile(payload: any) {
    const res = await api.put("/users/profile", payload);
    return res.data;
  },

  async getSessions() {
    const res = await api.get("/users/sessions");
    return res.data;
  },

  async terminateSession(sessionId: string) {
    const res = await api.delete(`/users/sessions/${sessionId}`);
    return res.data;
  }
};
