/**
 * WorkerConnect — Registration Step 6: Documents
 */

import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../contexts/ThemeContext';
import AppTextInput from '../../../components/common/AppTextInput';
import PrimaryButton from '../../../components/common/PrimaryButton';
import { documentSchema } from '../../../validators';
import { spacing, layout, borderRadius } from '../../../theme/spacing';
import { fontSize } from '../../../theme/typography';
import type { DocumentDetails } from '../../../types';

interface Step6Props {
  initialData?: Partial<DocumentDetails>;
  onNext: (data: Partial<DocumentDetails>) => void;
}

const Step6Documents: React.FC<Step6Props> = ({ initialData, onNext }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [aadhaarPhoto, setAadhaarPhoto] = React.useState<string | undefined>(initialData?.aadhaarPhoto);
  const [panPhoto, setPanPhoto] = React.useState<string | undefined>(initialData?.panPhoto);

  const { control, handleSubmit, formState: { errors } } = useForm<DocumentDetails>({
    resolver: yupResolver(documentSchema) as any,
    defaultValues: {
      aadhaarNumber: initialData?.aadhaarNumber ?? '',
      panNumber: initialData?.panNumber ?? '',
    },
  });

  const pickImage = async (setter: (uri: string) => void) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'] as ImagePicker.MediaType[],
      allowsEditing: true,
      aspect: [16, 10],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setter(result.assets[0].uri);
    }
  };

  const DocumentUploadBox: React.FC<{
    label: string;
    uri?: string;
    onPress: () => void;
    isOptional?: boolean;
  }> = ({ label, uri, onPress, isOptional }) => (
    <View style={styles.uploadSection}>
      <Text style={[styles.uploadLabel, { color: theme.colors.textSecondary }]}>
        {label}
        {!isOptional && <Text style={{ color: theme.colors.error }}> *</Text>}
        {isOptional && <Text style={{ color: theme.colors.textMuted }}> ({t('common.optional', 'Optional')})</Text>}
      </Text>
      <TouchableOpacity
        style={[
          styles.uploadBox,
          {
            backgroundColor: theme.colors.surfaceVariant,
            borderColor: uri ? theme.colors.success : theme.colors.border,
          },
        ]}
        onPress={onPress}
        accessibilityLabel={`Upload ${label}`}
      >
        {uri ? (
          <>
            <Image source={{ uri }} style={styles.docPreview} resizeMode="cover" />
            <View style={[styles.changeOverlay]}>
              <Ionicons name="camera" size={20} color="#FFF" />
              <Text style={styles.changeText}>{t('common.edit', 'Change')}</Text>
            </View>
          </>
        ) : (
          <View style={styles.uploadPlaceholder}>
            <Ionicons name="cloud-upload-outline" size={32} color={theme.colors.primary} />
            <Text style={[styles.uploadHint, { color: theme.colors.textSecondary }]}>
              {t('documents.tapToUpload', 'Tap to upload')}
            </Text>
            <Text style={[styles.uploadHintSmall, { color: theme.colors.textMuted }]}>
              {t('documents.uploadSpecs', 'JPG, PNG — Max 5MB')}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  const onSubmit = (data: any) => {
    onNext({ ...data, aadhaarPhoto, panPhoto });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Aadhaar */}
      <Controller
        name="aadhaarNumber"
        control={control}
        render={({ field: { onChange, value } }) => (
          <AppTextInput
            label={t('documents.aadhaar')}
            placeholder={t('documents.aadhaarPlaceholder', '12-digit Aadhaar number')}
            value={value ?? ''}
            onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, 12))}
            error={errors.aadhaarNumber?.message}
            leftIcon="card-outline"
            keyboardType="number-pad"
            maxLength={12}
          />
        )}
      />
      <DocumentUploadBox
        label={t('documents.aadhaarPhoto')}
        uri={aadhaarPhoto}
        onPress={() => pickImage(setAadhaarPhoto)}
        isOptional
      />

      {/* PAN */}
      <Controller
        name="panNumber"
        control={control}
        render={({ field: { onChange, value } }) => (
          <AppTextInput
            label={t('documents.pan')}
            placeholder={t('documents.panPlaceholder', 'e.g. ABCDE1234F (Optional)')}
            value={value ?? ''}
            onChangeText={(t) => onChange(t.toUpperCase().slice(0, 10))}
            error={errors.panNumber?.message}
            leftIcon="document-text-outline"
            autoCapitalize="characters"
          />
        )}
      />
      <DocumentUploadBox
        label={t('documents.panPhoto')}
        uri={panPhoto}
        onPress={() => pickImage(setPanPhoto)}
        isOptional
      />

      <PrimaryButton
        title={t('registration.review', 'NEXT — REVIEW')}
        onPress={handleSubmit(onSubmit)}
        style={{ marginTop: spacing[4] }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: layout.screenPaddingHorizontal },
  uploadSection: { marginBottom: spacing[4] },
  uploadLabel: { fontSize: fontSize.sm, fontWeight: '500', marginBottom: spacing[2] },
  uploadBox: {
    height: 140,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadPlaceholder: { alignItems: 'center', gap: spacing[2] },
  uploadHint: { fontSize: fontSize.sm, fontWeight: '500' },
  uploadHintSmall: { fontSize: fontSize.xs },
  docPreview: { width: '100%', height: '100%' },
  changeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[2],
  },
  changeText: { color: '#FFF', fontSize: fontSize.sm, fontWeight: '600' },
});

export default Step6Documents;
