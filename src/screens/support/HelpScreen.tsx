/**
 * WorkerConnect — Help Screen
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing, layout, borderRadius } from '../../theme/spacing';
import { fontSize } from '../../theme/typography';

const HELP_TOPICS = [
  {
    icon: 'person-add-outline',
    title: 'How to Register',
    steps: [
      'Download the Naukari Bazaar app and open it.',
      'Choose your preferred language.',
      'Tap "Register" on the welcome screen.',
      'Enter your mobile number and verify with OTP.',
      'Fill in all 6 steps of your profile.',
      'Submit your profile and start receiving job alerts!',
    ],
  },
  {
    icon: 'search-outline',
    title: 'How to Find Jobs',
    steps: [
      'Go to the Dashboard after logging in.',
      'Browse "Jobs For You" — curated for your profile.',
      'Tap any job card to view full details.',
      'Tap "Apply Now" to submit your application.',
      'Track applications in your profile.',
    ],
  },
  {
    icon: 'image-outline',
    title: 'How to Upload Profile Photo',
    steps: [
      'Go to the registration screen or edit profile.',
      'Tap the profile photo field at the top.',
      'Choose a photo from your gallery.',
      'Ensure the photo is clear and contains only your face.',
      'Tap Save to upload.',
    ],
  },
];

const HelpScreen: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = React.useState<number | null>(0);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, { borderBottomColor: theme.colors.divider }]}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        )}
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>Help Center</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Step-by-step guides to help you use Naukari Bazaar.
        </Text>
        {HELP_TOPICS.map((topic, i) => (
          <View
            key={i}
            style={[styles.topicCard, { backgroundColor: theme.colors.cardBackground, borderColor: expanded === i ? theme.colors.primary : theme.colors.cardBorder }]}
          >
            <TouchableOpacity
              style={styles.topicHeader}
              onPress={() => setExpanded(expanded === i ? null : i)}
            >
              <View style={[styles.topicIcon, { backgroundColor: theme.colors.primaryLight }]}>
                <Ionicons name={topic.icon as any} size={20} color={theme.colors.primary} />
              </View>
              <Text style={[styles.topicTitle, { color: theme.colors.textPrimary }]}>
                {topic.title}
              </Text>
              <Ionicons
                name={expanded === i ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={theme.colors.textMuted}
              />
            </TouchableOpacity>
            {expanded === i && (
              <View style={styles.steps}>
                {topic.steps.map((step, j) => (
                  <View key={j} style={styles.step}>
                    <View style={[styles.stepNum, { backgroundColor: theme.colors.primary }]}>
                      <Text style={styles.stepNumText}>{j + 1}</Text>
                    </View>
                    <Text style={[styles.stepText, { color: theme.colors.textSecondary }]}>{step}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
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
  subtitle: { fontSize: fontSize.base, marginBottom: spacing[5], lineHeight: fontSize.base * 1.6 },
  topicCard: {
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    marginBottom: spacing[3],
    overflow: 'hidden',
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    gap: spacing[3],
  },
  topicIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicTitle: { flex: 1, fontSize: fontSize.base, fontWeight: '700' },
  steps: { paddingHorizontal: spacing[4], paddingBottom: spacing[4] },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing[3], marginBottom: spacing[3] },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumText: { color: '#FFF', fontSize: fontSize.xs, fontWeight: '700' },
  stepText: { flex: 1, fontSize: fontSize.sm, lineHeight: fontSize.sm * 1.6 },
});

export default HelpScreen;
