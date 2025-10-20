/**
 * Snackbar Component
 * Toast-style notifications for success/error/info messages
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../constants';

export type SnackbarType = 'success' | 'error' | 'warning' | 'info';

interface SnackbarProps {
  visible: boolean;
  message: string;
  type?: SnackbarType;
  duration?: number;
  onDismiss?: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onDismiss,
}) => {
  const translateY = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (visible) {
      // Slide in
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();

      // Auto dismiss
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      // Slide out
      Animated.timing(translateY, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleDismiss = () => {
    Animated.timing(translateY, {
      toValue: 100,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onDismiss?.();
    });
  };

  if (!visible) return null;

  const getConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'check-circle',
          color: colors.success,
          bg: '#ECFDF5',
        };
      case 'error':
        return {
          icon: 'x-circle',
          color: colors.error,
          bg: '#FEF2F2',
        };
      case 'warning':
        return {
          icon: 'alert-triangle',
          color: '#F59E0B',
          bg: '#FFFBEB',
        };
      case 'info':
      default:
        return {
          icon: 'info',
          color: colors.primary,
          bg: '#E6F7F4',
        };
    }
  };

  const config = getConfig();

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY }] },
        { backgroundColor: config.bg },
      ]}
    >
      <Icon name={config.icon} size={20} color={config.color} />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80,
    left: SPACING.lg,
    right: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    gap: SPACING.md,
    zIndex: 9999,
  },
  message: {
    flex: 1,
    fontSize: FONT_SIZE.base,
    color: '#0F172A',
    fontWeight: '500',
  },
});

export default Snackbar;
