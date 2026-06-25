/**
 * WorkerConnect — Registration Success Screen
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
  withSequence,
  FadeInDown,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import PrimaryButton from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/Buttons';
import { spacing, layout, borderRadius } from '../../theme/spacing';
import { fontSize } from '../../theme/typography';

import { useTranslation } from 'react-i18next';

interface SuccessScreenProps {
  onGoHome: () => void;
  onViewProfile: () => void;
}

const { width } = Dimensions.get('window');

const RegistrationSuccessScreen: React.FC<SuccessScreenProps> = ({
  onGoHome,
  onViewProfile,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const ring1 = useSharedValue(0);
  const ring2 = useSharedValue(0);

  useEffect(() => {
    checkOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
    checkScale.value = withDelay(300, withSpring(1, { damping: 10, stiffness: 100 }));
    ring1.value = withDelay(500, withTiming(1, { duration: 600 }));
    ring2.value = withDelay(700, withTiming(1, { duration: 600 }));
  }, []);

  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
    transform: [{ scale: checkScale.value }],
  }));

  const ring1Style = useAnimatedStyle(() => ({
    opacity: ring1.value * 0.3,
    transform: [{ scale: 0.7 + ring1.value * 0.5 }],
  }));

  const ring2Style = useAnimatedStyle(() => ({
    opacity: ring2.value * 0.15,
    transform: [{ scale: 0.5 + ring2.value * 0.8 }],
  }));

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      <View style={styles.container}>
        {/* Success Animation */}
        <View style={styles.animationContainer}>
          {/* Outer ring */}
          <Animated.View
            style={[
              styles.ring,
              { backgroundColor: theme.colors.successBackground, width: 200, height: 200, borderRadius: 100 },
              ring2Style,
            ]}
          />
          {/* Inner ring */}
          <Animated.View
            style={[
              styles.ring,
              { backgroundColor: theme.colors.successBackground, width: 150, height: 150, borderRadius: 75 },
              ring1Style,
            ]}
          />
          {/* Check circle */}
          <Animated.View
            style={[
              styles.checkCircle,
              { backgroundColor: theme.colors.success },
              checkStyle,
            ]}
          >
            <Ionicons name="checkmark" size={48} color="#FFF" />
          </Animated.View>
        </View>

        {/* Text */}
        <Animated.View entering={FadeInDown.delay(800).springify()} style={styles.textSection}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            {t('success.title')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {t('success.subtitle')}
          </Text>
        </Animated.View>

        {/* Info Cards */}
        <Animated.View entering={FadeInDown.delay(1000).springify()} style={styles.infoCards}>
          {[
            { icon: 'notifications-outline', text: t('success.alertSms', "You'll get job alerts via SMS & app") },
            { icon: 'shield-checkmark-outline', text: t('success.infoSafe', "Your info is safe & encrypted") },
            { icon: 'people-outline', text: t('success.viewProfileAlert', "Employers can now view your profile") },
          ].map((item, i) => (
            <View
              key={i}
              style={[styles.infoCard, { backgroundColor: theme.colors.surfaceVariant }]}
            >
              <Ionicons name={item.icon as any} size={20} color={theme.colors.primary} />
              <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                {item.text}
              </Text>
            </View>
          ))}
        </Animated.View>

        {/* Actions */}
        <Animated.View entering={FadeInDown.delay(1200).springify()} style={styles.actions}>
          <PrimaryButton title={t('success.goHome')} onPress={onGoHome} testID="go-home-button" />
          <SecondaryButton title={t('success.viewProfile')} onPress={onViewProfile} />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: spacing[8],
    alignItems: 'center',
  },
  animationContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[8],
    position: 'relative',
  },
  ring: {
    position: 'absolute',
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSection: {
    alignItems: 'center',
    marginBottom: spacing[8],
    gap: spacing[3],
  },
  title: {
    fontSize: fontSize['2xl'],
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.base,
    textAlign: 'center',
    lineHeight: fontSize.base * 1.7,
  },
  infoCards: {
    width: '100%',
    gap: spacing[3],
    marginBottom: spacing[8],
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[4],
    borderRadius: borderRadius.lg,
  },
  infoText: {
    fontSize: fontSize.sm,
    flex: 1,
    lineHeight: fontSize.sm * 1.5,
  },
  actions: { width: '100%', gap: spacing[3] },
});

export default RegistrationSuccessScreen;
