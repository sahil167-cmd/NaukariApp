/**
 * WorkerConnect — Snackbar Component
 * Bottom toast notification with success/error/info variants.
 */

import React, { useEffect } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { borderRadius, shadows, spacing } from '../../theme/spacing';
import { fontSize } from '../../theme/typography';

type SnackbarType = 'success' | 'error' | 'info' | 'warning';

interface SnackbarProps {
  visible: boolean;
  message: string;
  type?: SnackbarType;
  duration?: number;
  onDismiss: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

const ICON_MAP: Record<SnackbarType, string> = {
  success: 'checkmark-circle',
  error: 'alert-circle',
  info: 'information-circle',
  warning: 'warning',
};

const Snackbar: React.FC<SnackbarProps> = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onDismiss,
  actionLabel,
  onAction,
}) => {
  const { theme } = useTheme();
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 20 });
      opacity.value = withTiming(1, { duration: 200 });
      const timer = setTimeout(() => {
        translateY.value = withTiming(100, { duration: 200 });
        opacity.value = withTiming(0, { duration: 200 }, () => {
          runOnJS(onDismiss)();
        });
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const bgColors: Record<SnackbarType, string> = {
    success: theme.colors.success,
    error: theme.colors.error,
    info: theme.colors.info,
    warning: theme.colors.warning,
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: bgColors[type] },
        animStyle,
        shadows.lg,
      ]}
    >
      <Ionicons name={ICON_MAP[type] as any} size={20} color="#FFF" style={styles.icon} />
      <Text style={styles.message} numberOfLines={2}>{message}</Text>
      {actionLabel && onAction && (
        <Pressable onPress={onAction} style={styles.action}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    left: spacing[4],
    right: spacing[4],
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    zIndex: 9999,
  },
  icon: { marginRight: spacing[2] },
  message: {
    flex: 1,
    color: '#FFF',
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  action: { marginLeft: spacing[3] },
  actionText: {
    color: '#FFF',
    fontSize: fontSize.sm,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});

export default Snackbar;
