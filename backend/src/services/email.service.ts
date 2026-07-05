import dns from 'dns';
import nodemailer from 'nodemailer';
import { config } from '../config/env.config';
import { logger } from '../utils/logger';

// Force Node.js to resolve DNS with IPv4 first globally.
// This prevents Render from routing outbound requests through unsupported IPv6 paths.
dns.setDefaultResultOrder('ipv4first');

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private smtpUser: string = '';
  private smtpHost: string = 'smtp.gmail.com';
  private smtpPort: number = 587;

  constructor() {
    this.init();
  }

  private init() {
    try {
      const email = config.SMTP_EMAIL;
      const password = config.SMTP_APP_PASSWORD;

      if (!email || !password) {
        throw new Error('SMTP_EMAIL or SMTP_APP_PASSWORD environment variable is not set.');
      }

      this.smtpUser = email;

      // Define production-safe non-pooled configuration using STARTTLS
      const transportOpts = {
        host: this.smtpHost,
        port: this.smtpPort,
        secure: false, // Must be false for port 587 (STARTTLS)
        auth: {
          user: email,
          pass: password,
        },
        pool: false, // Bypasses connection pool IPv6 resolution fallback behaviors
        requireTLS: true,
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
        lookup: (hostname: string, options: any, callback: any) => {
          dns.lookup(hostname, { ...options, family: 4 }, callback);
        },
      };

      this.transporter = nodemailer.createTransport(transportOpts as any);
      logger.info('Nodemailer SMTP service initialized.');
    } catch (error: any) {
      logger.error(`Nodemailer SMTP initialization error: ${error.message}`, {
        stack: error.stack,
        smtpHost: this.smtpHost,
        smtpPort: this.smtpPort,
        smtpUser: this.smtpUser,
      });
      throw error;
    }
  }

  public getSmtpUser(): string {
    return this.smtpUser;
  }

  public getSmtpHost(): string {
    return this.smtpHost;
  }

  public getSmtpPort(): number {
    return this.smtpPort;
  }

  public async verifyTransporter(): Promise<void> {
    if (!this.transporter) {
      throw new Error('Nodemailer SMTP transporter is not initialized.');
    }

    return new Promise<void>((resolve, reject) => {
      this.transporter!.verify((error, success) => {
        if (error) {
          logger.error(`SMTP Transporter verification failed: ${error.message}`, {
            error,
            code: (error as any).code,
            response: (error as any).response,
            stack: error.stack,
            smtpHost: this.smtpHost,
            smtpPort: this.smtpPort,
            smtpUser: this.smtpUser,
          });
          reject(error);
        } else {
          logger.info('SMTP Transporter verified and ready to send emails.');
          resolve();
        }
      });
    });
  }

  public async sendRegistrationEmail(managerEmail: string, userDetails: Record<string, string>) {
    if (!this.transporter) {
      throw new Error('Email service not initialized.');
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

      await this.transporter.sendMail({
        from: `"Naukari Bazaar" <${config.SMTP_EMAIL}>`,
        to: emailTo,
        subject: 'New Registration - Naukari Bazaar',
        html: htmlContent,
      });

      logger.info(`Successfully sent registration email to ${emailTo}.`);
    } catch (error: any) {
      logger.error(`Failed to send registration email to ${emailTo}: ${error.message}`, {
        code: error.code,
        response: error.response,
        stack: error.stack,
        smtpHost: this.smtpHost,
        smtpPort: this.smtpPort,
        smtpUser: this.smtpUser,
      });
      throw error;
    }
  }
}

export const emailService = new EmailService();
