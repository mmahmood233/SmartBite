import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

interface ChipProps {
  label: string;
  active?: boolean;
  style?: ViewStyle;
}

const Chip: React.FC<ChipProps> = ({ label, active = false, style }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} style={[styles.base, active ? styles.active : styles.inactive, style]}>
      <Text style={[styles.text, active ? styles.textActive : styles.textInactive]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
  },
  active: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  inactive: {
    backgroundColor: 'transparent',
    borderColor: '#D8E0DD',
  },
  text: {
    fontSize: 14,
    fontWeight: '500', // active default
    letterSpacing: 0.2,
  },
  textActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  textInactive: {
    color: '#555555',
    fontWeight: '400',
  },
});

export default Chip;
