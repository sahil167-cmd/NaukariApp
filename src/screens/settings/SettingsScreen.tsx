/**
 * WorkerConnect — Settings Screen
 */

import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
  StatusBar, Switch, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { SUPPORTED_LANGUAGES, APP_VERSION } from '../../constants';
import { spacing, layout, borderRadius } from '../../theme/spacing';
import { fontSize } from '../../theme/typography';
import { authService } from '../../services/api/authService';

interface SettingsScreenProps {
  onNotifications: () => void;
  onPrivacyPolicy: () => void;
  onTerms: () => void;
  onAboutCompany: () => void;
  onLanguageSelect: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onNotifications, onPrivacyPolicy, onTerms, onAboutCompany, onLanguageSelect,
}) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { logout, user } = useAuthStore();
  const { language, notificationsEnabled, toggleNotifications } = useSettingsStore();
  const { t } = useTranslation();

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language);

  const handleLogout = () => {
    Alert.alert(
      t('settings.logout', 'Logout'),
      t('settings.logoutConfirm', 'Are you sure you want to logout?'),
      [
        { text: t('common.cancel', 'Cancel'), style: 'cancel' },
        {
          text: t('settings.logout', 'Logout'),
          style: 'destructive',
          onPress: async () => {
            await authService.logout();
            logout();
          },
        },
      ]
    );
  };

  const SettingRow: React.FC<{
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    color?: string;
    isDanger?: boolean;
  }> = ({ icon, title, subtitle, onPress, rightElement, color, isDanger }) => (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: theme.colors.divider }]}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={[styles.rowIcon, { backgroundColor: (color ?? theme.colors.primary) + '20' }]}>
        <Ionicons
          name={icon as any}
          size={20}
          color={isDanger ? theme.colors.error : (color ?? theme.colors.primary)}
        />
      </View>
      <View style={styles.rowText}>
        <Text
          style={[
            styles.rowTitle,
            { color: isDanger ? theme.colors.error : theme.colors.textPrimary },
          ]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.rowSub, { color: theme.colors.textMuted }]}>{subtitle}</Text>
        )}
      </View>
      {rightElement ?? (onPress && (
        <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
      ))}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Account */}
        <View style={[styles.section, { backgroundColor: theme.colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>{t('settings.account', 'ACCOUNT')}</Text>
          <SettingRow
            icon="person-circle-outline"
            title={user?.name ?? t('settings.myAccount', 'My Account')}
            subtitle={`+91 ${user?.phone}`}
            onPress={() => {}}
          />
        </View>

        {/* Preferences */}
        <View style={[styles.section, { backgroundColor: theme.colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>{t('settings.preferences', 'PREFERENCES')}</Text>
          <SettingRow
            icon="globe-outline"
            title={t('settings.language')}
            subtitle={currentLang?.nativeName ?? 'English'}
            onPress={onLanguageSelect}
          />
          <SettingRow
            icon="moon-outline"
            title={t('settings.themeMode', 'Dark Mode')}
            subtitle={isDark ? t('common.on', 'On') : t('common.off', 'Off')}
            rightElement={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor="#FFF"
              />
            }
          />
          <SettingRow
            icon="notifications-outline"
            title={t('settings.notifications')}
            subtitle={notificationsEnabled ? t('common.enabled', 'Enabled') : t('common.disabled', 'Disabled')}
            onPress={onNotifications}
          />
        </View>

        {/* Legal */}
        <View style={[styles.section, { backgroundColor: theme.colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>{t('settings.legal', 'LEGAL & INFO')}</Text>
          <SettingRow icon="shield-outline" title={t('settings.privacy')} onPress={onPrivacyPolicy} />
          <SettingRow icon="document-text-outline" title={t('settings.terms')} onPress={onTerms} />
          <SettingRow icon="business-outline" title={t('settings.about')} onPress={onAboutCompany} />
          <SettingRow
            icon="information-circle-outline"
            title={t('settings.appVersion', 'App Version')}
            subtitle={APP_VERSION}
          />
        </View>

        {/* Logout */}
        <View style={[styles.section, { backgroundColor: theme.colors.cardBackground }]}>
          <SettingRow
            icon="log-out-outline"
            title={t('settings.logout')}
            onPress={handleLogout}
            isDanger
          />
        </View>

        <View style={{ height: spacing[8] }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: spacing[5],
  },
  headerTitle: { color: '#FFF', fontSize: fontSize.xl, fontWeight: '800' },
  section: {
    marginTop: spacing[4],
    borderRadius: 0,
  },
  sectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    letterSpacing: 1,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing[3],
    paddingBottom: spacing[2],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: spacing[4],
    borderBottomWidth: 0.5,
    gap: spacing[3],
    minHeight: 64,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1 },
  rowTitle: { fontSize: fontSize.base, fontWeight: '500' },
  rowSub: { fontSize: fontSize.xs, marginTop: 2 },
});

export default SettingsScreen;
