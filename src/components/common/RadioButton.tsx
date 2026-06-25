/**
 * WorkerConnect — Radio Button Component
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing } from '../../theme/spacing';
import { textStyles } from '../../theme/typography';

interface RadioButtonProps {
  label: string;
  selected: boolean;
  onSelect?: () => void;
  disabled?: boolean;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  selected,
  onSelect,
  disabled = false,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => !disabled && onSelect?.()}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View
        style={[
          styles.circle,
          {
            borderColor: selected ? colors.primary : colors.inputBorder,
          },
          disabled && { opacity: 0.5 },
        ]}
      >
        {selected && (
          <View
            style={[
              styles.innerCircle,
              { backgroundColor: colors.primary },
            ]}
          />
        )}
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
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  label: {
    ...textStyles.body1,
    flex: 1,
  },
});

export default RadioButton;
