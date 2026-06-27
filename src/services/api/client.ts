/**
 * WorkerConnect — Axios API Client
 * Handles auth token injection, refresh, and error normalization.
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_TIMEOUT, STORAGE_KEYS } from '../../constants';
import Storage, { storage } from '../../utils/storage';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Bypass-Tunnel-Reminders': 'true',
    'bypass-tunnel-reminder': 'true',
  },
});

// Map to track retry counts for each request by unique ID
const retryTracker = new Map<string, number>();

// Request interceptor — attach auth token and request ID
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Generate a unique request ID if not present to track retries reliably
    if (!(config as any).requestId) {
      (config as any).requestId = Math.random().toString(36).substring(7);
    }

    try {
      const { useAuthStore } = require('../../store/authStore');
      const token = useAuthStore.getState().tokens?.accessToken;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Failed to load auth token for request:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — normalize errors & handle retries
apiClient.interceptors.response.use(
  (response) => {
    // Clean up retry tracker on success
    const config = response.config;
    const requestId = config ? (config as any).requestId : null;
    if (requestId) {
      retryTracker.delete(requestId);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    const requestId = originalRequest ? (originalRequest as any).requestId : null;

    // Handle token expiration (401 Unauthorized)
    if (error.response?.status === 401 && originalRequest && !originalRequest.headers['x-token-expired-retry']) {
      originalRequest.headers['x-token-expired-retry'] = 'true';
      try {
        const { useAuthStore } = require('../../store/authStore');
        useAuthStore.getState().logout();
      } catch (e) {
        console.warn('Failed to logout on 401:', e);
      }
    }

    // Auto-retry for network errors (e.g. timeout, no internet connection)
    if (!error.response && originalRequest && requestId) {
      const retryCount = retryTracker.get(requestId) || 0;

      if (retryCount < 3) {
        retryTracker.set(requestId, retryCount + 1);
        console.log(`Network error. Retrying request (${retryCount + 1}/3) for ID: ${requestId}...`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return apiClient(originalRequest);
      } else {
        retryTracker.delete(requestId);
      }
    }

    return Promise.reject({
      message: (error.response?.data as any)?.message ?? error.message ?? 'Something went wrong',
      statusCode: error.response?.status ?? 0,
      errors: (error.response?.data as any)?.errors,
    });
  }
);

export default apiClient;
