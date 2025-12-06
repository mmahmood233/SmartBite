/**
 * Admin Dashboard Stack Navigator
 * Stack navigation for admin dashboard and related screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Admin Screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import UserManagementScreen from '../screens/admin/UserManagementScreen';

const Stack = createNativeStackNavigator();

const AdminDashboardStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="DashboardHome" 
        component={AdminDashboardScreen}
      />
      <Stack.Screen 
        name="UserManagement" 
        component={UserManagementScreen}
      />
    </Stack.Navigator>
  );
};

export default AdminDashboardStack;
