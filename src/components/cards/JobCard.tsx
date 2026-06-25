/**
 * WorkerConnect — Job Card Component
 * Matches the card style in the Dashboard screen.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { borderRadius, shadows, spacing } from '../../theme/spacing';
import { fontSize } from '../../theme/typography';
import type { Job } from '../../types';

interface JobCardProps {
  job: Job;
  onPress: (job: Job) => void;
  onApply?: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onPress, onApply }) => {
  const { theme } = useTheme();

  const timeAgo = (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.cardBackground,
          borderColor: theme.colors.cardBorder,
        },
        shadows.sm,
      ]}
      onPress={() => onPress(job)}
      accessibilityRole="button"
      accessibilityLabel={`${job.title} at ${job.company}`}
    >
      {/* Urgent badge */}
      {job.urgentHiring && (
        <View style={[styles.urgentBadge, { backgroundColor: theme.colors.error }]}>
          <Text style={styles.urgentText}>URGENT</Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.logoPlaceholder, { backgroundColor: theme.colors.primaryLight }]}>
          <Ionicons name="briefcase" size={22} color={theme.colors.primary} />
        </View>
        <View style={styles.headerText}>
          <Text
            style={[styles.title, { color: theme.colors.textPrimary }]}
            numberOfLines={2}
          >
            {job.title}
          </Text>
          <Text style={[styles.company, { color: theme.colors.textSecondary }]} numberOfLines={1}>
            {job.company}
          </Text>
        </View>
      </View>

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={13} color={theme.colors.textMuted} />
          <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
            {job.location}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="cash-outline" size={13} color={theme.colors.textMuted} />
          <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
            {job.salary}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text style={[styles.badgeText, { color: theme.colors.textSecondary }]}>
              {job.type}
            </Text>
          </View>
          {job.isVerified && (
            <View style={[styles.badge, { backgroundColor: theme.colors.successBackground }]}>
              <Ionicons name="shield-checkmark" size={11} color={theme.colors.success} />
              <Text style={[styles.badgeText, { color: theme.colors.success }]}>Verified</Text>
            </View>
          )}
        </View>
        <View style={styles.footerRight}>
          <Text style={[styles.time, { color: theme.colors.textMuted }]}>
            {timeAgo(job.postedAt)}
          </Text>
          {onApply && (
            <TouchableOpacity
              style={[styles.applyBtn, { backgroundColor: theme.colors.primary }]}
              onPress={() => onApply(job)}
              accessibilityRole="button"
              accessibilityLabel={`Apply for ${job.title}`}
            >
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing[4],
    marginBottom: spacing[3],
    position: 'relative',
    overflow: 'hidden',
  },
  urgentBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: spacing[3],
    paddingVertical: 4,
    borderBottomLeftRadius: borderRadius.base,
  },
  urgentText: {
    color: '#FFF',
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  logoPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1 },
  title: {
    fontSize: fontSize.base,
    fontWeight: '700',
    lineHeight: 20,
  },
  company: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  details: { gap: 4, marginBottom: spacing[3] },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: { fontSize: fontSize.sm },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badges: { flexDirection: 'row', gap: spacing[2], flexWrap: 'wrap' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: spacing[2],
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  badgeText: { fontSize: fontSize.xs, fontWeight: '500' },
  footerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
  time: { fontSize: fontSize.xs },
  applyBtn: {
    paddingHorizontal: spacing[3],
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  applyText: {
    color: '#FFF',
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
});

export default JobCard;
