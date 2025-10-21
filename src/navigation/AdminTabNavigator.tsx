/**
 * Admin Portal Tab Navigator
 * Bottom tab navigation for admin dashboard
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather as Icon } from '@expo/vector-icons';
import { Platform } from 'react-native';

// Admin Screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import RestaurantsManagementScreen from '../screens/admin/RestaurantsManagementScreen';
import CategoriesManagementScreen from '../screens/admin/CategoriesManagementScreen';
import PromotionsManagementScreen from '../screens/admin/PromotionsManagementScreen';
import AdminSettingsScreen from '../screens/admin/AdminSettingsScreen';

// Theme
import { PartnerColors } from '../constants/partnerTheme';

const Tab = createBottomTabNavigator();

const AdminTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: PartnerColors.primary,
        tabBarInactiveTintColor: PartnerColors.light.text.tertiary,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: PartnerColors.light.borderLight,
          height: Platform.OS === 'ios' ? 88 : 65,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
            },
            android: {
              elevation: 8,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={AdminDashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Restaurants"
        component={RestaurantsManagementScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="shopping-bag" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesManagementScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Promotions"
        component={PromotionsManagementScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="tag" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={AdminSettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminTabNavigator;
