# Production Deployment Guide — Naukari Bazaar Backend

This document details the configuration, build, deployment, and management procedures for running the Naukari Bazaar API in production.

---

## 1. Environment Configurations Checklist

Create the production environment parameters in your hosting provider (Render, Railway, AWS, Docker etc.) using the following template:

| Parameter | Type | Required? | Description |
|---|---|---|---|
| `PORT` | Number | Yes | Port to listen on (e.g. `5000` or custom). |
| `MONGO_URI` | Connection String | Yes | MongoDB Atlas production connection URI. |
| `JWT_SECRET` | Secret String | Yes | Encryption key for signing user access JWT tokens (Must be highly secure). |
| `JWT_REFRESH_SECRET` | Secret String | Yes | Encryption key for signing session refresh tokens. |
| `JWT_EXPIRES_IN` | String | Optional | Token validity period. Default: `7d`. |
| `JWT_REFRESH_EXPIRES_IN` | String | Optional | Refresh token validity period. Default: `30d`. |
| `SUPPORT_PHONE` | String | Yes | Customer helpline number. |
| `SUPPORT_WHATSAPP` | String | Yes | Customer support WhatsApp number. |
| `NODE_ENV` | String | Yes | Run context (`production` or `development`). |
| `APP_VERSION` | String | Optional | Deployment release version. Default: `1.0.0`. |

---

## 2. Platform Specific Deployment Instructions

### 2.1 Render Deployment (Recommended Web Service)
1. Log in to your **Render Dashboard** and select **New +** -> **Web Service**.
2. Connect your Git repository.
3. In the Settings configuration:
   * **Name**: `naukari-backend`
   * **Environment**: `Node`
   * **Region**: Choose the closest region to your user base.
   * **Root Directory**: `backend` (This automatically navigates all builds/runs into the backend folder).
   * **Build Command**: `npm install && npm run build`
   * **Start Command**: `npm run start`
4. Click **Advanced** and define all required environment variables outlined in Section 1.
5. Save and click **Create Web Service**.

### 2.2 Railway Deployment
1. Log in to your **Railway Dashboard** and click **New Project** -> **Deploy from GitHub**.
2. Select your repository.
3. In the Variables settings: Add all environment parameters.
4. In the Service settings, override the root build directory if needed or run commands:
   * **Build Command**: `cd backend && npm install && npm run build`
   * **Start Command**: `cd backend && npm run start`
5. Click **Deploy**.

### 2.3 Docker Deployment
Use the included or configure a Docker container to host the backend server.
Example `Dockerfile` inside the `backend` directory:
```dockerfile
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "run", "start"]
```

---

## 3. Server Health & Verification Endpoints

The API is structured with automated status probes to monitor uptime and health:

- **Root Status Verification (`GET /`)**:
  Verifies the server is online and responding.
  * *Response*: `{ "success": true, "message": "Backend Running Successfully" }`

- **Health Check Probe (`GET /health`)**:
  Verifies database connectivity and server state. Used for monitoring tools.
  * *Response*: `{ "success": true, "status": "UP", "database": "CONNECTED", "timestamp": "..." }`

- **Ready Probe Check (`GET /ready`)**:
  Used by Orchestration systems (Kubernetes/Render/AWS) to routing traffic.
  * *Response*: `{ "success": true, "status": "READY" }` (returns `503 Service Unavailable` if database is down).

- **Metadata Endpoint (`GET /version`)**:
  Retrieves compilation environment details.
  * *Response*: `{ "success": true, "version": "1.0.0", "environment": "production", "uptime": 25.4 }`
