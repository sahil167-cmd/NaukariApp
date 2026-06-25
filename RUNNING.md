# Running the Naukari Bazaar Application (Phase 2)

This guide provides step-by-step instructions to set up and run both the Express backend API and the React Native frontend application.

---

## 1. Prerequisites

Ensure you have the following installed on your development machine:
1. **Node.js** (v18 or v20 recommended)
2. **MongoDB Community Server** (running locally on port `27017`)
3. **Expo Go** app (installed on your mobile device, if testing on physical hardware)

---

## 2. Running the Backend Server

The backend is built with Express, TypeScript, and Mongoose.

1. **Navigate to the Backend Directory:**
   ```bash
   cd backend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `backend/` directory using the provided `.env.example` as a template.
   ```bash
   cp .env.example .env
   ```
   Verify that `MONGO_URI` is pointing to your active MongoDB instance (e.g. `mongodb://127.0.0.1:27017/naukari-bazaar`).

4. **Seed the Database:**
   Populate MongoDB with default job listings:
   ```bash
   npm run seed
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The backend server will launch on port `5000` (i.e. `http://127.0.0.1:5000`).

---

## 3. Running the React Native App (Frontend)

1. **Navigate to the Root Directory:**
   ```bash
   cd ..
   ```

2. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

3. **Configure the Development API URL:**
   React Native runs on an emulator or physical device and cannot easily access `localhost` or `127.0.0.1` directly.
   * Create a `.env` file in the root directory:
     ```env
     API_BASE_URL=http://<YOUR_LAN_IP_ADDRESS>:5000/api/v1
     ```
   * Replace `<YOUR_LAN_IP_ADDRESS>` with your computer's local network IP address (e.g., `192.168.1.15`).
   * If you are running on the Android Emulator, you can use `http://10.0.2.2:5000/api/v1` as the base URL.

4. **Start the Metro Bundler:**
   ```bash
   npx expo start --clear
   ```
   This will boot the Metro bundler. Scan the QR code using Expo Go on your mobile device or press `a` to run on the Android Emulator.
