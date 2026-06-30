# Disaster Recovery & Developer Setup Guide

This guide explains how to restore the **Naukari Bazaar** application from scratch on any new development machine.

---

## 1. Prerequisites

Ensure your machine has the following tools installed:
1.  **Node.js** (v18 or v20)
2.  **MongoDB Community Server** (running locally on port `27017`)
3.  **Git**
4.  **Expo Go** app (installed on your Android or iOS testing device)

---

## 2. Cloning the Project

To restore the project from GitHub, run:
```bash
git clone https://github.com/sahil167-cmd/NaukariApp.git
cd NaukariApp
git checkout recovery-2026-06-27
```

---

## 3. Configuring the Backend

### Step 1: Install Dependencies
Navigate into the `backend/` folder and install NPM packages:
```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables
Create a new file named `.env` inside the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/naukari-bazaar
JWT_SECRET=supersecretjwtkeyfornaukaribazaar
JWT_REFRESH_SECRET=supersecretjwtrefreshkeyfornaukaribazaar
SUPPORT_PHONE=7506710665
SUPPORT_WHATSAPP=7506710665
APP_NAME=Naukari Bazaar
```

### Step 3: Seed Database
Populate your local MongoDB instance with test data:
```bash
npm run seed
```

### Step 4: Run Backend
Launch the Express API server in development mode:
```bash
npm run dev
```
*(The server will start listening on `http://localhost:5000`)*.

---

## 4. Configuring the Frontend (React Native)

### Step 1: Install Dependencies
Navigate back to the project root directory and install NPM packages:
```bash
cd ..
npm install
```

### Step 2: Configure Environment Variables
Create a new file named `.env` in the root folder. You must set the `API_BASE_URL` to your computer's current local network IP or localtunnel URL:

**For local network (Recommended):**
1. Get your computer's IP address (e.g. run `ipconfig` and look for the IPv4 Address under your active Wi-Fi adapter).
2. Set your root `.env` to:
   ```env
   SUPPORT_PHONE=+917506710665
   SUPPORT_WHATSAPP=+917506710665
   API_BASE_URL=http://<YOUR_COMPUTER_IP>:5000/api/v1
   ```

**For Emulator:**
Set the root `.env` to:
```env
API_BASE_URL=http://10.0.2.2:5000/api/v1
```

### Step 3: Start Metro Server
```bash
npx expo start --clear
```
Scan the QR code with **Expo Go** on your physical phone, or press **`a`** to load it in the Android Emulator.

---

## 5. Building the App with EAS (Android)

To generate a standalone `.apk` or `.aab` package for the Google Play Store:
1. Log in to your Expo account:
   ```bash
   npx eas-cli login
   ```
2. Build the app using your EAS configurations (defined in `eas.json`):
   *   **For internal testing (.apk):**
       ```bash
       npx eas-cli build --platform android --profile development
       ```
   *   **For Google Play Store submission (.aab):**
       ```bash
       npx eas-cli build --platform android --profile production
       ```
