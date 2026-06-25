# WorkerConnect - Project Structure Documentation

This document provides a comprehensive overview of the project structure and organization.

## 📁 Root Directory

```
WorkerConnect/
├── assets/                 # Static assets
├── src/                    # Source code
├── .git/                   # Git repository
├── .gitignore             # Git ignore rules
├── App.tsx                # App entry point
├── app.json               # Expo configuration
├── index.ts               # Metro bundler entry
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript configuration
├── README.md              # Project overview
├── RUNNING.md             # Setup & running instructions
├── PROJECT_STRUCTURE.md   # This file
├── COMPONENT_GUIDE.md     # Component usage guide
└── LICENSE                # License file
```

## 📱 Source Directory (`src/`)

### `/assets`
Static resources like images, fonts, and icons.

```
assets/
├── android-icon-background.png
├── android-icon-foreground.png
├── android-icon-monochrome.png
├── favicon.png
├── icon.png
└── splash-icon.png
```

### `/components/common`
Reusable UI components used throughout the app.

```
common/
├── AppTextInput.tsx       # Text input with label & error
├── Buttons.tsx            # Secondary & Outlined buttons
├── Checkbox.tsx           # Checkbox component
├── Dropdown.tsx           # Dropdown select component
├── PhoneInput.tsx         # Phone number input
├── PrimaryButton.tsx      # Primary action button
├── RadioButton.tsx        # Radio button component
└── StateScreens.tsx       # Loader, Error, Empty screens
```

**Key Components:**
- **AppTextInput**: Consistent text input with validation
- **PrimaryButton**: Main CTA button with loading state
- **Dropdown**: Modal-based select component
- **StateScreens**: Loading, error, and empty state screens

### `/constants`
App-wide constants and configuration.

```typescript
// Example usage
import { APP_NAME, STORAGE_KEYS, SUPPORTED_LANGUAGES } from '@/constants';
```

**Key Constants:**
- `APP_NAME`, `APP_VERSION`
- `API_BASE_URL`, `API_TIMEOUT`
- `STORAGE_KEYS` - MMKV storage keys
- `SUPPORTED_LANGUAGES` - 11 Indian languages
- `JOB_CATEGORIES` - Job category options
- `INDIAN_STATES` - List of all states

### `/contexts`
React Context providers.

```
contexts/
└── ThemeContext.tsx       # Theme provider (Light/Dark)
```

**ThemeContext:**
- Provides theme object to entire app
- Handles theme switching
- Supports system theme detection

### `/hooks`
Custom React hooks (currently empty, ready for expansion).

**Potential hooks:**
- `useAuth()` - Authentication helpers
- `useApi()` - API call wrapper
- `useDebounce()` - Debouncing utility
- `useForm()` - Form management

### `/localization`
Internationalization (i18n) configuration.

```
localization/
├── i18n.ts                # i18next configuration
└── translations/
    ├── en.json            # English
    ├── hi.json            # Hindi
    ├── mr.json            # Marathi
    ├── gu.json            # Gujarati
    ├── ta.json            # Tamil
    ├── te.json            # Telugu
    └── others.json        # Kannada, Malayalam, Punjabi, Bengali, Odia
```

**Usage:**
```typescript
import { useTranslation } from 'react-i18next';

const { t, i18n } = useTranslation();
const title = t('app.name'); // "RecruitIndia"
i18n.changeLanguage('hi');   // Switch to Hindi
```

### `/navigation`
Navigation configuration using React Navigation v7.

```
navigation/
├── RootNavigator.tsx         # Root navigator (Auth/Main switch)
├── AuthNavigator.tsx         # Authentication stack
├── MainNavigator.tsx         # Bottom tab navigator
├── RegistrationNavigator.tsx # Registration wizard stack
├── ProfileNavigator.tsx      # Profile stack
├── SettingsNavigator.tsx     # Settings stack
└── SupportNavigator.tsx      # Support stack
```

**Navigation Flow:**
```
Root
├── Auth Stack (unauthenticated)
│   ├── LanguageSelection
│   ├── Welcome
│   ├── Login
│   ├── OTPVerification
│   └── Registration
│       ├── RegistrationWizard (6 steps)
│       └── RegistrationSuccess
└── Main Tabs (authenticated)
    ├── Dashboard
    ├── Profile
    ├── Support
    └── Settings
```

### `/screens`
All application screens organized by feature.

```
screens/
├── authentication/
│   ├── LanguageSelectionScreen.tsx
│   ├── WelcomeScreen.tsx
│   ├── LoginScreen.tsx
│   └── OTPVerificationScreen.tsx
├── registration/
│   ├── RegistrationWizardScreen.tsx
│   ├── RegistrationSuccessScreen.tsx
│   └── steps/
│       ├── PersonalDetailsStep.tsx
│       ├── AddressStep.tsx
│       ├── JobPreferencesStep.tsx
│       └── EducationStep.tsx
├── dashboard/
│   └── DashboardScreen.tsx
├── profile/
│   └── ProfileHomeScreen.tsx
├── settings/
│   ├── SettingsHomeScreen.tsx
│   ├── NotificationsScreen.tsx
│   ├── PrivacyPolicyScreen.tsx
│   ├── TermsScreen.tsx
│   └── AboutCompanyScreen.tsx
├── support/
│   ├── SupportHomeScreen.tsx
│   ├── FAQScreen.tsx
│   ├── HelpScreen.tsx
│   └── ContactUsScreen.tsx
└── SplashScreen.tsx
```

**Screen Responsibilities:**
- **SplashScreen**: App launch animation
- **Authentication**: User onboarding flow
- **Registration**: Multi-step profile creation
- **Dashboard**: Home screen with status cards
- **Profile**: User profile management
- **Settings**: App configuration
- **Support**: Help and contact options

