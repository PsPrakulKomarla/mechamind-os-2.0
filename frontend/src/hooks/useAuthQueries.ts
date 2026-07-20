import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { userService } from "@/services/userService";
import { useAuthStore } from "@/store/auth";

// Login mutation used by LoginPage
export const useLoginMutation = () => {
  const setAuth = useAuthStore(state => state.setAuth);
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      const { user, access_token } = data.data;
      setAuth(user, access_token);
    }
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: () => {
      // Optionally show a toast or notification
    }
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      // Optionally show a toast or redirect handled by component
    }
  });
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: userService.getProfile
  });
};
