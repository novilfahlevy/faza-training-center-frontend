import httpClient from '@/httpClient';

// Fungsi untuk mengambil semua pelatihan
export const fetchTrainings = async (params = {}) => {
  const response = await httpClient.get('/v1/pelatihan', { params });
  return response.data;
};

// Fungsi untuk mengambil detail pelatihan berdasarkan ID
export const fetchTrainingById = async (id) => {
  const response = await httpClient.get(`/v1/pelatihan/${id}`);
  return response.data;
};

// Fungsi untuk registrasi pengguna baru
export const registerUser = async (userData) => {
  const response = await httpClient.post('/v1/auth/register', userData);
  return response.data;
};

// Fungsi untuk login
export const loginUser = async (credentials) => {
  const response = await httpClient.post('/v1/auth/login', credentials);
  return response.data;
};

// Fungsi untuk mendaftar ke pelatihan (memerlukan token)
export const registerForTraining = async (trainingId, token) => {
  const response = await httpClient.post(
    `/v1/pelatihan/${trainingId}/register`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export default httpClient;