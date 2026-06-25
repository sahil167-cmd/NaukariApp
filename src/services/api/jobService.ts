/**
 * WorkerConnect — Job API Service
 * Production implementation connected to Express backend.
 */

import apiClient from './client';
import type { ApiResponse, Job, PaginatedResponse } from '../../types';

export const jobService = {
  /**
   * Fetch paginated list of job openings.
   */
  async getJobs(page = 1, pageSize = 10): Promise<ApiResponse<PaginatedResponse<Job>>> {
    const response = await apiClient.get('/jobs', {
      params: {
        page,
        pageSize,
      },
    });
    return response.data;
  },

  /**
   * Fetch details of a single job opening.
   */
  async getJobById(id: string): Promise<ApiResponse<Job>> {
    const response = await apiClient.get(`/jobs/${id}`);
    return response.data;
  },

  /**
   * Submit an application for a specific vacancy.
   */
  async applyForJob(jobId: string): Promise<ApiResponse<{ applicationId: string }>> {
    const response = await apiClient.post(`/jobs/${jobId}/apply`, {});
    return response.data;
  },
};
