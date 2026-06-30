/**
 * Naukri Bazaar — Auth API Service
 * Production implementation connected to Express backend.
 */

import apiClient from './client';
import type { ApiResponse, AuthTokens, User } from '../../types';

interface LoginRequest {
  phone: string;
}

interface LoginResponse {
  tokens: AuthTokens;
  user: User;
  isNew: boolean;
}

export const authService = {
  /**
   * Direct phone login/register — no OTP step.
   * Validates the number and returns JWT tokens + user object.
   */
  async loginWithPhone(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  /**
   * Logout — invalidate token on server.
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout', {});
    } catch (e) {
      // Ignore network errors on logout
    }
  },

  /**
   * Request OTP (compatibility)
   */
  async requestOTP(data: { phone: string }): Promise<ApiResponse<void>> {
    const response = await apiClient.post('/auth/request-otp', data);
    return response.data;
  },

  /**
   * Verify OTP (compatibility)
   */
  async verifyOTP(data: { phone: string; otp: string }): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post('/auth/verify-otp', data);
    return response.data;
  },

  /**
   * Refresh access token.
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthTokens>> {
    const response = await apiClient.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },
};
