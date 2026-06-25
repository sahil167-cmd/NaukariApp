/**
 * WorkerConnect — Recruiter Interaction Logs API Service
 */

import { Platform } from 'react-native';
import apiClient from './client';
import type { ApiResponse } from '../../types';

export const contactService = {
  /**
   * Log a recruiter call or WhatsApp redirection to database.
   */
  async logContact(actionType: 'CALL' | 'WHATSAPP'): Promise<ApiResponse<{ id: string }>> {
    try {
      const response = await apiClient.post('/contact-logs', {
        actionType,
        device: Platform.select({
          ios: 'iPhone',
          android: 'Android',
          default: 'Web',
        }),
        platform: Platform.OS,
      });
      return response.data;
    } catch (error) {
      console.error('Error logging support click interaction:', error);
      // Silent error handling: do not disrupt the caller dialer or WhatsApp open flow
      return {
        success: false,
        message: 'Failed to write interaction logs',
      } as any;
    }
  },
};
