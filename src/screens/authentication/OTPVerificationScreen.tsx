/**
 * WorkerConnect — OTP Verification Screen
 * 6-digit OTP input with countdown timer and resend.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import PrimaryButton from '../../components/common/PrimaryButton';
import { authService } from '../../services/api/authService';
import { useAuthStore } from '../../store/authStore';
import { spacing, borderRadius, layout } from '../../theme/spacing';
import { fontSize } from '../../theme/typography';
import { OTP_RESEND_SECONDS, OTP_LENGTH } from '../../constants';

import { useTranslation } from 'react-i18next';

interface OTPVerificationScreenProps {
  phone: string;
  onSuccess: (isNew: boolean) => void;
  onBack: () => void;
}

const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({
  phone,
  onSuccess,
  onBack,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { login } = useAuthStore();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [secondsLeft, setSecondsLeft] = useState(OTP_RESEND_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = useRef<TextInput[]>([]);

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const handleOtpChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError(null);
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (!digit && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }
    try {
      setIsVerifying(true);
      setError(null);
      const response = await authService.verifyOTP({ phone, otp: code });
      if (response.success) {
        login(response.data.user, response.data.tokens);
        onSuccess(response.data.isNew);
      } else {
        setError(response.message || 'Invalid OTP. Please try again.');
      }
    } catch (err: any) {
      // Show a friendly message — never expose raw MongoDB validation errors to user
      const msg = err?.message;
      if (msg && msg.length < 120 && !msg.includes('Path `')) {
        setError(msg);
      } else {
        setError('Verification failed. Please try again.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      await authService.requestOTP({ phone });
      setOtp(['', '', '', '', '', '']);
      setSecondsLeft(OTP_RESEND_SECONDS);
      setError(null);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError('Failed to resend OTP.');
    } finally {
      setIsResending(false);
    }
  };

  const maskedPhone = `+91 ****${phone.slice(-4)}`;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.container}>
          {/* Back */}
          <TouchableOpacity style={styles.backBtn} onPress={onBack} accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>

          {/* Icon */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <View style={[styles.iconBg, { backgroundColor: theme.colors.primaryLight }]}>
              <Ionicons name="lock-closed" size={28} color={theme.colors.primary} />
            </View>
          </Animated.View>

          {/* Title */}
          <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.textSection}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{t('otp.title')}</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              {t('otp.subtitle')}
            </Text>
            <Text style={[styles.phone, { color: theme.colors.textPrimary }]}>{maskedPhone}</Text>
          </Animated.View>

          {/* OTP Boxes */}
          <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.otpRow}>
            {otp.map((digit, i) => (
              <TextInput
                key={i}
                ref={(r) => { if (r) inputRefs.current[i] = r; }}
                style={[
                  styles.otpBox,
                  {
                    backgroundColor: theme.colors.inputBackground,
                    borderColor:
                      error
                        ? theme.colors.error
                        : digit
                        ? theme.colors.primary
                        : theme.colors.inputBorder,
                    color: theme.colors.textPrimary,
                  },
                ]}
                value={digit}
                onChangeText={(v) => handleOtpChange(v, i)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                accessibilityLabel={`OTP digit ${i + 1}`}
                autoFocus={i === 0}
              />
            ))}
          </Animated.View>

          {/* Error */}
          {error && (
            <Animated.View entering={FadeInDown}>
              <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>
            </Animated.View>
          )}

          {/* Verify Button */}
          <Animated.View entering={FadeInDown.delay(400).springify()} style={{ width: '100%' }}>
            <PrimaryButton
              title={t('otp.verify')}
              onPress={handleVerify}
              loading={isVerifying}
              testID="verify-otp-button"
            />
          </Animated.View>

          {/* Resend */}
          <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.resendRow}>
            {secondsLeft > 0 ? (
              <Text style={[styles.resendTimer, { color: theme.colors.textMuted }]}>
                {t('otp.resendIn', { seconds: secondsLeft })}
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResend} disabled={isResending}>
                <Text style={[styles.resendLink, { color: theme.colors.primary }]}>
                  {isResending ? 'Sending...' : t('otp.resend')}
                </Text>
              </TouchableOpacity>
            )}
          </Animated.View>

          {/* Change Number */}
          <TouchableOpacity onPress={onBack} style={styles.changeRow}>
            <Text style={[styles.changeText, { color: theme.colors.textMuted }]}>
              {t('otp.wrong')}{' '}
              <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>{t('otp.change')}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing[4],
    alignItems: 'center',
  },
  backBtn: {
    alignSelf: 'flex-start',
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },
  iconBg: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[5],
  },
  textSection: { alignItems: 'center', marginBottom: spacing[8] },
  title: { fontSize: fontSize['2xl'], fontWeight: '800', marginBottom: spacing[2] },
  subtitle: { fontSize: fontSize.base, marginBottom: spacing[1] },
  phone: { fontSize: fontSize.md, fontWeight: '700' },
  otpRow: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[5],
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  error: {
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginBottom: spacing[3],
  },
  resendRow: { marginTop: spacing[4], alignItems: 'center' },
  resendTimer: { fontSize: fontSize.base },
  resendLink: { fontSize: fontSize.base, fontWeight: '700' },
  changeRow: { marginTop: spacing[3] },
  changeText: { fontSize: fontSize.sm },
});

export default OTPVerificationScreen;
