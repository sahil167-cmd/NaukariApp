/**
 * Naukari Bazaar — App Configuration
 * All values use production defaults. Environment variables are inlined at build time by Babel.
 */

export const CONFIG = {
  APP_NAME: "Naukari Bazaar",
  APP_VERSION: "1.0.0",
  API_BASE_URL: "https://naukari-backend-57cn.onrender.com/api/v1",
  SUPPORT_PHONE: "+917506710665",
  SUPPORT_WHATSAPP: "917506710665",
  SUPPORT_EMAIL: "info@3hdmedia.com",
  SUPPORT_WEBSITE: "www.3hdmedia.com",
  OFFICE_ADDRESS: "3HD Media\n54, mamta 'A' Wing A.M Marg\nPrabhadevi Mumbai : 400025",
  API_TIMEOUT: 30000,
} as const;
