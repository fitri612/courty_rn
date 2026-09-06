import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";
import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import { AuthResponse, LoginPayload, RegisterPayload } from "../types";

export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { data } = await apiClient.post<AuthResponse>(endpoints.register, payload);
      return data;
    },
    onSuccess: async (data) => {
      await setSession(data.accessToken, data.user);
    },
  });
}

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await apiClient.post<AuthResponse>(endpoints.login, payload);
      return data;
    },
    onSuccess: async (data) => {
      await setSession(data.accessToken, data.user);
    },
  });
}

export function useLogout() {
  const clearSession = useAuthStore((s) => s.clearSession);
  return async () => {
    await clearSession();
  };
}
