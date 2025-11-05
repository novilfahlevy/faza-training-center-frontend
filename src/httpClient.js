import axios from "axios";

// Ganti URL ini dengan alamat backend kamu
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // batas waktu request (ms)
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.warn("⚠️ Token expired atau tidak valid");
        localStorage.removeItem("token");
        window.location.href = "/login";
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
