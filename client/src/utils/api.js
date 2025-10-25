import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;
const apiAxios = axios.create({
  baseURL:apiUrl || 'http://localhost:5000',
  timeout: 10000
});

apiAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default apiAxios;
