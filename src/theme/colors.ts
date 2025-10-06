import { ColorPalette } from '../types';

/**
 * Wajba Design System - Color Palette
 * Brand: Middle Eastern warmth meets intelligent personalization
 * Keywords: authentic • smart • local • appetizing • trustworthy
 */

export const colors: ColorPalette = {
  // Primary Colors (Wajba Teal)
  primary: '#14776F',           // Brand logo, buttons, icons
  primaryDark: '#0E5A55',       // Hover states, dark accents
  
  // Accent Colors
  accent: '#8E7CFF',            // AI features, glows
  
  // Backgrounds
  backgroundLight: '#F8F9FB',   // App background (light mode)
  backgroundDark: '#0F1113',    // App background (dark mode)
  
  // Surface (Cards)
  surfaceLight: '#FFFFFF',      // Cards, inputs (light mode)
  surfaceDark: '#1C1F24',       // Cards, inputs (dark mode)
  
  // Text
  textPrimary: '#1B1B1B',       // Headlines, main text (light)
  textSecondary: '#666E75',     // Subtext, helper text
  textLight: '#EAEAEA',         // Text (dark mode)
  textMuted: '#A0A5B1',         // Disabled, placeholders (dark mode)
  
  // Status
  success: '#4ECB71',           // Success, confirmations
  error: '#E74C3C',             // Validation, error states
  
  // Dividers & Disabled
  divider: '#E3E6EA',           // Borders, separators
  
  // Gradients (for linear gradient)
  gradientStart: '#14776F',     // Primary gradient start (Wajba Teal)
  gradientEnd: '#3BC8A4',       // Primary gradient end (Mint Accent)
  gradientBannerEnd: '#3BC8A4', // Button gradient end
};

export const lightTheme = {
  dark: false,
  colors: {
    primary: colors.primary,
    accent: colors.accent,
    background: colors.backgroundLight,
    surface: colors.surfaceLight,
    text: colors.textPrimary,
    error: colors.error,
    onSurface: colors.textPrimary,
    disabled: colors.textMuted,
    placeholder: colors.textSecondary,
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: colors.success,
  },
};

export const darkTheme = {
  dark: true,
  colors: {
    primary: colors.primary,
    accent: colors.accent,
    background: colors.backgroundDark,
    surface: colors.surfaceDark,
    text: colors.textLight,
    error: colors.error,
    onSurface: colors.textLight,
    disabled: colors.textMuted,
    placeholder: colors.textSecondary,
    backdrop: 'rgba(0, 0, 0, 0.7)',
    notification: colors.success,
  },
};
