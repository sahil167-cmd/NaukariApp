/**
 * Naukri Bazaar — Auth Navigator
 * Flow: Language Selection → Welcome → Login (direct, no OTP)
 */

import React, { useState } from 'react';
import SplashScreen from '../screens/authentication/SplashScreen';
import LanguageSelectionScreen from '../screens/authentication/LanguageSelectionScreen';
import WelcomeScreen from '../screens/authentication/WelcomeScreen';
import LoginScreen from '../screens/authentication/LoginScreen';

type AuthStep = 'splash' | 'language' | 'welcome' | 'login';

interface AuthNavigatorProps {
  onAuthSuccess?: (isNew: boolean) => void;
}

const AuthNavigator: React.FC<AuthNavigatorProps> = ({ onAuthSuccess }) => {
  const [step, setStep] = useState<AuthStep>('language');

  switch (step) {
    case 'splash':
      return <SplashScreen onFinish={() => setStep('language')} />;

    case 'language':
      return <LanguageSelectionScreen onContinue={() => setStep('welcome')} />;

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
          onSuccess={(isNew) => onAuthSuccess?.(isNew)}
          onBack={() => setStep('welcome')}
          onRegister={() => setStep('login')}
        />
      );

    default:
      return null;
  }
};

export default AuthNavigator;
