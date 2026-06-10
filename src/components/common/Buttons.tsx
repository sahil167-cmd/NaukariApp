/**
 * WorkerConnect — Secondary & Outlined Button Components
 */

import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "../../contexts/ThemeContext";
import { layout, borderRadius, spacing } from "../../theme/spacing";
import { textStyles } from "../../theme/typography";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ── Secondary Button (tan/cream fill) ────────────────────────────────────────

export const SecondaryButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  testID,
}) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const isDisabled = disabled || loading;

  return (
    <AnimatedPressable
      style={[
        animatedStyle,
        styles.button,
        { backgroundColor: theme.colors.buttonSecondary },
        style,
      ]}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 15 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15 });
      }}
      disabled={isDisabled}
      testID={testID ?? "secondary-button"}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.textPrimary} size="small" />
      ) : (
        <Text
          style={[
            styles.secondaryText,
            { color: theme.colors.buttonSecondaryText },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </AnimatedPressable>
  );
};

// ── Outlined Button ───────────────────────────────────────────────────────────

export const OutlinedButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  testID,
}) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const isDisabled = disabled || loading;

  return (
    <AnimatedPressable
      style={[
        animatedStyle,
        styles.button,
        styles.outlined,
        { borderColor: theme.colors.buttonOutlineBorder },
        style,
      ]}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 15 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15 });
      }}
      disabled={isDisabled}
      testID={testID ?? "outlined-button"}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.primary} size="small" />
      ) : (
        <Text
          style={[
            styles.outlinedText,
            { color: theme.colors.buttonOutlineText },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: layout.buttonHeight,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing[6],
    width: "100%",
  },
  outlined: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
  },
  secondaryText: {
    ...textStyles.button,
    fontSize: 15,
    letterSpacing: 1.2,
  },
  outlinedText: {
    ...textStyles.button,
    fontSize: 15,
    letterSpacing: 1.2,
  },
});
