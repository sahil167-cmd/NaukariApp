/**
 * WorkerConnect — Auth Navigator
 * Handles: Language Selection → Welcome → Login → OTP
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import SplashScreen from '../screens/authentication/SplashScreen';
import LanguageSelectionScreen from '../screens/authentication/LanguageSelectionScreen';
import WelcomeScreen from '../screens/authentication/WelcomeScreen';
import LoginScreen from '../screens/authentication/LoginScreen';
import OTPVerificationScreen from '../screens/authentication/OTPVerificationScreen';

type AuthStep =
  | 'splash'
  | 'language'
  | 'welcome'
  | 'login'
  | 'otp';

interface AuthNavigatorProps {
  onAuthSuccess?: (isNew: boolean) => void;
}

const AuthNavigator: React.FC<AuthNavigatorProps> = ({ onAuthSuccess }) => {
  const [step, setStep] = useState<AuthStep>('language');
  const [phone, setPhone] = useState('');

  switch (step) {
    case 'splash':
      return (
        <SplashScreen onFinish={() => setStep('language')} />
      );
    case 'language':
      return (
        <LanguageSelectionScreen onContinue={() => setStep('welcome')} />
      );
    case 'welcome':
      return (
        <WelcomeScreen
          onRegister={() => setStep('login')}
          onLogin={() => setStep('login')}
          onContinueWithPhone={() => setStep('login')}
        />
      );
    case 'login':
      return (
        <LoginScreen
          onOTPSent={(p) => {
            setPhone(p);
            setStep('otp');
          }}
          onBack={() => setStep('welcome')}
          onRegister={() => setStep('login')}
        />
      );
    case 'otp':
      return (
        <OTPVerificationScreen
          phone={phone}
          onSuccess={(isNew) => onAuthSuccess?.(isNew)}
          onBack={() => setStep('login')}
        />
      );
    default:
      return null;
  }
};

export default AuthNavigator;
