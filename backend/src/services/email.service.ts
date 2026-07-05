import { Resend } from 'resend';
import { config } from '../config/env.config';
import { logger } from '../utils/logger';

export class EmailService {
  private resend: Resend | null = null;
  private resendApiKey: string = '';

  constructor() {
    this.init();
  }

  private init() {
    try {
      this.resendApiKey = config.RESEND_API_KEY;
      if (!this.resendApiKey) {
        logger.warn('RESEND_API_KEY environment variable is not set. Email service will not function.');
        return;
      }
      this.resend = new Resend(this.resendApiKey);
      logger.info('Resend Email service initialized successfully.');
    } catch (error: any) {
      logger.error(`Resend Email service initialization error: ${error.message}`, {
        stack: error.stack,
      });
      throw error;
    }
  }

  public getSmtpUser(): string {
    return 'Resend API Service';
  }

  public getSmtpHost(): string {
    return 'api.resend.com';
  }

  public getSmtpPort(): number {
    return 443;
  }

  public async verifyTransporter(): Promise<void> {
    if (!this.resend || !this.resendApiKey) {
      throw new Error('Resend client is not initialized.');
    }
    // Verify connection by checking key format
    if (!this.resendApiKey.startsWith('re_')) {
      throw new Error('Invalid Resend API Key format. Must start with re_');
    }
    logger.info('Resend Email Client credentials format verified.');
  }

  public async sendRegistrationEmail(managerEmail: string, userDetails: Record<string, string>) {
    if (!this.resend) {
      throw new Error('Resend Email service not initialized.');
    }

    const emailTo = managerEmail || config.MANAGER_EMAIL;
    if (!emailTo) {
      throw new Error('No manager email target specified.');
    }

    try {
      const tableRows = Object.entries(userDetails)
        .map(([key, value]) => `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">${key}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${value || '—'}</td>
          </tr>
        `).join('');

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
          <h2 style="color: #FF5A1F; border-bottom: 2px solid #FF5A1F; padding-bottom: 10px;">New Registration - Naukari Bazaar</h2>
          <p>A new worker has completed their registration. Here are the details:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <thead>
              <tr style="background-color: #FF5A1F; color: white;">
                <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Field</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Value</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <p style="margin-top: 20px; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 10px;">
            This is an automated notification from Naukari Bazaar recruitment pipeline.
          </p>
        </div>
      `;

      // Note: Resend Free tier allows sending emails from 'onboarding@resend.dev'
      // to the email address registered on the Resend account.
      const fromEmail = 'onboarding@resend.dev';

      logger.info(`Attempting to send registration email to ${emailTo} using Resend API...`);
      const response = await this.resend.emails.send({
        from: fromEmail,
        to: emailTo,
        subject: 'New Registration - Naukari Bazaar',
        html: htmlContent,
      });

      if (response.error) {
        throw new Error(`Resend API Error: ${response.error.message} (${response.error.name})`);
      }

      logger.info(`Successfully sent registration email to ${emailTo} (ID: ${response.data?.id}).`);
    } catch (error: any) {
      logger.error(`Failed to send registration email to ${emailTo} using Resend: ${error.message}`, {
        code: error.code,
        response: error.response,
        stack: error.stack,
      });
      throw error;
    }
  }
}

export const emailService = new EmailService();
