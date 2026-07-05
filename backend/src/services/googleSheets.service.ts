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
      let credentialsJson = config.GOOGLE_SERVICE_ACCOUNT_JSON;
      if (!credentialsJson) {
        logger.warn('GOOGLE_SERVICE_ACCOUNT_JSON env variable is not set. Google Sheets service will not function.');
        return;
      }
      if (!this.spreadsheetId) {
        logger.warn('GOOGLE_SHEET_ID env variable is not set. Google Sheets service will not function.');
        return;
      }

      // Defensively strip surrounding quotes if they were copied with them
      credentialsJson = credentialsJson.trim();
      if (credentialsJson.startsWith("'") && credentialsJson.endsWith("'")) {
        credentialsJson = credentialsJson.slice(1, -1).trim();
      } else if (credentialsJson.startsWith('"') && credentialsJson.endsWith('"')) {
        credentialsJson = credentialsJson.slice(1, -1).trim();
      }

      // Parse JSON credentials
      const credentials = JSON.parse(credentialsJson);

      // Defensively replace literal escaped newlines with actual newlines in private key
      const privateKey = credentials.private_key.replace(/\\n/g, '\n');

      const auth = new google.auth.JWT({
        email: credentials.client_email,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth });
      logger.info('Google Sheets service initialized successfully.');
    } catch (error: any) {
      logger.error(`Failed to initialize Google Sheets service: ${error.message}`);
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
      logger.error(`Failed to append row to Google Sheets: ${error.message}`);
      throw error;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
