/**
 * WorkerConnect — Registration Wizard Screen
 * Orchestrates all 7 steps with progress indicator, autosave, and navigation.
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useRegistrationStore } from '../../store/registrationStore';
import ProgressIndicator from '../../components/common/ProgressIndicator';
import Step1PersonalDetails from './steps/Step1PersonalDetails';
import Step2Address from './steps/Step2Address';
import Step3JobPreferences from './steps/Step3JobPreferences';
import Step4Education from './steps/Step4Education';
import Step5Experience from './steps/Step5Experience';
import Step7Review from './steps/Step7Review';
import { userService } from '../../services/api/userService';
import { spacing, layout } from '../../theme/spacing';
import { fontSize } from '../../theme/typography';
import type {
  PersonalDetails, AddressDetails, JobPreferences,
  EducationDetails, ExperienceDetails, DocumentDetails, RegistrationStep,
} from '../../types';

interface RegistrationWizardScreenProps {
  onSuccess: () => void;
  onBack: () => void;
}

const RegistrationWizardScreen: React.FC<RegistrationWizardScreenProps> = ({
  onSuccess,
  onBack,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const {
    draft,
    isSubmitting,
    lastSavedAt,
    nextStep,
    prevStep,
    setStep,
    setPersonal,
    setAddress,
    setJobPreferences,
    setEducation,
    setExperience,
    setSubmitting,
    resetRegistration,
  } = useRegistrationStore();

  React.useEffect(() => {
    // Force isSubmitting to false on load to unlock the UI from any previous stuck states
    setSubmitting(false);
  }, []);

  const currentStep = draft.currentStep;

  const handleNext = useCallback(async (stepData: any) => {
    switch (currentStep) {
      case 1: setPersonal(stepData); break;
      case 2: setAddress(stepData); break;
      case 3: setJobPreferences(stepData); break;
      case 4: setEducation(stepData); break;
      case 5: setExperience(stepData); break;
    }
    nextStep();
  }, [currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep === 1) {
      Alert.alert(
        t('registration.exitTitle', 'Exit Registration'),
        t('registration.exitMsg', 'Your progress has been saved. You can continue later.'),
        [
          { text: t('common.stay', 'Stay'), style: 'cancel' },
          { text: t('common.exit', 'Exit'), style: 'destructive', onPress: onBack },
        ]
      );
    } else {
      prevStep();
    }
  }, [currentStep, onBack]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await userService.submitRegistration(draft);
      resetRegistration();
      onSuccess();
    } catch (err: any) {
      Alert.alert(t('registration.submitFailed', 'Submission Failed'), err.message ?? t('errors.serverError'));
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1PersonalDetails
            initialData={draft.personal}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <Step2Address
            initialData={draft.address}
            onNext={handleNext}
          />
        );
      case 3:
        return (
          <Step3JobPreferences
            initialData={draft.jobPreferences}
            onNext={handleNext}
          />
        );
      case 4:
        return (
          <Step4Education
            initialData={draft.education}
            onNext={handleNext}
          />
        );
      case 5:
        return (
          <Step5Experience
            initialData={draft.experience}
            onNext={handleNext}
          />
        );
      case 6:
        return (
          <Step7Review
            draft={draft}
            onSubmit={handleSubmit}
            onEditStep={(step) => setStep(step as RegistrationStep)}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.divider }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleBack}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
            {t('registration.title')}
          </Text>
          {lastSavedAt && (
            <Text style={[styles.savedText, { color: theme.colors.success }]}>
              {t('registration.autoSaved', '✓ Progress saved')}
            </Text>
          )}
        </View>

        <View style={styles.headerRight} />
      </View>

      {/* Progress */}
      <View style={styles.progressWrapper}>
        <ProgressIndicator currentStep={currentStep} />
      </View>

      {/* Step Content wrapped in KeyboardAvoidingView */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={{ flex: 1 }}>
          {renderStep()}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: fontSize.base, fontWeight: '700' },
  savedText: { fontSize: fontSize.xs, marginTop: 2 },
  headerRight: { width: 44 },
  progressWrapper: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing[4],
  },
});

export default RegistrationWizardScreen;
