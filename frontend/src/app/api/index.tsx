import axios from 'axios';
import { useAuthStore } from '@/src/app/store/authStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
});

api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// This is the corrected, permanent fetcher function.
export const fetcher = (url: string) => api.get(url).then(res => res.data);

export default api;

