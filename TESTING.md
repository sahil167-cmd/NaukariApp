# TESTING.md — Testing Strategy

## Overview

WorkerConnect uses a multi-layer testing approach covering unit tests, integration tests, and end-to-end tests.

---

## Test Stack

| Type | Library | Use Case |
|---|---|---|
| Unit | Jest + @testing-library/react-native | Components, hooks, utils |
| Integration | React Query + Mock Service Worker | API + state interaction |
| E2E | Detox | Full user flows on Android |

---

## Setup

### Install Test Dependencies

```bash
npm install --save-dev \
  jest \
  @testing-library/react-native \
  @testing-library/jest-native \
  jest-expo \
  react-native-testing-library
```

### `jest.config.js`

```js
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterFramework: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
};
```

---

## Component Testing

### Example: PrimaryButton

```tsx
// __tests__/PrimaryButton.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PrimaryButton from '../src/components/common/PrimaryButton';
import { ThemeProvider } from '../src/contexts/ThemeContext';

const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

describe('PrimaryButton', () => {
  it('renders title correctly', () => {
    const { getByText } = render(
      <PrimaryButton title="SUBMIT" onPress={() => {}} />,
      { wrapper }
    );
    expect(getByText('SUBMIT')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const mockPress = jest.fn();
    const { getByTestId } = render(
      <PrimaryButton title="TEST" onPress={mockPress} testID="test-btn" />,
      { wrapper }
    );
    fireEvent.press(getByTestId('test-btn'));
    expect(mockPress).toHaveBeenCalledTimes(1);
  });

  it('shows spinner when loading', () => {
    const { queryByText } = render(
      <PrimaryButton title="SAVE" onPress={() => {}} loading />,
      { wrapper }
    );
    expect(queryByText('SAVE')).toBeNull(); // Text hidden when loading
  });

  it('is disabled when loading', () => {
    const mockPress = jest.fn();
    const { getByTestId } = render(
      <PrimaryButton title="X" onPress={mockPress} loading testID="btn" />,
      { wrapper }
    );
    fireEvent.press(getByTestId('btn'));
    expect(mockPress).not.toHaveBeenCalled();
  });
});
```

---

## Form Validation Testing

```tsx
// __tests__/validators.test.ts
import { loginSchema, personalDetailsSchema } from '../src/validators';

describe('Login Schema', () => {
  it('accepts valid 10-digit Indian mobile', async () => {
    await expect(loginSchema.validate({ phone: '9876543210' })).resolves.toBeTruthy();
  });

  it('rejects short phone number', async () => {
    await expect(loginSchema.validate({ phone: '98765' })).rejects.toThrow();
  });

  it('rejects non-numeric input', async () => {
    await expect(loginSchema.validate({ phone: 'abcdefghij' })).rejects.toThrow();
  });
});
```

---

## Store Testing

```tsx
// __tests__/authStore.test.ts
import { act, renderHook } from '@testing-library/react-native';
import { useAuthStore } from '../src/store/authStore';

describe('Auth Store', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it('starts unauthenticated', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('logs in a user', () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.login(
        { id: '1', name: 'Test', phone: '9876543210', registrationComplete: true, isVerified: true },
        { accessToken: 'tok', refreshToken: 'ref', expiresAt: 99999999999 }
      );
    });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.name).toBe('Test');
  });

  it('logs out', () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.login(
        { id: '1', name: 'X', phone: '1234567890', registrationComplete: true, isVerified: false },
        { accessToken: 't', refreshToken: 'r', expiresAt: 99999 }
      );
      result.current.logout();
    });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
```

---

## OTP Screen Testing

```tsx
// __tests__/OTPVerificationScreen.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import OTPVerificationScreen from '../src/screens/authentication/OTPVerificationScreen';

describe('OTPVerificationScreen', () => {
  const props = {
    phone: '9876543210',
    onSuccess: jest.fn(),
    onBack: jest.fn(),
  };

  it('renders 6 input boxes', () => {
    const { getAllByRole } = render(<OTPVerificationScreen {...props} />);
    // Each OTP box has accessibilityLabel with "OTP digit X"
    const inputs = getAllByRole('none'); // TextInput has no role
    expect(inputs.length).toBeGreaterThanOrEqual(6);
  });

  it('shows masked phone number', () => {
    const { getByText } = render(<OTPVerificationScreen {...props} />);
    expect(getByText('+91 ****3210')).toBeTruthy();
  });

  it('shows error when submitting incomplete OTP', async () => {
    const { getByTestId, getByText } = render(<OTPVerificationScreen {...props} />);
    fireEvent.press(getByTestId('verify-otp-button'));
    await waitFor(() => {
      expect(getByText('Please enter the complete 6-digit OTP.')).toBeTruthy();
    });
  });
});
```

