import { queryKeys } from '@/lib/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from './requests';
import type { LoginRequest, RegisterRequest, WhoAmIResponse } from './types';

export function useWhoami() {
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: async (): Promise<WhoAmIResponse> => {
      return await authApi.whoami();
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
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
