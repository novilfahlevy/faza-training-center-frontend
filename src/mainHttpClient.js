import { useAuthStore } from "@/stores/useAuthStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const handleResponse = async (response) => {
  // Parse response body terlebih dahulu
  let responseBody;
  try {
    responseBody = await response.json();
  } catch (e) {
    responseBody = {};
  }

  if (!response.ok) {
    const status = response.status;
    const { logout, user } = useAuthStore.getState();
    const role = user?.role;

    // Handle unauthorized
    if ([401, 403].includes(status) && responseBody.state === "NOT_AUTHORIZED") {
      logout();

      if (role === "admin" || role === "mitra") {
        window.location.href = "/admin/login";
      } else {
        window.location.href = "/login";
      }
    }

    // Throw error dengan message dari server atau default
    const errorMessage = responseBody.message || 
                        responseBody.error || 
                        `HTTP error: ${status}`;
    
    const error = new Error(errorMessage);
    error.status = status;
    error.response = responseBody;
    
    throw error;
  }

  return responseBody;
};

const apiRequest = async (url, options = {}) => {
  const token = useAuthStore.getState().token;

  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
  };

  // Hanya tambahkan JSON content-type jika bukan FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    return await handleResponse(response);
  } catch (error) {
    // Re-throw error agar bisa di-catch oleh caller
    throw error;
  }
};

export const api = {
  get: (url) => apiRequest(url, { method: "GET" }),
  post: (url, data) => apiRequest(url, { method: "POST", body: JSON.stringify(data) }),
  put: (url, data) => apiRequest(url, { method: "PUT", body: JSON.stringify(data) }),
  delete: (url) => apiRequest(url, { method: "DELETE" }),
};

// ----------------------------------------------------------------------
// AUTH
// ----------------------------------------------------------------------

export const login = (credentials) => api.post("/auth/admin/login", credentials);
export const loginPeserta = (credentials) => api.post("/auth/login", credentials);
export const registerUser = (data) => api.post("/auth/register", data);

// ----------------------------------------------------------------------
// PELATIHAN (main/pelatihanRoutes.js)
// ----------------------------------------------------------------------

// GET /pelatihan
export const fetchTrainings = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/pelatihan?${query}`);
};

// GET /pelatihan/:slug
export const fetchTrainingBySlug = (slug) => api.get(`/pelatihan/${slug}`);

// GET /pelatihan/:slug/status
export const fetchTrainingStatus = (slug) => api.get(`/pelatihan/${slug}/status`);

// POST /pelatihan/:slug/register
export const registerForTraining = (slug) =>
  api.post(`/pelatihan/${slug}/register`);

// POST /pelatihan/:slug/register (dengan file)
export const registerForTrainingWithFile = async (slug, file) => {
  const formData = new FormData();
  if (file) {
    formData.append("bukti_pembayaran", file);
  }

  return apiRequest(`/pelatihan/${slug}/register`, {
    method: "POST",
    body: formData,
  });
};

// PUT /pelatihan/:slug/bukti-pembayaran
export const updatePaymentProof = (slug, file) => {
  const formData = new FormData();
  formData.append("bukti_pembayaran", file);

  return apiRequest(`/pelatihan/${slug}/bukti-pembayaran`, {
    method: "PUT",
    body: formData,
  });
};

// DELETE /pelatihan/:slug/register
export const cancelTrainingRegistration = (slug) =>
  api.delete(`/pelatihan/${slug}/register`);

// POST /pelatihan/upload-bukti-pembayaran
export const uploadPaymentProof = (file) => {
  const formData = new FormData();
  formData.append("bukti_pembayaran", file);

  return apiRequest(`/pelatihan/upload-bukti-pembayaran`, {
    method: "POST",
    body: formData,
  });
};

// GET /pelatihan/riwayat
export const fetchTrainingHistory = () => api.get("/pelatihan/riwayat");

// ----------------------------------------------------------------------
// PROFILE (main/profileRoutes.js)
// ----------------------------------------------------------------------

// GET /profile
export const getUserProfile = () => api.get("/profile");

// PUT /profile/email
export const updateEmail = (data) => api.put("/profile/email", data);

// PUT /profile/password
export const updatePassword = (data) => api.put("/profile/password", data);

// PUT /profile/profile  (update profil peserta)
export const updateProfilePeserta = (data) => api.put("/profile", data);