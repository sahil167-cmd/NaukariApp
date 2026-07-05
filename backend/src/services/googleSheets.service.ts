import { google } from 'googleapis';
import { config } from '../config/env.config';
import { logger } from '../utils/logger';

export class GoogleSheetsService {
  private sheets: any = null;
  private spreadsheetId: string;

  constructor() {
    this.spreadsheetId = config.GOOGLE_SHEET_ID;
    this.init();
  }

  private init() {
    try {
      const credentialsJson = config.GOOGLE_SERVICE_ACCOUNT_JSON;
      if (!credentialsJson) {
        logger.warn('GOOGLE_SERVICE_ACCOUNT_JSON env variable is not set. Google Sheets service will not function.');
        return;
      }
      if (!this.spreadsheetId) {
        logger.warn('GOOGLE_SHEET_ID env variable is not set. Google Sheets service will not function.');
        return;
      }

      // Parse JSON credentials
      const credentials = JSON.parse(credentialsJson);

      const auth = new google.auth.JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth });
      logger.info('Google Sheets service initialized successfully.');
    } catch (error: any) {
      logger.error('Failed to initialize Google Sheets service:', { error: error.message });
    }
  }

  public async appendRegistrationRow(row: any[]) {
    if (!this.sheets || !this.spreadsheetId) {
      logger.warn('Google Sheets service not initialized. Skipping row append.');
      return;
    }

    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Sheet1!A:O',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [row],
        },
      });
      logger.info('Successfully appended registration row to Google Sheets.');
    } catch (error: any) {
      logger.error('Failed to append row to Google Sheets:', { error: error.message });
      throw error;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
