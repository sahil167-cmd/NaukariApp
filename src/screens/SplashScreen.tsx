/**
 * WorkerConnect — Splash Screen
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, StatusBar } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { spacing } from '../theme/spacing';
import { textStyles } from '../theme/typography';

const SplashScreen: React.FC = () => {
  const { t } = useTranslation();
  const opacity = useSharedValue(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 800 });
    progress.value = withTiming(100, { duration: 3200 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <Animated.View style={[styles.content, animatedStyle]}>
        <View style={styles.iconContainer}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        
        <Text style={styles.title}>{t('app.name', 'Naukari Bazaar')}</Text>
        <Text style={styles.tagline}>{t('app.tagline', 'Connecting Workers with Opportunities')}</Text>
        
        <View style={styles.footer}>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressIndicator, progressStyle]} />
          </View>
          <Text style={styles.loadingText}>{t('splash.finding', 'FINDING THE BEST ROLES')}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[8],
  },
  iconContainer: {
    marginBottom: spacing[8],
  },
  logoImage: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  title: {
    ...textStyles.h1,
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  tagline: {
    ...textStyles.body1,
    color: '#6B6B6B',
    textAlign: 'center',
    marginBottom: spacing[12],
  },
  footer: {
    position: 'absolute',
    bottom: spacing[12],
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: 160,
    height: 4,
    backgroundColor: '#F5EDE4',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing[3],
  },
  progressIndicator: {
    height: '100%',
    backgroundColor: '#E8621A',
  },
  loadingText: {
    ...textStyles.caption,
    color: '#8E8E8E',
    letterSpacing: 1,
    fontWeight: '600',
  },
});

export default SplashScreen;
