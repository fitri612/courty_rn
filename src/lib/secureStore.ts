import * as SecureStore from "expo-secure-store";
import { AUTH_TOKEN_KEY } from "../constants/config";


export const tokenStorage = {
  async get(): Promise<string | null> {
    return SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  },
  async set(token: string): Promise<void> {
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
  },
  async remove(): Promise<void> {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  },
};
