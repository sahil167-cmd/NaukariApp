/**
 * WorkerConnect — Root Navigator
 * Persistent authentication: restores session from storage on app launch.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import { authService } from '../services/api/authService';
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
    const initApp = async () => {
      // 1. Set the initial localization language from settings store
      const storedLang = useSettingsStore.getState().language;
      if (storedLang) {
        i18n.changeLanguage(storedLang);
      }

      // 2. Restore auth — wait for Zustand hydration, then validate tokens
      // Zustand persist middleware hydrates from AsyncStorage asynchronously.
      // We give it a moment, then check if tokens are still valid.
      await new Promise((resolve) => setTimeout(resolve, 500));

      const { tokens, isAuthenticated: wasLoggedIn } = useAuthStore.getState();

      if (wasLoggedIn && tokens) {
        // Check if access token is expired
        const isAccessExpired = tokens.expiresAt && Date.now() > tokens.expiresAt;

        if (isAccessExpired && tokens.refreshToken) {
          // Try to refresh the access token silently
          try {
            const refreshResult = await authService.refreshToken(tokens.refreshToken);
            if (refreshResult.success && refreshResult.data) {
              useAuthStore.getState().setTokens({
                accessToken: refreshResult.data.accessToken,
                refreshToken: tokens.refreshToken,
                expiresAt: refreshResult.data.expiresAt ?? (Date.now() + 7 * 24 * 60 * 60 * 1000),
              });
            } else {
              // Refresh failed — session expired, force logout
              useAuthStore.getState().logout();
            }
          } catch {
            // Refresh failed (network error, invalid token, etc.) — force logout
            useAuthStore.getState().logout();
          }
        }
        // If access token is still valid, do nothing — user stays logged in
      }

      // 3. Keep splash visible for a smooth, premium load animation
      await new Promise((resolve) => setTimeout(resolve, 2500));
      setIsInitialized(true);
    };

    initApp();
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
