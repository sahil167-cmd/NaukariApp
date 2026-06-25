/**
 * WorkerConnect — Contact Recruiter Screen
 * Blocks unauthorized dashboard access, forcing the user to contact recruitment.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  BackHandler,
  Linking,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
  FadeInDown,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuthStore } from '../../store/authStore';
import { userService } from '../../services/api/userService';
import { contactService } from '../../services/api/contactService';
import ContactCard from '../../components/cards/ContactCard';
import Snackbar from '../../components/common/Snackbar';
import { spacing, layout, borderRadius, shadows } from '../../theme/spacing';
import { fontSize } from '../../theme/typography';

const { width } = Dimensions.get('window');

// Load environment variables dynamically inlined via Babel config
const SUPPORT_PHONE = process.env.SUPPORT_PHONE || '';
const SUPPORT_WHATSAPP = process.env.SUPPORT_WHATSAPP || '';

const ContactRecruiterScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { user, updateUser } = useAuthStore();

  // Animation values
  const iconScale = useSharedValue(0);
  const iconOpacity = useSharedValue(0);
  const ring1 = useSharedValue(0);
  const ring2 = useSharedValue(0);

  // States
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
  
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);

  // Load user profile details dynamically
  const { data: profileResponse, isLoading: isProfileLoading } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: () => userService.getProfile(user?.id || ''),
    enabled: !!user?.id,
  });

  const profile = profileResponse?.data;

  useEffect(() => {
    // Start animations
    iconOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
    iconScale.value = withDelay(300, withSpring(1, { damping: 10, stiffness: 100 }));
    ring1.value = withDelay(500, withTiming(1, { duration: 600 }));
    ring2.value = withDelay(700, withTiming(1, { duration: 600 }));

    // Disable Android back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Return true to disable default back behavior
      return true;
    });

    return () => backHandler.remove();
  }, []);

  const ring1Style = useAnimatedStyle(() => ({
    opacity: ring1.value * 0.25,
    transform: [{ scale: 0.7 + ring1.value * 0.5 }],
  }));

  const ring2Style = useAnimatedStyle(() => ({
    opacity: ring2.value * 0.15,
    transform: [{ scale: 0.5 + ring2.value * 0.8 }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'error') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const handleCall = async () => {
    if (!SUPPORT_PHONE) {
      showToast('Support phone number is not configured in the system.', 'error');
      return;
    }

    // Log call event to database
    await contactService.logContact('CALL');

    const url = `tel:${SUPPORT_PHONE}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        // Show bottom sheet after dialer is opened
        setTimeout(() => setBottomSheetVisible(true), 1000);
      } else {
        showToast(t('contactRecruiter.callError', { number: SUPPORT_PHONE }), 'error');
      }
    } catch (e) {
      showToast(t('contactRecruiter.callError', { number: SUPPORT_PHONE }), 'error');
    }
  };

  const handleWhatsApp = async () => {
    if (!SUPPORT_WHATSAPP) {
      showToast('Support WhatsApp number is not configured in the system.', 'error');
      return;
    }

    // Log whatsapp event to database
    await contactService.logContact('WHATSAPP');

    // Build WhatsApp Message dynamically
    const name = profile?.personal
      ? `${profile.personal.firstName} ${profile.personal.lastName}`
      : user?.name || '';
    const phone = profile?.personal?.phone || user?.phone || '';
    const jobCategories = profile?.jobPreferences?.categories?.join(', ') || '';
    const city = profile?.address?.city || '';

    const textMessage = `Hello,
I have successfully registered in the Naukari Bazaar application.

My Name: ${name}
Mobile Number: ${phone}
Preferred Job Category: ${jobCategories}
City: ${city}

Please guide me further regarding available jobs.`;

    const whatsappUrl = `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(textMessage)}`;

    try {
      const supported = await Linking.canOpenURL(whatsappUrl);
      if (supported) {
        await Linking.openURL(whatsappUrl);
        // Show bottom sheet after WhatsApp is opened
        setTimeout(() => setBottomSheetVisible(true), 1000);
      } else {
        // WhatsApp protocol might fail on simulator or web, try to open in browser link
        const fallbackUrl = `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(textMessage)}`;
        await Linking.openURL(fallbackUrl);
        setTimeout(() => setBottomSheetVisible(true), 1000);
      }
    } catch (e) {
      showToast(t('contactRecruiter.whatsappError', { number: SUPPORT_WHATSAPP }), 'error');
    }
  };

  const handleConfirmAccess = () => {
    setBottomSheetVisible(false);
    setConfirmDialogVisible(false);
    // Proceed to Dashboard by setting registration status as completed
    updateUser({ registrationComplete: true });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      <View style={styles.container}>
        {/* Support Animation Header */}
        <View style={styles.animationContainer}>
          {/* Outer ring */}
          <Animated.View
            style={[
              styles.ring,
              { backgroundColor: theme.colors.primary, width: 200, height: 200, borderRadius: 100 },
              ring2Style,
            ]}
          />
          {/* Inner ring */}
          <Animated.View
            style={[
              styles.ring,
              { backgroundColor: theme.colors.primary, width: 150, height: 150, borderRadius: 75 },
              ring1Style,
            ]}
          />
          {/* Main circle */}
          <Animated.View
            style={[
              styles.supportCircle,
              { backgroundColor: theme.colors.primary },
              iconStyle,
            ]}
          >
            <Ionicons name="headset" size={48} color="#FFF" />
          </Animated.View>
        </View>

        {/* Text Section */}
        <View style={styles.textSection}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            {t('contactRecruiter.title')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {t('contactRecruiter.subtitle')}
          </Text>
        </View>

        {/* Action Cards */}
        <View style={styles.cardsContainer}>
          <ContactCard
            icon="📞"
            title={t('contactRecruiter.card1Title')}
            description={t('contactRecruiter.card1Desc')}
            buttonTitle={t('contactRecruiter.card1Btn')}
            buttonColor={theme.colors.primary}
            buttonTextColor="#FFF"
            onPress={handleCall}
          />

          <ContactCard
            icon="💬"
            title={t('contactRecruiter.card2Title')}
            description={t('contactRecruiter.card2Desc')}
            buttonTitle={t('contactRecruiter.card2Btn')}
            buttonColor="#25D366" // WhatsApp Green
            buttonTextColor="#FFF"
            onPress={handleWhatsApp}
          />
        </View>

        {/* Skip/Continue Text Link */}
        <Pressable
          style={styles.continueLink}
          onPress={() => setConfirmDialogVisible(true)}
          accessibilityRole="button"
        >
          <Text style={[styles.continueText, { color: theme.colors.textSecondary }]}>
            {t('contactRecruiter.continueBtn')}
          </Text>
        </Pressable>
      </View>

      {/* Loading state indicator */}
      {isProfileLoading && (
        <View style={[StyleSheet.absoluteFillObject, styles.loadingOverlay]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}

      {/* Contact Verification Bottom Sheet */}
      <Modal
        visible={bottomSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setBottomSheetVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setBottomSheetVisible(false)}>
          <View
            style={[
              styles.bottomSheet,
              { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border },
              shadows.lg,
            ]}
          >
            <View style={[styles.handleBar, { backgroundColor: theme.colors.divider }]} />
            <Text style={[styles.sheetTitle, { color: theme.colors.textPrimary }]}>
              {t('contactRecruiter.sheetTitle')}
            </Text>

            <View style={styles.sheetButtons}>
              <Pressable
                style={[styles.sheetButton, styles.primarySheetBtn, { backgroundColor: theme.colors.primary }]}
                onPress={handleConfirmAccess}
              >
                <Text style={styles.primarySheetBtnText}>
                  {t('contactRecruiter.sheetYes')}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.sheetButton, styles.secondarySheetBtn, { backgroundColor: theme.colors.surfaceVariant }]}
                onPress={() => setBottomSheetVisible(false)}
              >
                <Text style={[styles.secondarySheetBtnText, { color: theme.colors.textPrimary }]}>
                  {t('contactRecruiter.sheetAgain')}
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Continue to Dashboard Confirmation Dialog (Modal-based popup) */}
      <Modal
        visible={confirmDialogVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmDialogVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setConfirmDialogVisible(false)}>
          <View
            style={[
              styles.confirmDialog,
              { backgroundColor: theme.colors.surface },
              shadows.lg,
            ]}
          >
            <Text style={[styles.dialogTitle, { color: theme.colors.textPrimary }]}>
              {t('contactRecruiter.confirmTitle')}
            </Text>

            <View style={styles.dialogButtons}>
              <Pressable
                style={[styles.dialogButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleConfirmAccess}
              >
                <Text style={styles.dialogBtnTextPrimary}>
                  {t('contactRecruiter.confirmYes')}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.dialogButton, { backgroundColor: theme.colors.surfaceVariant }]}
                onPress={() => setConfirmDialogVisible(false)}
              >
                <Text style={[styles.dialogBtnTextSecondary, { color: theme.colors.textPrimary }]}>
                  {t('contactRecruiter.confirmNo')}
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Custom Snackbar Toast */}
      <Snackbar
        visible={toastVisible}
        message={toastMessage}
        type={toastType as any}
        onDismiss={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: spacing[6],
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  animationContainer: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing[4],
    position: 'relative',
  },
  ring: {
    position: 'absolute',
  },
  supportCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  textSection: {
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    marginBottom: spacing[2],
    gap: spacing[2],
  },
  title: {
    fontSize: fontSize['2xl'],
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.base,
    textAlign: 'center',
    lineHeight: fontSize.base * 1.5,
  },
  cardsContainer: {
    width: '100%',
    marginVertical: spacing[2],
  },
  continueLink: {
    paddingVertical: spacing[3],
  },
  continueText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  loadingOverlay: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  // Modal Overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  // Bottom Sheet
  bottomSheet: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    borderTopWidth: 1,
    paddingHorizontal: spacing[5],
    paddingTop: spacing[3],
    paddingBottom: spacing[8],
    alignItems: 'center',
    width: '100%',
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: spacing[5],
  },
  sheetTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing[6],
  },
  sheetButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: spacing[3],
  },
  sheetButton: {
    flex: 1,
    height: 52,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primarySheetBtn: {},
  primarySheetBtnText: {
    color: '#FFF',
    fontSize: fontSize.base,
    fontWeight: '700',
  },
  secondarySheetBtn: {},
  secondarySheetBtnText: {
    fontSize: fontSize.base,
    fontWeight: '700',
  },
  // Dialog (Modal Alert)
  confirmDialog: {
    alignSelf: 'center',
    marginHorizontal: spacing[5],
    marginBottom: 'auto',
    marginTop: 'auto',
    width: width - spacing[10],
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    alignItems: 'center',
  },
  dialogTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing[6],
  },
  dialogButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: spacing[3],
  },
  dialogButton: {
    flex: 1,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogBtnTextPrimary: {
    color: '#FFF',
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  dialogBtnTextSecondary: {
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
});

export default ContactRecruiterScreen;
