/**
 * WorkerConnect — Splash Screen
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, StatusBar } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { palette } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { textStyles } from '../theme/typography';

const SplashScreen: React.FC = () => {
  const { t } = useTranslation();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withSpring(1.2, { damping: 10 }),
      withSpring(1, { damping: 15 })
    );
    opacity.value = withTiming(1, { duration: 600 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={palette.cream100} />
      <LinearGradient
        colors={[palette.cream50, palette.cream100, palette.cream200]}
        style={StyleSheet.absoluteFillObject}
      />
      
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
            <View style={styles.progressIndicator} />
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
    backgroundColor: palette.cream100,
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
    backgroundColor: palette.orange500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  title: {
    ...textStyles.h1,
    fontSize: 32,
    fontWeight: '700',
    color: palette.orange600,
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  tagline: {
    ...textStyles.body1,
    color: palette.gray600,
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
    backgroundColor: palette.cream300,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing[3],
  },
  progressIndicator: {
    width: '70%',
    height: '100%',
    backgroundColor: palette.orange500,
  },
  loadingText: {
    ...textStyles.caption,
    color: palette.gray500,
    letterSpacing: 1,
    fontWeight: '600',
  },
});

export default SplashScreen;
