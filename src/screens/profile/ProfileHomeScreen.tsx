/**
 * WorkerConnect — Profile Home Screen
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { textStyles } from '../../theme/typography';

const ProfileHomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.logo, { color: colors.primary }]}>{t('app.name', 'Naukari Bazaar')}</Text>
        <TouchableOpacity>
          <Ionicons name="person-circle-outline" size={28} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={[styles.profileCard, { backgroundColor: colors.surface }, shadows.base]}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, { backgroundColor: colors.surfaceVariant }]}>
                <Text style={styles.avatarText}>👤</Text>
              </View>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={[styles.name, { color: colors.textPrimary }]}>Ramesh Kumar</Text>
                <Ionicons name="checkmark-circle" size={20} color={colors.info} />
              </View>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color={colors.textMuted} />
                <Text style={[styles.location, { color: colors.textSecondary }]}>New Delhi, India</Text>
              </View>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color={colors.warning} />
                <Text style={[styles.rating, { color: colors.info }]}>4.9 (42 Reviews)</Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.editButton, { backgroundColor: colors.primary }]}>
              <Ionicons name="pencil" size={16} color="white" />
              <Text style={styles.editText}>{t('profile.edit', 'Edit Profile')}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.progressSection, { backgroundColor: colors.surfaceVariant }]}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>{t('profile.completion', 'Profile Completion')}</Text>
              <Text style={[styles.progressPercent, { color: colors.primary }]}>85%</Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
              <View style={[styles.progress, { backgroundColor: colors.primary, width: '85%' }]} />
            </View>
            <Text style={[styles.progressHint, { color: colors.textMuted }]}>
              {t('profile.progressHint', 'Complete "Documents" to reach 100%')}
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }, shadows.base]}>
          <View style={[styles.sectionIcon, { backgroundColor: colors.warningBackground }]}>
            <Ionicons name="briefcase-outline" size={24} color={colors.warning} />
          </View>
          <View style={styles.sectionContent}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('profile.experience', 'Experience')}</Text>
            <Text style={[styles.sectionValue, { color: colors.primary }]}>5 Years</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>Skilled Professional</Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }, shadows.base]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="bookmark" size={20} color={colors.primary} />
            <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>{t('profile.job', 'Job Preferences')}</Text>
          </View>
          <View style={styles.chips}>
            {['Driver', 'Electrician', 'Mechanic'].map((pref) => (
              <View key={pref} style={[styles.chip, { backgroundColor: colors.surfaceVariant }]}>
                <Text style={[styles.chipText, { color: colors.textPrimary }]}>{pref}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }, shadows.base]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={20} color={colors.primary} />
            <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>{t('profile.basicDetails', 'Basic Details')}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing[5], paddingVertical: spacing[4] },
  logo: { ...textStyles.h5, fontWeight: '700' },
  scroll: { flex: 1 },
  content: { padding: spacing[5], paddingBottom: spacing[8] },
  profileCard: { padding: spacing[5], borderRadius: borderRadius.xl, marginBottom: spacing[4] },
  profileHeader: { flexDirection: 'row', marginBottom: spacing[5] },
  avatarContainer: { marginRight: spacing[3] },
  avatar: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 32 },
  profileInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[1], marginBottom: spacing[1] },
  name: { ...textStyles.h4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[1], marginBottom: spacing[1] },
  location: { ...textStyles.caption },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[1] },
  rating: { ...textStyles.caption, fontWeight: '600' },
  editButton: { paddingHorizontal: spacing[3], paddingVertical: spacing[2], borderRadius: borderRadius.md, flexDirection: 'row', alignItems: 'center', gap: spacing[1], alignSelf: 'flex-start' },
  editText: { ...textStyles.caption, color: 'white', fontWeight: '700' },
  progressSection: { padding: spacing[4], borderRadius: borderRadius.md },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[2] },
  progressLabel: { ...textStyles.caption },
  progressPercent: { ...textStyles.body1, fontWeight: '700' },
  progressBar: { height: 6, borderRadius: 3, overflow: 'hidden', marginBottom: spacing[2] },
  progress: { height: '100%' },
  progressHint: { ...textStyles.caption },
  section: { padding: spacing[5], borderRadius: borderRadius.xl, marginBottom: spacing[4] },
  sectionIcon: { width: 56, height: 56, borderRadius: borderRadius.lg, alignItems: 'center', justifyContent: 'center', marginBottom: spacing[3] },
  sectionContent: {},
  sectionTitle: { ...textStyles.body2, marginBottom: spacing[1] },
  sectionValue: { ...textStyles.h2, fontSize: 28, fontWeight: '700', marginBottom: spacing[1] },
  sectionSubtitle: { ...textStyles.caption },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginBottom: spacing[3] },
  sectionHeading: { ...textStyles.h5 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] },
  chip: { paddingVertical: spacing[2], paddingHorizontal: spacing[3], borderRadius: borderRadius.md },
  chipText: { ...textStyles.body2, fontWeight: '500' },
});

export default ProfileHomeScreen;
