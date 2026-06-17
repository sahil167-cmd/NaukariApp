/**
 * WorkerConnect — Registration Progress Indicator
 * Horizontal step dots with connecting line.
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../contexts/ThemeContext";
import { borderRadius, spacing } from "../../theme/spacing";
import { fontSize } from "../../theme/typography";
import { TOTAL_REGISTRATION_STEPS } from "../../constants";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps = TOTAL_REGISTRATION_STEPS,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const stepLabels = [
    t("registration.steps.1", "Personal"),
    t("registration.steps.2", "Address"),
    t("registration.steps.3", "Job"),
    t("registration.steps.4", "Education"),
    t("registration.steps.5", "Experience"),
    t("registration.steps.7", "Review"),
  ];

  return (
    <View style={styles.wrapper}>
      {/* Step bar */}
      <View style={styles.barContainer}>
        {/* Background track */}
        <View
          style={[styles.track, { backgroundColor: theme.colors.border }]}
        />
        {/* Progress fill */}
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: theme.colors.primary,
              width: `${progress}%`,
            },
          ]}
        />
        {/* Step dots */}
        <View style={styles.dotsRow}>
          {Array.from({ length: totalSteps }).map((_, i) => {
            const stepNum = i + 1;
            const isDone = stepNum < currentStep;
            const isActive = stepNum === currentStep;
            return (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      isDone || isActive
                        ? theme.colors.primary
                        : theme.colors.border,
                    borderColor: isActive
                      ? theme.colors.primary
                      : "transparent",
                    width: isActive ? 28 : 22,
                    height: isActive ? 28 : 22,
                    borderRadius: isActive ? 14 : 11,
                  },
                ]}
              >
                {isDone ? (
                  <Ionicons name="checkmark" size={12} color="#FFF" />
                ) : (
                  <Text
                    style={[
                      styles.dotText,
                      { color: isActive ? "#FFF" : theme.colors.textMuted },
                    ]}
                  >
                    {stepNum}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Current step label */}
      <View style={styles.labelRow}>
        <Text style={[styles.stepLabel, { color: theme.colors.textSecondary }]}>
          {t("registration.step", { current: currentStep, total: totalSteps })}
        </Text>
        <Text style={[styles.stepName, { color: theme.colors.primary }]}>
          {stepLabels[currentStep - 1]}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing[2],
    marginBottom: spacing[5],
  },
  barContainer: {
    position: "relative",
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing[2],
  },
  track: {
    position: "absolute",
    left: 11,
    right: 11,
    height: 3,
    borderRadius: borderRadius.full,
  },
  fill: {
    position: "absolute",
    left: 11,
    height: 3,
    borderRadius: borderRadius.full,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  dot: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  dotText: {
    fontSize: fontSize.xs,
    fontWeight: "700",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepLabel: { fontSize: fontSize.xs },
  stepName: { fontSize: fontSize.sm, fontWeight: "600" },
});

export default ProgressIndicator;
