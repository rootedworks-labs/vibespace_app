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


export const viewUserData = async () => {
  const response = await api.get('/data/view');
  return response.data;
};

/**
 * Fetches all of the authenticated user's data as a file blob for export.
 */
export const exportUserData = async () => {
  const response = await api.get('/data/export', {
    responseType: 'blob', // This is crucial for handling file downloads
  });
  return response.data;
};

export const grantConsent = async (consentType: string): Promise<void> => {
  await api.post('/consents', { consent_type: consentType });
};

/**
 * Fetches the current user's privacy settings.
 */
export const getPrivacySettings = async () => {
  const response = await api.get('/users/me/privacy');
  return response.data;
};

/**
 * Updates the current user's privacy settings.
 */
export const updatePrivacySettings = async (settings: {
  account_privacy?: 'public' | 'private';
  dm_privacy?: 'open' | 'mutuals';
}) => {
  const response = await api.patch('/users/me/privacy', settings);
  return response.data;
};

export const getFollowRequests = async () => {
  const response = await api.get('/follow-requests');
  return response.data;
};

/**
 * Approves a follow request from a specific user.
 */
export const approveFollowRequest = async (followerId: number) => {
  const response = await api.post('/follow-requests/approve', { followerId });
  return response.data;
};

/**
 * Denies or ignores a follow request from a specific user.
 */
export const denyFollowRequest = async (followerId: number) => {
  const response = await api.post('/follow-requests/deny', { followerId });
  return response.data;
};