/**
 * WorkerConnect — Welcome Screen
 * Hero illustration + Register/Login buttons.
 * Matches Stitch design exactly.
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import PrimaryButton from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/Buttons';
import { spacing, borderRadius, layout } from '../../theme/spacing';
import { fontSize } from '../../theme/typography';

import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

interface WelcomeScreenProps {
  onRegister: () => void;
  onLogin: () => void;
  onContinueWithPhone: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onRegister,
  onLogin,
  onContinueWithPhone,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Hero Image Section */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.imageSection}>
          {/* Decorative blobs */}
          <View
            style={[styles.blobTopRight, { backgroundColor: theme.colors.divider }]}
          />
          <View
            style={[styles.blobBottomLeft, { backgroundColor: theme.colors.divider }]}
          />

          <View style={[styles.imageCard, { backgroundColor: theme.colors.surface }]}>
            <Image
              source={require('../../../assets/icon.png')}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* Text Content */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={styles.textContent}
        >
          <Text style={[styles.brandName, { color: theme.colors.primary }]}>
            {t('welcome.title')}
          </Text>
          <Text style={[styles.headline, { color: theme.colors.textPrimary }]}>
            {t('welcome.headline')}
          </Text>
          <Text style={[styles.subtext, { color: theme.colors.textSecondary }]}>
            {t('welcome.subtext')}
          </Text>
        </Animated.View>

        {/* CTA Buttons */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          style={styles.buttons}
        >
          <PrimaryButton
            title={t('welcome.register')}
            onPress={onRegister}
            testID="register-button"
          />
          <SecondaryButton
            title={t('welcome.login')}
            onPress={onLogin}
            testID="login-button"
          />
        </Animated.View>

        {/* Continue with Phone */}
        <Animated.View entering={FadeInDown.delay(700).springify()}>
          <TouchableOpacity
            style={styles.continueWithPhone}
            onPress={onContinueWithPhone}
            accessibilityRole="button"
            accessibilityLabel={t('welcome.continuePhone')}
          >
            <View style={[styles.phoneIconWrapper, { borderColor: theme.colors.primary }]}>
              <Ionicons name="phone-portrait-outline" size={16} color={theme.colors.primary} />
            </View>
            <Text style={[styles.continueText, { color: theme.colors.textPrimary }]}>
              {t('welcome.continuePhone')}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.textMuted} />
          </TouchableOpacity>
        </Animated.View>

        {/* Trust Signal */}
        <Animated.View
          entering={FadeInDown.delay(900).springify()}
          style={styles.trustRow}
        >
          <Ionicons name="shield-checkmark-outline" size={14} color={theme.colors.success} />
          <Text style={[styles.trustText, { color: theme.colors.textMuted }]}>
            {t('welcome.verified')}
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: spacing[10],
    paddingTop: spacing[4],
    flexGrow: 1,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: spacing[6],
    position: 'relative',
    paddingVertical: spacing[4],
  },
  blobTopRight: {
    position: 'absolute',
    top: 0,
    right: -10,
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.6,
  },
  blobBottomLeft: {
    position: 'absolute',
    bottom: 10,
    left: -10,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    opacity: 0.5,
  },
  imageCard: {
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: 140,
    height: 140,
    borderRadius: 28,
  },
  textContent: {
    alignItems: 'center',
    marginBottom: spacing[6],
    gap: spacing[3],
  },
  brandName: {
    fontSize: fontSize['2xl'],
    fontWeight: '800',
  },
  headline: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: fontSize.xl * 1.4,
  },
  subtext: {
    fontSize: fontSize.sm,
    textAlign: 'center',
    lineHeight: fontSize.sm * 1.7,
  },
  buttons: {
    gap: spacing[3],
    marginBottom: spacing[5],
  },
  continueWithPhone: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[3],
    marginBottom: spacing[4],
  },
  phoneIconWrapper: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  trustText: {
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
});

export default WelcomeScreen;
