# COMPONENT_GUIDE.md — Component Reference

## Component Hierarchy

```
App
├── ThemeProvider
├── QueryClientProvider
├── GestureHandlerRootView
│   └── AppNavigator
│       ├── AuthNavigator
│       │   ├── SplashScreen
│       │   ├── LanguageSelectionScreen
│       │   ├── WelcomeScreen
│       │   ├── LoginScreen
│       │   └── OTPVerificationScreen
│       ├── RegistrationWizardScreen
│       └── MainNavigator (BottomTabs)
│           ├── DashboardScreen
│           ├── ProfileScreen
│           ├── SupportStack
│           └── SettingsStack
```

---

## Common Components

### `PrimaryButton`

Orange filled CTA button with spring press animation.

```tsx
import PrimaryButton from './components/common/PrimaryButton';

<PrimaryButton
  title="SUBMIT"
  onPress={() => {}}
  loading={false}
  disabled={false}
  style={{ marginTop: 16 }}
  testID="submit-button"
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | required | Button label |
| `onPress` | `() => void` | required | Press handler |
| `loading` | `boolean` | `false` | Show spinner |
| `disabled` | `boolean` | `false` | Disable interaction |
| `style` | `ViewStyle` | — | Override container style |
| `textStyle` | `TextStyle` | — | Override text style |
| `testID` | `string` | `'primary-button'` | Test ID |

---

### `SecondaryButton` / `OutlinedButton`

```tsx
import { SecondaryButton, OutlinedButton } from './components/common/Buttons';

<SecondaryButton title="BACK" onPress={() => {}} />
<OutlinedButton title="SKIP" onPress={() => {}} />
```

---

### `AppTextInput`

Cream-background text input with label, icon, validation.

```tsx
import AppTextInput from './components/common/AppTextInput';

<AppTextInput
  label="Full Name"
  placeholder="Enter name"
  value={value}
  onChangeText={onChange}
  error="Name is required"
  leftIcon="person-outline"
  rightIcon="close-circle"
  onRightIconPress={() => {}}
  required
  secureTextEntry={false}
/>
```

| Prop | Type | Description |
|---|---|---|
| `label` | `string` | Field label |
| `error` | `string` | Validation error message |
| `hint` | `string` | Helper text (shown if no error) |
| `leftIcon` | `string` | Ionicons icon name |
| `rightIcon` | `string` | Ionicons icon name (right side) |
| `secureTextEntry` | `boolean` | Shows eye toggle if true |
| `required` | `boolean` | Adds red asterisk to label |

---

### `PhoneInput`

+91 prefixed Indian phone number input.

```tsx
import PhoneInput from './components/common/PhoneInput';

<PhoneInput
  label="Mobile Number"
  value={value}
  onChangeText={onChange}
  error={errors.phone?.message}
/>
```

Auto-filters non-digits and limits to 10 digits.

---

### `Dropdown`

Searchable select with slide-up modal.

```tsx
import Dropdown from './components/common/Dropdown';

<Dropdown
  label="State"
  placeholder="Select your state"
  options={[{ label: 'Maharashtra', value: 'Maharashtra' }]}
  value={selectedValue}
  onChange={(val) => setSelected(val)}
  error={errors.state?.message}
  searchable
  required
/>
```

---

### `RadioButton` / `RadioGroup` / `Checkbox`

```tsx
import { RadioGroup, Checkbox } from './components/common/FormControls';

// Radio group
<RadioGroup
  label="Gender"
  options={[
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ]}
  value={selected}
  onChange={setSelected}
  horizontal
/>

// Checkbox
<Checkbox
  label="I agree to terms"
  checked={agreed}
  onPress={() => setAgreed(!agreed)}
/>
```

---

### `ProgressIndicator`

7-step wizard progress bar.

```tsx
import ProgressIndicator from './components/common/ProgressIndicator';

<ProgressIndicator
  currentStep={3}
  totalSteps={7}
/>
```

- Completed steps show ✓ checkmark
- Active step is enlarged
- Inactive steps show step number

---

### `SkeletonBox` / `JobCardSkeleton`

Shimmer loading placeholders.

```tsx
import { SkeletonBox, JobCardSkeleton } from './components/common/LoadingSkeleton';

// Loading a job list
{isLoading && Array.from({ length: 3 }).map((_, i) => <JobCardSkeleton key={i} />)}

// Custom skeleton
<SkeletonBox width="60%" height={14} />
```

---

### `Snackbar`

```tsx
import Snackbar from './components/common/Snackbar';

<Snackbar
  visible={showToast}
  message="Profile saved successfully!"
  type="success"
  duration={3000}
  onDismiss={() => setShowToast(false)}
  actionLabel="Undo"
  onAction={() => {}}
/>
```

Types: `success | error | info | warning`

---

### `Loader` / `ErrorScreen` / `EmptyScreen`

```tsx
import { Loader, ErrorScreen, EmptyScreen } from './components/common/StateScreens';

// Full-screen loading
<Loader message="Loading profile..." />

// Error with retry
<ErrorScreen
  title="Failed to load"
  message="Please try again"
  onRetry={refetch}
/>

// Empty state
<EmptyScreen
  title="No jobs found"
  iconName="briefcase-outline"
  action={{ label: 'Browse All', onPress: () => {} }}
/>
```

---

## Card Components

### `JobCard`

```tsx
import JobCard from './components/cards/JobCard';

<JobCard
  job={jobData}
  onPress={(job) => navigation.navigate('JobDetail', { job })}
  onApply={(job) => handleApply(job)}
/>
```

Features:
- `URGENT` badge (red top-right)
- Verified employer badge
- Time ago ("2h ago")
- Location + salary details
- Apply button

---

### `ProfileCard`

```tsx
import ProfileCard from './components/cards/ProfileCard';

<ProfileCard
  user={currentUser}
  completionPercent={65}
  onEditPress={() => {}}
/>
```

---

## Theme Usage

Always use theme tokens from `useTheme()`:

```tsx
const { theme } = useTheme();

// Colors
theme.colors.primary          // #E8621A
theme.colors.background       // #FDF6F0
theme.colors.textPrimary      // #2D1F12
theme.colors.textSecondary    // #6B5744

// Spacing (8pt grid)
import { spacing } from '../theme/spacing';
spacing[4] // 16px
spacing[6] // 24px

// Border radius
import { borderRadius } from '../theme/spacing';
borderRadius.md   // 12px
borderRadius.lg   // 16px
borderRadius.full // 9999px (pill)
```

---

## Accessibility Checklist

All interactive components must have:

- [ ] `testID` prop for automation testing
- [ ] `accessibilityLabel` describing the action
- [ ] `accessibilityRole` (button, checkbox, radio, etc.)
- [ ] `accessibilityState` (checked, disabled, expanded)
- [ ] Minimum 44×44pt touch target size
