/**
 * WorkerConnect — Address Step
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { useRegistrationStore } from '../../../store/registrationStore';
import AppTextInput from '../../../components/common/AppTextInput';
import Dropdown from '../../../components/common/Dropdown';
import Checkbox from '../../../components/common/Checkbox';
import PrimaryButton from '../../../components/common/PrimaryButton';
import { SecondaryButton } from '../../../components/common/Buttons';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';
import { INDIAN_STATES } from '../../../constants';

const AddressStep: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const { draft, setAddress, nextStep, prevStep } = useRegistrationStore();
  
  const [formData, setFormData] = useState({
    currentAddress: draft.address?.houseNumber || '',
    state: draft.address?.state || '',
    district: draft.address?.district || '',
    city: draft.address?.city || '',
    sameAsCurrent: false,
  });

  const stateOptions = INDIAN_STATES.map((s) => ({ label: s, value: s }));

  const handleNext = () => {
    setAddress({
      houseNumber: formData.currentAddress,
      state: formData.state,
      district: formData.district,
      city: formData.city,
      streetAddress: '',
      pinCode: '',
    });
    nextStep();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Where do you live?</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Please provide your address details to help us find jobs near you.
        </Text>

        <TouchableOpacity style={[styles.autoDetect, { backgroundColor: colors.surfaceVariant }]}>
          <Ionicons name="location-outline" size={20} color={colors.textSecondary} />
          <Text style={[styles.autoDetectText, { color: colors.textSecondary }]}>Auto Detect Location</Text>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Current Address</Text>
        <AppTextInput
          value={formData.currentAddress}
          onChangeText={(val) => setFormData({ ...formData, currentAddress: val })}
          placeholder="House No., Street Name, Landmark"
          multiline
        />

        <Checkbox
          label="Same as Current Address"
          checked={formData.sameAsCurrent}
          onChange={(val) => setFormData({ ...formData, sameAsCurrent: val })}
        />

        {!formData.sameAsCurrent && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Permanent Address</Text>
            <AppTextInput placeholder="Permanent House No., Street Name, Landmark" multiline />
          </>
        )}

        <Dropdown
          label="State"
          value={formData.state}
          onSelect={(val) => setFormData({ ...formData, state: val })}
          options={stateOptions}
          placeholder="Select State"
        />

        <AppTextInput
          label="District"
          value={formData.district}
          onChangeText={(val) => setFormData({ ...formData, district: val })}
          placeholder="Enter District"
        />

        <AppTextInput
          label="City / Town"
          value={formData.city}
          onChangeText={(val) => setFormData({ ...formData, city: val })}
          placeholder="Enter City"
        />
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.buttons}>
          <SecondaryButton title="PREVIOUS" onPress={prevStep} />
          <PrimaryButton title="NEXT STEP" onPress={handleNext} disabled={!formData.state} />
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
  subtitle: { ...textStyles.body2, marginBottom: spacing[4] },
  autoDetect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[3],
    borderRadius: 12,
    gap: spacing[2],
    marginBottom: spacing[5],
  },
  autoDetectText: { ...textStyles.body1, fontWeight: '600' },
  sectionTitle: { ...textStyles.h5, marginBottom: spacing[3], marginTop: spacing[2] },
  footer: { paddingHorizontal: spacing[5], paddingVertical: spacing[4], borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  buttons: { flexDirection: 'row', gap: spacing[3] },
});

export default AddressStep;
