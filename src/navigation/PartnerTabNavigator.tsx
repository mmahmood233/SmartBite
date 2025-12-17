/**
 * Wajba Partner Tab Navigator
 * Bottom navigation for restaurant partner portal
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import OverviewDashboard from '../screens/partner/OverviewDashboard';
import LiveOrdersScreen from '../screens/partner/LiveOrdersScreen';
import MenuManagementScreen from '../screens/partner/MenuManagementScreen';
import PartnerMoreScreen from '../screens/partner/PartnerMoreScreen';

const Tab = createBottomTabNavigator();

const PartnerTabNavigator: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#00A896',
        tabBarInactiveTintColor: '#A1A1A1',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: 'rgba(0, 0, 0, 0.06)',
          paddingTop: 16,
          paddingBottom: Platform.OS === 'ios' ? 32 : 16,
          height: Platform.OS === 'ios' ? 88 : 72,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -2 },
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="LiveOrders"
        component={LiveOrdersScreen}
        options={{
          tabBarLabel: t('partner.orders'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="file-text" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Overview"
        component={OverviewDashboard}
        options={{
          tabBarLabel: t('partner.overview'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="bar-chart-2" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuManagementScreen}
        options={{
          tabBarLabel: t('partner.menu'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="book-open" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={PartnerMoreScreen}
        options={{
          tabBarLabel: t('partner.profile'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default PartnerTabNavigator;
