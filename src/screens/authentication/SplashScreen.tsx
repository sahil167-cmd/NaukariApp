/**
 * Naukri Bazaar — Splash Screen
 * Pixel-perfect recreation of the app splash screen.
 * White background, red squircle logo, app name + Hindi tagline.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const LOGO_SIZE = Math.round(width * 0.38);
const LOGO_RADIUS = Math.round(LOGO_SIZE * 0.28);

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const logoScale = useSharedValue(0.6);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textY = useSharedValue(16);
  const barWidth = useSharedValue(0);
  const barOpacity = useSharedValue(0);

  useEffect(() => {
    // Logo pop in
    logoOpacity.value = withDelay(150, withTiming(1, { duration: 350 }));
    logoScale.value = withDelay(150, withSpring(1, { damping: 13, stiffness: 140 }));

    // Text fade up
    textOpacity.value = withDelay(450, withTiming(1, { duration: 400 }));
    textY.value = withDelay(450, withSpring(0, { damping: 16 }));

    // Loading bar
    barOpacity.value = withDelay(700, withTiming(1, { duration: 200 }));
    barWidth.value = withDelay(750, withTiming(100, { duration: 600 }));

    // Navigate away
    const timer = setTimeout(() => {
      runOnJS(onFinish)();
    }, 1600);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textY.value }],
  }));

  const barContainerStyle = useAnimatedStyle(() => ({
    opacity: barOpacity.value,
  }));

  const barFillStyle = useAnimatedStyle(() => ({
    width: `${barWidth.value}%`,
  }));

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Logo */}
      <Animated.View style={[styles.logoWrapper, logoStyle]}>
        <View style={[styles.squircle, { width: LOGO_SIZE, height: LOGO_SIZE, borderRadius: LOGO_RADIUS }]}>
          <Text style={styles.logoTextTop}>NAUKRI</Text>
          <Text style={styles.logoTextBottom}>BAZAR</Text>
        </View>
      </Animated.View>

      {/* App name + Tagline */}
      <Animated.View style={[styles.textSection, textStyle]}>
        <Text style={styles.appName}>Naukri Bazar</Text>
        <Text style={styles.tagline}>नौकरी कोई भी कहीं भी</Text>
      </Animated.View>

      {/* Loading Bar at bottom */}
      <Animated.View style={[styles.loaderSection, barContainerStyle]}>
        <View style={styles.loaderTrack}>
          <Animated.View style={[styles.loaderFill, barFillStyle]} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    marginBottom: 20,
    shadowColor: '#C0392B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  squircle: {
    backgroundColor: '#D94F4F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTextTop: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: Math.round(width * 0.085),
    letterSpacing: 1,
    lineHeight: Math.round(width * 0.1),
    textAlign: 'center',
  },
  logoTextBottom: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: Math.round(width * 0.085),
    letterSpacing: 1,
    lineHeight: Math.round(width * 0.1),
    textAlign: 'center',
  },
  textSection: {
    alignItems: 'center',
    marginTop: 4,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  tagline: {
    fontSize: 15,
    color: '#888888',
    fontStyle: 'italic',
    letterSpacing: 0.2,
  },
  loaderSection: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
    width: '100%',
  },
  loaderTrack: {
    width: '45%',
    height: 3,
    backgroundColor: '#E8E8E8',
    borderRadius: 99,
    overflow: 'hidden',
  },
  loaderFill: {
    height: '100%',
    backgroundColor: '#D94F4F',
    borderRadius: 99,
  },
});

export default SplashScreen;
