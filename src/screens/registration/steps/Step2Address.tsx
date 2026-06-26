/**
 * WorkerConnect — Registration Step 2: Address
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../contexts/ThemeContext';
import AppTextInput from '../../../components/common/AppTextInput';
import Dropdown from '../../../components/common/Dropdown';
import PrimaryButton from '../../../components/common/PrimaryButton';
import { addressSchema } from '../../../validators';
import { INDIAN_STATES } from '../../../constants';
import { spacing, layout } from '../../../theme/spacing';
import type { AddressDetails } from '../../../types';

interface Step2Props {
  initialData?: Partial<AddressDetails>;
  onNext: (data: AddressDetails) => void;
}

const Step2Address: React.FC<Step2Props> = ({ initialData, onNext }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const { control, handleSubmit, formState: { errors } } = useForm<AddressDetails>({
    resolver: yupResolver(addressSchema) as any,
    defaultValues: {
      houseNumber: initialData?.houseNumber ?? '',
      streetAddress: initialData?.streetAddress ?? '',
      landmark: initialData?.landmark ?? '',
      city: initialData?.city ?? '',
      district: initialData?.district ?? '',
      state: initialData?.state ?? '',
      pinCode: initialData?.pinCode ?? '',
    },
  });

  const stateOptions = INDIAN_STATES.map((s) => ({ label: s, value: s }));

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Controller
        name="streetAddress"
        control={control}
        render={({ field: { onChange, value } }) => (
          <AppTextInput
            label={t('address.street')}
            placeholder={t('address.streetPlaceholder', 'e.g. MG Road, Sector 4')}
            value={value}
            onChangeText={onChange}
            error={errors.streetAddress?.message}
            required
            leftIcon="map-outline"
            multiline
          />
        )}
      />
      <Controller
        name="city"
        control={control}
        render={({ field: { onChange, value } }) => (
          <AppTextInput
            label={t('address.city')}
            placeholder={t('address.cityPlaceholder', 'Enter your city')}
            value={value}
            onChangeText={onChange}
            error={errors.city?.message}
            required
            leftIcon="business-outline"
          />
        )}
      />
      <Controller
        name="district"
        control={control}
        render={({ field: { onChange, value } }) => (
          <AppTextInput
            label={t('address.district')}
            placeholder={t('address.districtPlaceholder', 'Enter your district')}
            value={value}
            onChangeText={onChange}
            error={errors.district?.message}
            required
            leftIcon="location-outline"
          />
        )}
      />
      <Controller
        name="state"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Dropdown
            label={t('address.state')}
            placeholder={t('address.statePlaceholder', 'Select your state')}
            options={stateOptions}
            value={value}
            onSelect={onChange}
            error={errors.state?.message}
            searchable
            required
          />
        )}
      />
      <Controller
        name="pinCode"
        control={control}
        render={({ field: { onChange, value } }) => (
          <AppTextInput
            label={t('address.pinCode')}
            placeholder={t('address.pinPlaceholder', '6-digit PIN Code')}
            value={value}
            onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, 6))}
            error={errors.pinCode?.message}
            required
            leftIcon="keypad-outline"
            keyboardType="number-pad"
            maxLength={6}
          />
        )}
      />
      <PrimaryButton title={t('registration.next')} onPress={handleSubmit(onNext as any)} style={{ marginTop: spacing[4] }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: layout.screenPaddingHorizontal },
});

export default Step2Address;
