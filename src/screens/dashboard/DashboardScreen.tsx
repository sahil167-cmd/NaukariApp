/**
 * WorkerConnect — Dashboard Screen
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  Linking,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuthStore } from '../../store/authStore';
import { contactService } from '../../services/api/contactService';
import apiClient from '../../services/api/client';
import JobCard from '../../components/cards/JobCard';
import { JobCardSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorScreen } from '../../components/common/StateScreens';
import { jobService } from '../../services/api/jobService';
import { spacing, layout, borderRadius } from '../../theme/spacing';
import { fontSize } from '../../theme/typography';
import type { Job } from '../../types';

interface DashboardScreenProps {
  onJobPress?: (job: Job) => void;
}

const SUPPORT_PHONE = process.env.SUPPORT_PHONE || '';
const SUPPORT_WHATSAPP = process.env.SUPPORT_WHATSAPP || '';

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onJobPress }) => {
  const { theme } = useTheme();
  const { user } = useAuthStore();
  const { t } = useTranslation();

  // Retrieve dashboard analytics & live jobs from backend DB via react-query
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard');
      return response.data;
    },
  });

  // Pull dashboard jobs
  const jobs: Job[] = data?.jobs ?? [];
  const summary = data?.summary;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.goodMorning', 'Good Morning');
    if (hour < 17) return t('dashboard.goodAfternoon', 'Good Afternoon');
    return t('dashboard.goodEvening', 'Good Evening');
  };

  const handleCall = async () => {
    if (!SUPPORT_PHONE) return;
    
    // Log CALL event to database
    await contactService.logContact('CALL');

    const url = `tel:${SUPPORT_PHONE}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (e) {
      console.log('Error opening dialer', e);
    }
  };

  const handleWhatsApp = async () => {
    if (!SUPPORT_WHATSAPP) return;

    // Log WHATSAPP event to database
    await contactService.logContact('WHATSAPP');

    const name = user?.name || '';
    const phone = user?.phone || '';
    const textMessage = `Hello, I am registered on Naukari Bazaar.\nMy Name: ${name}\nMobile Number: ${phone}\nI need recruiter support.`;
    const whatsappUrl = `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(textMessage)}`;
    try {
      const supported = await Linking.canOpenURL(whatsappUrl);
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        await Linking.openURL(`https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(textMessage)}`);
      }
    } catch (e) {
      console.log('Error opening WhatsApp', e);
    }
  };

  const stats = [
    { label: t('dashboard.jobsApplied', 'Jobs Applied'), value: '3', icon: 'briefcase-outline' },
    { label: t('dashboard.profileViews', 'Profile Views'), value: '12', icon: 'eye-outline' },
    { label: t('dashboard.savedJobs', 'Saved Jobs'), value: '5', icon: 'heart-outline' },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>
              {user?.name ?? t('dashboard.greetingDefault', 'Worker')} 👋
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.notifBtn, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
            accessibilityLabel="Notifications"
          >
            <Ionicons name="notifications-outline" size={22} color="#FFF" />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Profile Completion Banner */}
        <View style={[styles.completionBanner, { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary }]}>
          <View style={styles.completionLeft}>
            <Ionicons name="person-circle-outline" size={32} color={theme.colors.primary} />
            <View>
              <Text style={[styles.completionTitle, { color: theme.colors.textPrimary }]}>
                {t('dashboard.completProfile', 'Complete your profile')}
              </Text>
              <Text style={[styles.completionSub, { color: theme.colors.textMuted }]}>
                {t('dashboard.profilePercent', { percent: 65 })} — {t('dashboard.boostVisibility', 'Boost visibility')}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.completeBtn, { backgroundColor: theme.colors.primaryLight }]}>
            <Text style={[styles.completeBtnText, { color: theme.colors.primary }]}>
              {t('common.complete', 'Complete')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {stats.map((stat, i) => (
            <View
              key={i}
              style={[styles.statCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }]}
            >
              <Ionicons name={stat.icon as any} size={20} color={theme.colors.primary} />
              <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Contact Recruiter / Support Section */}
        <View style={[styles.supportCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary }]}>
          <View style={styles.supportHeader}>
            <Ionicons name="headset-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.supportTitle, { color: theme.colors.textPrimary }]}>
              {t('dashboard.supportTitle')}
            </Text>
          </View>
          <Text style={[styles.supportDesc, { color: theme.colors.textSecondary }]}>
            {t('dashboard.supportDesc')}
          </Text>
          <View style={styles.supportButtons}>
            <TouchableOpacity
              style={[styles.supportButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleCall}
            >
              <Ionicons name="call" size={14} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.supportButtonText}>{t('dashboard.callBtn')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.supportButton, { backgroundColor: '#25D366' }]}
              onPress={handleWhatsApp}
            >
              <Ionicons name="logo-whatsapp" size={14} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.supportButtonText}>{t('dashboard.whatsappBtn')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Jobs Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              {t('dashboard.jobsForYou')}
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>{t('dashboard.seeAll')}</Text>
            </TouchableOpacity>
          </View>

          {isLoading && (
            <>
              <JobCardSkeleton />
              <JobCardSkeleton />
              <JobCardSkeleton />
            </>
          )}

          {isError && (
            <ErrorScreen
              title={t('dashboard.failedLoadJobs', 'Failed to load jobs')}
              message={t('errors.networkError')}
              onRetry={refetch}
            />
          )}

          {!isLoading && !isError && jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onPress={(j) => onJobPress?.(j)}
              onApply={(j) => {}}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing[5],
    paddingBottom: spacing[8],
  },
  greeting: { color: 'rgba(255,255,255,0.85)', fontSize: fontSize.sm },
  userName: { color: '#FFF', fontSize: fontSize.xl, fontWeight: '800' },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4444',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  completionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: layout.screenPaddingHorizontal,
    marginTop: -spacing[4],
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    padding: spacing[4],
    gap: spacing[3],
  },
  completionLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing[3], flex: 1 },
  completionTitle: { fontSize: fontSize.sm, fontWeight: '700' },
  completionSub: { fontSize: fontSize.xs, marginTop: 2 },
  completeBtn: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
  },
  completeBtnText: { fontSize: fontSize.xs, fontWeight: '700' },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: layout.screenPaddingHorizontal,
    gap: spacing[3],
    marginBottom: spacing[5],
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing[3],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    gap: spacing[1],
  },
  statValue: { fontSize: fontSize.xl, fontWeight: '800' },
  statLabel: { fontSize: fontSize.xs, textAlign: 'center' },
  supportCard: {
    marginHorizontal: layout.screenPaddingHorizontal,
    marginBottom: spacing[5],
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  supportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  supportTitle: {
    fontSize: fontSize.base,
    fontWeight: '700',
  },
  supportDesc: {
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * 1.5,
    marginBottom: spacing[4],
  },
  supportButtons: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  supportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: borderRadius.md,
  },
  supportButtonText: {
    color: '#FFF',
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  section: { paddingHorizontal: layout.screenPaddingHorizontal, paddingBottom: spacing[8] },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '700' },
  seeAll: { fontSize: fontSize.sm, fontWeight: '600' },
});

export default DashboardScreen;
