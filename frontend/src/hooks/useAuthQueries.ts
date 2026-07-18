import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/auth";

export const useLoginMutation = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      const { access_token, refresh_token } = data.data;
      if (refresh_token) {
        localStorage.setItem("refresh_token", refresh_token);
      }

      try {
        const profile = await authService.getProfile();
        setAuth(profile, access_token);
      } catch {
        setAuth(
          {
            id: "",
            email: "",
            first_name: "",
            last_name: "",
            organization_id: "",
          },
          access_token
        );
      }

      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: authService.register,
  });
};

export const useLogoutMutation = () => {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      logout();
      queryClient.clear();
      window.location.href = "/login";
    },
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: authService.forgotPassword,
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: authService.resetPassword,
  });
};

export const useUserProfile = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: authService.getProfile,
    enabled: isAuthenticated,
    retry: false,
  });
};
