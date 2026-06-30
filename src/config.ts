/**
 * Naukari Bazaar — App Configuration
 */

export const CONFIG = {
  APP_NAME: process.env.APP_NAME || "Naukari Bazaar",
  APP_VERSION: process.env.APP_VERSION || "1.0.0",
  API_BASE_URL: process.env.API_BASE_URL || "http://192.168.0.100:5000/api/v1",
  SUPPORT_PHONE: process.env.SUPPORT_PHONE || "7506710665",
  SUPPORT_WHATSAPP: process.env.SUPPORT_WHATSAPP || "7506710665",
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || "info@3hdmedia.com",
  SUPPORT_WEBSITE: process.env.SUPPORT_WEBSITE || "www.3hdmedia.com",
  OFFICE_ADDRESS: (
    process.env.OFFICE_ADDRESS ||
    "3HD Media\n54, mamta 'A' Wing A.M Marg\nPrabhadevi Mumbai : 400025"
  ).replace(/\\n/g, "\n"),
  API_TIMEOUT: 30000,
} as const;
