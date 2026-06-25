/**
 * WorkerConnect — Registration Step 4: Education
 */

import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../contexts/ThemeContext';
import AppTextInput from '../../../components/common/AppTextInput';
import Dropdown from '../../../components/common/Dropdown';
import PrimaryButton from '../../../components/common/PrimaryButton';
import { educationSchema } from '../../../validators';
import { EDUCATION_LEVELS } from '../../../constants';
import { spacing, layout } from '../../../theme/spacing';
import type { EducationDetails } from '../../../types';

interface Step4Props {
  initialData?: Partial<EducationDetails>;
  onNext: (data: EducationDetails) => void;
}

const Step4Education: React.FC<Step4Props> = ({ initialData, onNext }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { control, handleSubmit, formState: { errors } } = useForm<EducationDetails>({
    resolver: yupResolver(educationSchema) as any,
    defaultValues: {
      highestLevel: initialData?.highestLevel ?? '',
      specialization: initialData?.specialization ?? '',
      institutionName: initialData?.institutionName ?? '',
      passingYear: initialData?.passingYear ?? '',
    },
  });

  const educationOptions = EDUCATION_LEVELS.map((e) => ({ label: e, value: e }));

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Controller
        name="highestLevel"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Dropdown
            label={t('education.level')}
            placeholder={t('education.levelPlaceholder', 'Select education level')}
            options={educationOptions}
            value={value}
            onSelect={onChange}
            error={errors.highestLevel?.message}
            required
          />
        )}
      />
      <Controller
        name="specialization"
        control={control}
        render={({ field: { onChange, value } }) => (
          <AppTextInput
            label={t('education.specialization')}
            placeholder={t('education.specPlaceholder', 'e.g. Science, Commerce, ITI Electrical')}
            value={value ?? ''}
            onChangeText={onChange}
            leftIcon="school-outline"
          />
        )}
      />
      <Controller
        name="institutionName"
        control={control}
        render={({ field: { onChange, value } }) => (
          <AppTextInput
            label={t('education.institution')}
            placeholder={t('education.instPlaceholder', 'Enter institution name')}
            value={value ?? ''}
            onChangeText={onChange}
            leftIcon="library-outline"
          />
        )}
      />
      <Controller
        name="passingYear"
        control={control}
        render={({ field: { onChange, value } }) => (
          <AppTextInput
            label={t('education.year')}
            placeholder={t('education.yearPlaceholder', 'e.g. 2018')}
            value={value ?? ''}
            onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, 4))}
            keyboardType="number-pad"
            maxLength={4}
            leftIcon="calendar-outline"
          />
        )}
      />
      <PrimaryButton title={t('registration.next')} onPress={handleSubmit(onNext as any)} style={{ marginTop: spacing[4] }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: layout.screenPaddingHorizontal },
});

export default Step4Education;
