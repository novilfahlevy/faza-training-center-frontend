"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";;

export default function AuthDataLayout({ children }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth(); // ambil token & user dari localStorage
  }, [initializeAuth]);

  return (
    <>
      {children}
    </>
  );
}
