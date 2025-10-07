import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface BottomNavProps {
  active?: 'Home' | 'Chat' | 'Orders' | 'Profile';
}

const getIconName = (label: string): string => {
  const icons = {
    Home: 'home',
    Chat: 'message-circle',
    Orders: 'shopping-bag',
    Profile: 'user',
  };
  return icons[label as keyof typeof icons] || 'home';
};

const BottomNav: React.FC<BottomNavProps> = ({ active = 'Home' }) => {
  const navigation = useNavigation<NavigationProp>();

  const handleTabPress = (label: string) => {
    if (label === 'Home') {
      navigation.navigate('MainTabs');
    } else if (label === 'Orders') {
      navigation.navigate('MainTabs');
    }
    // Chat and Profile screens can be added later
  };

  const Tab = ({ label, isActive }: { label: string; isActive: boolean }) => (
    <TouchableOpacity 
      activeOpacity={0.8} 
      style={styles.tab}
      onPress={() => handleTabPress(label)}
    >
      <View style={[styles.pill, isActive && styles.pillActive]}>
        <Icon 
          name={getIconName(label)} 
          size={isActive ? 25 : 24} 
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
