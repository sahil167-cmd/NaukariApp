import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
  StatusBar, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useSettingsStore } from '../../store/settingsStore';
import { spacing, layout, borderRadius } from '../../theme/spacing';
import { fontSize } from '../../theme/typography';

const BackHeader: React.FC<{ title: string; onBack?: () => void }> = ({ title, onBack }) => {
  const { theme } = useTheme();
  return (
    <View style={[headerStyles.header, { borderBottomColor: theme.colors.divider }]}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={headerStyles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      )}
      <Text style={[headerStyles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
    </View>
  );
};

const headerStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    gap: spacing[3],
  },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: fontSize.xl, fontWeight: '700' },
});

// ── Notifications Screen ─────────────────────────────────────────────────────

export const NotificationsScreen: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { notificationsEnabled, jobAlerts, smsAlerts, toggleNotifications, toggleJobAlerts, toggleSmsAlerts } = useSettingsStore();

  const settings = [
    { label: t('notifications.pushNotif', 'Push Notifications'), sub: t('notifications.pushNotifDesc', 'Receive job and app notifications'), value: notificationsEnabled, onToggle: toggleNotifications },
    { label: t('notifications.jobAlerts', 'Job Alerts'), sub: t('notifications.jobAlertsDesc', 'Get notified when matching jobs are posted'), value: jobAlerts, onToggle: toggleJobAlerts },
    { label: t('notifications.smsAlerts', 'SMS Alerts'), sub: t('notifications.smsAlertsDesc', 'Receive important alerts via SMS'), value: smsAlerts, onToggle: toggleSmsAlerts },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      <BackHeader title={t('notifications.title', 'Notifications')} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {settings.map((s, i) => (
          <View key={i} style={[styles.settingRow, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: theme.colors.textPrimary }]}>{s.label}</Text>
              <Text style={[styles.settingSub, { color: theme.colors.textMuted }]}>{s.sub}</Text>
            </View>
            <Switch
              value={s.value}
              onValueChange={s.onToggle}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="#FFF"
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// ── Privacy Policy Screen ─────────────────────────────────────────────────────

export const PrivacyPolicyScreen: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const sections = [
    { title: t('privacy.infoCollect', 'Information We Collect'), body: t('privacy.infoCollectBody', 'We collect information you provide directly to us when you create an account, complete your profile, or contact us for support. This includes your name, phone number, email, address, Aadhaar and PAN numbers, and employment details.') },
    { title: t('privacy.howUse', 'How We Use Your Information'), body: t('privacy.howUseBody', 'We use the information we collect to match you with suitable job opportunities, improve our services, send you notifications and job alerts, and comply with legal obligations.') },
    { title: t('privacy.dataSecurity', 'Data Security'), body: t('privacy.dataSecurityBody', 'We use industry-standard encryption and security practices to protect your personal information. Your Aadhaar and PAN data are encrypted and stored securely.') },
    { title: t('privacy.dataSharing', 'Data Sharing'), body: t('privacy.dataSharingBody', 'We do not sell your personal information to third parties. We share your profile only with verified employers on our platform, and only when you apply for a job.') },
    { title: t('privacy.yourRights', 'Your Rights'), body: t('privacy.yourRightsBody', 'You can request to view, update, or delete your personal information at any time by contacting our support team.') },
    { title: t('privacy.contactUsTitle', 'Contact Us'), body: t('privacy.contactUsBody', 'For privacy-related concerns, write to us at privacy@naukaribazaar.in') },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      <BackHeader title={t('settings.privacy', 'Privacy Policy')} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.updated, { color: theme.colors.textMuted }]}>{t('privacy.lastUpdated', 'Last updated: June 2024')}</Text>
        {sections.map((s, i) => (
          <View key={i} style={styles.policySection}>
            <Text style={[styles.policyTitle, { color: theme.colors.textPrimary }]}>{s.title}</Text>
            <Text style={[styles.policyBody, { color: theme.colors.textSecondary }]}>{s.body}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// ── Terms Screen ──────────────────────────────────────────────────────────────

export const TermsScreen: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const terms = [
    { title: t('terms.acceptance', 'Acceptance of Terms'), body: t('terms.acceptanceBody', 'By using Naukari Bazaar, you agree to these Terms and Conditions. Please read them carefully before using our services.') },
    { title: t('terms.responsibilities', 'User Responsibilities'), body: t('terms.responsibilitiesBody', 'You are responsible for ensuring that all information you provide is accurate and up-to-date. Providing false information may result in account suspension.') },
    { title: t('terms.prohibited', 'Prohibited Activities'), body: t('terms.prohibitedBody', 'You may not use Naukari Bazaar to post fraudulent information, harass other users, or engage in any illegal activities.') },
    { title: t('terms.availability', 'Service Availability'), body: t('terms.availabilityBody', 'We aim to provide uninterrupted service but may occasionally need to perform maintenance. We are not liable for temporary service unavailability.') },
    { title: t('terms.liability', 'Limitation of Liability'), body: t('terms.liabilityBody', 'Naukari Bazaar is not responsible for job outcomes, employer decisions, or any losses resulting from using our platform.') },
    { title: t('terms.law', 'Governing Law'), body: t('terms.lawBody', 'These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of Mumbai courts.') },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      <BackHeader title={t('settings.terms', 'Terms & Conditions')} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.updated, { color: theme.colors.textMuted }]}>{t('terms.effective', 'Effective: June 2024')}</Text>
        {terms.map((tRow, i) => (
          <View key={i} style={styles.policySection}>
            <Text style={[styles.policyTitle, { color: theme.colors.textPrimary }]}>{tRow.title}</Text>
            <Text style={[styles.policyBody, { color: theme.colors.textSecondary }]}>{tRow.body}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// ── About Company Screen ──────────────────────────────────────────────────────

export const AboutCompanyScreen: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const stats = [
    { label: t('about.workers', 'Workers Registered'), value: '2 Lakh+' },
    { label: t('about.employers', 'Verified Employers'), value: '5,000+' },
    { label: t('about.cities', 'Cities Covered'), value: '200+' },
    { label: t('about.founded', 'Founded'), value: '2020' },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      <BackHeader title={t('settings.about', 'About Company')} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Logo area */}
        <View style={[styles.aboutHero, { backgroundColor: theme.colors.primaryLight }]}>
          <Ionicons name="briefcase" size={48} color={theme.colors.primary} />
          <Text style={[styles.aboutName, { color: theme.colors.primary }]}>{t('app.name', 'Naukari Bazaar')}</Text>
          <Text style={[styles.aboutTagline, { color: theme.colors.textSecondary }]}>
            {t('app.tagline', 'Connecting Workers with Opportunities')}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {stats.map((s, i) => (
            <View key={i} style={[styles.statBox, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }]}>
              <Text style={[styles.statVal, { color: theme.colors.primary }]}>{s.value}</Text>
              <Text style={[styles.statLab, { color: theme.colors.textMuted }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Mission/Vision */}
        {[
          { title: t('about.mission', 'Our Mission'), icon: 'rocket-outline', text: t('about.missionText', 'To connect underprivileged workers across India with dignified employment opportunities.') },
          { title: t('about.vision', 'Our Vision'), icon: 'eye-outline', text: t('about.visionText', 'A future where every willing worker has access to fair and meaningful work.') },
          { title: t('about.values', 'Our Values'), icon: 'heart-outline', text: t('about.valuesText', 'Integrity, Inclusion, Empowerment. We believe in treating every worker with respect and enabling them to achieve economic independence.') },
        ].map((item, i) => (
          <View key={i} style={[styles.infoCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }]}>
            <View style={[styles.infoIcon, { backgroundColor: theme.colors.primaryLight }]}>
              <Ionicons name={item.icon as any} size={22} color={theme.colors.primary} />
            </View>
            <Text style={[styles.infoTitle, { color: theme.colors.textPrimary }]}>{item.title}</Text>
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>{item.text}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: layout.screenPaddingHorizontal, paddingBottom: spacing[8] },
  updated: { fontSize: fontSize.xs, marginBottom: spacing[4] },
  policySection: { marginBottom: spacing[5] },
  policyTitle: { fontSize: fontSize.base, fontWeight: '700', marginBottom: spacing[2] },
  policyBody: { fontSize: fontSize.sm, lineHeight: fontSize.sm * 1.8 },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing[4],
    marginBottom: spacing[3],
  },
  settingLabel: { fontSize: fontSize.base, fontWeight: '600' },
  settingSub: { fontSize: fontSize.xs, marginTop: 2 },
  aboutHero: {
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    marginBottom: spacing[5],
    gap: spacing[2],
  },
  aboutName: { fontSize: fontSize['2xl'], fontWeight: '800' },
  aboutTagline: { fontSize: fontSize.base, textAlign: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3], marginBottom: spacing[5] },
  statBox: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    alignItems: 'center',
    width: '47%',
  },
  statVal: { fontSize: fontSize.xl, fontWeight: '800', marginBottom: spacing[1] },
  statLab: { fontSize: fontSize.xs, textAlign: 'center' },
  infoCard: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    marginBottom: spacing[3],
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
  infoTitle: { fontSize: fontSize.base, fontWeight: '700', marginBottom: spacing[2] },
  infoText: { fontSize: fontSize.sm, lineHeight: fontSize.sm * 1.8 },
});
