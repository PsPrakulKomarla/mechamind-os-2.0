import { create } from "zustand";

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  organization_id: string;
}

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: UserProfile, token: string) => void;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  isLoading: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: localStorage.getItem("access_token"),
  isAuthenticated: !!localStorage.getItem("access_token"),
  isLoading: true,
  setAuth: (user, token) => {
    localStorage.setItem("access_token", token);
    set({ user, accessToken: token, isAuthenticated: true, isLoading: false });
  },
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
  },
  fetchProfile: async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }
    
    // Lazy load authService to prevent circular dependency if api.ts imports store
    const { authService } = await import('@/services/authService');
    try {
      const profileResponse = await authService.getProfile();
      if (profileResponse && profileResponse.data) {
        set({ user: profileResponse.data, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false, accessToken: null });
        localStorage.removeItem("access_token");
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false, accessToken: null });
      localStorage.removeItem("access_token");
    }
  },
}));
