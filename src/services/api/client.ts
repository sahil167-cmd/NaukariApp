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
      if (__DEV__) {
        console.warn('Failed to load auth token for request:', e);
      }
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

    // Handle token expiration (401 Unauthorized) — attempt refresh before logout
    if (error.response?.status === 401 && originalRequest && !originalRequest.headers['x-token-expired-retry']) {
      originalRequest.headers['x-token-expired-retry'] = 'true';
      try {
        const { useAuthStore } = require('../../store/authStore');
        const state = useAuthStore.getState();
        const refreshToken = state.tokens?.refreshToken;

        if (refreshToken) {
          // Attempt silent token refresh
          const refreshResponse = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`,
            { refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );

          if (refreshResponse.data?.success && refreshResponse.data?.data?.accessToken) {
            const newAccessToken = refreshResponse.data.data.accessToken;
            const newExpiresAt = refreshResponse.data.data.expiresAt ?? (Date.now() + 7 * 24 * 60 * 60 * 1000);

            // Update store with new access token
            state.setTokens({
              accessToken: newAccessToken,
              refreshToken: refreshToken,
              expiresAt: newExpiresAt,
            });

            // Retry the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          }
        }

        // No refresh token or refresh failed — logout
        state.logout();
      } catch (refreshError) {
        // Refresh failed entirely — logout
        try {
          const { useAuthStore } = require('../../store/authStore');
          useAuthStore.getState().logout();
        } catch (_) {
          // Swallow errors during logout
        }
      }
    }

    // Auto-retry for network errors (e.g. timeout, no internet connection)
    if (!error.response && originalRequest && requestId) {
      const retryCount = retryTracker.get(requestId) || 0;

      if (retryCount < 3) {
        retryTracker.set(requestId, retryCount + 1);
        if (__DEV__) {
          console.log(`Network error. Retrying request (${retryCount + 1}/3) for ID: ${requestId}...`);
        }
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