---

## API Service Testing (Mocked)

```tsx
// __tests__/authService.test.ts
import { authService } from '../src/services/api/authService';

// Mock the axios client
jest.mock('../src/services/api/client');

describe('AuthService', () => {
  it('requestOTP returns success', async () => {
    const result = await authService.requestOTP({ phone: '9876543210' });
    expect(result.success).toBe(true);
  });

  it('verifyOTP returns tokens for valid code', async () => {
    const result = await authService.verifyOTP({
      phone: '9876543210',
      otp: '123456',
    });
    expect(result.data.tokens.accessToken).toBeDefined();
  });
});
```

---

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- PrimaryButton

# Watch mode
npm test -- --watchAll
```

---

## Coverage Targets

| Module | Target |
|---|---|
| Validators | 100% |
| Store | 90% |
| Components | 80% |
| Screens | 60% |
| Services | 70% |

---

## Testing Recruiter Contact Flow (Call & WhatsApp)

### 1. Verification of Environment Variables
- Ensure that you have a `.env` file in the root of the workspace.
- Check that the variables are specified:
  ```env
  SUPPORT_PHONE=+919876543210
  SUPPORT_WHATSAPP=+919876543210
  ```
- Clear the Metro/Expo cache (`npx expo start --clear`) so that the Babel plugin inlines these values during the bundle process.

### 2. Manual Test Cases (ContactRecruiterScreen)

#### Test Case 2.1: Call Redirection (Android/iOS Dialer)
1. Complete the registration wizard steps and click **Submit**.
2. From the Registration Success screen, tap **GO TO DASHBOARD**.
3. Verify you are redirected to the **Contact Recruiter** screen and back button is disabled.
4. Tap **CALL NOW**.
5. Verify the device dialer opens immediately prefilled with the number specified in `SUPPORT_PHONE`.
6. Return to the app and confirm that the **Did you contact our recruitment team?** bottom sheet appears automatically.
7. Tap **Yes** and verify you are navigated to the **Dashboard**.

#### Test Case 2.2: WhatsApp Integration & Prefilled Message
1. Reset the registration state.
2. Complete registration and go to the **Contact Recruiter** screen.
3. Tap **CHAT ON WHATSAPP**.
4. Verify that WhatsApp opens (or tries to open `wa.me` in browser) with the support phone number specified in `SUPPORT_WHATSAPP`.
5. Verify the prefilled message contains the dynamically loaded user details (Name, Phone number, Job Category, and City).
6. Return to the app and confirm the bottom sheet appears.
7. Tap **Contact Again** and verify the bottom sheet dismisses, remaining on the recruiter contact screen.

#### Test Case 2.3: Bypass Attempt & Confirmation Dialogue
1. Tap the **Continue to Dashboard** text link at the bottom.
2. Verify a confirmation modal pop-up appears: **Have you contacted the recruitment team?**
3. Tap **No** and verify the dialog closes, staying on the screen.
4. Tap the link again, tap **Yes** and verify it successfully routes you to the **Dashboard** and saves this choice.

---

## E2E with Detox (Future)

```bash
# Install Detox
npm install --save-dev detox

# Build for testing
detox build --configuration android.emu.debug

# Run E2E tests
detox test --configuration android.emu.debug
```

### Key E2E Scenarios to Test

1. **Happy Path**: Launch → Language → Welcome → Register → OTP → Fill 7 steps → Submit → Dashboard
2. **Login Flow**: Launch → Login → OTP → Dashboard
3. **Logout**: Dashboard → Settings → Logout → Welcome screen
4. **OTP Retry**: Enter wrong OTP → Error → Resend → Success
5. **Back Navigation**: Each step should persist data when going back
