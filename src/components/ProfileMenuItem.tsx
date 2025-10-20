/**
 * Reusable Profile Menu Item Component
 * Used in both User and Partner profile screens
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';

interface ProfileMenuItemProps {
  icon: keyof typeof Icon.glyphMap;
  label: string;
  onPress: () => void;
  color?: string;
  showChevron?: boolean;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  icon,
  label,
  onPress,
  color = '#00A896',
  showChevron = true,
}) => {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuLeft}>
        <Icon name={icon} size={20} color={color} />
        <Text style={styles.menuText}>{label}</Text>
      </View>
      {showChevron && <Icon name="chevron-right" size={20} color="#CCC" />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
  },
});

export default ProfileMenuItem;