### `/services/api`
API service layer using Axios.

```
api/
├── client.ts              # Axios instance with interceptors
├── authService.ts         # Authentication APIs
├── userService.ts         # User profile APIs
└── jobService.ts          # Job listing APIs
```

**Features:**
- Automatic token injection
- Token refresh on 401
- Error normalization
- Request/response interceptors

**Usage:**
```typescript
import { authService } from '@/services/api/authService';

const response = await authService.verifyOTP({ phone, otp });
```

### `/store`
Zustand stores with MMKV persistence.

```
store/
├── authStore.ts           # Auth state & user data
├── registrationStore.ts   # Multi-step form draft
└── settingsStore.ts       # App settings (language, theme)
```

**authStore:**
- User authentication state
- JWT tokens management
- Login/logout actions

**registrationStore:**
- Multi-step registration data
- Autosave on each step
- Step navigation

**settingsStore:**
- Language preference
- Theme mode (light/dark/system)
- Notification preferences

**Usage:**
```typescript
import { useAuthStore } from '@/store/authStore';

const { user, isAuthenticated, login, logout } = useAuthStore();
```

### `/theme`
Design system tokens and theming.

```
theme/
├── colors.ts              # Color palette & tokens
├── typography.ts          # Font sizes, weights, styles
├── spacing.ts             # Spacing scale, border radius, shadows
└── index.ts               # Theme composition
```

**Design Tokens:**

**Colors:**
- Brand colors (orange palette)
- Neutral colors (cream/gray)
- Semantic colors (success, error, warning, info)
- Light & Dark theme variants

**Typography:**
- Font scales: xs, sm, base, md, lg, xl, 2xl, 3xl
- Text styles: h1-h5, body1-2, caption, button, label

**Spacing:**
- 8pt grid system
- Spacing scale: 0-24 (0px to 96px)
- Border radius: sm, base, md, lg, xl, 2xl, 3xl, full
- Shadow presets: sm, base, md, lg, xl

**Usage:**
```typescript
import { useTheme } from '@/contexts/ThemeContext';
import { spacing, borderRadius } from '@/theme/spacing';
import { textStyles } from '@/theme/typography';

const { colors } = useTheme();

const styles = StyleSheet.create({
  container: {
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
  },
  title: {
    ...textStyles.h2,
    color: colors.textPrimary,
  },
});
```

### `/types`
TypeScript type definitions.

**Key Types:**
- `User`, `UserProfile`
- `AuthTokens`, `OTPRequest`, `OTPVerifyRequest`
- `RegistrationDraft`, `RegistrationStep`
- `PersonalDetails`, `AddressDetails`, `JobPreferences`
- Navigation param lists
- `ApiResponse<T>`, `PaginatedResponse<T>`

### `/utils`
Utility functions and helpers.

```
utils/
└── storage.ts             # MMKV storage wrapper
```

**Storage Utilities:**
- Type-safe storage wrapper
- Encrypted MMKV storage
- String, Boolean, Object storage
- Clear all data

### `/validators`
Form validation schemas (Yup).

**Potential validators:**
- Phone number validation
- Email validation
- Aadhaar number validation
- PIN code validation

## 🗂 File Naming Conventions

### Components
- PascalCase: `PrimaryButton.tsx`
- One component per file
- Co-locate styles with component

### Screens
- PascalCase with "Screen" suffix: `LoginScreen.tsx`
- Descriptive names: `LanguageSelectionScreen.tsx`

### Utilities & Helpers
- camelCase: `storage.ts`, `validators.ts`

### Types
- PascalCase for interfaces/types
- Descriptive names: `AuthTokens`, `ApiResponse<T>`

## 📦 Module Organization

### Imports Order
```typescript
// 1. External libraries
import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 2. Internal modules (absolute paths)
import { useTheme } from '@/contexts/ThemeContext';
import { useAuthStore } from '@/store/authStore';
import PrimaryButton from '@/components/common/PrimaryButton';

// 3. Relative imports
import { styles } from './styles';
import { helper } from '../utils';

// 4. Types
import type { User } from '@/types';
```

### Barrel Exports
Use `index.ts` for cleaner imports:

```typescript
// src/components/common/index.ts
export { default as PrimaryButton } from './PrimaryButton';
export { default as AppTextInput } from './AppTextInput';

// Usage
import { PrimaryButton, AppTextInput } from '@/components/common';
```

## 🔧 Configuration Files

### `app.json`
Expo configuration:
- App name, version
- Splash screen
- Icons
- Android configuration
- iOS configuration (if needed)

### `tsconfig.json`
TypeScript configuration:
- Strict mode enabled
- Target: ESNext
- Module: ESNext
- Extends: expo/tsconfig.base

### `package.json`
Dependencies and scripts:
- `start`: Start Expo dev server
- `android`: Run on Android
- `ios`: Run on iOS (if configured)
- `web`: Run on web (if configured)

## 🚀 Scalability Considerations

### Adding New Features

1. **New Screen:**
   - Create screen in appropriate `/screens` subfolder
   - Add to relevant navigator
   - Update types for navigation params

2. **New Component:**
   - Add to `/components/common` if reusable
   - Create feature-specific folder if needed
   - Export from `index.ts` for cleaner imports

3. **New Store:**
   - Create in `/store`
   - Add MMKV persistence if needed
   - Define clear actions and selectors

4. **New API Service:**
   - Add to `/services/api`
   - Use existing `client.ts` for consistency
   - Handle errors properly

### Code Organization Best Practices

- Keep components under 300 lines
- Extract logic into custom hooks
- Use composition over inheritance
- Follow SOLID principles
- Write self-documenting code

---

**This structure supports rapid development while maintaining code quality and scalability.**
