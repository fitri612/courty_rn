import { User } from "@/api/types";
import { tokenStorage } from "./secureStore";

export const authStorage = {
  get: async () => {
    const data = await tokenStorage.get();

    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch {
      // Old format: token was stored directly
      return {
        token: data,
        user: null,
      };
    }
  },

  set: async (token: string, user: User) => {
    await tokenStorage.set(
      JSON.stringify({
        token,
        user,
      }),
    );
  },

  remove: async () => {
    await tokenStorage.remove();
  },
};