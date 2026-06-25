/**
 * WorkerConnect — App Constants
 */

export const APP_NAME = 'RecruitIndia';
export const APP_TAGLINE = 'Connecting Workers with Opportunities';
export const APP_VERSION = '1.0.0';

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@wc:auth_token',
  REFRESH_TOKEN: '@wc:refresh_token',
  USER_PROFILE: '@wc:user_profile',
  SELECTED_LANGUAGE: '@wc:language',
  THEME_MODE: '@wc:theme',
  REGISTRATION_DRAFT: '@wc:reg_draft',
  ONBOARDING_DONE: '@wc:onboarding',
  NOTIFICATIONS_ENABLED: '@wc:notifs',
} as const;

// API
export const API_TIMEOUT = 30000;
export const API_BASE_URL = 'https://api.recruitindia.in/v1';

// OTP
export const OTP_LENGTH = 6;
export const OTP_RESEND_SECONDS = 60;

// Registration
export const TOTAL_REGISTRATION_STEPS = 7;

// Supported Languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

// Job Categories
export const JOB_CATEGORIES = [
  'Construction',
  'Manufacturing',
  'Logistics & Delivery',
  'Domestic Help',
  'Security',
  'Hospitality',
  'Retail',
  'Agriculture',
  'Plumbing & Electrical',
  'Driving',
  'Cleaning',
  'Healthcare Support',
] as const;

// Education Levels
export const EDUCATION_LEVELS = [
  'No Formal Education',
  'Primary School (Up to 5th)',
  'Middle School (Up to 8th)',
  'Secondary (10th Pass)',
  'Higher Secondary (12th Pass)',
  'Diploma / ITI',
  'Graduate',
  'Post Graduate',
] as const;

// Indian States
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh',
] as const;

// Gender
export const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'] as const;

// Experience
export const EXPERIENCE_LEVELS = [
  'Fresher (No Experience)',
  'Less than 1 year',
  '1 - 2 years',
  '2 - 5 years',
  '5 - 10 years',
  'More than 10 years',
] as const;

// Shift Preference
export const SHIFT_PREFERENCES = ['Day', 'Night', 'Rotational', 'Flexible'] as const;

// Salary Range
export const SALARY_RANGES = [
  'Below ₹5,000',
  '₹5,000 - ₹10,000',
  '₹10,000 - ₹15,000',
  '₹15,000 - ₹20,000',
  '₹20,000 - ₹30,000',
  'Above ₹30,000',
] as const;
