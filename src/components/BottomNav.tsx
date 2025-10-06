import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';

interface BottomNavProps {
  active?: 'Home' | 'Chat' | 'Orders' | 'Profile';
}

const getIconName = (label: string, isActive: boolean): string => {
  const icons = {
    Home: isActive ? 'home' : 'home-outline',
    Chat: isActive ? 'chatbubble' : 'chatbubble-outline',
    Orders: isActive ? 'bag-handle' : 'bag-handle-outline',
    Profile: isActive ? 'person' : 'person-outline',
  };
  return icons[label as keyof typeof icons] || 'home-outline';
};

const BottomNav: React.FC<BottomNavProps> = ({ active = 'Home' }) => {
  const Tab = ({ label, isActive }: { label: string; isActive: boolean }) => (
    <TouchableOpacity activeOpacity={0.8} style={styles.tab}>
      <View style={[styles.pill, isActive && styles.pillActive]}>
        <Icon 
          name={getIconName(label, isActive)} 
          size={24} 
          color={isActive ? colors.primary : '#555555'}
          style={styles.icon}
        />
        <Text style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Tab label="Home" isActive={active === 'Home'} />
      <Tab label="Chat" isActive={active === 'Chat'} />
      <Tab label="Orders" isActive={active === 'Orders'} />
      <Tab label="Profile" isActive={active === 'Profile'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  pill: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  pillActive: {
    backgroundColor: '#E6F3F1',
  },
  icon: {
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
  labelActive: { color: colors.primary },
  labelInactive: { color: '#555555' },
});

export default BottomNav;
