/**
 * WorkerConnect — Registration Navigator
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RegistrationStackParamList } from '../types';
import { useAuthStore } from '../store/authStore';

import RegistrationWizardScreen from '../screens/registration/RegistrationWizardScreen';
import RegistrationSuccessScreen from '../screens/registration/RegistrationSuccessScreen';
import ContactRecruiterScreen from '../screens/registration/ContactRecruiterScreen';

const Stack = createNativeStackNavigator<RegistrationStackParamList>();

const RegistrationNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RegistrationWizard">
        {(props) => (
          <RegistrationWizardScreen
            {...props}
            onSuccess={() => props.navigation.navigate('RegistrationSuccess')}
            onBack={() => {
              const { logout } = useAuthStore.getState();
              logout();
            }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="RegistrationSuccess">
        {(props) => (
          <RegistrationSuccessScreen
            {...props}
            onGoHome={() => {
              props.navigation.navigate('ContactRecruiter');
            }}
            onViewProfile={() => {
              props.navigation.navigate('ContactRecruiter');
            }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="ContactRecruiter" component={ContactRecruiterScreen} />
    </Stack.Navigator>
  );
};

export default RegistrationNavigator;
