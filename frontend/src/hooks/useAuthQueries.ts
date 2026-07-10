import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { userService } from "@/services/userService";
import { useAuthStore } from "@/store/auth";

export const useLoginMutation = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      const { user, access_token } = data.data;
      setAuth(user, access_token);
    }
  });
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: userService.getProfile
  });
};
