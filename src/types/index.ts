/**
 * WorkerConnect — TypeScript Types
 */

// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  profileImage?: string;
  isVerified: boolean;
  registrationComplete: boolean;
  createdAt: string;
}

export interface UserProfile {
  userId: string;
  personal: PersonalDetails;
  address: AddressDetails;
  jobPreferences: JobPreferences;
  education: EducationDetails;
  experience: ExperienceDetails[];
  documents: DocumentDetails;
  completionPercentage: number;
}

// ─── Registration ─────────────────────────────────────────────────────────────

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  phone: string;
  email?: string;
  profilePhoto?: string;
}

export interface AddressDetails {
  houseNumber: string;
  streetAddress: string;
  landmark?: string;
  city: string;
  district: string;
  state: string;
  pinCode: string;
}

export interface JobPreferences {
  categories: string[];
  salaryRange: string;
  preferredLocations: string[];
  shiftPreference: string;
  immediatelyAvailable: boolean;
  willingToRelocate: boolean;
}

export interface EducationDetails {
  highestLevel: string;
  specialization?: string;
  institutionName?: string;
  passingYear?: string;
}

export interface ExperienceDetails {
  id: string;
  companyName: string;
  jobRole: string;
  duration: string;
  location?: string;
  skills?: string[];
  isCurrent: boolean;
}

export interface DocumentDetails {
  aadhaarNumber?: string;
  aadhaarPhoto?: string;
  panNumber?: string;
  panPhoto?: string;
  profilePhoto?: string;
}

export type RegistrationStep = 1 | 2 | 3 | 4 | 5 | 6;

export interface RegistrationDraft {
  currentStep: RegistrationStep;
  personal?: Partial<PersonalDetails>;
  address?: Partial<AddressDetails>;
  jobPreferences?: Partial<JobPreferences>;
  education?: Partial<EducationDetails>;
  experience?: Partial<ExperienceDetails>[];
  documents?: Partial<DocumentDetails>;
  lastSavedAt?: string;
}

// ─── Job ─────────────────────────────────────────────────────────────────────

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  category: string;
  type: 'Full Time' | 'Part Time' | 'Contract' | 'Daily Wage';
  description: string;
  postedAt: string;
  isBookmarked?: boolean;
  isVerified: boolean;
  urgentHiring?: boolean;
  logo?: string;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface OTPRequest {
  phone: string;
}

export interface OTPVerifyRequest {
  phone: string;
  otp: string;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// ─── Navigation ──────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Registration: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  LanguageSelection: undefined;
  Welcome: undefined;
  Login: undefined;
  OTPVerification: { phone: string };
  Registration: undefined;
  RegistrationSuccess: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Profile: undefined;
  Support: undefined;
  Settings: undefined;
};

export type RegistrationStackParamList = {
  RegistrationWizard: { step?: RegistrationStep };
  RegistrationSuccess: undefined;
  ContactRecruiter: undefined;
};

export type SupportStackParamList = {
  SupportHome: undefined;
  FAQ: undefined;
  Help: undefined;
  ContactUs: undefined;
};

export type SettingsStackParamList = {
  SettingsHome: undefined;
  Notifications: undefined;
  PrivacyPolicy: undefined;
  Terms: undefined;
  AboutCompany: undefined;
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
};

// ─── Notification ─────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'job' | 'system' | 'alert' | 'info';
  isRead: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
}

// ─── Settings ────────────────────────────────────────────────────────────────

export interface AppSettings {
  language: string;
  themeMode: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  jobAlerts: boolean;
  smsAlerts: boolean;
}
