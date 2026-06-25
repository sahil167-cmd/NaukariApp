/**
 * WorkerConnect — Education & Skills Step
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { useRegistrationStore } from '../../../store/registrationStore';
import Dropdown from '../../../components/common/Dropdown';
import Checkbox from '../../../components/common/Checkbox';
import PrimaryButton from '../../../components/common/PrimaryButton';
import { SecondaryButton } from '../../../components/common/Buttons';
import { spacing, borderRadius } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';
import { EDUCATION_LEVELS } from '../../../constants';

const EducationStep: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const { setEducation, prevStep } = useRegistrationStore();
  
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [languages, setLanguages] = useState<Record<string, { read: boolean; write: boolean; speak: boolean }>>({
    Hindi: { read: true, write: true, speak: true },
    English: { read: false, write: false, speak: false },
    Bengali: { read: false, write: false, speak: false },
  });

  const eduOptions = EDUCATION_LEVELS.map((e) => ({ label: e, value: e }));
  const expOptions = [
    { label: 'Fresher', value: 'Fresher' },
    { label: '1-2 Years', value: '1-2' },
    { label: '3-5 Years', value: '3-5' },
    { label: '5-10 Years', value: '5-10' },
    { label: '10+ Years', value: '10+' },
  ];

  const skillsList = ['Driving', 'Plumbing', 'Electrical', 'Masonry', 'Security Guard', 'Cooking', 'Cleaning'];

  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const toggleLanguage = (lang: string, field: 'read' | 'write' | 'speak') => {
    setLanguages({
      ...languages,
      [lang]: {
        ...languages[lang],
        [field]: !languages[lang][field],
      },
    });
  };

  const handleNext = () => {
    setEducation({ highestLevel: qualification });
    navigation.navigate('RegistrationSuccess');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Education & Skills</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Help us find jobs that match your expertise.
        </Text>

        <Dropdown
          label="Highest Qualification"
          value={qualification}
          onSelect={setQualification}
          options={eduOptions}
          placeholder="Select Qualification"
        />

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Work Experience</Text>
        <View style={styles.expGrid}>
          {expOptions.map((exp) => (
            <TouchableOpacity
              key={exp.value}
              style={[
                styles.expChip,
                {
                  backgroundColor: experience === exp.value ? colors.primary : colors.surface,
                  borderColor: experience === exp.value ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setExperience(exp.value)}
            >
              <Text
                style={[
                  styles.expText,
                  { color: experience === exp.value ? colors.buttonPrimaryText : colors.textPrimary },
                ]}
              >
                {exp.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Select Your Skills (Multiple)</Text>
        <View style={styles.skillsGrid}>
          {skillsList.map((skill) => (
            <TouchableOpacity
              key={skill}
              style={[
                styles.skillChip,
                {
                  backgroundColor: skills.includes(skill) ? colors.primaryLight : colors.surface,
                  borderColor: skills.includes(skill) ? colors.primary : colors.border,
                },
              ]}
              onPress={() => toggleSkill(skill)}
            >
              <Ionicons name="hammer" size={16} color={skills.includes(skill) ? colors.primary : colors.textSecondary} />
              <Text style={[styles.skillText, { color: colors.textPrimary }]}>{skill}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.skillChip, { borderColor: colors.border, borderWidth: 1 }]}>
            <Ionicons name="add-circle-outline" size={16} color={colors.primary} />
            <Text style={[styles.skillText, { color: colors.primary }]}>Other</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Languages Known</Text>
        <View style={[styles.langTable, { backgroundColor: colors.surface }]}>
          <View style={styles.langHeader}>
            <Text style={[styles.langHeaderText, { color: colors.textMuted }]}>LANGUAGE</Text>
            <Text style={[styles.langHeaderText, { color: colors.textMuted }]}>READ</Text>
            <Text style={[styles.langHeaderText, { color: colors.textMuted }]}>WRITE</Text>
            <Text style={[styles.langHeaderText, { color: colors.textMuted }]}>SPEAK</Text>
          </View>
          {Object.keys(languages).map((lang) => (
            <View key={lang} style={[styles.langRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.langName, { color: colors.textPrimary }]}>{lang}</Text>
              <Checkbox label="" checked={languages[lang].read} onChange={() => toggleLanguage(lang, 'read')} />
              <Checkbox label="" checked={languages[lang].write} onChange={() => toggleLanguage(lang, 'write')} />
              <Checkbox label="" checked={languages[lang].speak} onChange={() => toggleLanguage(lang, 'speak')} />
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.addLang}>
          <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
          <Text style={[styles.addLangText, { color: colors.primary }]}>Add Another Language</Text>
        </TouchableOpacity>

        <View style={[styles.infoBanner, { backgroundColor: colors.warningBackground }]}>
          <Ionicons name="shield-checkmark" size={20} color={colors.warning} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Providing accurate experience details helps us match you with <Text style={{ fontWeight: '700' }}>high-paying Verified Employers</Text> in your area.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.buttons}>
          <SecondaryButton title="PREVIOUS" onPress={prevStep} />
          <PrimaryButton title="NEXT STEP" onPress={handleNext} disabled={!qualification} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing[5], paddingBottom: spacing[8] },
  title: { ...textStyles.h3, marginBottom: spacing[2] },
  subtitle: { ...textStyles.body2, marginBottom: spacing[5] },
  sectionTitle: { ...textStyles.h5, marginBottom: spacing[3], marginTop: spacing[4] },
  expGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] },
  expChip: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  expText: { ...textStyles.body2, fontWeight: '600' },
  skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.full,
    borderWidth: 1,
    gap: spacing[1],
  },
  skillText: { ...textStyles.body2, fontWeight: '500' },
  langTable: { borderRadius: borderRadius.md, overflow: 'hidden', padding: spacing[3] },
  langHeader: { flexDirection: 'row', marginBottom: spacing[2] },
  langHeaderText: { ...textStyles.caption, flex: 1, textAlign: 'center', fontWeight: '700' },
  langRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing[2], borderBottomWidth: 1 },
  langName: { ...textStyles.body2, flex: 1, fontWeight: '600' },
  addLang: { flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginTop: spacing[3] },
  addLangText: { ...textStyles.body1, fontWeight: '600' },
  infoBanner: { flexDirection: 'row', padding: spacing[3], borderRadius: borderRadius.md, marginTop: spacing[5], gap: spacing[2] },
  infoText: { ...textStyles.caption, flex: 1 },
  footer: { paddingHorizontal: spacing[5], paddingVertical: spacing[4], borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  buttons: { flexDirection: 'row', gap: spacing[3] },
});

export default EducationStep;
