import axios, { AxiosError } from 'axios';
import { env } from './env';
import { camelToSnake, snakeToCamel } from './utils';

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for cookies to be sent/received
});

// Request interceptor - convert outgoing data to snake_case
apiClient.interceptors.request.use((config) => {
  if (config.data) {
    config.data = camelToSnake(config.data);
  }
  if (config.params) {
    config.params = camelToSnake(config.params);
  }
  return config;
});

// Response interceptor - convert incoming data to camelCase
apiClient.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = snakeToCamel(response.data);
    }
    return response;
  },
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
