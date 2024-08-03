///useAuthStore.js
import { create } from 'zustand';

const useAuthStore = create((set) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return {
    isAuthenticated,
    login: () => {
      localStorage.setItem("isAuthenticated", "true");
      set({ isAuthenticated: true });
    },
    logout: () => {
      localStorage.setItem("isAuthenticated", "false");
      localStorage.removeItem("authToken");
      set({ isAuthenticated: false });
    },
  };
});

export default useAuthStore;
