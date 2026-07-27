# 🚀 Naukari Bazaar — Complete GoDaddy cPanel & Play Store Deployment Guide

This document is a comprehensive, step-by-step deployment handbook for team members deploying the **Naukari Bazaar** PHP backend to **GoDaddy cPanel Shared Hosting** and publishing the **React Native (Expo)** mobile app to the **Google Play Store**.

---

## 📋 System Architecture Overview

```
┌────────────────────────────────┐
│   React Native (Expo App)      │
│   Deployed on Google Play Store│
└───────────────┬────────────────┘
                │ HTTPS REST API
                ▼
┌────────────────────────────────┐
│  PHP Backend (Slim 4 + PDO)    │
│  Hosted on GoDaddy cPanel      │
└───────┬────────────────┬───────┘
        │ PDO SQL        │ Google Sheets API
        ▼                ▼
┌──────────────┐   ┌───────────────────────────┐
│ MySQL DB     │   │ Google Sheets             │
│ (cPanel)     │   │ (Triggers Apps Script for │
└──────────────┘   │  Manager Emails)          │
                   └───────────────────────────┘
```

---

## 📁 Key File Locations & Code Map

### 1. Frontend (React Native / Expo)
* **API URL Configuration**: [`src/constants/index.ts`](file:///c:/Users/Sahil%20Borhade/Desktop/Naukari/src/constants/index.ts) (Line 25)
* **App Metadata & Versioning**: [`app.json`](file:///c:/Users/Sahil%20Borhade/Desktop/Naukari/app.json) & [`app.config.ts`](file:///c:/Users/Sahil%20Borhade/Desktop/Naukari/app.config.ts)
* **Axios API Client**: [`src/services/api/client.ts`](file:///c:/Users/Sahil%20Borhade/Desktop/Naukari/src/services/api/client.ts)
* **Frontend Environment Variables**: [`.env`](file:///c:/Users/Sahil%20Borhade/Desktop/Naukari/.env)

### 2. Backend (PHP Slim 4)
* **Database DDL / Table Creation Script**: [`php-backend/database.sql`](file:///c:/Users/Sahil%20Borhade/Desktop/Naukari/php-backend/database.sql)
* **Backend Environment Variables**: [`php-backend/.env`](file:///c:/Users/Sahil%20Borhade/Desktop/Naukari/php-backend/.env)
* **Public Entry Point & Routing**: [`php-backend/public/index.php`](file:///c:/Users/Sahil%20Borhade/Desktop/Naukari/php-backend/public/index.php) and [`.htaccess`](file:///c:/Users/Sahil%20Borhade/Desktop/Naukari/php-backend/public/.htaccess)
* **API Route Definitions**: [`php-backend/src/Routes/api.php`](file:///c:/Users/Sahil%20Borhade/Desktop/Naukari/php-backend/src/Routes/api.php)
* **Database Connection (PDO)**: [`php-backend/src/Config/Database.php`](file:///c:/Users/Sahil%20Borhade/Desktop/Naukari/php-backend/src/Config/Database.php)
* **Google Sheets Integration**: [`php-backend/src/Services/GoogleSheetsService.php`](file:///c:/Users/Sahil%20Borhade/Desktop/Naukari/php-backend/src/Services/GoogleSheetsService.php)

---

## 🛠️ PART 1: Deploying the PHP Backend to GoDaddy cPanel

### Step 1: Create the MySQL Database on GoDaddy
1. Log in to **GoDaddy cPanel** (`https://yourdomain.com/cpanel` or `https://yourdomain.com:2083`).
2. Navigate to **Databases → MySQL Database Wizard**.
3. Create Database Name: `naukari_bazaar` (cPanel will prefix it, e.g., `user_naukari_bazaar`).
4. Create Database User: `naukari_user` and set a strong password.
5. Grant **ALL PRIVILEGES** to the user for this database.
6. Note down the full DB Name, DB User, and DB Password.

### Step 2: Import the Database Schema (`database.sql`)
1. In cPanel, click **phpMyAdmin**.
2. Select your newly created database on the left sidebar.
3. Click the **Import** tab at the top.
4. Click **Choose File** and select `php-backend/database.sql` from your project repository.
5. Click **Import** at the bottom. This will create all 4 tables (`users`, `profiles`, `jobs`, `contact_logs`) and populate the catalog seed data.

### Step 3: Set Up Subdomain & Document Root
1. In cPanel, navigate to **Domains → Subdomains** (or **Domains**).
2. Add a new subdomain: `api` (e.g. `api.yourdomain.com`).
3. Set the **Document Root** to: `public_html/api/public`
   > [!IMPORTANT]
   > The Document Root MUST point to the `/public` subfolder inside the backend directory. This ensures `index.php` and `.htaccess` act as the front controller.

### Step 4: Package and Upload the PHP Codebase
1. On your local machine, open terminal in `php-backend/`:
   ```bash
   cd "C:\Users\Sahil Borhade\Desktop\Naukari\php-backend"
   ```
2. Make sure `vendor/` folder is populated by running `composer install`.
3. Create a ZIP archive of the `php-backend` directory **EXCLUDING** `.git`, `logs/`, and `scratch/`.
4. In cPanel, open **File Manager** → navigate to `public_html/api/`.
5. Click **Upload** → upload `php-backend.zip`.
6. Extract the zip file directly inside `public_html/api/`.

### Step 5: Configure Production `.env` File
1. In cPanel File Manager (`public_html/api/`), locate `.env`.
2. Edit the `.env` file with production credentials:
   ```env
   PORT=5000
   
   # Production MySQL Settings
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=cpaneluser_naukari_bazaar
   DB_USER=cpaneluser_naukari_user
   DB_PASSWORD=YourProductionPassword123!

   JWT_SECRET=supersecretjwtkeyfornaukaribazaar
   JWT_REFRESH_SECRET=supersecretjwtrefreshkeyfornaukaribazaar
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_EXPIRES_IN=30d

   SUPPORT_PHONE=+917506710665
   SUPPORT_WHATSAPP=917506710665
   APP_NAME="Naukari Bazaar"
   NODE_ENV=production

   GOOGLE_SHEET_ID=1Wh3N8gxhScetRwEPshTFzOIJlfs_wHc1WFjONDghoV4
   MANAGER_EMAIL=borhadesahil52@gmail.com
   GOOGLE_SERVICE_ACCOUNT_JSON='{ ... }'
   ```
3. Save the `.env` file.

### Step 6: Verify Backend Health
Open your browser and visit:
`https://api.yourdomain.com/api/v1/health`

Expected JSON response:
```json
{
  "success": true,
  "message": "Server is healthy"
}
```

---

## 📱 PART 2: Preparing and Building the React Native Mobile App

### Step 1: Update API Base URL in Code
Open [`src/constants/index.ts`](file:///c:/Users/Sahil%20Borhade/Desktop/Naukari/src/constants/index.ts).

Replace line 25:
```typescript
// OLD (Testing with localtunnel):
// export const API_BASE_URL = 'https://tidy-webs-bake.loca.lt/api/v1';

// NEW (Production GoDaddy Domain):
export const API_BASE_URL = 'https://api.yourdomain.com/api/v1';
```

> [!WARNING]
> Do NOT omit `/api/v1` at the end of the production URL.

### Step 2: Increment Version Numbers in `app.json`
Open [`app.json`](file:///c:/Users/Sahil%20Borhade/Desktop/Naukari/app.json) and update the version strings:
```json
{
  "expo": {
    "name": "Naukari Bazaar",
    "version": "1.1.0",
    "android": {
      "versionCode": 2
    }
  }
}
```

### Step 3: Build Android Production Bundle (AAB)
Open Command Prompt in project root:
```bash
cd "C:\Users\Sahil Borhade\Desktop\Naukari"
eas build --platform android --profile production
```

Wait ~10-15 minutes. EAS will output a download link for your `.aab` binary file.

---

## 📤 PART 3: Uploading to Google Play Console

1. Log in to [Google Play Console](https://play.google.com/console).
2. Select **Naukari Bazaar**.
3. In the left navigation menu, go to **Production** → click **Create new release**.
4. Upload the downloaded `.aab` file.
5. Add Release Notes (e.g. *"Backend performance upgrade and bug fixes"*).
6. Click **Save** → **Next** → **Start Rollout to Production**.

---

## 🔍 Checklist Before Release

- [ ] GoDaddy MySQL database imported cleanly with `database.sql`.
- [ ] Subdomain Document Root set to `public_html/api/public`.
- [ ] Backend health check `https://api.yourdomain.com/api/v1/health` returns `200 OK`.
- [ ] Line 25 of `src/constants/index.ts` updated to production URL.
- [ ] `versionCode` in `app.json` incremented.
- [ ] `.aab` build succeeded and uploaded to Google Play Console.
