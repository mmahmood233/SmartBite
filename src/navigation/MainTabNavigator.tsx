import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import HomeScreen from '../screens/user/restaurant/HomeScreen';
import AIChatScreen from '../screens/user/profile/AIChatScreen';
import CartScreen from '../screens/user/cart/CartScreen';
import OrdersScreen from '../screens/user/orders/OrdersScreen';
import ProfileScreen from '../screens/user/profile/ProfileScreen';
import { colors } from '../theme/colors';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';

const Tab = createBottomTabNavigator();

const MainTabNavigator: React.FC = () => {
  const { itemCount } = useCart();
  const { t } = useLanguage();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#00A58E',
        tabBarInactiveTintColor: '#9C9C9C',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: t('navigation.home'),
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                <Icon name="home" size={24} color={color} style={{ opacity: focused ? 1 : 0.8 }} />
              </View>
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="AIChatTab"
        component={AIChatScreen}
        options={{
          tabBarLabel: t('navigation.aiChat'),
          tabBarIcon: ({ focused }) => (
            <View style={[styles.aiIconWrapper, focused && styles.aiIconWrapperActive]}>
              {focused ? (
                <LinearGradient
                  colors={[colors.gradientStart, colors.gradientEnd]}
                  style={styles.aiIconGradient}
                >
                  <Icon name="message-circle" size={28} color="#FFFFFF" />
                </LinearGradient>
              ) : (
                <View style={styles.aiIconInactive}>
                  <Icon name="message-circle" size={28} color={colors.primary} />
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          tabBarLabel: t('navigation.cart'),
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
          tabBarBadgeStyle: styles.badge,
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                <Icon name="shopping-cart" size={24} color={color} style={{ opacity: focused ? 1 : 0.8 }} />
              </View>
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersScreen}
        options={{
          tabBarLabel: t('navigation.orders'),
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                <Icon name="shopping-bag" size={24} color={color} style={{ opacity: focused ? 1 : 0.8 }} />
              </View>
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: t('navigation.profile'),
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                <Icon name="user" size={24} color={color} style={{ opacity: focused ? 1 : 0.8 }} />
              </View>
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};


const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === 'ios' ? 88 : 70,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EDEDED',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: -1 },
    elevation: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 6,
  },
  tabBarItem: {
    paddingTop: 4,
  },
  tabBarLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperActive: {
    transform: [{ translateY: -2 }],
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 32,
    borderRadius: 10,
  },
  iconContainerActive: {
    backgroundColor: '#E8F5F2',
  },
  activeIndicator: {
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#00A58E',
    marginTop: 2,
  },
  // AI Chat special styles
  aiIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -8,
  },
  aiIconWrapperActive: {
    transform: [{ scale: 1.05 }],
  },
  aiIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00A58E',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  aiIconInactive: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5F2',
  },
  badge: {
    backgroundColor: '#E74C3C',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    top: 2,
  },
});

export default MainTabNavigator;
