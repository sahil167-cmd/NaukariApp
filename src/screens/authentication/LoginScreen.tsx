/**
 * WorkerConnect — Login Screen
 * Phone + OTP-based login flow.
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
import { FadeInDown } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import PhoneInput from '../../components/common/PhoneInput';
import PrimaryButton from '../../components/common/PrimaryButton';
import { loginSchema } from '../../validators';
import { authService } from '../../services/api/authService';
import { spacing, layout, borderRadius } from '../../theme/spacing';
import { fontSize } from '../../theme/typography';

import { useTranslation } from 'react-i18next';

interface LoginFormData {
  phone: string;
}

interface LoginScreenProps {
  onOTPSent: (phone: string) => void;
  onBack: () => void;
  onRegister: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onOTPSent, onBack, onRegister }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
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
      await authService.requestOTP({ phone: data.phone });
      onOTPSent(data.phone);
    } catch (err: any) {
      setError(err.message ?? 'Failed to send OTP. Please try again.');
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
            {/* Header */}
            <View style={[styles.iconWrapper, { backgroundColor: theme.colors.primaryLight }]}>
              <Ionicons name="phone-portrait" size={28} color={theme.colors.primary} />
            </View>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              {t('auth.login')}
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              {t('auth.loginSubtitle')}
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
                  onChangeText={onChange}
                  error={errors.phone?.message}
                  testID="login-phone-input"
                />
              )}
            />

            {error && (
              <View style={[styles.errorBox, { backgroundColor: theme.colors.errorBackground }]}>
                <Ionicons name="alert-circle" size={16} color={theme.colors.error} />
                <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
              </View>
            )}

            <PrimaryButton
              title={t('auth.sendOtp')}
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              testID="send-otp-button"
            />
          </Animated.View>

          {/* Divider */}
          <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.dividerRow}>
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <Text style={[styles.orText, { color: theme.colors.textMuted }]}>
              {t('auth.orLogin')}
            </Text>
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          </Animated.View>

          {/* Register Link */}
          <Animated.View entering={FadeInDown.delay(700).springify()} style={styles.registerRow}>
            <Text style={[styles.registerText, { color: theme.colors.textSecondary }]}>
              {t('auth.noAccount')}{' '}
            </Text>
            <TouchableOpacity onPress={onRegister}>
              <Text style={[styles.registerLink, { color: theme.colors.primary }]}>
                {t('auth.signUp')}
              </Text>
            </TouchableOpacity>
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
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    padding: spacing[3],
    borderRadius: borderRadius.md,
    marginBottom: spacing[2],
  },
  errorText: { fontSize: fontSize.sm, flex: 1 },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginVertical: spacing[6],
  },
  divider: { flex: 1, height: 1 },
  orText: { fontSize: fontSize.sm },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: { fontSize: fontSize.base },
  registerLink: { fontSize: fontSize.base, fontWeight: '700' },
});

export default LoginScreen;
