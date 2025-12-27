// @ts-nocheck

import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { colors } from './colors';
import { DesignTokens } from '../types';

/**
 * Wajba Design System - Theme Configuration
 * Brand: Middle Eastern warmth meets intelligent personalization
 * Compatible with React Native Paper MD3
 */

export const WajbaLightTheme = {
  ...MD3LightTheme,
  dark: false,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,              // #14776F - Wajba Teal
    primaryContainer: colors.primaryDark, // #0E5A55
    secondary: colors.accent,             // #8E7CFF - AI Glow
    secondaryContainer: colors.accent,
    surface: colors.surfaceLight,         // #FFFFFF
    surfaceVariant: colors.backgroundLight,
    background: colors.backgroundLight,   // #F8F9FB
    error: colors.error,                  // #E74C3C
    onSurface: colors.textPrimary,        // #1B1B1B
    onSurfaceVariant: colors.textSecondary, // #666E75
    onBackground: colors.textPrimary,
    outline: colors.divider,              // #E3E6EA
    outlineVariant: colors.divider,
  },
  roundness: 12, // Wajba spec: 12px for all components
};

export const WajbaDarkTheme = {
  ...MD3DarkTheme,
  dark: true,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary,              // #14776F - stays same
    primaryContainer: colors.primaryDark,
    secondary: colors.accent,             // #8E7CFF - stays same
    secondaryContainer: colors.accent,
    surface: colors.surfaceDark,          // #1C1F24
    surfaceVariant: colors.backgroundDark,
    background: colors.backgroundDark,    // #0F1113
    error: colors.error,
    onSurface: colors.textLight,          // #EAEAEA
    onSurfaceVariant: colors.textMuted,   // #A0A5B1
    onBackground: colors.textLight,
    outline: colors.divider,
    outlineVariant: colors.divider,
  },
  roundness: 12,
};

// Backward compatibility aliases
export const SmartBiteTheme = WajbaLightTheme;
export const SmartBiteDarkTheme = WajbaDarkTheme;

// Design tokens for consistent spacing, shadows, etc.
export const tokens: DesignTokens = {
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
    // Wajba spec: Card shadow - 0 2px 4px rgba(0,0,0,0.05)
    input: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
    // Wajba spec: Button shadow - 0 4px 8px rgba(0,0,0,0.1)
    button: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    buttonPressed: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    },
    // Wajba spec: Logo glow - teal halo blur 24px
    logo: {
      shadowColor: colors.primary, // #14776F
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 24, // 24px blur
      elevation: 6,
    },
    // Wajba spec: Card shadow
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
  },
  animation: {
    timing: {
      fast: 150,      // Input focus fade (Wajba spec: 150ms)
      normal: 300,    // Page fade-in (Wajba spec: 300ms)
      slow: 600,
      verySlow: 2500, // Logo glow pulse (Wajba spec: 2.5s loop)
    },
    spring: {
      default: {
        friction: 8,
        tension: 40,
      },
      // Wajba spec: Button press scale(0.97-1.0)
      bouncy: {
        friction: 3,
        tension: 40,
      },
    },
  },
};

/**
 * Wajba UI Tokens
 * Additional design tokens for consistent UI
 */
export const ui = {
  radius: {
    card: 12,    // Wajba spec
    button: 12,  // Wajba spec
    input: 12,   // Wajba spec
  },
  shadow: {
    small: {
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    medium: {
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
    },
  },
};
