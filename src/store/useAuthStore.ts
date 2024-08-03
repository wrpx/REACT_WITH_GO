import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return {
    isAuthenticated,
    login: () => {
      localStorage.setItem("isAuthenticated", "true");
      set({ isAuthenticated: true });
    },
    logout: () => {
      localStorage.setItem("isAuthenticated", "false");
      set({ isAuthenticated: false });
    },
  };
});