import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { tokens } from '../theme/theme';
import { SocialButtonProps } from '../types';

const SocialButton: React.FC<SocialButtonProps> = ({ 
  onPress, 
  icon, 
  label,
  style,
  accessibilityLabel,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = (): void => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (): void => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.button, style]}
        activeOpacity={0.9}
        accessibilityLabel={accessibilityLabel || `Sign in with ${label}`}
        accessibilityRole="button"
      >
        <Text style={styles.text}>
          {icon} {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
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
