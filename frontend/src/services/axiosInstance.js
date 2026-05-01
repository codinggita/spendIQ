import axios from 'axios';
import { storage } from '../utils/storage';
import { toast } from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = storage.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      storage.remove('token');
      window.location.href = '/login';
    }
    const method = error.config?.method?.toUpperCase();
    if (method && method !== 'GET') {
      let message = error.response?.data?.message || 'Something went wrong. Try again.';
      
      // If the backend sends specific validation errors, display the first one so the user knows exactly what to fix
      if (error.response?.data?.errors && error.response.data.errors.length > 0) {
        message = error.response.data.errors[0];
      }

      toast.error(message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
