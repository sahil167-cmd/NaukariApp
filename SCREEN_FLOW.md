# SCREEN_FLOW.md — Navigation & Screen Flow

## Navigation Architecture

The app uses a **state-machine-based navigation** pattern (no React Navigation stack nesting) for simplicity and predictability.

---

## Full Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    APP LAUNCH                           │
└──────────────────────────┬──────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │   SPLASH    │ (3.5s animated)
                    └──────┬──────┘
                           │
              ┌────────────▼────────────┐
              │  LANGUAGE SELECTION     │ (11 Indian languages)
              └────────────┬────────────┘
                           │ Select + CONTINUE
              ┌────────────▼────────────┐
              │     WELCOME SCREEN      │
              └──────┬──────────┬───────┘
                     │          │
               REGISTER       LOGIN
                     │          │
              ┌──────▼──────────▼──────┐
              │     LOGIN SCREEN        │ (Phone number)
              └────────────┬────────────┘
                           │ SEND OTP
              ┌────────────▼────────────┐
              │   OTP VERIFICATION      │ (6-digit, 60s timer)
              └────────────┬────────────┘
                           │ VERIFY SUCCESS
              ┌────────────▼────────────┐
              │   New User?             │
              └──────┬──────────┬───────┘
                   YES          NO
                     │          │
          ┌──────────▼──┐    ┌──▼───────────────────────┐
          │ REGISTRATION │    │     MAIN APP (Tabs)       │
          │   WIZARD     │    │                          │
          └──────────────┘    └──────────────────────────┘
```

---

## Registration Wizard Flow

```
┌────────────────────────────────────────────────────────────┐
│                  REGISTRATION WIZARD                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Step Progress: ●●●●●●●  (1 of 7)                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  STEP 1: Personal Details ──────────────────────────────── │
│    Photo Upload | First Name | Last Name | DOB | Gender    │
│    Phone | Email                                            │
│                                                             │
│  STEP 2: Address ───────────────────────────────────────── │
│    House No | Street | Landmark | City | District           │
│    State (searchable) | PIN Code                            │
│                                                             │
│  STEP 3: Job Preferences ───────────────────────────────── │
│    Job Categories (chips) | Salary Range | Shift            │
│    Immediately Available | Willing to Relocate              │
│                                                             │
│  STEP 4: Education ─────────────────────────────────────── │
│    Level | Specialization | Institution | Year              │
│                                                             │
│  STEP 5: Experience ────────────────────────────────────── │
│    Fresher checkbox OR Dynamic experience entries           │
│    Company | Role | Duration | Location | Current?          │
│                                                             │
│  STEP 6: Documents ─────────────────────────────────────── │
│    Aadhaar Number | Aadhaar Photo | PAN | PAN Photo         │
│                                                             │
│  STEP 7: Review ────────────────────────────────────────── │
│    Full profile review with Edit buttons per section        │
│    SUBMIT APPLICATION                                       │
└────────────────────────────────────────────────────────────┘
          │
          │ On Success
          ▼
┌─────────────────────┐
│  REGISTRATION       │
│  SUCCESS SCREEN     │  (animated checkmark)
└──────────┬──────────┘
           │
    ┌──────▼──────┐
    │  MAIN APP   │
    └─────────────┘
```

---

## Main App Tabs

```
┌────────────────────────────────────────────────────────────┐
│                    MAIN APP                                 │
│                                                             │
│  ┌──────────┬──────────┬──────────┬──────────┐            │
│  │Dashboard │ Profile  │ Support  │ Settings │  ← Bottom  │
│  │  (Home)  │          │          │          │     Tabs   │
│  └──────────┴──────────┴──────────┴──────────┘            │
└────────────────────────────────────────────────────────────┘
```

### Dashboard Tab
```
Dashboard
├── Greeting Header (orange background)
├── Profile Completion Banner
├── Stats Row (Applied/Views/Saved)
└── Jobs For You (FlatList with JobCards)
```

### Profile Tab
```
Profile
├── Header (orange)
├── Profile Card (avatar, name, completion %)
└── Sections (Personal, Address, Job, Education, Experience, Documents)
    └── Each → Edit screen (TODO: future)
```

### Support Tab (Sub-stack)
```
Support Home
├── FAQ →
├── Help Center →
├── Contact Us →
└── About Company (→ goes to Settings sub-screen)
```

### Settings Tab (Sub-stack)
```
Settings
├── Account Row
├── Language → Language Selection (reused)
├── Dark Mode (Switch)
├── Notifications → Notifications Screen
├── Privacy Policy → Privacy Screen
├── Terms & Conditions → Terms Screen
├── About Company → About Screen
├── App Version (static)
└── Logout (Alert → confirm)
```

---

## Screen Index (18 screens)

| # | Screen | File | Tab |
|---|---|---|---|
| 1 | Splash | `authentication/SplashScreen.tsx` | — |
| 2 | Language Selection | `authentication/LanguageSelectionScreen.tsx` | — |
| 3 | Welcome | `authentication/WelcomeScreen.tsx` | — |
| 4 | Login | `authentication/LoginScreen.tsx` | — |
| 5 | OTP Verification | `authentication/OTPVerificationScreen.tsx` | — |
| 6 | Registration Wizard | `registration/RegistrationWizardScreen.tsx` | — |
| 6a | Step 1: Personal | `registration/steps/Step1PersonalDetails.tsx` | — |
| 6b | Step 2: Address | `registration/steps/Step2Address.tsx` | — |
| 6c | Step 3: Job Prefs | `registration/steps/Step3JobPreferences.tsx` | — |
| 6d | Step 4: Education | `registration/steps/Step4Education.tsx` | — |
| 6e | Step 5: Experience | `registration/steps/Step5Experience.tsx` | — |
| 6f | Step 6: Documents | `registration/steps/Step6Documents.tsx` | — |
| 6g | Step 7: Review | `registration/steps/Step7Review.tsx` | — |
| 7 | Registration Success | `registration/RegistrationSuccessScreen.tsx` | — |
| 8 | Dashboard | `dashboard/DashboardScreen.tsx` | 1 |
| 9 | Profile | `profile/ProfileScreen.tsx` | 2 |
| 10 | Support | `support/SupportScreen.tsx` | 3 |
| 11 | FAQ | `support/FAQScreen.tsx` | 3 (sub) |
| 12 | Help | `support/HelpScreen.tsx` | 3 (sub) |
| 13 | Contact Us | `support/ContactUsScreen.tsx` | 3 (sub) |
| 14 | Settings | `settings/SettingsScreen.tsx` | 4 |
| 15 | Notifications | `settings/OtherSettingsScreens.tsx` | 4 (sub) |
| 16 | Privacy Policy | `settings/OtherSettingsScreens.tsx` | 4 (sub) |
| 17 | Terms | `settings/OtherSettingsScreens.tsx` | 4 (sub) |
| 18 | About Company | `settings/OtherSettingsScreens.tsx` | 4 (sub) |
