"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const setAuthCookies = (token, user) => {
  if (!token || !user) return;
  document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
  document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400; SameSite=Lax`;
};

export const clearAuthCookies = () => {
  document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
  document.cookie = "user=; path=/; max-age=0; SameSite=Lax";
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      isHydrated: false,

      login: (token, user) => {
        if (token && user) {
          setAuthCookies(token, user);
          set({ token, user });
        }
      },

      logout: () => {
        clearAuthCookies();
        set({ token: null, user: null });
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state, _) => {
        useAuthStore.setState({ isHydrated: true });

        if (state?.token && state?.user) {
          setAuthCookies(state.token, state.user);
        }
      },
    }
  )
);