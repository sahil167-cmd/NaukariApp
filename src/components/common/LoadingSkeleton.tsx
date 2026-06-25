/**
 * WorkerConnect — LoadingSkeleton (Shimmer Effect)
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { borderRadius, spacing } from '../../theme/spacing';

interface SkeletonBoxProps {
  width?: number | string;
  height?: number;
  borderRadiusValue?: number;
  style?: ViewStyle;
}

export const SkeletonBox: React.FC<SkeletonBoxProps> = ({
  width = '100%',
  height = 16,
  borderRadiusValue = borderRadius.sm,
  style,
}) => {
  const { theme } = useTheme();
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      shimmer.value,
      [0, 1],
      [theme.colors.shimmerBase, theme.colors.shimmerHighlight]
    ),
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius: borderRadiusValue,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

// ── Job Card Skeleton ─────────────────────────────────────────────────────────

export const JobCardSkeleton: React.FC = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }]}>
      <View style={styles.cardHeader}>
        <SkeletonBox width={44} height={44} borderRadiusValue={borderRadius.base} />
        <View style={styles.cardHeaderText}>
          <SkeletonBox width="60%" height={14} />
          <SkeletonBox width="40%" height={12} style={{ marginTop: 6 }} />
        </View>
      </View>
      <SkeletonBox width="80%" height={12} style={{ marginTop: 12 }} />
      <SkeletonBox width="50%" height={12} style={{ marginTop: 8 }} />
      <View style={styles.cardFooter}>
        <SkeletonBox width={80} height={30} borderRadiusValue={borderRadius.full} />
        <SkeletonBox width={100} height={30} borderRadiusValue={borderRadius.full} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing[4],
    marginBottom: spacing[3],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  cardHeaderText: {
    flex: 1,
    gap: spacing[1],
  },
  cardFooter: {
    flexDirection: 'row',
    gap: spacing[2],
    marginTop: spacing[3],
  },
});
