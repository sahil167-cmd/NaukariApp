import nodemailer from 'nodemailer';
import { config } from '../config/env.config';
import { logger } from '../utils/logger';

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.init();
  }

  private init() {
    try {
      const email = config.SMTP_EMAIL;
      const password = config.SMTP_APP_PASSWORD;

      if (!email || !password) {
        logger.warn('SMTP_EMAIL or SMTP_APP_PASSWORD not set. Email service will not function.');
        return;
      }

      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: email,
          pass: password,
        },
      });
      logger.info('Nodemailer service initialized successfully.');
    } catch (error: any) {
      logger.error('Failed to initialize Nodemailer service:', { error: error.message });
    }
  }

  public async sendRegistrationEmail(managerEmail: string, userDetails: Record<string, string>) {
    if (!this.transporter) {
      logger.warn('Email service not initialized. Skipping registration email.');
      return;
    }

    const emailTo = managerEmail || config.MANAGER_EMAIL;
    if (!emailTo) {
      logger.warn('No manager email specified. Skipping registration email.');
      return;
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

      await this.transporter.sendMail({
        from: `"Naukari Bazaar" <${config.SMTP_EMAIL}>`,
        to: emailTo,
        subject: 'New Registration - Naukari Bazaar',
        html: htmlContent,
      });

      logger.info(`Successfully sent registration email to ${emailTo}.`);
    } catch (error: any) {
      logger.error('Failed to send registration email:', { error: error.message });
      throw error;
    }
  }
}

export const emailService = new EmailService();
