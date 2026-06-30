import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { contactService } from '../../services/api/contactService';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { textStyles } from '../../theme/typography';

const SupportHomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const handleCall = async () => {
    await contactService.logContact('CALL');
    Linking.openURL('tel:+917506710665');
  };

  const handleWhatsApp = async () => {
    await contactService.logContact('WHATSAPP');
    Linking.openURL('https://wa.me/917506710665');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.logo, { color: colors.primary }]}>Naukari Bazaar</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>Support</Text>
        <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
          We're here to help you
        </Text>

        <View style={[styles.card, { backgroundColor: colors.surface }, shadows.base]}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="help-circle" size={24} color={colors.primary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>Frequently Asked Questions</Text>
              <Text style={[styles.menuSubtitle, { color: colors.textSecondary }]}>Find quick answers</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>


        <View style={[styles.contactCard, { backgroundColor: colors.surface }, shadows.base]}>
          <View style={[styles.iconCircle, { backgroundColor: colors.successBackground }]}>
            <Ionicons name="call" size={24} color={colors.success} />
          </View>
          <Text style={[styles.contactTitle, { color: colors.textPrimary }]}>Contact Us</Text>
          <Text style={[styles.contactSubtitle, { color: colors.textSecondary }]}>
            Get in touch with our support team
          </Text>
          
          <View style={styles.contactButtons}>
            <TouchableOpacity
              style={[styles.contactButton, { backgroundColor: colors.primary }]}
              onPress={handleCall}
            >
              <Ionicons name="call" size={18} color="white" />
              <Text style={styles.contactButtonText}>Call Us</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.contactButton, { backgroundColor: colors.info }]}
              onPress={() => Linking.openURL('mailto:info@3hdmedia.com')}
            >
              <Ionicons name="mail" size={18} color="white" />
              <Text style={styles.contactButtonText}>Email Us</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.contactButton, { backgroundColor: '#25D366' }]}
              onPress={handleWhatsApp}
            >
              <Ionicons name="logo-whatsapp" size={18} color="white" />
              <Text style={styles.contactButtonText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.hoursText, { color: colors.textMuted }]}>Mon-Sat: 9 AM - 6 PM</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing[5], paddingVertical: spacing[4] },
  logo: { ...textStyles.h4, fontWeight: '700' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing[5], paddingBottom: spacing[8] },
  pageTitle: { ...textStyles.h2, marginTop: spacing[4], marginBottom: spacing[1] },
  pageSubtitle: { ...textStyles.body2, marginBottom: spacing[6] },
  card: { padding: spacing[4], borderRadius: borderRadius.xl, marginBottom: spacing[4] },
  menuItem: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: spacing[3] },
  menuContent: { flex: 1 },
  menuTitle: { ...textStyles.h5, marginBottom: spacing[1] },
  menuSubtitle: { ...textStyles.caption },
  contactCard: { padding: spacing[6], borderRadius: borderRadius.xl, alignItems: 'center', marginTop: spacing[4] },
  contactTitle: { ...textStyles.h3, marginTop: spacing[3], marginBottom: spacing[2] },
  contactSubtitle: { ...textStyles.body2, textAlign: 'center', marginBottom: spacing[5] },
  contactButtons: { width: '100%', gap: spacing[3], marginBottom: spacing[4] },
  contactButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing[3], borderRadius: borderRadius.lg, gap: spacing[2] },
  contactButtonText: { ...textStyles.button, color: 'white', fontSize: 14 },
  hoursText: { ...textStyles.caption },
});

export default SupportHomeScreen;
