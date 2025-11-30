import axios, { AxiosError } from 'axios';
import { env } from './env';

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for cookies to be sent/received
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Don't redirect for /auth/me - it's expected to return null when not authenticated
    const isAuthMeRequest = error.config?.url?.includes('/auth/me');

    if (error.response?.status === 401 && !isAuthMeRequest) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export type { AxiosError };
