import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather as Icon } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLanguage } from '../contexts/LanguageContext';
import RiderHomeScreen from '../screens/rider/RiderHomeScreen';
import RiderHistoryScreen from '../screens/rider/RiderHistoryScreen';
import RiderEarningsScreen from '../screens/rider/RiderEarningsScreen';

const Tab = createBottomTabNavigator();

const RiderTabNavigator: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="RiderHome"
        component={RiderHomeScreen}
        options={{
          tabBarLabel: t('rider.orders'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="list" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="RiderHistory"
        component={RiderHistoryScreen}
        options={{
          tabBarLabel: t('rider.history'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="clock" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="RiderEarnings"
        component={RiderEarningsScreen}
        options={{
          tabBarLabel: t('rider.earnings'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="dollar-sign" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default RiderTabNavigator;
