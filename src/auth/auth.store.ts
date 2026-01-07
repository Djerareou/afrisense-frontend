import { create } from "zustand";
import { authApi } from "@/api";

interface AuthState {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("auth_token"),
  user: null,
  isAuthenticated: !!localStorage.getItem("auth_token"),

  login: async (email, password) => {
    const { token, user } = await authApi.login({ email, password });
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user_data", JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
