/**
 * WorkerConnect — Registration Step 7: Review
 */

import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../contexts/ThemeContext';
import PrimaryButton from '../../../components/common/PrimaryButton';
import { spacing, layout, borderRadius } from '../../../theme/spacing';
import { fontSize } from '../../../theme/typography';
import type { RegistrationDraft } from '../../../types';

interface Step7Props {
  draft: RegistrationDraft;
  onSubmit: () => void;
  onEditStep: (step: number) => void;
  isSubmitting?: boolean;
}

const ReviewSection: React.FC<{
  title: string;
  step: number;
  onEdit: (s: number) => void;
  children: React.ReactNode;
}> = ({ title, step, onEdit, children }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  return (
    <View style={[styles.section, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>{title}</Text>
        <TouchableOpacity onPress={() => onEdit(step)} style={styles.editBtn}>
          <Ionicons name="create-outline" size={16} color={theme.colors.primary} />
          <Text style={[styles.editText, { color: theme.colors.primary }]}>{t('common.edit', 'Edit')}</Text>
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
};

const ReviewRow: React.FC<{ label: string; value?: string }> = ({ label, value }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: theme.colors.textMuted }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: theme.colors.textPrimary }]}>{value || '—'}</Text>
    </View>
  );
};

const Step7Review: React.FC<Step7Props> = ({ draft, onSubmit, onEditStep, isSubmitting }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={[styles.heading, { color: theme.colors.textSecondary }]}>
        {t('review.subtitle', 'Please review all details before submitting.')}
      </Text>

      {/* Personal */}
      <ReviewSection title={t('personal.title')} step={1} onEdit={onEditStep}>
        <ReviewRow label={t('personal.name', 'Name')} value={`${draft.personal?.firstName ?? ''} ${draft.personal?.lastName ?? ''}`} />
        <ReviewRow label={t('personal.dob')} value={draft.personal?.dob} />
        <ReviewRow label={t('personal.gender')} value={draft.personal?.gender} />
        <ReviewRow label={t('personal.phone')} value={draft.personal?.phone} />
        <ReviewRow label={t('personal.email')} value={draft.personal?.email} />
      </ReviewSection>

      {/* Address */}
      <ReviewSection title={t('address.title')} step={2} onEdit={onEditStep}>
        <ReviewRow label={t('address.street')} value={draft.address?.streetAddress} />
        <ReviewRow label={t('address.city')} value={draft.address?.city} />
        <ReviewRow label={t('address.district')} value={draft.address?.district} />
        <ReviewRow label={t('address.state')} value={draft.address?.state} />
        <ReviewRow label={t('address.pinCode')} value={draft.address?.pinCode} />
      </ReviewSection>

      {/* Job Preferences */}
      <ReviewSection title={t('jobPref.title')} step={3} onEdit={onEditStep}>
        <ReviewRow label={t('jobPref.categories')} value={draft.jobPreferences?.categories?.join(', ')} />
        <ReviewRow label={t('jobPref.salary')} value={draft.jobPreferences?.salaryRange} />
        <ReviewRow label={t('jobPref.shift')} value={draft.jobPreferences?.shiftPreference} />
        <ReviewRow
          label={t('jobPref.available')}
          value={draft.jobPreferences?.immediatelyAvailable ? t('common.yes') : t('common.no')}
        />
        <ReviewRow
          label={t('jobPref.relocate')}
          value={draft.jobPreferences?.willingToRelocate ? t('common.yes') : t('common.no')}
        />
      </ReviewSection>

      {/* Education */}
      <ReviewSection title={t('education.title')} step={4} onEdit={onEditStep}>
        <ReviewRow label={t('education.level')} value={draft.education?.highestLevel} />
        <ReviewRow label={t('education.specialization')} value={draft.education?.specialization} />
        <ReviewRow label={t('education.institution')} value={draft.education?.institutionName} />
        <ReviewRow label={t('education.passingYear', 'Passing Year')} value={draft.education?.passingYear} />
      </ReviewSection>

      {/* Experience */}
      <ReviewSection title={t('experience.title')} step={5} onEdit={onEditStep}>
        {!draft.experience || draft.experience.length === 0 ? (
          <ReviewRow label={t('common.status', 'Status')} value={t('experience.fresher')} />
        ) : (
          draft.experience.map((exp, i) => (
            <View key={i} style={styles.expBlock}>
              <ReviewRow label={`${t('experience.company')} ${i + 1}`} value={exp.companyName} />
              <ReviewRow label={t('experience.role')} value={exp.jobRole} />
              <ReviewRow label={t('experience.duration')} value={exp.duration} />
            </View>
          ))
        )}
      </ReviewSection>

      {/* Agreement */}
      <View style={[styles.agreement, { backgroundColor: theme.colors.primaryLight, borderColor: theme.colors.primary }]}>
        <Ionicons name="shield-checkmark-outline" size={18} color={theme.colors.primary} />
        <Text style={[styles.agreementText, { color: theme.colors.primary }]}>
          {t('review.agreement', 'By submitting, you confirm all information is accurate and agree to our Terms of Service.')}
        </Text>
      </View>

      <PrimaryButton
        title={t('review.submit')}
        onPress={onSubmit}
        loading={isSubmitting}
        style={{ marginTop: spacing[4] }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: layout.screenPaddingHorizontal },
  heading: { fontSize: fontSize.sm, marginBottom: spacing[4], lineHeight: fontSize.sm * 1.6 },
  section: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing[4],
    marginBottom: spacing[3],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
    paddingBottom: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: '#E0D8D0',
  },
  sectionTitle: { fontSize: fontSize.base, fontWeight: '700' },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  editText: { fontSize: fontSize.sm, fontWeight: '600' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing[2],
  },
  rowLabel: { fontSize: fontSize.sm, flex: 1 },
  rowValue: { fontSize: fontSize.sm, fontWeight: '500', flex: 1, textAlign: 'right' },
  expBlock: { paddingBottom: spacing[2], marginBottom: spacing[2], borderBottomWidth: 0.5, borderColor: '#E0D8D0' },
  agreement: {
    flexDirection: 'row',
    gap: spacing[3],
    padding: spacing[4],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'flex-start',
    marginTop: spacing[3],
  },
  agreementText: { flex: 1, fontSize: fontSize.sm, lineHeight: fontSize.sm * 1.6 },
});

export default Step7Review;
