// Base API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * Fungsi pembantu untuk menangani respons API
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Fungsi fetch pembungkus (wrapper) yang dapat digunakan di server dan klien
 * @param {string} url - Endpoint API (tanpa base URL)
 * @param {object} options - Opsi fetch (method, headers, body, dll.)
 * @param {string} token - Token autentikasi (opsional)
 */
const apiRequest = async (url, options = {}, token) => {
  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // Tambahkan header Authorization jika token ada
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers, // Header spesifik bisa menimpa default
    },
  };

  const response = await fetch(`${API_BASE_URL}${url}`, config);
  return handleResponse(response);
};

// --- Metode HTTP Spesifik ---
// Fungsi-fungsi ini menerima token sebagai argumen terakhir
export const api = {
  get: (url, token) => apiRequest(url, { method: 'GET' }, token),
  post: (url, data, token) => apiRequest(url, { method: 'POST', body: JSON.stringify(data) }, token),
  put: (url, data, token) => apiRequest(url, { method: 'PUT', body: JSON.stringify(data) }, token),
  delete: (url, token) => apiRequest(url, { method: 'DELETE' }, token),
};

// --- Pembungkus Klien (Client-Side Wrapper) ---
// Ini digunakan di Client Components. Secara otomatis mengambil token dari localStorage.
export const clientApi = {
  get: (url) => api.get(url, typeof window !== 'undefined' ? localStorage.getItem('token') : null),
  post: (url, data) => api.post(url, data, typeof window !== 'undefined' ? localStorage.getItem('token') : null),
  put: (url, data) => api.put(url, data, typeof window !== 'undefined' ? localStorage.getItem('token') : null),
  delete: (url) => api.delete(url, typeof window !== 'undefined' ? localStorage.getItem('token') : null),
};


// =========================================================================
// --- FUNGSI API SPESIFIK APLIKASI ANDA ---
// =========================================================================

// --- Fungsi Publik (bisa digunakan di Server Components) ---
export const fetchTrainings = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/v1/pelatihan?${queryString}`);
};

export const fetchTrainingById = async (id) => {
  return api.get(`/v1/pelatihan/${id}`);
};

export const registerUser = async (userData) => {
  return api.post('/v1/auth/register', userData);
};

export const loginUser = async (credentials) => {
  return api.post('/v1/auth/login', credentials);
};


// --- Fungsi yang Memerlukan Autentikasi (gunakan clientApi) ---
// Fungsi ini harus dipanggil dari Client Component
export const registerForTraining = async (trainingId) => {
  return clientApi.post(`/v1/pelatihan/${trainingId}/register`);
};

// Contoh lain:
export const getUserProfile = async () => {
  return clientApi.get('/v1/pengguna/profile');
};

export const updateUserProfile = async (data) => {
  return clientApi.put('/v1/pengguna/profile', data);
};