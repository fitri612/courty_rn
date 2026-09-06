import { create } from "zustand";

import { tokenStorage } from "@/lib/secureStore";
import { User } from "../api/types";

interface AuthState {
  token: string | null;
  user: User | null;
  isHydrated: boolean; // true once we've checked SecureStore on boot
  setSession: (token: string, user: User) => Promise<void>;
  clearSession: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isHydrated: false,

  hydrate: async () => {
    const token = await tokenStorage.get();
    set({ token, isHydrated: true });
  },

  setSession: async (token, user) => {
    await tokenStorage.set(token);
    set({ token, user });
  },

  clearSession: async () => {
    await tokenStorage.remove();
    set({ token: null, user: null });
  },
}));

export const getAuthToken = () => useAuthStore.getState().token;
export const clearAuthSession = () => useAuthStore.getState().clearSession();
