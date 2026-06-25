/**
 * WorkerConnect — About Company Screen
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { textStyles } from '../../theme/typography';

const AboutCompanyScreen: React.FC = () => {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>About Naukari Bazaar</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { ...textStyles.h2 },
});

export default AboutCompanyScreen;
