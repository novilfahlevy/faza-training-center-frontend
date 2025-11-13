"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getBearerToken,
  getUserData,
  setBearerToken,
  setUserData,
  clearAuthData,
} from "@/authCredentials";

const setAuthCookies = (token, user) => {
  document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
  document.cookie = `user=${JSON.stringify(user)}; path=/; max-age=86400; SameSite=Lax`;
}

export function clearAuthCookies() {
  document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
  document.cookie = "user=; path=/; max-age=0; SameSite=Lax";
}

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,

      // 🔹 Inisialisasi dari localStorage (saat app load)
      initializeAuth: () => {
        const token = getBearerToken();
        const user = getUserData();
        setAuthCookies(token, user);
        set({ token, user });
      },

      // 🔹 Login (update token & user)
      login: (token, user) => {
        setBearerToken(token);
        setUserData(user);
        setAuthCookies(token, user);
        set({ token, user });
      },

      // 🔹 Logout (hapus semua)
      logout: () => {
        clearAuthData();
        clearAuthCookies();
        set({ token: null, user: null });
      },
    }),
    {
      name: "auth-storage", // nama key di localStorage
    }
  )
);
