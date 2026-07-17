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
  
  // Existing methods (login, register, logout, forgotPassword, resetPassword) remain unchanged
  // New endpoint: Refresh token (handled via interceptor, provide helper if needed)
  async refreshToken(payload: { refresh_token: string }) {
    try {
      const res = await api.post("/auth/refresh", payload);
      return res.data;
    } catch (err) {
      // Graceful fallback if endpoint not implemented
      console.warn("Refresh token endpoint not available", err);
      return null;
    }
  },

  // Email verification (e.g., after registration)
  async verifyEmail(payload: { token: string }) {
    try {
      const res = await api.post("/auth/verify-email", payload);
      return res.data;
    } catch (err) {
      console.warn("Email verification endpoint not available", err);
      return null;
    }
  },

  // Change password (authenticated user)
  async changePassword(payload: { current_password: string; new_password: string }) {
    try {
      const res = await api.post("/auth/change-password", payload);
      return res.data;
    } catch (err) {
      console.warn("Change password endpoint not available", err);
      return null;
    }
  },

  // Get user profile
  async getProfile() {
    try {
      const res = await api.get("/auth/profile");
      return res.data;
    } catch (err) {
      console.warn("Get profile endpoint not available", err);
      return null;
    }
  },

  // MFA status check – returns true if MFA is enabled for the user
  async getMfaStatus() {
    try {
      const res = await api.get("/auth/mfa/status");
      return res.data.enabled as boolean;
    } catch (err) {
      console.warn("MFA status endpoint not available", err);
      return false;
    }
  }
};
