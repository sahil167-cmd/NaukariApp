/**
 * WorkerConnect — Personal Details Step
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { useRegistrationStore } from '../../../store/registrationStore';
import AppTextInput from '../../../components/common/AppTextInput';
import PrimaryButton from '../../../components/common/PrimaryButton';
import { spacing, borderRadius } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';
import { GENDERS } from '../../../constants';

const PersonalDetailsStep: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const { draft, setPersonal, nextStep } = useRegistrationStore();
  
  const [formData, setFormData] = useState({
    firstName: draft.personal?.firstName || '',
    lastName: draft.personal?.lastName || '',
    email: draft.personal?.email || '',
    gender: draft.personal?.gender || '',
    dob: draft.personal?.dob || '',
  });

  const handleNext = () => {
    setPersonal(formData);
    nextStep();
  };

  const isValid = formData.firstName && formData.gender;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Build your profile</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Help employers find you by sharing a few details.
        </Text>

        <TouchableOpacity style={[styles.photoUpload, { backgroundColor: colors.surfaceVariant }]}>
          <View style={styles.photoPlaceholder}>
            <Ionicons name="camera" size={32} color={colors.textMuted} />
            <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
              <Ionicons name="pencil" size={12} color="white" />
            </View>
          </View>
          <Text style={[styles.photoText, { color: colors.textSecondary }]}>Add Profile Photo</Text>
        </TouchableOpacity>

        <AppTextInput
          label="Full Name"
          value={formData.firstName}
          onChangeText={(val) => setFormData({ ...formData, firstName: val })}
          placeholder="e.g. Ramesh Kumar"
        />

        <AppTextInput
          label="Mobile Number"
          value="+91 9876543210"
          editable={false}
          rightIcon={
            <View style={[styles.verifiedBadge, { backgroundColor: colors.successBackground }]}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={[styles.verifiedText, { color: colors.success }]}>VERIFIED</Text>
            </View>
          }
        />

        <AppTextInput
          label="Email ID"
          value={formData.email}
          onChangeText={(val) => setFormData({ ...formData, email: val })}
          placeholder="name@example.com"
          keyboardType="email-address"
          optional
        />

        <View style={styles.genderContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Gender</Text>
          <View style={styles.genderButtons}>
            {['Male', 'Female', 'Other'].map((gender) => (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.genderButton,
                  {
                    backgroundColor: formData.gender === gender ? colors.primary : colors.surface,
                    borderColor: formData.gender === gender ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setFormData({ ...formData, gender })}
              >
                <Text
                  style={[
                    styles.genderText,
                    { color: formData.gender === gender ? colors.buttonPrimaryText : colors.textPrimary },
                  ]}
                >
                  {gender}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <AppTextInput
          label="Date of Birth"
          value={formData.dob}
          onChangeText={(val) => setFormData({ ...formData, dob: val })}
          placeholder="dd-mm-yyyy"
          rightIcon={<Ionicons name="calendar-outline" size={20} color={colors.textMuted} />}
        />
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton title="NEXT STEP" onPress={handleNext} disabled={!isValid} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[8],
  },
  title: {
    ...textStyles.h3,
    marginBottom: spacing[2],
  },
  subtitle: {
    ...textStyles.body2,
    marginBottom: spacing[6],
  },
  photoUpload: {
    alignItems: 'center',
    paddingVertical: spacing[6],
    borderRadius: borderRadius.lg,
    marginBottom: spacing[6],
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoText: {
    ...textStyles.body2,
    fontWeight: '600',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.sm,
    gap: spacing[1],
  },
  verifiedText: {
    ...textStyles.caption,
    fontWeight: '700',
    fontSize: 10,
  },
  genderContainer: {
    marginBottom: spacing[4],
  },
  label: {
    ...textStyles.label,
    marginBottom: spacing[2],
  },
  genderButtons: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  genderButton: {
    flex: 1,
    paddingVertical: spacing[3],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  genderText: {
    ...textStyles.body1,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
});

export default PersonalDetailsStep;
