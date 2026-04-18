import axios from 'axios';

const api = axios.create({
  baseURL: '/api',           // uses the proxy we set in vite.config.ts
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;