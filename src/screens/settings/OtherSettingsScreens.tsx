import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Switch} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    {
      title: t('privacy.scope', '1. Scope & Purpose'),
      body: t('privacy.scopeBody', 'This Privacy Policy governs the data collection, storage, and processing practices for the Naukari Bazaar mobile application operated by 3HD Media. By using this application, you consent to the processing of your personal information as described herein.'),
    },
    {
      title: t('privacy.infoCollect', '2. Information We Collect'),
      body: t('privacy.infoCollectBody', 'We collect information necessary to facilitate employment connections. This includes contact details (name, phone number, email address, physical address), professional/employment details (education, skills, work experience, salary expectations, and job preferences), and optional verification details like government-issued identifiers if voluntarily uploaded to enhance profile credibility.'),
    },
    {
      title: t('privacy.howUse', '3. How We Use Your Information'),
      body: t('privacy.howUseBody', 'Your information is used to match you with matching job vacancies, verify profile authenticity, communicate transactional updates and alerts (via SMS, push notifications, and email), and provide customer support.'),
    },
    {
      title: t('privacy.dataSharing', '4. Data Sharing & Disclosure'),
      body: t('privacy.dataSharingBody', 'We do not sell, trade, or rent candidate personal data to third parties. We share candidate profiles exclusively with verified and registered employers on the platform, and only when you explicitly apply to their job listings or consent to matching.'),
    },
    {
      title: t('privacy.dataSecurity', '5. Data Security & Storage'),
      body: t('privacy.dataSecurityBody', 'We implement industry-standard technical and organizational security measures to protect your data. Any sensitive identification documents are encrypted in transit and stored on secure cloud databases.'),
    },
    {
      title: t('privacy.userRights', '6. User Control & Data Deletion'),
      body: t('privacy.userRightsBody', 'You can modify or update your personal details directly within your profile settings. If you wish to permanently delete your account and associated data, please contact our support team.'),
    },
    {
      title: t('privacy.contactUsTitle', '7. Contact & Grievances'),
      body: t('privacy.contactUsBody', 'For queries, privacy concerns, or data requests, please contact our Grievance Officer at info@3hdmedia.com.'),
    },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      <BackHeader title={t('settings.privacy', 'Privacy Policy')} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.updated, { color: theme.colors.textMuted }]}>{t('privacy.lastUpdated', 'Last updated: June 2026')}</Text>
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
    {
      title: t('terms.acceptance', '1. Acceptance of Terms'),
      body: t('terms.acceptanceBody', 'By downloading, installing, or accessing the Naukari Bazaar application, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, you must immediately cease using the application.'),
    },
    {
      title: t('terms.registration', '2. User Accounts & Eligibility'),
      body: t('terms.registrationBody', 'You must be at least 18 years of age and legally competent to enter into contracts under applicable Indian law to register. You agree to provide accurate, truthful, and updated details in your profile. Misrepresentation or fraudulent profiles will result in immediate account termination.'),
    },
    {
      title: t('terms.platformRole', '3. Platform Scope & Disclaimer'),
      body: t('terms.platformRoleBody', 'Naukari Bazaar is an intermediary platform connecting job seekers with prospective employers. 3HD Media does not employ job seekers, nor does it guarantee employment, salary levels, or job conditions. We do not endorse or guarantee the validity of job postings or the conduct of employers. Users are advised to exercise caution and perform independent due diligence before accepting employment offers.'),
    },
    {
      title: t('terms.prohibited', '4. Prohibited Uses'),
      body: t('terms.prohibitedBody', 'Users shall not upload defamatory, offensive, or unlawful content, nor use the platform for spoofing, scraping, distribution of spam, or malicious software. Any form of harassment towards other users or employers is strictly prohibited.'),
    },
    {
      title: t('terms.liability', '5. Limitation of Liability'),
      body: t('terms.liabilityBody', 'To the fullest extent permitted by law, 3HD Media, Naukari Bazaar, and its officers shall not be liable for any direct, indirect, incidental, or consequential damages, or any loss of employment, wages, data, or business resulting from your use of the application.'),
    },
    {
      title: t('terms.intellectualProperty', '6. Intellectual Property'),
      body: t('terms.intellectualPropertyBody', 'All trademarks, logos, brand names, and source code associated with Naukari Bazaar are the intellectual property of 3HD Media. Unauthorized replication or usage is strictly prohibited.'),
    },
    {
      title: t('terms.law', '7. Governing Law & Jurisdiction'),
      body: t('terms.lawBody', 'These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the courts located in Mumbai, Maharashtra, India.'),
    },
    {
      title: t('terms.contactUsTitle', '8. Contact Us'),
      body: t('terms.contactUsBody', 'If you have any questions or feedback regarding these terms, please contact us at info@3hdmedia.com.'),
    },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      <BackHeader title={t('settings.terms', 'Terms & Conditions')} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.updated, { color: theme.colors.textMuted }]}>{t('terms.effective', 'Effective: June 2026')}</Text>
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
