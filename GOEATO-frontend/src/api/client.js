import axios from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '../config/constants.js';
import { isAuthError, logError } from '../utils/errorHandler.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: API_CONFIG.DEFAULT_TIMEOUT,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
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
    logError(err, { url: err.config?.url, method: err.config?.method });

    if (isAuthError(err)) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      // Optionally redirect to login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
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
