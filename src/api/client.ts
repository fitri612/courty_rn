import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { router } from "expo-router";
import { API_BASE_URL } from "../constants/config";
import { clearAuthSession, getAuthToken } from "../store/authStore";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the JWT to every request when we have one.
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralised handling for expired / invalid tokens: wipe the session and
// bounce back to the login screen so the user can re-authenticate.
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await clearAuthSession();
      router.replace("/(auth)/login");
    }
    return Promise.reject(error);
  }
);

export interface ApiErrorBody {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

/** Normalises NestJS error responses into a single readable string. */
export function getApiErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as ApiErrorBody | undefined;
    if (Array.isArray(body?.message)) return body.message.join("\n");
    if (typeof body?.message === "string") return body.message;
  }
  return fallback;
}
