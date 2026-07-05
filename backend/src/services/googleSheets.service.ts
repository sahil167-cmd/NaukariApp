import { google } from 'googleapis';
import { config } from '../config/env.config';
import { logger } from '../utils/logger';

export class GoogleSheetsService {
  private sheets: any = null;
  private spreadsheetId: string;
  private serviceAccountEmail: string = '';

  constructor() {
    this.spreadsheetId = config.GOOGLE_SHEET_ID ? config.GOOGLE_SHEET_ID.trim() : '';
    this.init();
  }

  private init() {
    try {
      let credentialsJson = config.GOOGLE_SERVICE_ACCOUNT_JSON;
      if (!credentialsJson) {
        throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON environment variable is not set.');
      }
      if (!this.spreadsheetId) {
        throw new Error('GOOGLE_SHEET_ID environment variable is not set.');
      }

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
        throw new Error(`Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON as valid JSON: ${parseError.message}`);
      }

      // Assert presence of client_email, private_key, project_id
      const missingFields: string[] = [];
      if (!credentials.client_email) missingFields.push('client_email');
      if (!credentials.private_key) missingFields.push('private_key');
      if (!credentials.project_id) missingFields.push('project_id');

      if (missingFields.length > 0) {
        throw new Error(`GOOGLE_SERVICE_ACCOUNT_JSON is missing required fields: ${missingFields.join(', ')}`);
      }

      this.serviceAccountEmail = credentials.client_email;

      // Defensively replace literal escaped newlines with actual newlines in private key
      const privateKey = credentials.private_key.replace(/\\n/g, '\n');

      const auth = new google.auth.JWT({
        email: this.serviceAccountEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth });
      logger.info('Google Sheets service initialized.');
    } catch (error: any) {
      logger.error(`Google Sheets initialization error: ${error.message}`, {
        stack: error.stack,
        spreadsheetId: this.spreadsheetId,
        serviceAccountEmail: this.serviceAccountEmail,
      });
      throw error;
    }
  }

  public getServiceAccountEmail(): string {
    return this.serviceAccountEmail;
  }

  public getSpreadsheetId(): string {
    return this.spreadsheetId;
  }

  /**
   * Automatically verifies if the spreadsheet exists, if the worksheet 'Sheet1' exists,
   * and creates it if it is missing.
   */
  public async verifyAccessAndSheets(): Promise<{ spreadsheetTitle: string; worksheetName: string }> {
    if (!this.sheets || !this.spreadsheetId) {
      throw new Error('Google Sheets API client is not initialized.');
    }

    try {
      // 1. Fetch spreadsheet metadata
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
        fields: 'properties.title,sheets.properties.title',
      });

      const title = response.data.properties?.title || 'Unknown';
      const sheetList = response.data.sheets || [];
      const hasWorksheet = sheetList.some((s: any) => s.properties?.title === 'Sheet1');

      if (!hasWorksheet) {
        logger.warn(`Worksheet "Sheet1" is missing in spreadsheet "${this.spreadsheetId}". Attempting auto-creation...`);
        try {
          await this.sheets.spreadsheets.batchUpdate({
            spreadsheetId: this.spreadsheetId,
            requestBody: {
              requests: [
                {
                  addSheet: {
                    properties: {
                      title: 'Sheet1',
                    },
                  },
                },
              ],
            },
          });
          logger.info(`Successfully auto-created worksheet "Sheet1" in spreadsheet "${this.spreadsheetId}".`);
        } catch (createErr: any) {
          logger.error(`Failed to auto-create worksheet "Sheet1" in spreadsheet "${this.spreadsheetId}": ${createErr.message}`, {
            error: createErr,
            code: createErr.code,
            response: createErr.response?.data,
          });
          throw createErr;
        }
      }

      return {
        spreadsheetTitle: title,
        worksheetName: 'Sheet1',
      };
    } catch (error: any) {
      // Specialized error logging
      if (error.code === 404) {
        logger.error(`Google Sheets Check failed: Spreadsheet with ID "${this.spreadsheetId}" was not found. Please verify GOOGLE_SHEET_ID on Render.`);
      } else if (error.code === 403) {
        logger.error(`Google Sheets Check failed: Access Denied. Service Account "${this.serviceAccountEmail}" does not have access. Please share the Google Sheet with this email as Editor.`);
      } else {
        logger.error(`Google Sheets Access Check encountered error: ${error.message}`, {
          code: error.code,
          response: error.response?.data,
          stack: error.stack,
          spreadsheetId: this.spreadsheetId,
          worksheetName: 'Sheet1',
          serviceAccountEmail: this.serviceAccountEmail,
        });
      }
      throw error;
    }
  }

  public async appendRegistrationRow(row: any[]) {
    if (!this.sheets || !this.spreadsheetId) {
      throw new Error('Google Sheets client is not initialized.');
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
      logger.info('Successfully appended registration row to Google Sheets worksheet "Sheet1".');
    } catch (error: any) {
      logger.error(`Failed to append row to Google Sheets: ${error.message}`, {
        code: error.code,
        response: error.response?.data,
        stack: error.stack,
        spreadsheetId: this.spreadsheetId,
        worksheetName: 'Sheet1',
        serviceAccountEmail: this.serviceAccountEmail,
      });
      throw error;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
