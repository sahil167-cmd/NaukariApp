/**
 * WorkerConnect — Root Navigator
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import i18n from '../localization/i18n';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import RegistrationNavigator from './RegistrationNavigator';
import SplashScreen from '../screens/SplashScreen';
import type { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const [isInitialized, setIsInitialized] = React.useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  React.useEffect(() => {
    // 1. Force logout on fresh launch/scan so the app always starts from Splash -> Language -> Login
    useAuthStore.getState().logout();

    // 2. Set the initial localization language from settings store
    const storedLang = useSettingsStore.getState().language;
    if (storedLang) {
      i18n.changeLanguage(storedLang);
    }

    // 3. Keep splash visible for 1200ms to allow a smooth, premium load animation
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (!isInitialized) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : !user?.registrationComplete ? (
          <Stack.Screen name="Registration" component={RegistrationNavigator as any} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
