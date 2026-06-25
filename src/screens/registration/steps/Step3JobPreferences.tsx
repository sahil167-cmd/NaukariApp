/**
 * WorkerConnect — Registration Step 3: Job Preferences
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../contexts/ThemeContext';
import Dropdown from '../../../components/common/Dropdown';
import PrimaryButton from '../../../components/common/PrimaryButton';
import { Checkbox } from '../../../components/common/FormControls';
import { RadioGroup } from '../../../components/common/FormControls';
import { jobPreferencesSchema } from '../../../validators';
import { JOB_CATEGORIES, SALARY_RANGES, SHIFT_PREFERENCES } from '../../../constants';
import { spacing, layout, borderRadius } from '../../../theme/spacing';
import { fontSize } from '../../../theme/typography';
import type { JobPreferences } from '../../../types';

interface Step3Props {
  initialData?: Partial<JobPreferences>;
  onNext: (data: JobPreferences) => void;
}

const Step3JobPreferences: React.FC<Step3Props> = ({ initialData, onNext }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialData?.categories ?? []
  );

  const { control, handleSubmit, formState: { errors } } = useForm<any>({
    defaultValues: {
      salaryRange: initialData?.salaryRange ?? '',
      shiftPreference: initialData?.shiftPreference ?? '',
      immediatelyAvailable: initialData?.immediatelyAvailable ?? false,
      willingToRelocate: initialData?.willingToRelocate ?? false,
    },
  });

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const onSubmit = (data: any) => {
    if (selectedCategories.length === 0) return;
    onNext({
      ...data,
      categories: selectedCategories,
      preferredLocations: [],
    });
  };

  const salaryOptions = SALARY_RANGES.map((s) => ({ label: s, value: s }));
  const shiftOptions = SHIFT_PREFERENCES.map((s) => ({ label: s, value: s }));

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Job Categories */}
      <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
        {t('jobPref.categories')} <Text style={{ color: theme.colors.error }}>*</Text>
      </Text>
      <Text style={[styles.sectionHint, { color: theme.colors.textMuted }]}>
        {t('common.selectAll', 'Select all that apply')}
      </Text>
      <View style={styles.categories}>
        {JOB_CATEGORIES.map((cat) => {
          const isSelected = selectedCategories.includes(cat);
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: isSelected ? theme.colors.primaryLight : theme.colors.surfaceVariant,
                  borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                },
              ]}
              onPress={() => toggleCategory(cat)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: isSelected ? theme.colors.primary : theme.colors.textSecondary },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {selectedCategories.length === 0 && (
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {t('errors.required', 'Select at least one category')}
        </Text>
      )}

      {/* Salary Range */}
      <Controller
        name="salaryRange"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Dropdown
            label={t('jobPref.salary')}
            placeholder={t('jobPref.salaryPlaceholder', 'Select salary range')}
            options={salaryOptions}
            value={value}
            onSelect={onChange}
            error={typeof errors.salaryRange?.message === 'string' ? errors.salaryRange.message : undefined}
            required
          />
        )}
      />

      {/* Shift */}
      <Controller
        name="shiftPreference"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Dropdown
            label={t('jobPref.shift')}
            placeholder={t('jobPref.shiftPlaceholder', 'Select shift preference')}
            options={shiftOptions}
            value={value}
            onSelect={onChange}
            error={typeof errors.shiftPreference?.message === 'string' ? errors.shiftPreference.message : undefined}
            required
          />
        )}
      />

      {/* Toggles */}
      <Controller
        name="immediatelyAvailable"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Checkbox
            label={t('jobPref.available')}
            checked={value}
            onPress={() => onChange(!value)}
          />
        )}
      />
      <Controller
        name="willingToRelocate"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Checkbox
            label={t('jobPref.relocate')}
            checked={value}
            onPress={() => onChange(!value)}
          />
        )}
      />

      <PrimaryButton title={t('registration.next')} onPress={handleSubmit(onSubmit)} style={{ marginTop: spacing[4] }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: layout.screenPaddingHorizontal },
  sectionLabel: { fontSize: fontSize.sm, fontWeight: '500', marginBottom: spacing[1] },
  sectionHint: { fontSize: fontSize.xs, marginBottom: spacing[3] },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2], marginBottom: spacing[3] },
  categoryChip: {
    borderWidth: 1.5,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  chipText: { fontSize: fontSize.sm, fontWeight: '500' },
  error: { fontSize: fontSize.xs, marginBottom: spacing[3] },
});

export default Step3JobPreferences;
