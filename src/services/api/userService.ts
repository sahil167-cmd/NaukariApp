/**
 * WorkerConnect — User Profile API Service
 * Production implementation connected to Express backend.
 */

import apiClient from './client';
import type { ApiResponse, UserProfile, RegistrationDraft } from '../../types';

export const userService = {
  /**
   * Fetch current user's profile details.
   */
  async getProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    const response = await apiClient.get('/profile');
    return response.data;
  },

  /**
   * Save registration wizard step data.
   * Maps to PATCH /profile to immediately synchronize draft data in MongoDB.
   */
  async saveRegistrationStep(
    step: number,
    data: Partial<RegistrationDraft>
  ): Promise<ApiResponse<{ saved: boolean }>> {
    // Send partial registration draft step updates to database
    const payload: any = {};
    if (data.personal) payload.personal = data.personal;
    if (data.address) payload.address = data.address;
    if (data.jobPreferences) payload.jobPreferences = data.jobPreferences;
    if (data.education) payload.education = data.education;
    if (data.experience) payload.experience = data.experience;
    if (data.documents) payload.documents = data.documents;

    await apiClient.patch('/profile', payload);
    return { success: true, data: { saved: true }, message: 'Step saved successfully' };
  },

  /**
   * Submit complete profile registration draft.
   */
  async submitRegistration(
    draft: RegistrationDraft
  ): Promise<ApiResponse<{ profileId: string }>> {
    const response = await apiClient.post('/register', draft);
    return response.data;
  },

  /**
   * Modify specific profile sections.
   */
  async updateProfile(
    userId: string,
    data: Partial<UserProfile>
  ): Promise<ApiResponse<UserProfile>> {
    const response = await apiClient.patch('/profile', data);
    return response.data;
  },
};
