import { create } from "zustand";

import { authStorage } from "@/lib/authStore";
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
    const session = await authStorage.get();

    set({
      token: session?.token ?? null,
      user: session?.user ?? null,
      isHydrated: true,
    });
  },

  setSession: async (token, user) => {
    await authStorage.set(token, user);

    set({
      token,
      user,
    });
  },

  clearSession: async () => {
    await authStorage.remove();

    set({
      token: null,
      user: null,
    });
  },
}));


export const getAuthToken = () => useAuthStore.getState().token;
export const clearAuthSession = () => useAuthStore.getState().clearSession();
