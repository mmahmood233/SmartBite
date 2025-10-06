export const colors = {
  // Primary Colors
  primary: '#3BC8A4',
  primaryDark: '#009E83',
  
  // Accent (AI)
  accent: '#8E7CFF',
  
  // Backgrounds
  backgroundLight: '#F8F9FB',
  backgroundDark: '#121417',
  
  // Surface (Cards)
  surfaceLight: '#FFFFFF',
  surfaceDark: '#1C1F24',
  
  // Text
  textPrimary: '#1B1B1B',
  textSecondary: '#666E75',
  textLight: '#EAEAEA',
  textMuted: '#9097A2',
  
  // Status
  success: '#4ECB71',
  error: '#E74C3C',
  
  // Dividers
  divider: '#E3E6EA',
  
  // Gradients (for linear gradient)
  gradientStart: '#3BC8A4',
  gradientEnd: '#8E7CFF',
  gradientBannerEnd: '#56E2D7',
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
