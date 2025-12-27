/**
 * Wajba Partner - Reusable Button Component
 * Supports multiple variants, sizes, and states
 */
// @ts-nocheck

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather as Icon } from '@expo/vector-icons';
import { PartnerColors, PartnerTypography, PartnerBorderRadius } from '../../constants/partnerTheme';

interface PartnerButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

const PartnerButton: React.FC<PartnerButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  fullWidth = false,
  loading = false,
  style,
}) => {
  const getButtonHeight = () => {
    switch (size) {
      case 'sm': return 36;
      case 'lg': return 44;
      default: return 42;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm': return PartnerTypography.fontSize.md;
      case 'lg': return PartnerTypography.fontSize.lg;
      default: return PartnerTypography.fontSize.lg;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 16;
      case 'lg': return 20;
      default: return 18;
    }
  };

  const renderContent = () => {
    const iconSize = getIconSize();
    const iconColor = variant === 'outline' || variant === 'ghost' 
      ? PartnerColors.primary 
      : '#FFFFFF';

    return (
      <>
        {icon && iconPosition === 'left' && (
          <Icon name={icon} size={iconSize} color={iconColor} style={{ marginRight: 6 }} />
        )}
        <Text style={[
          styles.buttonText,
          { fontSize: getFontSize() },
          variant === 'outline' && styles.outlineText,
          variant === 'ghost' && styles.ghostText,
          variant === 'danger' && styles.dangerText,
          disabled && styles.disabledText,
        ]}>
          {loading ? 'Loading...' : title}
        </Text>
        {icon && iconPosition === 'right' && (
          <Icon name={icon} size={iconSize} color={iconColor} style={{ marginLeft: 6 }} />
        )}
      </>
    );
  };

  const buttonStyle: ViewStyle = {
    height: getButtonHeight(),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: PartnerBorderRadius.lg,
    paddingHorizontal: size === 'sm' ? 12 : 20,
    ...(fullWidth && { flex: 1 }),
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.9}
        style={[{ borderRadius: PartnerBorderRadius.lg, overflow: 'hidden' }, style]}
      >
        <LinearGradient
          colors={disabled ? ['#CCC', '#AAA'] : [PartnerColors.primary, PartnerColors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={buttonStyle}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.9}
        style={[{ borderRadius: PartnerBorderRadius.lg, overflow: 'hidden' }, style]}
      >
        <LinearGradient
          colors={disabled ? ['#CCC', '#AAA'] : [PartnerColors.secondary, PartnerColors.secondaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={buttonStyle}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        buttonStyle,
        variant === 'outline' && styles.outlineButton,
        variant === 'ghost' && styles.ghostButton,
        variant === 'danger' && styles.dangerButton,
        disabled && styles.disabledButton,
        style,
      ]}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    fontWeight: PartnerTypography.fontWeight.bold,
    color: '#FFFFFF',
  },
  outlineButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: PartnerColors.primary,
  },
  outlineText: {
    color: PartnerColors.primary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: PartnerColors.primary,
  },
  dangerButton: {
    backgroundColor: PartnerColors.error,
  },
  dangerText: {
    color: '#FFFFFF',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
    borderColor: '#CCC',
  },
  disabledText: {
    color: '#999',
  },
});

export default PartnerButton;
