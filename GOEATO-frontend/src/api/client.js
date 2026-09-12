import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('goeato_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // backward compat with old backend expecting x-auth-token
    config.headers['x-auth-token'] = token;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('goeato_token');
      localStorage.removeItem('goeato_user');
    }
    return Promise.reject(err);
  }
);

export function unwrapList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

export default api;
