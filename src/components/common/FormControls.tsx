/**
 * WorkerConnect — RadioButton & Checkbox Components
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { borderRadius, spacing } from "../../theme/spacing";
import { fontSize } from "../../theme/typography";

// ── RadioButton ───────────────────────────────────────────────────────────────

interface RadioButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  containerStyle?: ViewStyle;
  testID?: string;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  selected,
  onPress,
  containerStyle,
  testID,
}) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.radioContainer, containerStyle]}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      testID={testID}
    >
      <View
        style={[
          styles.radioOuter,
          {
            borderColor: selected ? theme.colors.primary : theme.colors.border,
          },
        ]}
      >
        {selected && (
          <View
            style={[
              styles.radioInner,
              { backgroundColor: theme.colors.primary },
            ]}
          />
        )}
      </View>
      <Text style={[styles.radioLabel, { color: theme.colors.textPrimary }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// ── RadioGroup ────────────────────────────────────────────────────────────────

interface RadioGroupProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  horizontal?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
  label,
  error,
  horizontal = false,
}) => {
  const { theme } = useTheme();
  return (
    <View style={styles.groupContainer}>
      {label && (
        <Text
          style={[styles.groupLabel, { color: theme.colors.textSecondary }]}
        >
          {label}
        </Text>
      )}
      <View style={[styles.group, horizontal && styles.groupHorizontal]}>
        {options.map((opt) => (
          <RadioButton
            key={opt.value}
            label={opt.label}
            selected={value === opt.value}
            onPress={() => onChange(opt.value)}
            containerStyle={
              horizontal ? { marginRight: spacing[5] } : undefined
            }
          />
        ))}
      </View>
      {error && (
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

// ── Checkbox ──────────────────────────────────────────────────────────────────

interface CheckboxProps {
  label: string;
  checked: boolean;
  onPress: () => void;
  containerStyle?: ViewStyle;
  testID?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onPress,
  containerStyle,
  testID,
}) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.checkContainer, containerStyle]}
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      testID={testID}
    >
      <View
        style={[
          styles.checkBox,
          {
            backgroundColor: checked ? theme.colors.primary : "transparent",
            borderColor: checked ? theme.colors.primary : theme.colors.border,
          },
        ]}
      >
        {checked && <Ionicons name="checkmark" size={14} color="#FFF" />}
      </View>
      <Text style={[styles.checkLabel, { color: theme.colors.textPrimary }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing[3],
    minHeight: 44,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing[3],
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  radioLabel: { fontSize: fontSize.base },
  groupContainer: { marginBottom: spacing[4] },
  groupLabel: {
    fontSize: fontSize.sm,
    fontWeight: "500",
    marginBottom: spacing[2],
  },
  group: { flexDirection: "column" },
  groupHorizontal: { flexDirection: "row", flexWrap: "wrap" },
  error: { fontSize: fontSize.xs, marginTop: spacing[1] },
  checkContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing[3],
    minHeight: 44,
  },
  checkBox: {
    width: 22,
    height: 22,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing[3],
  },
  checkLabel: { fontSize: fontSize.base, flex: 1 },
});
