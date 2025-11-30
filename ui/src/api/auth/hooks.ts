import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./requests";
import { queryKeys } from "@/lib/react-query";
import type { LoginRequest, RegisterRequest } from "./types";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      localStorage.setItem("auth_token", data.token);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
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
      localStorage.removeItem("auth_token");
      queryClient.clear();
    },
  });
}
