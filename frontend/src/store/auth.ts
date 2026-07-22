import { create } from "zustand";

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  organization_id: string;
  role?: string;
  permissions?: string[];
}

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: UserProfile, token: string) => void;
  setUser: (user: UserProfile) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

const token = localStorage.getItem("access_token");

export const useAuthStore = create<AuthState>((set) => ({
  user: (() => {
    try {
      const stored = localStorage.getItem("user_profile");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })(),
  accessToken: token,
  isAuthenticated: !!token,
  isLoading: false,
  setAuth: (user, accessToken) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("user_profile", JSON.stringify(user));
    set({ user, accessToken, isAuthenticated: true });
  },
  setUser: (user) => {
    localStorage.setItem("user_profile", JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_profile");
    localStorage.removeItem("selected_org_id");
    localStorage.removeItem("selected_factory_id");
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
  setLoading: (isLoading) => set({ isLoading }),
}));
