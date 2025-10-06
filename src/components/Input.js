import React, { useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { colors } from '../theme/colors';
import { tokens } from '../theme/theme';

const Input = ({
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
  const [isFocused, setIsFocused] = useState(false);
  const borderColorAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(borderColorAnim, {
      toValue: 1,
      duration: tokens.animation.timing.fast,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(borderColorAnim, {
      toValue: 0,
      duration: tokens.animation.timing.fast,
      useNativeDriver: false,
    }).start();
  };

  const animatedBorderColor = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.divider, colors.primary],
  });

  return (
    <Animated.View style={[styles.container, style]}>
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
