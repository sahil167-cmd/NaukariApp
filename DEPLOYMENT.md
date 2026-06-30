# Naukari Bazaar Deployment Guide

This document provides deployment guidelines for running Naukari Bazaar in production environments.

---

## 1. Backend Server Deployment (Express + Node.js)

### Recommended Environment: AWS (Elastic Beanstalk / EC2) or Heroku or Render
* **Node Version:** Node.js v20.x
* **Database:** MongoDB Atlas (M0/M10 Cluster)

### Step-by-Step Production Setup:
1. **Set Up MongoDB Atlas:**
   * Create a MongoDB Atlas account.
   * Launch a cluster and obtain the production connection URI.
   * Add database access credentials and configure Network Security (Whitelist IP addresses or allow from anywhere `0.0.0.0/0`).

2. **Environment Variables Configuration:**
   Create a `.env` file on your server (or add config vars in your cloud control panel):
   ```env
   PORT=80
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/naukaribazaar?retryWrites=true&w=majority
   JWT_SECRET=YOUR_PRODUCTION_SECURE_JWT_SECRET
   JWT_REFRESH_SECRET=YOUR_PRODUCTION_SECURE_REFRESH_SECRET
   SUPPORT_PHONE=7506710665
   SUPPORT_WHATSAPP=7506710665
   NODE_ENV=production
   ```

3. **Deploy Source Files:**
   Clone the repository to the production server and install dependencies:
   ```bash
   cd backend
   npm ci
   ```

4. **Build and Start Production Server:**
   Compile TypeScript files into standard ES5 output, seed defaults, and run using a process manager like `PM2`:
   ```bash
   # Compile TS to JS
   npm run build
   
   # Seed default job listings if database is empty
   npm run seed
   
   # Start with PM2
   npm install -g pm2
   pm2 start dist/server.js --name "naukari-bazaar-api"
   ```

---

## 2. Frontend Mobile App Deployment (React Native + Expo)

### Recommended Platform: Expo Application Services (EAS)

### Step-by-Step Production Bundling:
1. **Install EAS CLI globally:**
   ```bash
   npm install -g eas-cli
   ```

2. **Configure your Expo account:**
   Authenticate with your Expo account credentials:
   ```bash
   eas login
   ```

3. **Initialize EAS Project:**
   ```bash
   eas project:init
   ```

4. **Prepare `eas.json` Config:**
   Review your EAS profile build configurations:
   ```json
   {
     "cli": {
       "version": ">= 9.0.0"
     },
     "build": {
       "development": {
         "developmentClient": true,
         "distribution": "internal"
       },
       "preview": {
         "distribution": "internal"
       },
       "production": {
         "env": {
           "API_BASE_URL": "https://api.naukaribazaar.in/api/v1"
         }
       }
     },
     "submit": {
       "production": {}
     }
   }
   ```

5. **Trigger Android Build (.aab or .apk):**
   * Generate an Android App Bundle (`.aab`) to submit directly to Google Play Console:
     ```bash
     eas build --platform android --profile production
     ```
   * Or build a standalone Android package (`.apk`) to share internally:
     ```bash
     eas build --platform android --profile preview
     ```

6. **Trigger iOS Build (.ipa):**
   Submit an Apple build profile (requires Apple Developer Program membership):
   ```bash
   eas build --platform ios --profile production
   ```
