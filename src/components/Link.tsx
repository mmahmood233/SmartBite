import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { LinkProps } from '../types';

const Link: React.FC<LinkProps> = ({ 
  onPress, 
  children, 
  style,
  textStyle,
  accessibilityLabel,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, style]}
      activeOpacity={0.7}
      accessibilityLabel={accessibilityLabel || children}
      accessibilityRole="link"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  text: {
    ...typography.body,
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
});

export default Link;
