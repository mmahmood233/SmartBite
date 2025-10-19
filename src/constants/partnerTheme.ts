/**
 * Wajba Partner Portal - Theme Constants
 * Centralized colors, spacing, and typography for consistency
 * Supports light/dark mode and localization
 */

export const PartnerColors = {
  // Primary Brand Colors
  primary: '#00A896',
  primaryLight: '#00C7B1',
  primaryDark: '#008C7A',
  
  // Secondary Colors
  secondary: '#FFB703',
  secondaryLight: '#FFC933',
  secondaryDark: '#E5A400',
  
  // Accent Colors
  accent: '#FB8500',
  accentLight: '#FF9F33',
  accentDark: '#E07600',
  
  // Status Colors
  success: '#3EB489',
  successLight: '#4ECDC4',
  warning: '#FFB703',
  warningLight: '#FFC933',
  error: '#E53935',
  errorLight: '#FF5252',
  info: '#2196F3',
  
  // Neutral Colors (Light Mode)
  light: {
    background: '#FAFAF9',
    surface: '#FFFFFF',
    surfaceAlt: '#F9FAFA',
    border: '#E6E6E6',
    borderLight: '#F2F2F2',
    divider: '#EAEAEA',
    
    text: {
      primary: '#1A1A1A',
      secondary: '#444',
      tertiary: '#777',
      disabled: '#999',
      placeholder: '#999',
    },
    
    shadow: 'rgba(0, 0, 0, 0.08)',
  },
  
  // Dark Mode Colors (Future Support)
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    surfaceAlt: '#2A2A2A',
    border: '#3A3A3A',
    borderLight: '#2E2E2E',
    divider: '#333333',
    
    text: {
      primary: '#FFFFFF',
      secondary: '#E0E0E0',
      tertiary: '#B0B0B0',
      disabled: '#666666',
      placeholder: '#888888',
    },
    
    shadow: 'rgba(0, 0, 0, 0.4)',
  },
};

export const PartnerSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const PartnerBorderRadius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  xxl: 20,
  round: 999,
};

export const PartnerTypography = {
  // Font Sizes
  fontSize: {
    xs: 11,
    sm: 12,
    md: 13,
    base: 14,
    lg: 15,
    xl: 16,
    xxl: 18,
    xxxl: 20,
    display: 24,
  },
  
  // Font Weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const PartnerShadows = {
  sm: {
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
};

// Component-specific theme tokens
export const PartnerComponents = {
  button: {
    height: {
      sm: 36,
      md: 42,
      lg: 44,
    },
    borderWidth: 1.5,
  },
  
  chip: {
    height: {
      sm: 32,
      md: 36,
      lg: 40,
    },
  },
  
  input: {
    height: 44,
    borderWidth: 1,
  },
  
  card: {
    padding: 12,
    borderRadius: 12,
  },
};

/**
 * Get theme colors based on current mode
 * @param isDark - Whether dark mode is enabled
 */
export const getThemeColors = (isDark: boolean = false) => {
  return isDark ? PartnerColors.dark : PartnerColors.light;
};

export default {
  colors: PartnerColors,
  spacing: PartnerSpacing,
  borderRadius: PartnerBorderRadius,
  typography: PartnerTypography,
  shadows: PartnerShadows,
  components: PartnerComponents,
  getThemeColors,
};
