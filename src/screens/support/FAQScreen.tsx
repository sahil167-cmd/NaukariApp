/**
 * WorkerConnect — FAQ Screen
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar,
} from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing, layout, borderRadius } from '../../theme/spacing';
import { fontSize } from '../../theme/typography';

const FAQS = [
  {
    q: 'Is Naukari Bazaar free to use?',
    a: 'Yes! Naukari Bazaar is completely free for workers. You can create your profile and apply for jobs without any charges.',
  },
  {
    q: 'How do I get job alerts?',
    a: 'Once you complete your profile and set your job preferences, you will automatically receive alerts via SMS and app notifications.',
  },
  {
    q: 'Are all employers verified?',
    a: 'We verify all employers on our platform. Look for the "Verified" badge on job listings for added assurance.',
  },
  {
    q: 'Can I update my profile after submitting?',
    a: 'Yes, you can update any section of your profile at any time from the Profile screen.',
  },
  {
    q: 'How do I change my registered mobile number?',
    a: 'To change your mobile number, please contact our support team via the Contact Us section.',
  },
  {
    q: 'Is my personal data safe?',
    a: 'Yes. We use industry-standard encryption to protect your profile details. Your data is never shared with third parties without your consent.',
  },
  {
    q: 'How do I switch the language?',
    a: 'Go to Settings > Language to change the app language at any time.',
  },
];

const FAQItem: React.FC<{ item: typeof FAQS[0]; isOpen: boolean; onToggle: () => void }> = ({
  item, isOpen, onToggle,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.item, { backgroundColor: theme.colors.cardBackground, borderColor: isOpen ? theme.colors.primary : theme.colors.cardBorder }]}
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityState={{ expanded: isOpen }}
    >
      <View style={styles.question}>
        <Text style={[styles.questionText, { color: theme.colors.textPrimary }]}>{item.q}</Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={isOpen ? theme.colors.primary : theme.colors.textMuted}
        />
      </View>
      {isOpen && (
        <Text style={[styles.answer, { color: theme.colors.textSecondary }]}>{item.a}</Text>
      )}
    </TouchableOpacity>
  );
};

const FAQScreen: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { theme } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, { borderBottomColor: theme.colors.divider }]}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        )}
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>FAQ</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Find answers to the most common questions.
        </Text>
        {FAQS.map((faq, i) => (
          <FAQItem
            key={i}
            item={faq}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
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
  item: {
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    padding: spacing[4],
    marginBottom: spacing[3],
  },
  question: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing[3] },
  questionText: { flex: 1, fontSize: fontSize.base, fontWeight: '600', lineHeight: fontSize.base * 1.4 },
  answer: { fontSize: fontSize.sm, marginTop: spacing[3], lineHeight: fontSize.sm * 1.7 },
});

export default FAQScreen;
