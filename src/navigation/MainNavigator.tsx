/**
 * WorkerConnect — Main Navigator (Bottom Tabs + Sub-stacks)
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { layout } from '../theme/spacing';
import { fontSize } from '../theme/typography';

// Screen imports
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SupportScreen from '../screens/support/SupportScreen';
import FAQScreen from '../screens/support/FAQScreen';
import ContactUsScreen from '../screens/support/ContactUsScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import LanguageSelectionScreen from '../screens/authentication/LanguageSelectionScreen';
import {
  NotificationsScreen,
  PrivacyPolicyScreen,
  TermsScreen,
} from '../screens/settings/OtherSettingsScreens';

type SupportSubScreen = 'home' | 'faq' | 'contact';
type SettingsSubScreen = 'home' | 'notifications' | 'privacy' | 'terms' | 'language';

const Tab = createBottomTabNavigator();

interface MainNavigatorProps {
  onStartRegistration?: () => void;
}

// Support Stack (state machine)
const SupportStack: React.FC = () => {
  const [screen, setScreen] = useState<SupportSubScreen>('home');
  switch (screen) {
    case 'faq': return <FAQScreen onBack={() => setScreen('home')} />;
    case 'contact': return <ContactUsScreen onBack={() => setScreen('home')} />;
    default:
      return (
        <SupportScreen
          onFAQ={() => setScreen('faq')}
          onContactUs={() => setScreen('contact')}
        />
      );
  }
};

// Settings Stack (state machine)
const SettingsStack: React.FC = () => {
  const [screen, setScreen] = useState<SettingsSubScreen>('home');
  switch (screen) {
    case 'notifications': return <NotificationsScreen onBack={() => setScreen('home')} />;
    case 'privacy': return <PrivacyPolicyScreen onBack={() => setScreen('home')} />;
    case 'terms': return <TermsScreen onBack={() => setScreen('home')} />;
    case 'language': return <LanguageSelectionScreen onContinue={() => setScreen('home')} />;
    default:
      return (
        <SettingsScreen
          onNotifications={() => setScreen('notifications')}
          onPrivacyPolicy={() => setScreen('privacy')}
          onTerms={() => setScreen('terms')}
          onLanguageSelect={() => setScreen('language')}
        />
      );
  }
};

const MainNavigator: React.FC<MainNavigatorProps> = ({ onStartRegistration }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBackground,
          borderTopColor: theme.colors.border,
          height: layout.bottomTabHeight,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.colors.tabActive,
        tabBarInactiveTintColor: theme.colors.tabInactive,
        tabBarLabelStyle: {
          fontSize: fontSize.xs,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, [string, string]> = {
            Dashboard: ['home', 'home-outline'],
            Profile: ['person', 'person-outline'],
            Support: ['headset', 'headset-outline'],
            Settings: ['settings', 'settings-outline'],
          };
          const [filledName, outlineName] = icons[route.name] ?? ['circle', 'circle-outline'];
          return (
            <Ionicons
              name={(focused ? filledName : outlineName) as any}
              size={22}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ tabBarLabel: t('dashboard.title', 'Dashboard') }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarLabel: t('profile.title', 'Profile') }}
      />
      <Tab.Screen 
        name="Support" 
        component={SupportStack} 
        options={{ tabBarLabel: t('support.title', 'Support') }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsStack} 
        options={{ tabBarLabel: t('settings.title', 'Settings') }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({});

export default MainNavigator;
