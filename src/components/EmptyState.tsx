/**
 * EmptyState Component
 * Reusable empty state with icon, title, message, and action button
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather as Icon } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../constants';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
  buttonText?: string;
  onButtonPress?: () => void;
  emoji?: string; // Optional emoji instead of icon
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  buttonText,
  onButtonPress,
  emoji,
}) => {
  return (
    <View style={styles.container}>
      {/* Icon or Emoji */}
      <View style={styles.iconContainer}>
        {emoji ? (
          <Text style={styles.emoji}>{emoji}</Text>
        ) : icon ? (
          <View style={styles.iconCircle}>
            <Icon name={icon} size={48} color={colors.primary} />
          </View>
        ) : null}
      </View>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Message */}
      <Text style={styles.message}>{message}</Text>

      {/* Action Button */}
      {buttonText && onButtonPress && (
        <TouchableOpacity
          style={styles.button}
          onPress={onButtonPress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.xxxl,
  },
  iconContainer: {
    marginBottom: SPACING.xxl,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E6F7F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
  },
  title: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  message: {
    fontSize: FONT_SIZE.base,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xxxl,
    maxWidth: 300,
  },
  button: {
    alignSelf: 'stretch',
    maxWidth: 280,
  },
  buttonGradient: {
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: FONT_SIZE.base,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default EmptyState;
