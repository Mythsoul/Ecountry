import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for common headers
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is not 401 or it's already a retry, reject it
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    try {
      originalRequest._retry = true;

      // Try to refresh the token
      await axios.post('/api/user/refresh');
      
      // Retry the original request
      return api(originalRequest);
    } catch (refreshError) {
      // If refresh fails, redirect to login
      toast.error('Your session has expired. Please log in again.');
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }
);

export const apiClient = {
  login: async (data: { email: string; password: string }) => {
    return api.post('/user/login', data);
  },

  signup: async (data: { email: string; password: string; name?: string }) => {
    return api.post('/user/signup', data);
  },

  logout: async () => {
    return api.post('/user/logout');
  },

  verifyEmail: async (data: { email: string; code: string }) => {
    return api.post('/user/verify', data);
  },

  resendCode: async (data: { email: string }) => {
    return api.post('/user/resend-code', data);
  },

  forgotPassword: async (data: { email: string }) => {
    return api.post('/user/forgot-password', data);
  },

  verifyToken: async () => {
    return api.post('/user/verify-token');
  },

  refreshToken: async () => {
    return api.post('/user/refresh');
  }
};

export default apiClient;
