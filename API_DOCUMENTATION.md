# Naukari Bazaar API Documentation

This document describes the API endpoints available in the Naukari Bazaar backend server. All API requests are relative to `/api/v1` and return JSON payloads.

---

## Global Headers

For authenticated requests (any request after OTP verification, except when using the permissive local fallback), the following header must be present:
```http
Authorization: Bearer <jwt_access_token>
```

---

## 1. Authentication Endpoints

### 1.1 Request OTP
Initiates a mobile login session by sending an OTP. In development/testing, the response contains a simulated OTP.
* **URL:** `/auth/request-otp`
* **Method:** `POST`
* **Content-Type:** `application/json`
* **Request Body:**
  ```json
  {
    "phone": "7506710665"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "OTP sent successfully to +91 75067 10665",
    "data": {
      "otp": "123456"
    }
  }
  ```
* **Validation Errors (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Validation Error",
    "errors": [
      {
        "type": "field",
        "value": "invalid-phone",
        "msg": "Phone number must be a 10-digit number",
        "path": "phone",
        "location": "body"
      }
    ]
  }
  ```

### 1.2 Verify OTP
Verifies the OTP sent to the user and returns an authentication token and details.
* **URL:** `/auth/verify-otp`
* **Method:** `POST`
* **Content-Type:** `application/json`
* **Request Body:**
  ```json
  {
    "phone": "7506710665",
    "otp": "123456"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "OTP verified successfully",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "60c72b2f9b1d8b2d4c5c2d3a",
        "phone": "7506710665",
        "registrationStatus": "PENDING",
        "registrationComplete": false,
        "language": "en"
      }
    }
  }
  ```
* **Error Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Invalid OTP code provided"
  }
  ```

---

## 2. Registration Wizard Endpoints

### 2.1 Complete Wizard Registration
Finalizes the registration workflow and transitions the user state from `PENDING` to `COMPLETED`. Generates a registration number for the profile (`NB-YYYY-XXXXX`).
* **URL:** `/register`
* **Method:** `POST`
* **Headers:** `Authorization: Bearer <token>`
* **Content-Type:** `application/json`
* **Request Body:**
  ```json
  {
    "personal": {
      "firstName": "Raju",
      "lastName": "Sharma",
      "gender": "Male",
      "dob": "12-05-1996"
    },
    "address": {
      "state": "Maharashtra",
      "city": "Mumbai",
      "district": "Mumbai Suburbs",
      "pincode": "400069"
    },
    "jobPreferences": {
      "categories": ["Construction", "Logistics & Delivery"],
      "salaryRange": "₹15,000 - ₹20,000",
      "shiftPreference": "Day Shift",
      "immediatelyAvailable": true
    },
    "education": {
      "level": "10th Pass",
      "schoolName": "Sharda Mandir High School",
      "passingYear": 2012
    },
    "experience": {
      "hasExperience": true,
      "years": 3,
      "previousJobTitle": "Mason Assistant",
      "previousCompany": "L&T Construction"
    }
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Registration completed successfully",
    "data": {
      "registrationNo": "NB-2026-89472",
      "registrationComplete": true
    }
  }
  ```

---

## 3. Profile Management Endpoints

### 3.1 Get Profile
Retrieves the logged-in user's profile details.
* **URL:** `/profile`
* **Method:** `GET`
* **Headers:** `Authorization: Bearer <token>`
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "personal": {
        "firstName": "Raju",
        "lastName": "Sharma",
        "phone": "7506710665",
        "gender": "Male",
        "dob": "12-05-1996"
      },
      "address": {
        "state": "Maharashtra",
        "city": "Mumbai",
        "district": "Mumbai Suburbs",
        "pincode": "400069"
      },
      "jobPreferences": {
        "categories": ["Construction", "Logistics & Delivery"],
        "salaryRange": "₹15,000 - ₹20,000",
        "shiftPreference": "Day Shift",
        "immediatelyAvailable": true
      },
      "education": {
        "level": "10th Pass",
        "schoolName": "Sharda Mandir High School",
        "passingYear": 2012
      },
      "experience": {
        "hasExperience": true,
        "years": 3,
        "previousJobTitle": "Mason Assistant",
        "previousCompany": "L&T Construction"
      },
      "completionPercentage": 100,
      "registrationNo": "NB-2026-89472"
    }
  }
  ```

### 3.2 Update Profile Draft
Updates a section of the user's profile during registration or settings update. Dynamically recalculates the Profile Completion Percentage.
* **URL:** `/profile`
* **Method:** `PATCH`
* **Headers:** `Authorization: Bearer <token>`
* **Content-Type:** `application/json`
* **Request Body (Partial Update Example):**
  ```json
  {
    "personal": {
      "firstName": "Raju",
      "lastName": "Sharma",
      "gender": "Male",
      "dob": "12-05-1996"
    }
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Profile updated successfully",
    "data": {
      "completionPercentage": 40
    }
  }
  ```

---

## 4. Dashboard Endpoints

### 4.1 Get Dashboard Overview
Loads statistics, application settings, registration numbers, user details, and job recommendations based on user category preferences.
* **URL:** `/dashboard`
* **Method:** `GET`
* **Headers:** `Authorization: Bearer <token>`
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "60c72b2f9b1d8b2d4c5c2d3a",
        "phone": "7506710665",
        "name": "Raju Sharma"
      },
      "summary": {
        "registrationNo": "NB-2026-89472",
        "completionPercentage": 100,
        "matchingJobsCount": 3,
        "appliedJobsCount": 0
      },
      "jobs": [
        {
          "_id": "60c72b2f9b1d8b2d4c5c2d4b",
          "title": "Construction Helper",
          "company": "BuildFast Infra Pvt. Ltd.",
          "location": "Andheri, Mumbai",
          "salary": "₹12,000 - ₹15,000",
          "category": "Construction",
          "type": "Full Time",
          "description": "Looking for experienced construction helpers for ongoing residential projects in Andheri.",
          "isVerified": true,
          "urgentHiring": true
        }
      ]
    }
  }
  ```

---

## 5. Job Endpoints

### 5.1 List Jobs
Retrieves standard job listings with optional filtering by categories.
* **URL:** `/jobs`
* **Method:** `GET`
* **Headers:** `Authorization: Bearer <token>`
* **Query Parameters:** `category=Construction` (optional)
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "60c72b2f9b1d8b2d4c5c2d4b",
        "title": "Construction Helper",
        "company": "BuildFast Infra Pvt. Ltd.",
        "location": "Andheri, Mumbai",
        "salary": "₹12,000 - ₹15,000",
        "category": "Construction",
        "type": "Full Time",
        "isVerified": true,
        "urgentHiring": true
      }
    ]
  }
  ```

### 5.2 Apply for Job
Applies the authenticated user to a specific job listing.
* **URL:** `/jobs/:id/apply`
* **Method:** `POST`
* **Headers:** `Authorization: Bearer <token>`
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Applied to job successfully"
  }
  ```

---

## 6. Interaction Redirection Logging

### 6.1 Log Recruiter Contact
Records clicks on call support or WhatsApp support buttons for auditing and support optimization.
* **URL:** `/contact-logs`
* **Method:** `POST`
* **Headers:** `Authorization: Bearer <token>`
* **Content-Type:** `application/json`
* **Request Body:**
  ```json
  {
    "actionType": "CALL",
    "device": "Android",
    "platform": "android"
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Redirection logged successfully",
    "data": {
      "id": "60c72b2f9b1d8b2d4c5c2d6f"
    }
  }
  ```
