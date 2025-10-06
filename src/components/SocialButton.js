import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { tokens } from '../theme/theme';

const SocialButton = ({ 
  onPress, 
  icon, 
  label,
  style,
  accessibilityLabel,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style]}
      activeOpacity={0.7}
      accessibilityLabel={accessibilityLabel || `Sign in with ${label}`}
      accessibilityRole="button"
    >
      <Text style={styles.text}>
        {icon} {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: tokens.borderRadius.medium,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    ...tokens.shadows.input,
  },
  text: {
    ...typography.body,
    fontSize: 14,
    color: colors.textPrimary,
  },
});

export default SocialButton;
