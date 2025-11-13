import { getBearerToken, clearAuthData, getUserRole } from "./authCredentials";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const handleResponse = async (response) => {
  if (!response.ok) {
    if ([401, 403].includes(response.status) && typeof window !== "undefined") {
      console.warn("⚠️ Token tidak valid atau akses ditolak");
      clearAuthData();

      const role = getUserRole();
      if (role && response.status === 401) {
        if (role === "admin" || role === "mitra") {
          window.location.href = "/admin/login";
        } else if (role === "peserta") {
          window.location.href = "/login";
        } else {
          window.location.href = "/";
        }
      } else if (role && response.status === 403) {
        window.location.href = "/";
      }
    }

    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const apiRequest = async (url, options = {}, token) => {
  try {
      const defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    const response = await fetch(`${API_BASE_URL}${url}`, config);
    return handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const api = {
  get: (url, token) => apiRequest(url, { method: "GET" }, token),
  post: (url, data, token) => apiRequest(url, { method: "POST", body: JSON.stringify(data) }, token),
  put: (url, data, token) => apiRequest(url, { method: "PUT", body: JSON.stringify(data) }, token),
  delete: (url, token) => apiRequest(url, { method: "DELETE" }, token),
};

export const clientApi = {
  get: (url) => api.get(url, typeof window !== "undefined" ? getBearerToken() : null),
  post: (url, data) => api.post(url, data, typeof window !== "undefined" ? getBearerToken() : null),
  put: (url, data) => api.put(url, data, typeof window !== "undefined" ? getBearerToken() : null),
  delete: (url) => api.delete(url, typeof window !== "undefined" ? getBearerToken() : null),
};

// =========================================================================
// --- API SPESIFIK APLIKASI ---
// =========================================================================

export const login = async (credentials) => {
  return api.post("/v1/auth/login", credentials);
};

export const loginPeserta = async (credentials) => {
  return api.post("/v1/auth/peserta/login", credentials);
};

export const registerUser = async (userData) => {
  return api.post("/v1/auth/register", userData);
};

export const fetchTrainings = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/v1/pelatihan?${queryString}`);
};

export const fetchTrainingById = async (id) => api.get(`/v1/pelatihan/${id}`);
export const fetchTrainingBySlug = async (slug) => api.get(`/v1/pelatihan/by-slug/${slug}`);
export const registerForTraining = async (slug) => clientApi.post(`/v1/pelatihan/${slug}/register`);
export const registerForTrainingWithFile = async (slug, file) => {
  const token = typeof window !== "undefined" ? getBearerToken() : null;

  const formData = new FormData();
  formData.append("bukti_pembayaran", file);

  const response = await fetch(`${API_BASE_URL}/v1/pelatihan/${slug}/register`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  return handleResponse(response);
};
export const getUserProfile = async () => clientApi.get("/v1/data-peserta");
export const updateUserProfile = async (data) => clientApi.put("/v1/data-peserta", data);
