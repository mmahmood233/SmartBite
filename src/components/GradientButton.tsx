import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { tokens } from '../theme/theme';
import { GradientButtonProps } from '../types';

const GradientButton: React.FC<GradientButtonProps> = ({ 
  onPress, 
  title, 
  disabled = false,
  loading = false,
  style,
  textStyle,
  gradientColors = [colors.primary, colors.gradientBannerEnd],
  accessibilityLabel,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = (): void => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      ...tokens.animation.spring.bouncy,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (): void => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      ...tokens.animation.spring.default,
      useNativeDriver: true,
    }).start();
  };

  const disabledColors: [string, string] = ['#CBD5DE', '#CBD5DE'];

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
        style={[
          styles.container,
          disabled && styles.containerDisabled,
          style,
        ]}
        accessibilityLabel={accessibilityLabel || title}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading }}
      >
        <LinearGradient
          colors={disabled ? disabledColors : gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <Text 
            style={[
              styles.text, 
              disabled && styles.textDisabled,
              textStyle,
            ]}
          >
            {loading ? 'Loading...' : title}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: tokens.borderRadius.medium,
    overflow: 'hidden',
    ...tokens.shadows.button,
  },
  containerDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  gradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  textDisabled: {
    color: '#8B93A0',
  },
});

export default GradientButton;
