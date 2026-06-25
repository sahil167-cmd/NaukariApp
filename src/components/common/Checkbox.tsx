/**
 * WorkerConnect — Checkbox Component
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing, borderRadius } from '../../theme/spacing';
import { textStyles } from '../../theme/typography';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange, disabled = false }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => !disabled && onChange(!checked)}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View
        style={[
          styles.box,
          {
            backgroundColor: checked ? colors.primary : colors.inputBackground,
            borderColor: checked ? colors.primary : colors.inputBorder,
          },
          disabled && { opacity: 0.5 },
        ]}
      >
        {checked && <Ionicons name="checkmark" size={16} color={colors.buttonPrimaryText} />}
      </View>
      <Text
        style={[
          styles.label,
          { color: colors.textPrimary },
          disabled && { opacity: 0.5 },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  label: {
    ...textStyles.body1,
    flex: 1,
  },
});

export default Checkbox;
