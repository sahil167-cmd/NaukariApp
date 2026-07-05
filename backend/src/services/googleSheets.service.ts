import { google } from 'googleapis';
import { config } from '../config/env.config';
import { logger } from '../utils/logger';

export class GoogleSheetsService {
  private sheets: any = null;
  private spreadsheetId: string;
  private authClient: any = null;

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

      // Log the first 50 chars of the env var for debugging (never log the full key)
      logger.info(`GOOGLE_SERVICE_ACCOUNT_JSON starts with: "${credentialsJson.substring(0, 50)}..."`);
      logger.info(`GOOGLE_SHEET_ID = "${this.spreadsheetId}"`);

      // Defensively strip surrounding quotes if they were copied with them
      credentialsJson = credentialsJson.trim();
      if (credentialsJson.startsWith("'") && credentialsJson.endsWith("'")) {
        credentialsJson = credentialsJson.slice(1, -1).trim();
      } else if (credentialsJson.startsWith('"') && credentialsJson.endsWith('"')) {
        credentialsJson = credentialsJson.slice(1, -1).trim();
      }

      // Parse JSON credentials
      let credentials: any;
      try {
        credentials = JSON.parse(credentialsJson);
      } catch (parseError: any) {
        logger.error(`FATAL: Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON as JSON: ${parseError.message}`);
        logger.error(`First 100 chars of value: "${credentialsJson.substring(0, 100)}"`);
        return;
      }

      if (!credentials.client_email || !credentials.private_key) {
        logger.error('FATAL: GOOGLE_SERVICE_ACCOUNT_JSON is missing client_email or private_key fields.');
        return;
      }

      // Defensively replace literal escaped newlines with actual newlines in private key
      const privateKey = credentials.private_key.replace(/\\n/g, '\n');

      logger.info(`Google Sheets: Authenticating as "${credentials.client_email}" for sheet "${this.spreadsheetId}"`);

      this.authClient = new google.auth.JWT({
        email: credentials.client_email,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth: this.authClient });
      logger.info('Google Sheets service initialized successfully.');

      // Startup diagnostic: verify we can access the spreadsheet (non-blocking, informational only)
      this.verifyAccess();
    } catch (error: any) {
      logger.error(`Failed to initialize Google Sheets service: ${error.message}`);
      logger.error(`Stack: ${error.stack}`);
    }
  }

  private async verifyAccess() {
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
        fields: 'properties.title,sheets.properties.title',
      });
      const title = response.data.properties?.title || 'Unknown';
      const sheetNames = response.data.sheets?.map((s: any) => s.properties?.title).join(', ') || 'None';
      logger.info(`Google Sheets VERIFIED OK: "${title}" with tabs: [${sheetNames}]`);
    } catch (error: any) {
      // DO NOT set this.sheets = null here! The sharing permission may be fixed later.
      // Just log the diagnostic info.
      logger.error(`Google Sheets ACCESS VERIFICATION FAILED: ${error.message} (code: ${error.code})`);
      if (error.code === 404) {
        logger.error(`DIAGNOSIS: Spreadsheet ID "${this.spreadsheetId}" was not found. Check GOOGLE_SHEET_ID env variable on Render.`);
      } else if (error.code === 403) {
        logger.error(`DIAGNOSIS: Service account does not have access. Share the Google Sheet with the service account email as Editor.`);
      }
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
        range: 'A:O',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [row],
        },
      });
      logger.info('Successfully appended registration row to Google Sheets.');
    } catch (error: any) {
      logger.error(`Failed to append row to Google Sheets: ${error.message} (code: ${error.code})`);
      if (error.response?.data) {
        logger.error(`Google API response: ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
