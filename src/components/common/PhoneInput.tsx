/**
 * Naukri Bazaar — Phone Input Component
 * Indian phone number input with +91 prefix.
 * Enforces exactly 10 digits with a live counter.
 */

import React, { forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  KeyboardTypeOptions,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { borderRadius, layout, spacing } from '../../theme/spacing';
import { fontSize } from '../../theme/typography';

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  label?: string;
  containerStyle?: ViewStyle;
  testID?: string;
  maxLength?: number;
  keyboardType?: KeyboardTypeOptions;
  placeholder?: string;
}

const PHONE_MAX = 10;

const PhoneInput = forwardRef<TextInput, PhoneInputProps>(
  ({ value, onChangeText, error, label, containerStyle, testID, maxLength = PHONE_MAX }, ref) => {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = React.useState(false);

    const borderColor = error
      ? theme.colors.error
      : isFocused
      ? theme.colors.inputBorderFocused
      : theme.colors.inputBorder;

    const digitCount = (value || '').length;
    const isComplete = digitCount === PHONE_MAX;

    const handleChange = (text: string) => {
      // Strip any non-digit characters and cap at 10 digits
      const digits = text.replace(/\D/g, '').slice(0, PHONE_MAX);
      onChangeText(digits);
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            {label} <Text style={{ color: theme.colors.error }}>*</Text>
          </Text>
        )}
        <View
          style={[
            styles.wrapper,
            {
              backgroundColor: theme.colors.inputBackground,
              borderColor,
              borderWidth: isFocused ? 2 : 1.5,
            },
          ]}
        >
          <View style={[styles.prefix, { borderRightColor: theme.colors.inputBorder }]}>
            <Text style={[styles.prefixText, { color: theme.colors.textPrimary }]}>
              🇮🇳 +91
            </Text>
          </View>
          <TextInput
            ref={ref}
            style={[styles.input, { color: theme.colors.inputText }]}
            value={value}
            onChangeText={handleChange}
            keyboardType="number-pad"
            placeholder="Enter 10-digit number"
            placeholderTextColor={theme.colors.inputPlaceholder}
            maxLength={PHONE_MAX}
            returnKeyType="done"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            testID={testID ?? 'phone-input'}
            accessibilityLabel={label ?? 'Mobile number input'}
          />
          {/* Live digit counter */}
          <Text
            style={[
              styles.counter,
              {
                color: isComplete
                  ? theme.colors.success ?? '#27AE60'
                  : isFocused
                  ? theme.colors.primary
                  : theme.colors.textMuted,
              },
            ]}
          >
            {digitCount}/{PHONE_MAX}
          </Text>
        </View>
        {error && (
          <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: { marginBottom: spacing[4] },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    marginBottom: spacing[1],
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: layout.inputHeight,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  prefix: {
    paddingHorizontal: spacing[3],
    borderRightWidth: 1.5,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prefixText: {
    fontSize: fontSize.base,
    fontWeight: '500',
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing[3],
    fontSize: fontSize.base,
    height: '100%',
  },
  counter: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    paddingRight: spacing[3],
    minWidth: 36,
    textAlign: 'right',
  },
  error: {
    fontSize: fontSize.xs,
    marginTop: spacing[1],
    marginLeft: spacing[1],
  },
});

PhoneInput.displayName = 'PhoneInput';
export default PhoneInput;
