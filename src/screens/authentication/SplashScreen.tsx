/**
 * WorkerConnect — Splash Screen
 * Matches Stitch design: briefcase icon, title, tagline, animated loader bar.
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing, borderRadius } from '../../theme/spacing';
import { fontSize } from '../../theme/typography';
import { APP_NAME } from '../../constants';

const { width } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { theme } = useTheme();

  const iconScale = useSharedValue(0);
  const iconOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(20);
  const imageOpacity = useSharedValue(0);
  const imageY = useSharedValue(30);
  const barWidth = useSharedValue(0);
  const loaderOpacity = useSharedValue(0);

  useEffect(() => {
    // Icon pop
    iconScale.value = withDelay(100, withSpring(1, { damping: 12 }));
    iconOpacity.value = withDelay(100, withTiming(1, { duration: 300 }));

    // Title
    titleOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
    titleY.value = withDelay(300, withSpring(0, { damping: 15 }));

    // Image
    imageOpacity.value = withDelay(500, withTiming(1, { duration: 400 }));
    imageY.value = withDelay(500, withSpring(0, { damping: 15 }));

    // Progress bar
    loaderOpacity.value = withDelay(700, withTiming(1, { duration: 200 }));
    barWidth.value = withDelay(800, withTiming(100, { duration: 500 }));

    // Navigate away
    const timer = setTimeout(() => {
      runOnJS(onFinish)();
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  const iconAnimStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

  const titleAnimStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));

  const imageAnimStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
    transform: [{ translateY: imageY.value }],
  }));

  const barAnimStyle = useAnimatedStyle(() => ({
    width: `${barWidth.value}%`,
  }));

  const loaderAnimStyle = useAnimatedStyle(() => ({
    opacity: loaderOpacity.value,
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />

      {/* Briefcase Icon */}
      <Animated.View style={[styles.iconWrapper, iconAnimStyle]}>
        <View style={[styles.iconBg, { backgroundColor: theme.colors.primary }]}>
          <Ionicons name="briefcase" size={36} color="#FFF" />
        </View>
      </Animated.View>

      {/* Title & Tagline */}
      <Animated.View style={[styles.titleSection, titleAnimStyle]}>
        <Text style={[styles.appName, { color: theme.colors.primary }]}>{APP_NAME}</Text>
        <Text style={[styles.tagline, { color: theme.colors.textSecondary }]}>
          Connecting Workers with Opportunities
        </Text>
      </Animated.View>

      {/* Hero Image */}
      <Animated.View style={[styles.imageWrapper, imageAnimStyle]}>
        <View style={[styles.imageCard, { backgroundColor: theme.colors.surface }]}>
          <Image
            source={require('../../../assets/workers_hero.png')}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>
      </Animated.View>

      {/* Loader Bar */}
      <Animated.View style={[styles.loaderSection, loaderAnimStyle]}>
        <View style={[styles.loaderTrack, { backgroundColor: theme.colors.border }]}>
          <Animated.View
            style={[
              styles.loaderFill,
              { backgroundColor: theme.colors.primary },
              barAnimStyle,
            ]}
          />
        </View>
        <Text style={[styles.loadingText, { color: theme.colors.textMuted }]}>
          FINDING THE BEST ROLES
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
  },
  iconWrapper: {
    marginBottom: spacing[4],
  },
  iconBg: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  appName: {
    fontSize: fontSize['2xl'],
    fontWeight: '800',
    marginBottom: spacing[1],
  },
  tagline: {
    fontSize: fontSize.base,
    textAlign: 'center',
  },
  imageWrapper: {
    width: '100%',
    marginBottom: spacing[12],
  },
  imageCard: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[4],
  },
  heroImage: {
    width: width * 0.65,
    height: width * 0.65,
  },
  loaderSection: {
    width: '100%',
    position: 'absolute',
    bottom: spacing[12],
    alignItems: 'center',
    gap: spacing[3],
  },
  loaderTrack: {
    width: '50%',
    height: 3,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  loaderFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  loadingText: {
    fontSize: fontSize.xs,
    letterSpacing: 1.5,
    fontWeight: '600',
  },
});

export default SplashScreen;
