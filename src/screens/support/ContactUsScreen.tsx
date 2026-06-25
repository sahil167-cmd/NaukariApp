/**
 * WorkerConnect — Contact Us Screen
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { contactService } from '../../services/api/contactService';
import { spacing, layout, borderRadius } from '../../theme/spacing';
import { fontSize } from '../../theme/typography';

const ContactUsScreen: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { theme } = useTheme();

  const contacts = [
    {
      icon: 'call-outline',
      title: 'Call Us',
      detail: '+91 89764 78247',
      subtitle: 'Mon–Sat: 9 AM – 6 PM',
      action: async () => {
        await contactService.logContact('CALL');
        Linking.openURL('tel:8976478247');
      },
      color: '#4CAF50',
    },
    {
      icon: 'logo-whatsapp',
      title: 'WhatsApp',
      detail: '+91 89764 78247',
      subtitle: 'Available 24/7',
      action: async () => {
        await contactService.logContact('WHATSAPP');
        Linking.openURL('https://wa.me/918976478247');
      },
      color: '#25D366',
    },
    {
      icon: 'mail-outline',
      title: 'Email',
      detail: 'support@naukaribazaar.in',
      subtitle: 'Reply within 24 hours',
      action: () => Linking.openURL('mailto:support@naukaribazaar.in'),
      color: '#2196F3',
    },
    {
      icon: 'globe-outline',
      title: 'Website',
      detail: 'www.naukaribazaar.in',
      subtitle: 'Resources & blog',
      action: () => Linking.openURL('https://www.naukaribazaar.in'),
      color: '#9C27B0',
    },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, { borderBottomColor: theme.colors.divider }]}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        )}
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>Contact Us</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.heroCard, { backgroundColor: theme.colors.primaryLight }]}>
          <Ionicons name="headset" size={40} color={theme.colors.primary} />
          <Text style={[styles.heroTitle, { color: theme.colors.primary }]}>We're here to help</Text>
          <Text style={[styles.heroSub, { color: theme.colors.textSecondary }]}>
            Choose any of the options below to reach our support team.
          </Text>
        </View>

        {contacts.map((c, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.card, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }]}
            onPress={c.action}
            accessibilityRole="button"
            accessibilityLabel={c.title}
          >
            <View style={[styles.iconWrapper, { backgroundColor: c.color + '20' }]}>
              <Ionicons name={c.icon as any} size={24} color={c.color} />
            </View>
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>{c.title}</Text>
              <Text style={[styles.cardDetail, { color: theme.colors.primary }]}>{c.detail}</Text>
              <Text style={[styles.cardSub, { color: theme.colors.textMuted }]}>{c.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
          </TouchableOpacity>
        ))}

        <View style={[styles.officeCard, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text style={[styles.officeTitle, { color: theme.colors.textPrimary }]}>Registered Office</Text>
          <Text style={[styles.officeAddress, { color: theme.colors.textSecondary }]}>
            Naukari Bazaar Pvt. Ltd.{'\n'}
            123, Work Centre, Andheri East{'\n'}
            Mumbai - 400069, Maharashtra, India
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    gap: spacing[3],
  },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: fontSize.xl, fontWeight: '700' },
  scroll: { padding: layout.screenPaddingHorizontal, paddingBottom: spacing[8] },
  heroCard: {
    alignItems: 'center',
    padding: spacing[6],
    borderRadius: borderRadius.xl,
    marginBottom: spacing[6],
    gap: spacing[2],
  },
  heroTitle: { fontSize: fontSize.xl, fontWeight: '700' },
  heroSub: { fontSize: fontSize.sm, textAlign: 'center', lineHeight: fontSize.sm * 1.6 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing[4],
    marginBottom: spacing[3],
    gap: spacing[4],
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: { flex: 1 },
  cardTitle: { fontSize: fontSize.base, fontWeight: '700' },
  cardDetail: { fontSize: fontSize.sm, fontWeight: '600', marginTop: 2 },
  cardSub: { fontSize: fontSize.xs, marginTop: 2 },
  officeCard: {
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    marginTop: spacing[3],
    gap: spacing[3],
  },
  officeTitle: { fontSize: fontSize.base, fontWeight: '700' },
  officeAddress: { fontSize: fontSize.sm, lineHeight: fontSize.sm * 1.8 },
});

export default ContactUsScreen;
