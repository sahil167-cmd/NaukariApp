/**
 * Naukri Bazaar — Login Screen
 * Direct phone-number login — no OTP step.
 * Validates exactly 10 digits (Indian mobile: starts with 6-9).
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import PhoneInput from '../../components/common/PhoneInput';
import PrimaryButton from '../../components/common/PrimaryButton';
import { loginSchema } from '../../validators';
import { authService } from '../../services/api/authService';
import { useAuthStore } from '../../store/authStore';
import { spacing, layout, borderRadius } from '../../theme/spacing';
import { fontSize } from '../../theme/typography';
import { useTranslation } from 'react-i18next';

interface LoginFormData {
  phone: string;
}

interface LoginScreenProps {
  onSuccess: (isNew: boolean) => void;
  onBack: () => void;
  onRegister: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess, onBack, onRegister }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: { phone: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.loginWithPhone({ phone: data.phone });
      if (response.success) {
        login(response.data.user, response.data.tokens);
        onSuccess(response.data.isNew);
      } else {
        setError(response.message || t('errors.serverError'));
      }
    } catch (err: any) {
      const msg = err?.message;
      if (msg && msg.length < 120 && !msg.includes('Path `')) {
        setError(msg);
      } else {
        setError(t('errors.serverError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Back */}
          <TouchableOpacity style={styles.backBtn} onPress={onBack} accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>

          <Animated.View entering={FadeInDown.delay(100).springify()}>
            {/* Logo-style header */}
            <View style={[styles.iconWrapper, { backgroundColor: theme.colors.primaryLight }]}>
              <Ionicons name="phone-portrait" size={28} color={theme.colors.primary} />
            </View>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              {t('auth.login')}
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              {t('auth.loginSubtitleDirect', 'Enter your mobile number to login or register')}
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.form}>
            <Controller
              name="phone"
              control={control}
              render={({ field: { onChange, value } }) => (
                <PhoneInput
                  label={t('auth.phone')}
                  value={value}
                  onChangeText={(text) => {
                    // Strip non-digits and enforce max 10 digits
                    const digits = text.replace(/\D/g, '').slice(0, 10);
                    onChange(digits);
                  }}
                  error={errors.phone?.message}
                  testID="login-phone-input"
                  maxLength={10}
                  keyboardType="number-pad"
                />
              )}
            />

            {/* Inline digit counter hint */}
            <Animated.View entering={FadeInDown.delay(200)} style={styles.hintRow}>
              <Ionicons name="information-circle-outline" size={14} color={theme.colors.textMuted} />
              <Text style={[styles.hintText, { color: theme.colors.textMuted }]}>
                {t('auth.phoneHint', '10-digit Indian mobile number (e.g. 98XXXXXXXX)')}
              </Text>
            </Animated.View>

            {error && (
              <View style={[styles.errorBox, { backgroundColor: theme.colors.errorBackground }]}>
                <Ionicons name="alert-circle" size={16} color={theme.colors.error} />
                <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
              </View>
            )}

            <PrimaryButton
              title={t('auth.loginDirect', 'LOGIN / REGISTER')}
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              testID="login-button"
            />
          </Animated.View>

          {/* Privacy note */}
          <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.privacyRow}>
            <Ionicons name="lock-closed-outline" size={14} color={theme.colors.textMuted} />
            <Text style={[styles.privacyText, { color: theme.colors.textMuted }]}>
              {t('auth.privacy', 'Your data is secure and only accessible by you')}
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },
  title: {
    fontSize: fontSize['2xl'],
    fontWeight: '800',
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: fontSize.base,
    lineHeight: fontSize.base * 1.6,
    marginBottom: spacing[6],
  },
  form: { gap: spacing[2] },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    marginTop: -spacing[1],
    marginBottom: spacing[1],
  },
  hintText: {
    fontSize: fontSize.xs,
    flex: 1,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    padding: spacing[3],
    borderRadius: borderRadius.md,
    marginBottom: spacing[2],
  },
  errorText: { fontSize: fontSize.sm, flex: 1 },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    justifyContent: 'center',
    marginTop: spacing[8],
  },
  privacyText: {
    fontSize: fontSize.xs,
    textAlign: 'center',
    flex: 1,
  },
});

export default LoginScreen;
