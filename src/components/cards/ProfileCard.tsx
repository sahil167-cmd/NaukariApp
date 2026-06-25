/**
 * WorkerConnect — Profile Card Component
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { borderRadius, shadows, spacing } from '../../theme/spacing';
import { fontSize } from '../../theme/typography';
import type { User } from '../../types';

interface ProfileCardProps {
  user: User;
  completionPercent?: number;
  onEditPress?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  completionPercent = 0,
  onEditPress,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.cardBorder },
        shadows.base,
      ]}
    >
      {/* Avatar */}
      <View style={styles.avatarSection}>
        {user.profileImage ? (
          <Image source={{ uri: user.profileImage }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primaryLight }]}>
            <Text style={[styles.avatarInitial, { color: theme.colors.primary }]}>
              {(user.name?.[0] ?? 'W').toUpperCase()}
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={[styles.editAvatarBtn, { backgroundColor: theme.colors.primary }]}
          onPress={onEditPress}
        >
          <Ionicons name="camera" size={14} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Info */}
      <Text style={[styles.name, { color: theme.colors.textPrimary }]}>{user.name}</Text>
      <Text style={[styles.phone, { color: theme.colors.textSecondary }]}>+91 {user.phone}</Text>

      {/* Completion */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>
            Profile Completion
          </Text>
          <Text style={[styles.progressPercent, { color: theme.colors.primary }]}>
            {completionPercent}%
          </Text>
        </View>
        <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: theme.colors.primary, width: `${completionPercent}%` as any },
            ]}
          />
        </View>
      </View>

      {/* Verified badge */}
      {user.isVerified && (
        <View style={[styles.verifiedBadge, { backgroundColor: theme.colors.successBackground }]}>
          <Ionicons name="shield-checkmark" size={14} color={theme.colors.success} />
          <Text style={[styles.verifiedText, { color: theme.colors.success }]}>Verified</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing[5],
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  avatarSection: { position: 'relative', marginBottom: spacing[3] },
  avatar: { width: 88, height: 88, borderRadius: 44 },
  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { fontSize: 36, fontWeight: '700' },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  name: { fontSize: fontSize.xl, fontWeight: '700', marginBottom: spacing[1] },
  phone: { fontSize: fontSize.sm, marginBottom: spacing[4] },
  progressSection: { width: '100%', marginBottom: spacing[3] },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[2],
  },
  progressLabel: { fontSize: fontSize.sm },
  progressPercent: { fontSize: fontSize.sm, fontWeight: '700' },
  progressBar: { height: 8, borderRadius: borderRadius.full, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: borderRadius.full },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  verifiedText: { fontSize: fontSize.sm, fontWeight: '600' },
});

export default ProfileCard;
