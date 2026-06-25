/**
 * WorkerConnect — Job Preferences Step
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { useRegistrationStore } from '../../../store/registrationStore';
import RadioButton from '../../../components/common/RadioButton';
import PrimaryButton from '../../../components/common/PrimaryButton';
import { SecondaryButton } from '../../../components/common/Buttons';
import { spacing, borderRadius } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const JobPreferencesStep: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const { setJobPreferences, nextStep, prevStep } = useRegistrationStore();
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [employmentType, setEmploymentType] = useState('');
  const [salary, setSalary] = useState(15000);

  const categories = [
    { label: 'Driver', icon: 'car-sport' },
    { label: 'Electrician', icon: 'flash' },
    { label: 'Plumber', icon: 'build' },
    { label: 'Carpenter', icon: 'hammer' },
    { label: 'Security Guard', icon: 'shield-checkmark' },
    { label: 'Delivery Partner', icon: 'bicycle' },
  ];

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleNext = () => {
    setJobPreferences({ categories: selectedCategories, salaryRange: salary.toString() });
    nextStep();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <MaterialIcons name="work" size={28} color={colors.primary} />
          <Text style={[styles.title, { color: colors.textPrimary }]}>Preferred Job Category</Text>
        </View>
        
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Select the roles you are interested in (You can pick more than one)
        </Text>

        <View style={styles.categoriesGrid}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.label}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: selectedCategories.includes(cat.label) ? colors.primaryLight : colors.surface,
                  borderColor: selectedCategories.includes(cat.label) ? colors.primary : colors.border,
                },
              ]}
              onPress={() => toggleCategory(cat.label)}
            >
              <Ionicons
                name={cat.icon as any}
                size={18}
                color={selectedCategories.includes(cat.label) ? colors.primary : colors.textSecondary}
              />
              <Text style={[styles.categoryText, { color: colors.textPrimary }]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Ionicons name="time-outline" size={24} color={colors.textPrimary} />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Employment Type</Text>
        </View>

        {['Full Time', 'Part Time', 'Contract', 'Daily Wage'].map((type) => (
          <RadioButton
            key={type}
            label={type}
            selected={employmentType === type}
            onSelect={() => setEmploymentType(type)}
          />
        ))}

        <View style={[styles.salaryBox, { backgroundColor: colors.surfaceVariant }]}>
          <View style={styles.salaryHeader}>
            <Ionicons name="cash-outline" size={20} color={colors.textPrimary} />
            <Text style={[styles.salaryLabel, { color: colors.textPrimary }]}>Expected Salary (Monthly)</Text>
          </View>
          <Text style={[styles.salaryValue, { color: colors.primary }]}>₹{salary.toLocaleString()}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.buttons}>
          <SecondaryButton title="PREVIOUS" onPress={prevStep} />
          <PrimaryButton title="NEXT STEP" onPress={handleNext} disabled={selectedCategories.length === 0} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing[5], paddingBottom: spacing[8] },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginBottom: spacing[2] },
  title: { ...textStyles.h3 },
  subtitle: { ...textStyles.body2, marginBottom: spacing[5] },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2], marginBottom: spacing[6] },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.full,
    borderWidth: 1,
    gap: spacing[1],
  },
  categoryText: { ...textStyles.body2, fontWeight: '500' },
  section: { flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginTop: spacing[6], marginBottom: spacing[3] },
  sectionTitle: { ...textStyles.h5 },
  salaryBox: { padding: spacing[4], borderRadius: borderRadius.lg, marginTop: spacing[5] },
  salaryHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginBottom: spacing[2] },
  salaryLabel: { ...textStyles.body2, fontWeight: '600' },
  salaryValue: { ...textStyles.h2, fontSize: 28, fontWeight: '700' },
  footer: { paddingHorizontal: spacing[5], paddingVertical: spacing[4], borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  buttons: { flexDirection: 'row', gap: spacing[3] },
});

export default JobPreferencesStep;
