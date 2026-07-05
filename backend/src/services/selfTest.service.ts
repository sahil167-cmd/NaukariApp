import mongoose from 'mongoose';
import { googleSheetsService } from './googleSheets.service';
import { emailService } from './email.service';
import { logger } from '../utils/logger';

export interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

export class SelfTestService {
  public async runSelfTests(): Promise<TestResult[]> {
    logger.info('=========================================');
    logger.info('      STARTING SYSTEM SELF-TESTS         ');
    logger.info('=========================================');

    const results: TestResult[] = [];

    // 1. MongoDB test
    try {
      const readyState = mongoose.connection.readyState;
      const isConnected = readyState === 1;
      if (isConnected) {
        results.push({
          name: 'MongoDB Connection',
          passed: true,
          message: `Connected successfully to host: ${mongoose.connection.host}`,
        });
      } else {
        results.push({
          name: 'MongoDB Connection',
          passed: false,
          message: `Not connected. Connection readyState is ${readyState}`,
        });
      }
    } catch (err: any) {
      results.push({
        name: 'MongoDB Connection',
        passed: false,
        message: `Connection check failed: ${err.message}`,
      });
    }

    // 2. Google Sheets test
    try {
      const check = await googleSheetsService.verifyAccessAndSheets();
      results.push({
        name: 'Google Sheets API',
        passed: true,
        message: `Access verified. Title: "${check.spreadsheetTitle}". Target Tab: "${check.worksheetName}"`,
      });
    } catch (err: any) {
      results.push({
        name: 'Google Sheets API',
        passed: false,
        message: `Access check failed: ${err.message}. Email: "${googleSheetsService.getServiceAccountEmail()}"`,
      });
    }

    // 3. SMTP Transporter test
    try {
      await emailService.verifyTransporter();
      results.push({
        name: 'SMTP Email Transport',
        passed: true,
        message: `Verified and ready. Server: "${emailService.getSmtpHost()}:${emailService.getSmtpPort()}" as user: "${emailService.getSmtpUser()}"`,
      });
    } catch (err: any) {
      results.push({
        name: 'SMTP Email Transport',
        passed: false,
        message: `Transporter validation failed: ${err.message}`,
      });
    }

    // Output formatted results
    logger.info('=========================================');
    logger.info('           SELF-TEST RESULTS             ');
    logger.info('=========================================');
    for (const res of results) {
      const statusStr = res.passed ? 'PASS' : 'FAIL';
      logger.info(`[${statusStr}] ${res.name}: ${res.message}`);
    }
    logger.info('=========================================');

    return results;
  }
}

export const selfTestService = new SelfTestService();
