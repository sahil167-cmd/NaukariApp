/**
 * WorkerConnect — Phone Input Component
 * Indian phone number input with +91 country code prefix.
 */

import React, { forwardRef } from "react";
import { View, TextInput, Text, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { borderRadius, layout, spacing } from "../../theme/spacing";
import { fontSize } from "../../theme/typography";

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  label?: string;
  containerStyle?: ViewStyle;
  testID?: string;
}

const PhoneInput = forwardRef<TextInput, PhoneInputProps>(
  ({ value, onChangeText, error, label, containerStyle, testID }, ref) => {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = React.useState(false);

    const borderColor = error
      ? theme.colors.error
      : isFocused
        ? theme.colors.inputBorderFocused
        : theme.colors.inputBorder;

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
            { backgroundColor: theme.colors.inputBackground, borderColor },
          ]}
        >
          <View
            style={[
              styles.prefix,
              { borderRightColor: theme.colors.inputBorder },
            ]}
          >
            <Text
              style={[styles.prefixText, { color: theme.colors.textPrimary }]}
            >
              🇮🇳 +91
            </Text>
          </View>
          <TextInput
            ref={ref}
            style={[styles.input, { color: theme.colors.inputText }]}
            value={value}
            onChangeText={(t) =>
              onChangeText(t.replace(/\D/g, "").slice(0, 10))
            }
            keyboardType="number-pad"
            placeholder="Enter mobile number"
            placeholderTextColor={theme.colors.inputPlaceholder}
            maxLength={10}
            returnKeyType="done"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            testID={testID ?? "phone-input"}
            accessibilityLabel={label ?? "Mobile number"}
          />
        </View>
        {error && (
          <Text style={[styles.error, { color: theme.colors.error }]}>
            {error}
          </Text>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: { marginBottom: spacing[4] },
  label: {
    fontSize: fontSize.sm,
    fontWeight: "500",
    marginBottom: spacing[1],
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: layout.inputHeight,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    overflow: "hidden",
  },
  prefix: {
    paddingHorizontal: spacing[3],
    borderRightWidth: 1.5,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  prefixText: {
    fontSize: fontSize.base,
    fontWeight: "500",
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing[3],
    fontSize: fontSize.base,
    height: "100%",
  },
  error: {
    fontSize: fontSize.xs,
    marginTop: spacing[1],
    marginLeft: spacing[1],
  },
});

PhoneInput.displayName = "PhoneInput";
export default PhoneInput;
