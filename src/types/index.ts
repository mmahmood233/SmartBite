import { TextStyle, ViewStyle } from 'react-native';
import { TextInputProps } from 'react-native-paper';

// ==================== Navigation Types ====================
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  MainTabs: undefined;
  Home: undefined;
  AIChat: undefined;
  AllRestaurants: undefined;
  Login: undefined;
  Signup: undefined;
  RestaurantDetail: {
    restaurantId: string;
    restaurantName: string;
  };
  Cart: undefined;
  Checkout: undefined;
  OrderConfirmation: undefined;
  OrderTracking: {
    orderNumber: string;
  };
  DeliveryComplete: undefined;
  ReviewConfirmation: undefined;
  Orders: undefined;
  OrderDetails: {
    orderId: string;
    isActive: boolean;
  };
  EditProfile: undefined;
  Favorites: undefined;
  SavedAddresses: undefined;
  AddAddress: undefined;
  EditAddress: {
    addressId: string;
  };
  PaymentMethods: undefined;
  AddPaymentMethod: undefined;
  Offers: undefined;
  HelpSupport: undefined;
  ChangePassword: undefined;
  PartnerPortal: undefined;
  PartnerOrderDetails: {
    orderId: string;
  };
  AdminPortal: undefined;
  AddPromotion: {
    promotion?: {
      id: string;
      title: string;
      description: string;
      type: 'percentage' | 'fixed' | 'free_delivery';
      discountValue: string;
      minOrderAmount: string;
      validFrom: string;
      validUntil: string;
      maxUsage: string;
      isActive: boolean;
    };
  };
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

// ==================== Component Props ====================

export interface GradientButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradientColors?: [string, string];
  accessibilityLabel?: string;
}

export interface InputProps extends Omit<TextInputProps, 'theme'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: boolean;
  errorText?: string;
  style?: ViewStyle;
}

export interface LinkProps {
  onPress: () => void;
  children: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

export interface AnimatedLogoProps {
  emoji?: string;
  size?: number;
}

export interface SocialButtonProps {
  onPress: () => void;
  icon: string;
  label: string;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

// ==================== Theme Types ====================

export interface ColorPalette {
  primary: string;
  primaryDark: string;
  accent: string;
  backgroundLight: string;
  backgroundDark: string;
  surfaceLight: string;
  surfaceDark: string;
  textPrimary: string;
  textSecondary: string;
  textLight: string;
  textMuted: string;
  success: string;
  error: string;
  divider: string;
  gradientStart: string;
  gradientEnd: string;
  gradientBannerEnd: string;
}

export interface Typography {
  headline: TextStyle;
  subheader: TextStyle;
  body: TextStyle;
  caption: TextStyle;
  button: TextStyle;
}

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
  huge: number;
}

export interface BorderRadius {
  small: number;
  medium: number;
  large: number;
  round: number;
  pill: number;
}

export interface Shadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface Shadows {
  input: Shadow;
  button: Shadow;
  buttonPressed: Shadow;
  logo: Shadow;
  card: Shadow;
}

export interface AnimationTiming {
  fast: number;
  normal: number;
  slow: number;
  verySlow: number;
}

export interface SpringConfig {
  friction: number;
  tension: number;
}

export interface AnimationConfig {
  timing: AnimationTiming;
  spring: {
    default: SpringConfig;
    bouncy: SpringConfig;
  };
}

export interface DesignTokens {
  spacing: Spacing;
  borderRadius: BorderRadius;
  shadows: Shadows;
  animation: AnimationConfig;
}
