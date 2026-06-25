/**
 * WorkerConnect — Settings Navigator
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '../types';

import SettingsHomeScreen from '../screens/settings/SettingsHomeScreen';
import NotificationsScreen from '../screens/settings/NotificationsScreen';
import PrivacyPolicyScreen from '../screens/settings/PrivacyPolicyScreen';
import TermsScreen from '../screens/settings/TermsScreen';
import AboutCompanyScreen from '../screens/settings/AboutCompanyScreen';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

const SettingsNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsHome" component={SettingsHomeScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="AboutCompany" component={AboutCompanyScreen} />
    </Stack.Navigator>
  );
};

export default SettingsNavigator;
