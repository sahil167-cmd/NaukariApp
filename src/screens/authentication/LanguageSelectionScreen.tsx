/**
 * WorkerConnect — Language Selection Screen
 * 2-column grid of 11 Indian languages with orange Continue CTA.
 * Matches Stitch design pixel-perfect.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useSettingsStore } from '../../store/settingsStore';
import PrimaryButton from '../../components/common/PrimaryButton';
import { spacing, borderRadius, layout } from '../../theme/spacing';
import { fontSize } from '../../theme/typography';
import { SUPPORTED_LANGUAGES } from '../../constants';
import i18n from '../../localization/i18n';

interface LanguageSelectionScreenProps {
  onContinue: () => void;
}

const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({ onContinue }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { language, setLanguage } = useSettingsStore();
  const [selected, setSelected] = useState(language ?? 'en');

  const handleSelect = (code: string) => {
    setSelected(code);
  };

  const handleContinue = () => {
    setLanguage(selected);
    i18n.changeLanguage(selected);
    onContinue();
  };

  // Split into pairs for 2-column grid
  const pairs: typeof SUPPORTED_LANGUAGES[number][][] = [];
  for (let i = 0; i < SUPPORTED_LANGUAGES.length; i += 2) {
    pairs.push(SUPPORTED_LANGUAGES.slice(i, i + 2) as any);
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="globe-outline" size={22} color={theme.colors.primary} />
          <Text style={[styles.appName, { color: theme.colors.primary }]}>Naukari Bazaar</Text>
        </View>
        <TouchableOpacity
          style={[styles.helpBtn, { borderColor: theme.colors.border }]}
          accessibilityLabel="Help"
        >
          <Ionicons name="help-circle-outline" size={22} color={theme.colors.textMuted} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          {t('language.title')}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {t('language.subtitle')}
        </Text>

        {/* Language Grid */}
        <View style={styles.grid}>
          {pairs.map((pair, rowIdx) => (
            <View key={rowIdx} style={styles.row}>
              {pair.map((lang) => {
                const isSelected = selected === lang.code;
                return (
                  <TouchableOpacity
                    key={lang.code}
                    style={[
                      styles.langCard,
                      {
                        backgroundColor: theme.colors.cardBackground,
                        borderColor: isSelected ? theme.colors.primary : theme.colors.cardBorder,
                        borderWidth: isSelected ? 2 : 1,
                      },
                    ]}
                    onPress={() => handleSelect(lang.code)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: isSelected }}
                    accessibilityLabel={lang.name}
                  >
                    <Text
                      style={[
                        styles.nativeName,
                        { color: isSelected ? theme.colors.primary : theme.colors.textPrimary },
                      ]}
                    >
                      {lang.nativeName}
                    </Text>
                    <Text
                      style={[
                        styles.langName,
                        { color: isSelected ? theme.colors.primary : theme.colors.textMuted },
                      ]}
                    >
                      {lang.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              {/* Fill empty cell if odd count */}
              {pair.length === 1 && <View style={styles.langCardEmpty} />}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: theme.colors.background }]}>
        <PrimaryButton
          title={t('language.continue')}
          onPress={handleContinue}
          testID="continue-button"
        />
        <Text style={[styles.terms, { color: theme.colors.textMuted }]}>
          {t('language.terms')}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: spacing[3],
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
  appName: { fontSize: fontSize.md, fontWeight: '700' },
  helpBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: spacing[4],
  },
  title: {
    fontSize: fontSize['2xl'],
    fontWeight: '800',
    marginBottom: spacing[2],
    marginTop: spacing[4],
  },
  subtitle: {
    fontSize: fontSize.base,
    lineHeight: fontSize.base * 1.6,
    marginBottom: spacing[6],
  },
  grid: { gap: spacing[3] },
  row: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  langCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    minHeight: 68,
    justifyContent: 'center',
  },
  langCardEmpty: { flex: 1 },
  nativeName: {
    fontSize: fontSize.md,
    fontWeight: '700',
    marginBottom: 2,
  },
  langName: {
    fontSize: fontSize.sm,
  },
  footer: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: spacing[8],
    paddingTop: spacing[4],
    gap: spacing[3],
  },
  terms: {
    fontSize: fontSize.xs,
    textAlign: 'center',
  },
});

export default LanguageSelectionScreen;
