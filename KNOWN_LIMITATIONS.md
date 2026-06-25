# Naukari Bazaar Known Limitations

This document lists developer constraints, architecture fallbacks, and items that require modification before taking this project into production.

---

## 1. Authentication & Simulated SMS Gateway
* **SMS Gateway Integration:** The backend server uses simulated OTP logic. When calling `/auth/request-otp`, the API mocks sending an SMS message and returns the passcode `123456` in the payload for local development efficiency.
* **Production Action:** To go live, this logic must be integrated with a real SMS gateway api provider like Twilio, Gupshup, or Firebase Auth.

---

## 2. Permissive Local Development Auth Fallback
* **Fallback Validation:** In `backend/src/middleware/authMiddleware.ts`, a permissive check automatically logs in a test user (`Raju Sharma` / `8976478247`) if no token or an invalid Bearer token is provided. This allows developers to test dashboard APIs and register workflows immediately in Metro Bundler without getting locked out.
* **Production Action:** The fallback mechanism MUST be commented out or set to trigger only when `NODE_ENV === 'development'` before staging deploy, to enforce strict JWT validation.

---

## 3. Media Upload Fallback
* **Cloudinary Mocking:** Avatar profile image uploads in the wizard fallback to static image paths in local storage because the default backend cloud configuration fields (`CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET`) are left empty in development.
* **Production Action:** Configure a CDN or cloud bucket storage like AWS S3 or Cloudinary in the `.env` settings to enable real remote profile picture rendering.

---

## 4. Hardcoded Support Details
* **Support Number:** The support number (`+91 89764 78247`) and WhatsApp chat redirect references are configured via environment config files. If missing, it uses default values.
* **Production Action:** Keep these environment config settings synchronized across deployments so clients redirect to active call center numbers.
