/**
 * WorkerConnect — Auth API Service
 * Production implementation connected to Express backend.
 */

import apiClient from './client';
import type { ApiResponse, AuthTokens, OTPRequest, OTPVerifyRequest, User } from '../../types';

export const authService = {
  /**
   * Request OTP for a phone number.
   */
  async requestOTP(data: OTPRequest): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.post('/auth/request-otp', data);
    return response.data;
  },

  /**
   * Verify OTP and get tokens.
   */
  async verifyOTP(data: OTPVerifyRequest): Promise<ApiResponse<{ tokens: AuthTokens; user: User; isNew: boolean }>> {
    const response = await apiClient.post('/auth/verify-otp', data);
    return response.data;
  },

  /**
   * Logout — invalidate token on server.
   */
  async logout(): Promise<void> {
    // Stateless logout: token clean-up is done in store
    try {
      await apiClient.post('/auth/logout', {});
    } catch (e) {
      // Ignore network errors on logout
    }
  },

  /**
   * Refresh access token.
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthTokens>> {
    const response = await apiClient.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },
};
