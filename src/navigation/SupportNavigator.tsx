/**
 * WorkerConnect — Support Navigator
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { SupportStackParamList } from '../types';

import SupportHomeScreen from '../screens/support/SupportHomeScreen';
import FAQScreen from '../screens/support/FAQScreen';
import HelpScreen from '../screens/support/HelpScreen';
import ContactUsScreen from '../screens/support/ContactUsScreen';

const Stack = createNativeStackNavigator<SupportStackParamList>();

const SupportNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SupportHome" component={SupportHomeScreen} />
      <Stack.Screen name="FAQ" component={FAQScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />
    </Stack.Navigator>
  );
};

export default SupportNavigator;
