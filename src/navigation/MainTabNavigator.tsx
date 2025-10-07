import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../theme/colors';
import HomeScreen from '../screens/HomeScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#555555',
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Icon name="home" size={focused ? 25 : 24} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersScreen}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Icon name="shopping-bag" size={focused ? 25 : 24} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Icon name="user" size={focused ? 25 : 24} color={color} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};


const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
    paddingBottom: 10,
    paddingTop: 10,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  iconContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  iconContainerActive: {
    backgroundColor: '#E6F3F1',
  },
});

export default MainTabNavigator;
