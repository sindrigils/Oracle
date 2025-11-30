"use client";

import { createContext, useContext, ReactNode } from "react";
import { useWhoami, useLogin, useLogout } from "./hooks";
import type { UserResponse, LoginRequest } from "./types";

interface AuthContextValue {
  user: UserResponse | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  loginError: Error | null;
  logoutError: Error | null;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: user, isLoading } = useWhoami();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const login = async (data: LoginRequest): Promise<void> => {
    await loginMutation.mutateAsync(data);
  };

  const logout = async (): Promise<void> => {
    await logoutMutation.mutateAsync();
  };

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
