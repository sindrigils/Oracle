import { apiClient } from "@/lib/axios";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  LogoutResponse,
  WhoAmIResponse,
} from "./types";

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>(
      "/auth/register",
      data
    );
    return response.data;
  },

  logout: async (): Promise<LogoutResponse> => {
    const response = await apiClient.post<LogoutResponse>("/auth/logout");
    return response.data;
  },

  whoami: async (): Promise<WhoAmIResponse> => {
    const response = await apiClient.get<WhoAmIResponse>("/auth/whoami");
    return response.data;
  },
};
