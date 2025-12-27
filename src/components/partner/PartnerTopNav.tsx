/**
 * Wajba Partner - Shared Top Navigation Component
 * Consistent navigation bar across all partner screens
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather as Icon } from '@expo/vector-icons';

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

interface PartnerTopNavProps {
  title: string;
  showMenu?: boolean;
  onMenuPress?: () => void;
  showNotification?: boolean;
  hasNotification?: boolean;
  unreadCount?: number; // Unread notification count
  onNotificationPress?: () => void;
  showBranding?: boolean; // Show Wajba Partner logo + avatar
  showDropdown?: boolean; // Show dropdown arrow next to title
  restaurantLogo?: string | null; // Restaurant logo URL
}

const PartnerTopNav: React.FC<PartnerTopNavProps> = ({
  title,
  showMenu = true,
  onMenuPress,
  showNotification = true,
  hasNotification = false,
  unreadCount = 0,
  onNotificationPress,
  showBranding = false,
  showDropdown = false,
  restaurantLogo = null,
}) => {
  if (showBranding) {
    // Branded version with logo and avatar (for Overview)
    return (
      <View style={styles.topNav}>
        <View style={styles.headerLeft}>
          <LinearGradient
            colors={['#00A896', '#4ECDC4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoGradient}
          >
            <Icon name="briefcase" size={18} color="#FFFFFF" />
          </LinearGradient>
          <View>
            <View style={styles.brandRow}>
              <Text style={styles.logoText}>{title}</Text>
              {showDropdown && <Icon name="chevron-down" size={14} color="#9CA3AF" style={{ marginLeft: 4 }} />}
            </View>
          </View>
        </View>
        <View style={styles.headerRight}>
          {showNotification && (
            <TouchableOpacity style={styles.notificationButton} onPress={onNotificationPress} activeOpacity={0.7}>
              <Icon name="bell" size={22} color="#333" />
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          {restaurantLogo ? (
            <Image 
              source={{ uri: restaurantLogo }} 
              style={styles.profileAvatar}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>R</Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  // Simple version (for Live Orders, etc.)
  return (
    <View style={styles.topNav}>
      {showMenu ? (
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress} activeOpacity={0.7}>
          <Icon name="menu" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      ) : (
        <View style={styles.menuButton} />
      )}
      
      <Text style={styles.navTitle}>{title}</Text>
      
      {showNotification ? (
        <TouchableOpacity style={styles.notificationButton} onPress={onNotificationPress} activeOpacity={0.7}>
          <Icon name="bell" size={22} color="#1A1A1A" />
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.notificationButton} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: STATUS_BAR_HEIGHT + 8,
    paddingBottom: 8,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
  },
  menuButton: {
    padding: 8,
    width: 40,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222222',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    width: 40,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: '#FF6B6B',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 16,
    height: 16,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Branded version styles
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00A896',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default PartnerTopNav;
