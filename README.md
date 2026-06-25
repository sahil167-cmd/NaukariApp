# Naukari Bazaar

> An Enterprise-Grade React Native Mobile Application and Node.js Express/Mongoose backend for connecting underprivileged workers across India with employment opportunities.

## 📱 Project Overview

Naukari Bazaar is a recruitment platform designed specifically for underprivileged workers in India. The application features a dynamic React Native frontend integrated with a robust Express API service and MongoDB database. Features include:

- Multi-language support (11 Indian languages)
- Multi-step registration wizard
- Job preference matching
- Live profile completion tracking and registration verification
- Real-time interaction logging (Call/WhatsApp redirects tracked in database)
- Support system (direct recruiter dialer and WhatsApp redirect)
- Dark/Light theme support

## 🛠 Tech Stack

### Core
- **React Native** (0.85.3)
- **Expo SDK** (56.0.12)
- **TypeScript** (6.0.3)

### State Management
- **Zustand** - Global state management
- **React Query (TanStack)** - Server state management
- **React Native MMKV** - Local persistent storage

### Navigation
- **React Navigation v7**
- Bottom Tab Navigator
- Stack Navigators (Auth, Main, Registration, Settings, Support, Profile)

### UI & Styling
- **React Native Paper** - UI Component library
- **React Native Reanimated** - Animations
- **React Native Gesture Handler** - Touch interactions
- **Expo Linear Gradient** - Gradient backgrounds

### Forms & Validation
- **React Hook Form** - Form state management
- **Yup** - Schema validation

### Localization
- **i18next** - Internationalization
- **react-i18next** - React bindings

### API & Data
- **Axios** - HTTP client
- **React Query** - Data fetching & caching

### Others
- **Expo Image Picker** - Image selection
- **React Native Vector Icons** - Icon library

## 📂 Project Structure

```
src/
├── assets/              # Images, fonts, icons
├── components/
│   └── common/          # Reusable UI components
│       ├── AppTextInput.tsx
│       ├── Buttons.tsx
│       ├── Checkbox.tsx
│       ├── Dropdown.tsx
│       ├── PhoneInput.tsx
│       ├── PrimaryButton.tsx
│       ├── RadioButton.tsx
│       └── StateScreens.tsx
├── constants/           # App constants
├── contexts/            # React contexts
│   └── ThemeContext.tsx
├── hooks/               # Custom React hooks
├── localization/        # i18n configuration
│   └── translations/    # Translation files (11 languages)
├── navigation/          # Navigation configuration
│   ├── AuthNavigator.tsx
│   ├── MainNavigator.tsx
│   ├── ProfileNavigator.tsx
│   ├── RegistrationNavigator.tsx
│   ├── RootNavigator.tsx
│   ├── SettingsNavigator.tsx
│   └── SupportNavigator.tsx
├── screens/
│   ├── authentication/  # Login, OTP, Language Selection, Welcome
│   ├── dashboard/       # Main dashboard
│   ├── profile/         # User profile screens
│   ├── registration/    # Multi-step registration wizard
│   │   └── steps/       # Individual registration steps
│   ├── settings/        # App settings
│   ├── support/         # Help & Support
│   └── SplashScreen.tsx
├── services/
│   └── api/             # API services (Axios)
│       ├── authService.ts
│       ├── client.ts
│       ├── jobService.ts
│       └── userService.ts
├── store/               # Zustand stores
│   ├── authStore.ts
│   ├── registrationStore.ts
│   └── settingsStore.ts
├── theme/               # Design system
│   ├── colors.ts
│   ├── index.ts
│   ├── spacing.ts
│   └── typography.ts
├── types/               # TypeScript types
├── utils/               # Utility functions
│   └── storage.ts
└── validators/          # Form validators
```

## 🏗 Architecture

### Clean Architecture

The app follows Clean Architecture principles with clear separation of concerns:

1. **Presentation Layer** - React components, screens, navigation
2. **Application Layer** - Zustand stores, custom hooks
3. **Domain Layer** - Types, interfaces, business logic
4. **Infrastructure Layer** - API services, storage, external dependencies

### Design Patterns

- **SOLID Principles** - Single Responsibility, Open/Closed, etc.
- **DRY (Don't Repeat Yourself)** - Reusable components and utilities
- **KISS (Keep It Simple, Stupid)** - Simple, maintainable code

## 🚀 Getting Started

See [RUNNING.md](./RUNNING.md) for detailed instructions.

### Quick Start

```bash
# Install dependencies
npm install

# Start Expo
npx expo start

# Run on Android
npx expo start --android
```

## 🌍 Localization

Supports 11 Indian languages:
- English
- Hindi (हिंदी)
- Marathi (मराठी)
- Gujarati (ગુજરાતી)
- Tamil (தமிழ்)
- Telugu (తెలుగు)
- Kannada (ಕನ್ನಡ)
- Malayalam (മലയാളം)
- Punjabi (ਪੰਜਾਬੀ)
- Bengali (বাংলা)
- Odia (ଓଡ଼ିଆ)

## 🎨 Themes

- **Light Theme** - Default cream/orange branding
- **Dark Theme** - Dark mode support
- **System** - Follows device settings

## 📱 Screens

### Authentication Flow
1. Splash Screen
2. Language Selection
3. Welcome Screen
4. Login (Phone Number)
5. OTP Verification
6. Registration Wizard (6 steps)
7. Registration Success
8. Contact Recruiter Screen
9. Dashboard (Access after recruiter contact verification)
2. **Profile** - User profile, experience, job preferences
3. **Support** - FAQ, Help Center, Contact Us
4. **Settings** - Language, theme, notifications, privacy

### Registration Steps
1. Personal Details
2. Address
3. Job Preferences
4. Education & Skills
5. Experience (placeholder)
6. Documents (placeholder)

## 🔐 State Management

### Zustand Stores

- **authStore** - Authentication state, user data, tokens
- **registrationStore** - Multi-step registration draft with autosave
- **settingsStore** - App settings (language, theme, notifications)

### MMKV Persistent Storage

All Zustand stores are persisted using React Native MMKV for fast, encrypted storage.

## 🧪 Testing

Testing framework setup is complete. Tests can be added for:
- Unit tests (Components, Utils, Stores)
- Integration tests (API services, Navigation)
- E2E tests (User flows)

## 📦 Build & Deployment

```bash
# Build for Android
npx expo build:android

# Generate APK
eas build --platform android --profile preview
```

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript strictly
3. Follow the style guide (spacing, typography from theme)
4. Keep components independent and reusable
5. Document complex logic

## 📄 License

See [LICENSE](./LICENSE) file.

## 📞 Support

For issues and questions, refer to [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) and other documentation.

---

**Built with ❤️ for connecting workers with opportunities across India**
