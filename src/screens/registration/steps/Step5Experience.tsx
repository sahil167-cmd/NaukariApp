/**
 * WorkerConnect — Registration Step 5: Work Experience
 */

import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
} from 'react-native';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../contexts/ThemeContext';
import AppTextInput from '../../../components/common/AppTextInput';
import { Checkbox } from '../../../components/common/FormControls';
import PrimaryButton from '../../../components/common/PrimaryButton';
import { spacing, layout, borderRadius } from '../../../theme/spacing';
import { fontSize } from '../../../theme/typography';
import type { ExperienceDetails } from '../../../types';

interface Step5Props {
  initialData?: Partial<ExperienceDetails>[];
  onNext: (data: Partial<ExperienceDetails>[]) => void;
}

const emptyExp = (): Partial<ExperienceDetails> => ({
  id: Date.now().toString(),
  companyName: '',
  jobRole: '',
  duration: '',
  location: '',
  isCurrent: false,
});

const Step5Experience: React.FC<Step5Props> = ({ initialData, onNext }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [isFresher, setIsFresher] = useState(
    !initialData || initialData.length === 0
  );
  const [experiences, setExperiences] = useState<Partial<ExperienceDetails>[]>(
    initialData?.length ? initialData : [emptyExp()]
  );

  const updateExp = (index: number, key: keyof ExperienceDetails, value: any) => {
    setExperiences((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const addExp = () => setExperiences((prev) => [...prev, emptyExp()]);

  const removeExp = (index: number) => {
    setExperiences((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (isFresher) {
      onNext([]);
    } else {
      onNext(experiences);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Fresher toggle */}
      <Checkbox
        label={t('experience.fresher', 'I am a Fresher (No previous work experience)')}
        checked={isFresher}
        onPress={() => setIsFresher((v) => !v)}
        containerStyle={{ marginBottom: spacing[5] }}
      />

      {!isFresher && (
        <>
          {experiences.map((exp, i) => (
            <View
              key={exp.id ?? i}
              style={[
                styles.expCard,
                {
                  backgroundColor: theme.colors.cardBackground,
                  borderColor: theme.colors.cardBorder,
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
                  {t('experience.title', 'Experience')} #{i + 1}
                </Text>
                {experiences.length > 1 && (
                  <TouchableOpacity onPress={() => removeExp(i)}>
                    <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
                  </TouchableOpacity>
                )}
              </View>

              <AppTextInput
                label={t('experience.company')}
                placeholder={t('experience.companyPlaceholder', 'e.g. BuildFast Infra Pvt. Ltd.')}
                value={exp.companyName ?? ''}
                onChangeText={(v) => updateExp(i, 'companyName', v)}
                required
                leftIcon="business-outline"
              />
              <AppTextInput
                label={t('experience.role')}
                placeholder={t('experience.rolePlaceholder', 'e.g. Construction Helper, Driver')}
                value={exp.jobRole ?? ''}
                onChangeText={(v) => updateExp(i, 'jobRole', v)}
                required
                leftIcon="construct-outline"
              />
              <AppTextInput
                label={t('experience.duration')}
                placeholder={t('experience.durationPlaceholder', 'e.g. 1 year 6 months')}
                value={exp.duration ?? ''}
                onChangeText={(v) => updateExp(i, 'duration', v)}
                required
                leftIcon="time-outline"
              />
              <AppTextInput
                label={t('experience.location', 'Work Location')}
                placeholder={t('experience.locPlaceholder', 'e.g. Mumbai, Maharashtra')}
                value={exp.location ?? ''}
                onChangeText={(v) => updateExp(i, 'location', v)}
                leftIcon="location-outline"
              />
              <Checkbox
                label={t('experience.current')}
                checked={exp.isCurrent ?? false}
                onPress={() => updateExp(i, 'isCurrent', !exp.isCurrent)}
              />
            </View>
          ))}

          <TouchableOpacity
            style={[styles.addBtn, { borderColor: theme.colors.primary }]}
            onPress={addExp}
            accessibilityLabel={t('experience.add', 'Add Another Experience')}
          >
            <Ionicons name="add-circle-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.addText, { color: theme.colors.primary }]}>
              {t('experience.add', 'Add Another Experience')}
            </Text>
          </TouchableOpacity>
        </>
      )}

      <PrimaryButton title={t('registration.next')} onPress={handleNext} style={{ marginTop: spacing[4] }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: layout.screenPaddingHorizontal },
  expCard: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  cardTitle: { fontSize: fontSize.base, fontWeight: '700' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing[4],
    marginTop: spacing[2],
  },
  addText: { fontSize: fontSize.base, fontWeight: '600' },
});

export default Step5Experience;
