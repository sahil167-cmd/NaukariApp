/**
 * WorkerConnect — Registration Step 1: Personal Details
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../contexts/ThemeContext';
import AppTextInput from '../../../components/common/AppTextInput';
import PhoneInput from '../../../components/common/PhoneInput';
import Dropdown from '../../../components/common/Dropdown';
import PrimaryButton from '../../../components/common/PrimaryButton';
import { personalDetailsSchema } from '../../../validators';
import { GENDERS } from '../../../constants';
import { spacing, borderRadius, layout } from '../../../theme/spacing';
import { fontSize } from '../../../theme/typography';
import type { PersonalDetails } from '../../../types';

interface Step1Props {
  initialData?: Partial<PersonalDetails>;
  onNext: (data: PersonalDetails) => void;
}

const Step1PersonalDetails: React.FC<Step1Props> = ({ initialData, onNext }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [profilePhoto, setProfilePhoto] = React.useState<string | undefined>(initialData?.profilePhoto);
  const [dobParts, setDobParts] = React.useState(() => {
    const initialDob = initialData?.dob ?? '';
    const [y, m, d] = initialDob.includes('-') ? initialDob.split('-') : ['', '', ''];
    return {
      day: d || '',
      month: m || '',
      year: y || '',
    };
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PersonalDetails>({
    resolver: yupResolver(personalDetailsSchema) as any,
    defaultValues: {
      firstName: initialData?.firstName ?? '',
      lastName: initialData?.lastName ?? '',
      dob: initialData?.dob ?? '',
      gender: initialData?.gender ?? '',
      phone: initialData?.phone ?? '',
      email: initialData?.email ?? '',
    },
  });

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'] as ImagePicker.MediaType[],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setProfilePhoto(result.assets[0].uri);
      setValue('profilePhoto', result.assets[0].uri);
    }
  };

  const onSubmit = (data: any) => {
    onNext({ ...data, profilePhoto });
  };

  const days = Array.from({ length: 31 }, (_, i) => {
    const d = String(i + 1).padStart(2, '0');
    return { label: d, value: d };
  });

  const months = [
    { label: 'Jan', value: '01' },
    { label: 'Feb', value: '02' },
    { label: 'Mar', value: '03' },
    { label: 'Apr', value: '04' },
    { label: 'May', value: '05' },
    { label: 'Jun', value: '06' },
    { label: 'Jul', value: '07' },
    { label: 'Aug', value: '08' },
    { label: 'Sep', value: '09' },
    { label: 'Oct', value: '10' },
    { label: 'Nov', value: '11' },
    { label: 'Dec', value: '12' },
  ];

  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 18;
  const endYear = currentYear - 80;
  const years = Array.from({ length: startYear - endYear + 1 }, (_, i) => {
    const y = String(startYear - i);
    return { label: y, value: y };
  });

  const genderOptions = GENDERS.map((g) => ({ label: g, value: g }));

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Photo Picker */}
      <View style={styles.photoSection}>
        <TouchableOpacity
          style={[styles.photoBtn, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border }]}
          onPress={pickPhoto}
          accessibilityLabel={t('personal.photo', 'Profile Photo')}
        >
          {profilePhoto ? (
            <Image source={{ uri: profilePhoto }} style={styles.photoImage} />
          ) : (
            <>
              <Ionicons name="camera" size={28} color={theme.colors.primary} />
              <Text style={[styles.photoText, { color: theme.colors.textSecondary }]}>
                {t('personal.uploadPhoto', 'Upload Photo')}
              </Text>
            </>
          )}
        </TouchableOpacity>
        <Text style={[styles.photoHint, { color: theme.colors.textMuted }]}>
          {t('personal.photoHint', 'Optional — Increases your profile visibility')}
        </Text>
      </View>

      {/* First Name */}
      <Controller
        name="firstName"
        control={control}
        render={({ field: { onChange, value } }) => (
          <AppTextInput
            label={t('personal.firstName')}
            placeholder={t('personal.firstNamePlaceholder', 'Enter your first name')}
            value={value}
            onChangeText={onChange}
            error={errors.firstName?.message}
            required
            leftIcon="person-outline"
          />
        )}
      />

      {/* Last Name */}
      <Controller
        name="lastName"
        control={control}
        render={({ field: { onChange, value } }) => (
          <AppTextInput
            label={t('personal.lastName')}
            placeholder={t('personal.lastNamePlaceholder', 'Enter your last name')}
            value={value}
            onChangeText={onChange}
            error={errors.lastName?.message}
            required
            leftIcon="person-outline"
          />
        )}
      />

      {/* DOB Dropdown Row */}
      <View style={styles.dobContainer}>
        <Text style={[styles.dobLabel, { color: theme.colors.textSecondary }]}>
          {t('personal.dob')} <Text style={{ color: theme.colors.primary }}>*</Text>
        </Text>
        
        <Controller
          name="dob"
          control={control}
          render={({ field: { onChange } }) => {
            const handleSelect = (val: string, type: 'day' | 'month' | 'year') => {
              const updated = {
                ...dobParts,
                [type]: val,
              };
              setDobParts(updated);

              if (updated.day && updated.month && updated.year) {
                onChange(`${updated.year}-${updated.month}-${updated.day}`);
              } else {
                onChange('');
              }
            };

            return (
              <View>
                <View style={styles.dobRow}>
                  <View style={{ flex: 1 }}>
                    <Dropdown
                      placeholder={t('personal.day', 'Day')}
                      options={days}
                      value={dobParts.day}
                      onSelect={(val) => handleSelect(val, 'day')}
                      error={errors.dob?.message ? ' ' : undefined}
                    />
                  </View>
                  <View style={{ flex: 1.5 }}>
                    <Dropdown
                      placeholder={t('personal.month', 'Month')}
                      options={months}
                      value={dobParts.month}
                      onSelect={(val) => handleSelect(val, 'month')}
                      error={errors.dob?.message ? ' ' : undefined}
                    />
                  </View>
                  <View style={{ flex: 1.2 }}>
                    <Dropdown
                      placeholder={t('personal.year', 'Year')}
                      options={years}
                      value={dobParts.year}
                      onSelect={(val) => handleSelect(val, 'year')}
                      error={errors.dob?.message ? ' ' : undefined}
                    />
                  </View>
                </View>
                {errors.dob?.message && (
                  <Text style={[styles.dobError, { color: theme.colors.inputError }]}>
                    {errors.dob.message}
                  </Text>
                )}
              </View>
            );
          }}
        />
      </View>

      {/* Gender */}
      <Controller
        name="gender"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Dropdown
            label={t('personal.gender')}
            placeholder={t('personal.genderPlaceholder', 'Select your gender')}
            options={genderOptions}
            value={value}
            onSelect={onChange}
            error={errors.gender?.message}
            required
          />
        )}
      />

      {/* Phone */}
      <Controller
        name="phone"
        control={control}
        render={({ field: { onChange, value } }) => (
          <PhoneInput
            label={t('personal.phone')}
            value={value}
            onChangeText={onChange}
            error={errors.phone?.message}
          />
        )}
      />

      {/* Email */}
      <Controller
        name="email"
        control={control}
        render={({ field: { onChange, value } }) => (
          <AppTextInput
            label={t('personal.email')}
            placeholder={t('common.optional')}
            value={value ?? ''}
            onChangeText={onChange}
            error={errors.email?.message}
            leftIcon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />

      <PrimaryButton
        title={t('registration.next')}
        onPress={handleSubmit(onSubmit)}
        style={{ marginTop: spacing[4] }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: layout.screenPaddingHorizontal,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  photoBtn: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
    overflow: 'hidden',
  },
  photoImage: { width: 100, height: 100 },
  photoText: { fontSize: fontSize.xs, marginTop: 4 },
  photoHint: { fontSize: fontSize.xs, textAlign: 'center' },
  dobContainer: {
    marginBottom: spacing[4],
  },
  dobLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginBottom: spacing[2],
  },
  dobRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  dobError: {
    fontSize: fontSize.xs,
    marginTop: spacing[1],
  },
});

export default Step1PersonalDetails;
