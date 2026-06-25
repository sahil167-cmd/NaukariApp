/**
 * WorkerConnect — Contact Card Component
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { fontSize } from '../../theme/typography';

interface ContactCardProps {
  icon: string;
  title: string;
  description: string;
  buttonTitle: string;
  buttonColor: string;
  buttonTextColor: string;
  onPress: () => void;
}

const ContactCard: React.FC<ContactCardProps> = ({
  icon,
  title,
  description,
  buttonTitle,
  buttonColor,
  buttonTextColor,
  onPress,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.cardBackground,
          borderColor: theme.colors.cardBorder,
        },
        shadows.sm,
      ]}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text style={styles.iconText}>{icon}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            {title}
          </Text>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            {description}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: buttonColor }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={[styles.buttonText, { color: buttonTextColor }]}>
          {buttonTitle}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
    gap: spacing[4],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
    gap: spacing[1],
  },
  title: {
    fontSize: fontSize.base,
    fontWeight: '700',
  },
  description: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.4,
  },
  button: {
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default ContactCard;
