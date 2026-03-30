import { create } from "zustand";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
  refreshToken?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  login: (userData: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  login: (userData) => {
    localStorage.setItem("token", userData.token || "");
    if (userData.refreshToken) {
      localStorage.setItem("refreshToken", userData.refreshToken);
    }
    set({ user: userData, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    set({ user: null, isAuthenticated: false });
  },
  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await axios.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        set({ user: { ...res.data, token }, isAuthenticated: true, isCheckingAuth: false });
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        set({ user: null, isAuthenticated: false, isCheckingAuth: false });
      }
    } else {
      set({ isCheckingAuth: false });
    }
  },
  token: () => {
    const token = localStorage.getItem("token");
    if (token) {
      return token;
    }
    return "";
  },
}));
