/**
 * WorkerConnect — Settings Home Screen
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useSettingsStore } from '../../store/settingsStore';
import { useAuthStore } from '../../store/authStore';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { textStyles } from '../../theme/typography';

const SettingsHomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { notificationsEnabled, toggleNotifications, themeMode, setThemeMode } = useSettingsStore();
  const { logout } = useAuthStore();

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
        <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>{t('settings.title', 'Settings')}</Text>
        <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
          {t('settings.accountSubtitle', 'Manage your account and app preferences')}
        </Text>

        <View style={[styles.profileSection, { backgroundColor: colors.surface }, shadows.base]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Ionicons name="person" size={32} color="white" />
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.textPrimary }]}>Ramesh Kumar</Text>
            <Text style={[styles.userStatus, { color: colors.textSecondary }]}>
              Verified Worker • <Text style={{ fontWeight: '600' }}>English / Hindi</Text>
            </Text>
          </View>
          <TouchableOpacity>
            <Text style={[styles.editLink, { color: colors.primary }]}>{t('common.edit', 'Edit')}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t('settings.preferences', 'PREFERENCES')}</Text>
        
        <View style={[styles.menuCard, { backgroundColor: colors.surface }, shadows.sm]}>
          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.divider }]}>
            <View style={styles.menuLeft}>
              <Ionicons name="globe-outline" size={20} color={colors.textSecondary} />
              <View style={styles.menuText}>
                <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>{t('settings.language', 'Language')}</Text>
                <Text style={[styles.menuSubtitle, { color: colors.textSecondary }]}>English / Hindi</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={[styles.menuItem, { borderBottomColor: colors.divider }]}>
            <View style={styles.menuLeft}>
              <Ionicons name="notifications-outline" size={20} color={colors.textSecondary} />
              <View style={styles.menuText}>
                <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>{t('settings.jobNotifications', 'Job Notifications')}</Text>
                <Text style={[styles.menuSubtitle, { color: colors.textSecondary }]}>{t('settings.enabledLoc', 'Enabled for your location')}</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>

          <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={styles.menuLeft}>
              <Ionicons name="moon-outline" size={20} color={colors.textSecondary} />
              <View style={styles.menuText}>
                <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>{t('settings.themeMode', 'Dark Mode')}</Text>
                <Text style={[styles.menuSubtitle, { color: colors.textSecondary }]}>{t('settings.adjustBrightness', 'Adjust app brightness')}</Text>
              </View>
            </View>
            <Switch
              value={themeMode === 'dark'}
              onValueChange={(val) => setThemeMode(val ? 'dark' : 'light')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t('settings.legal', 'INFORMATION')}</Text>
        
        <View style={[styles.menuCard, { backgroundColor: colors.surface }, shadows.sm]}>
          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.divider }]}>
            <View style={styles.menuLeft}>
              <Ionicons name="shield-outline" size={20} color={colors.textSecondary} />
              <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>{t('settings.privacy', 'Privacy Policy')}</Text>
            </View>
            <Ionicons name="open-outline" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.divider }]}>
            <View style={styles.menuLeft}>
              <Ionicons name="document-text-outline" size={20} color={colors.textSecondary} />
              <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>{t('settings.terms', 'Terms & Conditions')}</Text>
            </View>
            <Ionicons name="open-outline" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={styles.menuLeft}>
              <Ionicons name="help-circle-outline" size={20} color={colors.textSecondary} />
              <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>{t('settings.helpCenter', 'Help Center')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.errorBackground }]}
          onPress={logout}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>{t('settings.logout', 'Logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing[5], paddingVertical: spacing[4] },
  logo: { ...textStyles.h5, fontWeight: '700' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing[5], paddingBottom: spacing[8] },
  pageTitle: { ...textStyles.h2, marginTop: spacing[4], marginBottom: spacing[1] },
  pageSubtitle: { ...textStyles.body2, marginBottom: spacing[6] },
  profileSection: { flexDirection: 'row', alignItems: 'center', padding: spacing[4], borderRadius: borderRadius.lg, marginBottom: spacing[6] },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginRight: spacing[3] },
  userInfo: { flex: 1 },
  userName: { ...textStyles.h5, marginBottom: spacing[1] },
  userStatus: { ...textStyles.caption },
  editLink: { ...textStyles.body1, fontWeight: '600' },
  sectionTitle: { ...textStyles.caption, fontWeight: '700', letterSpacing: 1, marginBottom: spacing[3], marginTop: spacing[2] },
  menuCard: { borderRadius: borderRadius.lg, overflow: 'hidden', marginBottom: spacing[6] },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing[4], paddingHorizontal: spacing[4], borderBottomWidth: 1 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing[3], flex: 1 },
  menuText: { flex: 1 },
  menuTitle: { ...textStyles.body1, marginBottom: 2 },
  menuSubtitle: { ...textStyles.caption },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing[4], borderRadius: borderRadius.lg, gap: spacing[2], marginTop: spacing[4] },
  logoutText: { ...textStyles.button },
});

export default SettingsHomeScreen;
