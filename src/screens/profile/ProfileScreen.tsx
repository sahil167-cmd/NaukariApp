import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  StatusBar, TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuthStore } from '../../store/authStore';
import ProfileCard from '../../components/cards/ProfileCard';
import { Loader } from '../../components/common/StateScreens';
import { userService } from '../../services/api/userService';
import { spacing, layout, borderRadius } from '../../theme/spacing';
import { fontSize } from '../../theme/typography';

const ProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => userService.getProfile(user?.id ?? ''),
    enabled: !!user?.id,
  });

  const profile = data?.data;

  const sections = [
    {
      icon: 'person-outline',
      title: t('profile.personal', 'Personal Info'),
      subtitle: profile?.personal?.firstName
        ? `${profile.personal.firstName} ${profile.personal.lastName}`
        : t('common.notCompleted', 'Not completed'),
      completed: !!profile?.personal?.firstName,
    },
    {
      icon: 'location-outline',
      title: t('profile.address', 'Address'),
      subtitle: profile?.address?.city
        ? `${profile.address.city}, ${profile.address.state}`
        : t('common.notCompleted', 'Not completed'),
      completed: !!profile?.address?.city,
    },
    {
      icon: 'briefcase-outline',
      title: t('profile.job', 'Job Preferences'),
      subtitle: profile?.jobPreferences?.categories?.length
        ? profile.jobPreferences.categories.slice(0, 2).join(', ')
        : t('common.notCompleted', 'Not completed'),
      completed: !!profile?.jobPreferences?.categories?.length,
    },
    {
      icon: 'school-outline',
      title: t('profile.education', 'Education'),
      subtitle: profile?.education?.highestLevel ?? t('common.notCompleted', 'Not completed'),
      completed: !!profile?.education?.highestLevel,
    },
    {
      icon: 'construct-outline',
      title: t('profile.experience', 'Experience'),
      subtitle: profile?.experience?.length
        ? t('profile.experienceCount', { count: profile.experience.length, defaultValue: `${profile.experience.length} entry(s)` })
        : t('common.notAdded', 'Fresher / Not added'),
      completed: true,
    },
    {
      icon: 'document-text-outline',
      title: t('profile.documents', 'Documents'),
      subtitle: profile?.documents?.aadhaarNumber ? t('common.uploaded', 'Uploaded') : t('common.notUploaded', 'Not uploaded'),
      completed: !!profile?.documents?.aadhaarNumber,
    },
  ];

  if (isLoading) return <Loader message={t('profile.loading', 'Loading profile...')} />;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.headerTitle}>{t('profile.title')}</Text>
          <TouchableOpacity style={[styles.editBtn, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Ionicons name="create-outline" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        {user && (
          <View style={styles.cardWrapper}>
            <ProfileCard
              user={user}
              completionPercent={profile?.completionPercentage ?? 65}
            />
          </View>
        )}

        {/* Sections */}
        <View style={styles.sections}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            {t('profile.profileSections', 'Profile Sections')}
          </Text>
          {sections.map((sec, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.sectionCard,
                { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.cardBorder },
              ]}
              accessibilityRole="button"
              accessibilityLabel={sec.title}
            >
              <View style={[styles.sectionIcon, { backgroundColor: theme.colors.primaryLight }]}>
                <Ionicons name={sec.icon as any} size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.sectionText}>
                <Text style={[styles.sectionName, { color: theme.colors.textPrimary }]}>
                  {sec.title}
                </Text>
                <Text
                  style={[
                    styles.sectionSub,
                    { color: sec.completed ? theme.colors.textMuted : theme.colors.error },
                  ]}
                  numberOfLines={1}
                >
                  {sec.subtitle}
                </Text>
              </View>
              <View style={styles.sectionRight}>
                {sec.completed ? (
                  <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                ) : (
                  <Ionicons name="alert-circle-outline" size={20} color={theme.colors.error} />
                )}
                <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: spacing[8] },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: spacing[5],
    paddingBottom: spacing[10],
  },
  headerTitle: { color: '#FFF', fontSize: fontSize.xl, fontWeight: '800' },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrapper: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    marginTop: -spacing[6],
  },
  sections: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    marginTop: spacing[4],
  },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '700', marginBottom: spacing[4] },
  sectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing[4],
    marginBottom: spacing[3],
    gap: spacing[3],
  },
  sectionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionText: { flex: 1 },
  sectionName: { fontSize: fontSize.base, fontWeight: '600' },
  sectionSub: { fontSize: fontSize.xs, marginTop: 2 },
  sectionRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});

export default ProfileScreen;
