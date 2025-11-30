import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./requests";
import { queryKeys } from "@/lib/react-query";
import type { LoginRequest, RegisterRequest, UserResponse } from "./types";

export function useWhoami() {
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: async (): Promise<UserResponse | null> => {
      const response = await authApi.whoami();
      return response.user;
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      // Update the user cache directly with the returned user
      queryClient.setQueryData(queryKeys.auth.user(), data.user);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear all cached data on logout
      queryClient.clear();
    },
  });
}
