import axios from "axios";
import { useAuthStore, clearAuthCookies } from "@/stores/useAuthStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ---------------------------------------------
// 🔹 AUTO-ADD TOKEN USING ZUSTAND
// ---------------------------------------------
httpClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------------------------------------
// 🔴 GLOBAL ERROR HANDLING
// ---------------------------------------------
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const auth = useAuthStore.getState();
    const role = auth?.user?.role;

    if (error.response) {
      const status = error.response.status;
      const state = error.response.data.state;

      if (status === 401 && state == "NOT_AUTHORIZED") {
        auth.logout();
        clearAuthCookies();

        if (role === "admin" || role === "mitra") {
          window.location.href = "/admin/login";
        } else {
          window.location.href = "/login";
        }
      }

      if (status === 403) {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;


// =============================================================================
// ROUTES
// =============================================================================

export const login = (credentials) =>
  httpClient.post("/auth/admin/login", credentials);

export const fetchPelatihanList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return httpClient.get(`/admin/pelatihan?${queryString}`);
};

export const fetchMitraOptions = () => httpClient.get("/admin/mitra/options");

export const fetchPelatihanById = (id, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return httpClient.get(`/admin/pelatihan/${id}?${queryString}`);
};

export const createPelatihan = (data) =>
  httpClient.post("/admin/pelatihan", data);

export const updatePelatihan = (id, data) =>
  httpClient.put(`/admin/pelatihan/${id}`, data);

export const deletePelatihan = (id) =>
  httpClient.delete(`/admin/pelatihan/${id}`);

export const uploadPelatihanThumbnail = (formData) =>
  httpClient.post("/admin/pelatihan/upload-thumbnail", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const fetchPelatihanParticipants = (id, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return httpClient.get(`/admin/pelatihan/${id}/peserta?${queryString}`);
};

export const updatePesertaStatus = (id, data) =>
  httpClient.put(`/admin/pelatihan/peserta/${id}/status`, data);

export const fetchPenggunaList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return httpClient.get(`/admin/pengguna?${queryString}`);
};

export const fetchPenggunaById = (id) =>
  httpClient.get(`/admin/pengguna/${id}`);

export const createPengguna = (data) =>
  httpClient.post("/admin/pengguna", data);

export const updatePengguna = (id, data) =>
  httpClient.put(`/admin/pengguna/${id}`, data);

export const deletePengguna = (id) =>
  httpClient.delete(`/admin/pengguna/${id}`);
