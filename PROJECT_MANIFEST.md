# Project Manifest - Naukari Bazaar

This manifest outlines the technical architecture, directory structure, database collections, configurations, and dependencies of the Naukari Bazaar application.

---

## 1. Technical Stack

*   **Frontend:** React Native (Expo SDK 54, TypeScript)
*   **Navigation:** React Navigation (Native Stack, Bottom Tabs)
*   **State Management:** Zustand
*   **Styling:** StyleSheet (Vanilla React Native)
*   **Backend:** Node.js (Express, TypeScript)
*   **Database:** MongoDB (using Mongoose ODM)
*   **Data Fetching:** Axios, TanStack React Query (v5)

---

## 2. Directory Structure

```
Naukari/
├── .expo/                       # Local Expo cache (ignored)
├── assets/                      # Application icons, logos, and splash screen images
├── backend/                     # Node.js / Express Backend
│   ├── src/
│   │   ├── config/              # Server config and DB connections
│   │   ├── controllers/         # Express router request handlers (Auth, Profile, Jobs)
│   │   ├── middleware/          # JWT Auth validation and payload schemas
│   │   ├── models/              # Mongoose DB schemas (User, Job, Language, etc.)
│   │   ├── routes/              # Express API endpoints
│   │   └── server.ts            # Entrypoint file for the API
│   ├── tsconfig.json
│   └── package.json
├── src/                         # React Native Frontend
│   ├── components/              # Shared UI components (Input, Buttons, Cards)
│   ├── constants/               # Stylesheets, colors, layout sizing, and static configs
│   ├── contexts/                # Theme contexts (Light / Dark mode)
│   ├── localization/            # Multi-language translations (Hindi, English, etc.)
│   ├── navigation/              # React Navigation routers (Auth and Main app tab stacks)
│   ├── screens/                 # Mobile Screens (Dashboard, Auth, Support, Settings)
│   ├── services/                # Axios configuration and API endpoints integrations
│   ├── store/                   # Zustand state stores (Auth, Settings, Registration)
│   ├── utils/                   # Shared utilities (mmkv storage, safe-area hooks)
│   └── validators/              # Input validation rules (Yup schemas)
├── app.json                     # Static Expo settings (linked to EAS ID)
├── app.config.ts                # Dynamic Expo settings
├── eas.json                     # EAS Build profiles (development, preview, production)
└── package.json                 # Frontend dependencies
```

---

## 3. Database Collections (MongoDB)

*   **`users`**: User records, registration status, verification timestamps.
*   **`profiles`**: Full user profiles containing contact details, address, preferences, experience, and uploaded files.
*   **`jobs`**: Job listings, descriptions, salary ranges, requirements, and recruiter details.
*   **`settings`**: Application configuration and default parameters.
*   **`languages`**: Supported UI languages and localized names.
*   **`supportrequests`**: Support logs, complaints, and recruiter contact requests.
*   **`auditlogs`**: Administrative audit history tracking database actions.

---

## 4. Environment Variables

### Frontend (`.env` in root)
*   `API_BASE_URL`: URL pointing to the active Express backend (e.g. local IP `http://192.168.x.x:5000/api/v1` or localtunnel URL).
*   `SUPPORT_PHONE`: Default customer helpline number.
*   `SUPPORT_WHATSAPP`: WhatsApp contact link for direct customer assistance.

### Backend (`.env` in backend/)
*   `PORT`: Port for Express server (defaults to `5000`).
*   `MONGO_URI`: MongoDB connection string.
*   `JWT_SECRET` / `JWT_REFRESH_SECRET`: Secrets for signing secure access tokens.
