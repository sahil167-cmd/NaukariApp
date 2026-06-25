/**
 * WorkerConnect — Support Screen
 */

import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { contactService } from '../../services/api/contactService';
import { spacing, layout, borderRadius } from '../../theme/spacing';
import { fontSize } from '../../theme/typography';

interface SupportScreenProps {
  onFAQ: () => void;
  onHelp: () => void;
  onContactUs: () => void;
  onAboutCompany: () => void;
}

const SupportScreen: React.FC<SupportScreenProps> = ({
  onFAQ, onHelp, onContactUs, onAboutCompany,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const menuItems = [
    { icon: 'help-circle-outline', title: t('support.faq'), subtitle: t('support.faqSubtitle', 'Frequently asked questions'), onPress: onFAQ, color: '#4CAF50' },
    { icon: 'headset-outline', title: t('support.help'), subtitle: t('support.helpSubtitle', 'Step-by-step guidance'), onPress: onHelp, color: '#2196F3' },
    { icon: 'call-outline', title: t('support.contact'), subtitle: t('support.contactSubtitle', 'Reach our support team'), onPress: onContactUs, color: '#FF9800' },
    { icon: 'business-outline', title: t('support.about', 'About Company'), subtitle: t('support.aboutSubtitle', 'Learn more about us'), onPress: onAboutCompany, color: '#9C27B0' },
  ];

  const quickActions = [
    {
      icon: 'call',
      label: t('contact.phone', 'Call Us'),
      value: '+91 89764 78247',
      onPress: async () => {
        await contactService.logContact('CALL');
        Linking.openURL('tel:+918976478247');
      },
    },
    {
      icon: 'logo-whatsapp',
      label: t('contact.whatsapp', 'WhatsApp'),
      value: t('contact.whatsappChat', 'Chat on WhatsApp'),
      onPress: async () => {
        await contactService.logContact('WHATSAPP');
        Linking.openURL('https://wa.me/918976478247');
      },
    },
    {
      icon: 'mail-outline',
      label: t('contact.email', 'Email'),
      value: 'support@naukaribazaar.in',
      onPress: () => Linking.openURL('mailto:support@naukaribazaar.in'),
    },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.headerTitle}>{t('support.title')}</Text>
          <Text style={styles.headerSub}>{t('support.subtitle', "We're here to help you")}</Text>
        </View>

        {/* Quick Contact */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>{t('support.quickContact', 'Quick Contact')}</Text>
          {quickActions.map((action, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.quickCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }]}
              onPress={action.onPress}
            >
              <View style={[styles.quickIcon, { backgroundColor: theme.colors.primaryLight }]}>
                <Ionicons name={action.icon as any} size={22} color={theme.colors.primary} />
              </View>
              <View>
                <Text style={[styles.quickLabel, { color: theme.colors.textMuted }]}>{action.label}</Text>
                <Text style={[styles.quickValue, { color: theme.colors.textPrimary }]}>{action.value}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} style={styles.chevron} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Menu */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>{t('support.helpInfo', 'Help & Information')}</Text>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.menuCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }]}
              onPress={item.onPress}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon as any} size={22} color={item.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.menuTitle, { color: theme.colors.textPrimary }]}>{item.title}</Text>
                <Text style={[styles.menuSub, { color: theme.colors.textMuted }]}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Hours */}
        <View style={[styles.hoursCard, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
          <Text style={[styles.hoursText, { color: theme.colors.textSecondary }]}>
            {t('support.hours', 'Support Hours: Monday–Saturday, 9 AM – 6 PM IST')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: spacing[8] },
  header: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing[5],
    paddingBottom: spacing[8],
  },
  headerTitle: { color: '#FFF', fontSize: fontSize.xl, fontWeight: '800', marginBottom: spacing[1] },
  headerSub: { color: 'rgba(255,255,255,0.85)', fontSize: fontSize.sm },
  section: { paddingHorizontal: layout.screenPaddingHorizontal, marginTop: spacing[6] },
  sectionTitle: { fontSize: fontSize.base, fontWeight: '700', marginBottom: spacing[4] },
  quickCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing[4],
    marginBottom: spacing[3],
    gap: spacing[3],
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: { fontSize: fontSize.xs },
  quickValue: { fontSize: fontSize.sm, fontWeight: '600' },
  chevron: { marginLeft: 'auto' },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing[4],
    marginBottom: spacing[3],
    gap: spacing[3],
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: { fontSize: fontSize.base, fontWeight: '600' },
  menuSub: { fontSize: fontSize.xs, marginTop: 2 },
  hoursCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    margin: layout.screenPaddingHorizontal,
    marginTop: spacing[3],
    padding: spacing[4],
    borderRadius: borderRadius.lg,
  },
  hoursText: { flex: 1, fontSize: fontSize.sm, lineHeight: fontSize.sm * 1.5 },
});

export default SupportScreen;
