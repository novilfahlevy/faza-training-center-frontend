import axios from "axios";
import { getBearerToken, getUserRole, clearAuthData } from "./authCredentials";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 🟢 Tambahkan token secara otomatis
httpClient.interceptors.request.use(
  (config) => {
    const token = getBearerToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔴 Tangani error global (401/403)
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const role = getUserRole();

      if (status === 401) {
        console.warn("⚠️ Token expired atau tidak valid");
        clearAuthData();

        if (role === "admin" || role === "mitra") {
          window.location.href = "/admin/login";
        } else if (role === "peserta") {
          window.location.href = "/login";
        } else {
          window.location.href = "/";
        }
      }

      if (status === 403) {
        console.warn("⚠️ Hanya admin yang dapat mengakses halaman ini.");
        window.location.href = "/";
      }
    } else if (error.request) {
      console.error("❌ Tidak ada respons dari server");
    } else {
      console.error("❌ Error saat menyiapkan request:", error.message);
    }

    return Promise.reject(error);
  }
);

export default httpClient;
