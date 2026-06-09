/**
 * WorkerConnect — AppTextInput Component
 * Matches the cream-background input fields in Stitch design.
 */

import React, { useState, forwardRef } from "react";
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { borderRadius, layout, spacing } from "../../theme/spacing";
import { fontSize } from "../../theme/typography";

interface AppTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: string;
  rightIcon?: string | React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  required?: boolean;
  optional?: boolean;
}

const AppTextInput = forwardRef<RNTextInput, AppTextInputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      onRightIconPress,
      containerStyle,
      required,
      optional,
      secureTextEntry,
      ...rest
    },
    ref,
  ) => {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [isSecure, setIsSecure] = useState(secureTextEntry ?? false);

    const borderColor = error
      ? theme.colors.error
      : isFocused
        ? theme.colors.inputBorderFocused
        : theme.colors.inputBorder;

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            {label}
            {required && <Text style={{ color: theme.colors.error }}> *</Text>}
          </Text>
        )}

        <View
          style={[
            styles.inputWrapper,
            {
              backgroundColor: theme.colors.inputBackground,
              borderColor,
            },
          ]}
        >
          {leftIcon && (
            <Ionicons
              name={leftIcon as any}
              size={18}
              color={isFocused ? theme.colors.primary : theme.colors.textMuted}
              style={styles.leftIcon}
            />
          )}

          <RNTextInput
            ref={ref}
            style={[
              styles.input,
              {
                color: theme.colors.inputText,
                paddingLeft: leftIcon ? 0 : spacing[4],
              },
            ]}
            placeholderTextColor={theme.colors.inputPlaceholder}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            secureTextEntry={isSecure}
            accessibilityLabel={label}
            {...rest}
          />

          {secureTextEntry && (
            <TouchableOpacity
              onPress={() => setIsSecure((prev) => !prev)}
              style={styles.rightIconBtn}
              accessibilityLabel={isSecure ? "Show password" : "Hide password"}
            >
              <Ionicons
                name={isSecure ? "eye-off-outline" : "eye-outline"}
                size={18}
                color={theme.colors.textMuted}
              />
            </TouchableOpacity>
          )}

          {rightIcon && !secureTextEntry && (
            <TouchableOpacity
              onPress={onRightIconPress}
              style={styles.rightIconBtn}
              disabled={!onRightIconPress}
            >
              {React.isValidElement(rightIcon) ? (
                rightIcon
              ) : (
                <Ionicons
                  name={rightIcon as any}
                  size={18}
                  color={theme.colors.textMuted}
                />
              )}
            </TouchableOpacity>
          )}
        </View>

        {error && (
          <Text style={[styles.error, { color: theme.colors.error }]}>
            {error}
          </Text>
        )}
        {hint && !error && (
          <Text style={[styles.hint, { color: theme.colors.textMuted }]}>
            {hint}
          </Text>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[4],
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: "500",
    marginBottom: spacing[1],
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    height: layout.inputHeight,
    overflow: "hidden",
  },
  leftIcon: {
    paddingLeft: spacing[4],
    paddingRight: spacing[2],
  },
  input: {
    flex: 1,
    fontSize: fontSize.base,
    paddingRight: spacing[4],
    height: "100%",
  },
  rightIconBtn: {
    padding: spacing[3],
  },
  error: {
    fontSize: fontSize.xs,
    marginTop: spacing[1],
    marginLeft: spacing[1],
  },
  hint: {
    fontSize: fontSize.xs,
    marginTop: spacing[1],
    marginLeft: spacing[1],
  },
});

AppTextInput.displayName = "AppTextInput";

export default AppTextInput;
