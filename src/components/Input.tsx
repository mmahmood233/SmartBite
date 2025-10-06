import React, { useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { colors } from '../theme/colors';
import { tokens } from '../theme/theme';
import { InputProps } from '../types';

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  style,
  error = false,
  errorText,
  right,
  ...props
}) => {
  const borderColorAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleFocus = (): void => {
    Animated.parallel([
      Animated.timing(borderColorAnim, {
        toValue: 1,
        duration: 150, // Exactly 150ms for crisp feel
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.01,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleBlur = (): void => {
    Animated.parallel([
      Animated.timing(borderColorAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animatedBorderColor = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [error ? colors.error : colors.divider, error ? colors.error : colors.primary],
  });

  return (
    <Animated.View 
      style={[
        styles.container, 
        style,
        { transform: [{ scale: scaleAnim }] }
      ]}
    >
      <TextInput
        mode="outlined"
        label={label}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        error={error}
        style={styles.input}
        outlineColor={error ? colors.error : colors.divider}
        activeOutlineColor={error ? colors.error : colors.primary}
        right={right}
        theme={{
          colors: {
            text: colors.textPrimary,
            placeholder: colors.textSecondary,
            error: colors.error,
          },
          roundness: tokens.borderRadius.medium,
        }}
        {...props}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: tokens.spacing.lg,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    ...tokens.shadows.input,
  },
});

export default Input;
