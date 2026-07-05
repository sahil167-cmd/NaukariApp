import { logger } from '../utils/logger';

export interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  MONGO_URI: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  SUPPORT_PHONE: string;
  SUPPORT_WHATSAPP: string;
  ALLOWED_ORIGINS: string[];
  APP_VERSION: string;
  GOOGLE_SHEET_ID: string;
  GOOGLE_SERVICE_ACCOUNT_JSON: string;
  SMTP_EMAIL: string;
  SMTP_APP_PASSWORD: string;
  MANAGER_EMAIL: string;
  RESEND_API_KEY: string;
}

const getEnvOrThrow = (key: string, isProduction: boolean, fallback?: string): string => {
  const val = process.env[key];
  if (!val) {
    if (isProduction) {
      const errorMsg = `FATAL CONFIG ERROR: Environment variable ${key} is required in production.`;
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }
    if (fallback === undefined) {
      const errorMsg = `FATAL CONFIG ERROR: Environment variable ${key} is required.`;
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }
    logger.warn(`Missing env variable ${key}. Using dev fallback: "${fallback}"`);
    return fallback;
  }
  return val;
};

const isProduction = process.env.NODE_ENV === 'production';

export const config: EnvConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGO_URI: getEnvOrThrow('MONGO_URI', isProduction, 'mongodb://127.0.0.1:27017/naukari-bazaar'),
  JWT_SECRET: getEnvOrThrow('JWT_SECRET', isProduction, 'supersecretjwtkeyfornaukaribazaar'),
  JWT_REFRESH_SECRET: getEnvOrThrow('JWT_REFRESH_SECRET', isProduction, 'supersecretjwtrefreshkeyfornaukaribazaar'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  SUPPORT_PHONE: process.env.SUPPORT_PHONE || '7506710665',
  SUPPORT_WHATSAPP: process.env.SUPPORT_WHATSAPP || '7506710665',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map((o: string) => o.trim()) 
    : ['*'],
  APP_VERSION: process.env.APP_VERSION || '1.0.0',
  GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID || '',
  GOOGLE_SERVICE_ACCOUNT_JSON: process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '',
  SMTP_EMAIL: process.env.SMTP_EMAIL || '',
  SMTP_APP_PASSWORD: process.env.SMTP_APP_PASSWORD || '',
  MANAGER_EMAIL: process.env.MANAGER_EMAIL || '',
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
};
