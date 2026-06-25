/**
 * WorkerConnect — Validation Schemas (Yup)
 */

import * as Yup from 'yup';

// Phone: exactly 10 digits, starts with 6-9
export const phoneSchema = Yup.string()
  .required('Phone number is required')
  .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number');

// OTP: 6 digits
export const otpSchema = Yup.string()
  .required('OTP is required')
  .matches(/^\d{6}$/, 'Enter a valid 6-digit OTP');

// Email: optional but valid if provided
export const emailSchema = Yup.string()
  .email('Enter a valid email address')
  .optional();

// Aadhaar: 12 digits
export const aadhaarSchema = Yup.string()
  .matches(/^\d{12}$/, 'Enter a valid 12-digit Aadhaar number')
  .optional();

// PAN: 5 letters + 4 digits + 1 letter
export const panSchema = Yup.string()
  .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Enter a valid PAN (e.g. ABCDE1234F)')
  .optional();

// PIN Code: 6 digits
export const pinCodeSchema = Yup.string()
  .required('PIN Code is required')
  .matches(/^\d{6}$/, 'Enter a valid 6-digit PIN code');

// ── Form Schemas ─────────────────────────────────────────────────────────────

export const loginSchema = Yup.object({
  phone: phoneSchema,
});

export const otpFormSchema = Yup.object({
  otp: otpSchema,
});

export const personalDetailsSchema = Yup.object({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'Minimum 2 characters')
    .max(50, 'Maximum 50 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Minimum 2 characters')
    .max(50, 'Maximum 50 characters'),
  dob: Yup.string()
    .required('Date of birth is required'),
  gender: Yup.string()
    .required('Gender is required'),
  phone: phoneSchema,
  email: emailSchema,
});

export const addressSchema = Yup.object({
  houseNumber: Yup.string().required('House number is required'),
  streetAddress: Yup.string()
    .required('Street address is required')
    .min(5, 'Minimum 5 characters'),
  city: Yup.string().required('City is required'),
  district: Yup.string().required('District is required'),
  state: Yup.string().required('State is required'),
  pinCode: pinCodeSchema,
});

export const jobPreferencesSchema = Yup.object({
  categories: Yup.array()
    .of(Yup.string())
    .min(1, 'Select at least one category')
    .required('Select at least one category'),
  salaryRange: Yup.string().required('Salary range is required'),
  shiftPreference: Yup.string().required('Shift preference is required'),
});

export const educationSchema = Yup.object({
  highestLevel: Yup.string().required('Education level is required'),
  specialization: Yup.string().optional(),
  institutionName: Yup.string().optional(),
  passingYear: Yup.string().optional(),
});

export const experienceSchema = Yup.object({
  companyName: Yup.string()
    .required('Company name is required')
    .min(2, 'Minimum 2 characters'),
  jobRole: Yup.string().required('Job role is required'),
  duration: Yup.string().required('Duration is required'),
  isCurrent: Yup.boolean().default(false),
});

export const documentSchema = Yup.object({
  aadhaarNumber: aadhaarSchema,
  panNumber: panSchema,
});
