import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { colors } from './colors';

export const SmartBiteTheme = {
  ...MD3LightTheme,
  dark: false,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    primaryContainer: colors.primaryDark,
    secondary: colors.accent,
    secondaryContainer: colors.accent,
    surface: colors.surfaceLight,
    surfaceVariant: colors.backgroundLight,
    background: colors.backgroundLight,
    error: colors.error,
    onSurface: colors.textPrimary,
    onSurfaceVariant: colors.textSecondary,
    onBackground: colors.textPrimary,
    outline: colors.divider,
    outlineVariant: colors.divider,
    success: colors.success,
  },
  roundness: 12,
};

export const SmartBiteDarkTheme = {
  ...MD3DarkTheme,
  dark: true,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary,
    primaryContainer: colors.primaryDark,
    secondary: colors.accent,
    secondaryContainer: colors.accent,
    surface: colors.surfaceDark,
    surfaceVariant: colors.backgroundDark,
    background: colors.backgroundDark,
    error: colors.error,
    onSurface: colors.textLight,
    onSurfaceVariant: colors.textSecondary,
    onBackground: colors.textLight,
    outline: colors.divider,
    outlineVariant: colors.divider,
    success: colors.success,
  },
  roundness: 12,
};

// Design tokens for consistent spacing, shadows, etc.
export const tokens = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 40,
    huge: 60,
  },
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    round: 40,
    pill: 24,
  },
  shadows: {
    input: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    button: {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    buttonPressed: {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    },
    logo: {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 6,
    },
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
  },
  animation: {
    timing: {
      fast: 150,
      normal: 300,
      slow: 600,
      verySlow: 800,
    },
    spring: {
      default: {
        friction: 8,
        tension: 40,
      },
      bouncy: {
        friction: 3,
        tension: 40,
      },
    },
  },
};
