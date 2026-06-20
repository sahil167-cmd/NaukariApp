/**
 * WorkerConnect — Loader, ErrorScreen, EmptyScreen Components
 */

import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { spacing } from "../../theme/spacing";
import { fontSize } from "../../theme/typography";
import PrimaryButton from "./PrimaryButton";

// ── Loader ────────────────────────────────────────────────────────────────────

interface LoaderProps {
  message?: string;
  size?: "small" | "large";
}

export const Loader: React.FC<LoaderProps> = ({ message, size = "large" }) => {
  const { theme } = useTheme();
  return (
    <View
      style={[styles.centered, { backgroundColor: theme.colors.background }]}
    >
      <ActivityIndicator size={size} color={theme.colors.primary} />
      {message && (
        <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
          {message}
        </Text>
      )}
    </View>
  );
};

// ── ErrorScreen ───────────────────────────────────────────────────────────────

interface ErrorScreenProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
}) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.centered,
        { backgroundColor: theme.colors.background, padding: spacing[6] },
      ]}
    >
      <Ionicons
        name="alert-circle-outline"
        size={64}
        color={theme.colors.error}
      />
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        {title}
      </Text>
      <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
        {message}
      </Text>
      {onRetry && (
        <PrimaryButton
          title="Try Again"
          onPress={onRetry}
          style={{ marginTop: spacing[5], width: 200 }}
        />
      )}
    </View>
  );
};

// ── EmptyScreen ───────────────────────────────────────────────────────────────

interface EmptyScreenProps {
  title?: string;
  message?: string;
  iconName?: string;
  action?: { label: string; onPress: () => void };
}

export const EmptyScreen: React.FC<EmptyScreenProps> = ({
  title = "Nothing here yet",
  message = "There is nothing to show right now.",
  iconName = "folder-open-outline",
  action,
}) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.centered,
        { backgroundColor: theme.colors.background, padding: spacing[6] },
      ]}
    >
      <Ionicons
        name={iconName as any}
        size={64}
        color={theme.colors.textMuted}
      />
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        {title}
      </Text>
      <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
        {message}
      </Text>
      {action && (
        <PrimaryButton
          title={action.label}
          onPress={action.onPress}
          style={{ marginTop: spacing[5], width: 200 }}
        />
      )}
    </View>
  );
};

// ── Offline Screen ─────────────────────────────────────────────────────────────

interface OfflineScreenProps {
  onRetry?: () => void;
}

export const OfflineScreen: React.FC<OfflineScreenProps> = ({ onRetry }) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.centered,
        { backgroundColor: theme.colors.background, padding: spacing[6] },
      ]}
    >
      <Ionicons name="wifi-outline" size={64} color={theme.colors.textMuted} />
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        No Internet Connection
      </Text>
      <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
        Please check your connection and try again.
      </Text>
      {onRetry && (
        <PrimaryButton
          title="Retry"
          onPress={onRetry}
          style={{ marginTop: spacing[5], width: 200 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    marginTop: spacing[4],
    textAlign: "center",
  },
  message: {
    fontSize: fontSize.base,
    marginTop: spacing[2],
    textAlign: "center",
    lineHeight: fontSize.base * 1.5,
  },
});
