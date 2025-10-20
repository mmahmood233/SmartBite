/**
 * Wajba Partner - More Screen
 * Settings, profile, and management hub for restaurant partners
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, StatusBar, Switch, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import PartnerTopNav from '../../components/partner/PartnerTopNav';
import ProfileMenuItem from '../../components/ProfileMenuItem';
import { PartnerColors, PartnerSpacing, PartnerBorderRadius, PartnerTypography } from '../../constants/partnerTheme';
import { getStrings } from '../../constants/partnerStrings';

const strings = getStrings('en');

const PartnerMoreScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => console.log('Logged out') },
    ]);
  };

  const handleDarkModeToggle = (value: boolean) => {
    setIsDarkMode(value);
    console.log('Dark Mode:', value);
    // TODO: Apply dark mode theme
  };

  const handleLanguageSelect = (language: string) => {
    setCurrentLanguage(language);
    setLanguageModalVisible(false);
    console.log('Language changed to:', language);
    // TODO: Apply language change
  };

  const handleMenuPress = (label: string) => {
    switch (label) {
      case 'Edit Menu':
        navigation.navigate('Menu' as never);
        break;
      case 'Manage Orders':
        navigation.navigate('LiveOrders' as never);
        break;
      case 'View Earnings':
        navigation.navigate('Overview' as never);
        break;
      default:
        console.log(`Pressed: ${label}`);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <PartnerTopNav
        title={strings.nav.more}
        showBranding={true}
        showDropdown={false}
        showNotification={true}
        hasNotification={true}
      />

      <ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
      >
        {/* Restaurant Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>R</Text>
            </View>
            <View>
              <Text style={styles.restaurantName}>Burger Town</Text>
              <Text style={styles.restaurantStatus}>Open • 4.7 ⭐</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleMenuPress('Edit Business Info')}
            activeOpacity={0.7}
          >
            <Icon name="edit-2" size={16} color={PartnerColors.primary} />
          </TouchableOpacity>
        </View>

        {/* Management Section */}
        <Text style={styles.sectionTitle}>Management</Text>
        <ProfileMenuItem icon="book-open" label="Edit Menu" onPress={() => handleMenuPress('Edit Menu')} color={PartnerColors.primary} />
        <ProfileMenuItem icon="file-text" label="Manage Orders" onPress={() => handleMenuPress('Manage Orders')} color={PartnerColors.primary} />
        <ProfileMenuItem icon="bar-chart-2" label="View Earnings" onPress={() => handleMenuPress('View Earnings')} color={PartnerColors.primary} />

        {/* App Preferences Section */}
        <Text style={styles.sectionTitle}>App Preferences</Text>
        <View style={styles.preferencesCard}>
          {/* Dark Mode Toggle */}
          <View style={styles.preferenceItem}>
            <View style={styles.menuLeft}>
              <Icon name="moon" size={20} color={PartnerColors.primary} />
              <Text style={styles.menuText}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: '#E0E0E0', true: PartnerColors.primary }}
              thumbColor={isDarkMode ? '#FFFFFF' : '#F5F5F5'}
              ios_backgroundColor="#E0E0E0"
            />
          </View>

          <View style={styles.preferenceDivider} />

          {/* Language Selector */}
          <TouchableOpacity
            style={styles.preferenceItem}
            onPress={() => setLanguageModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Icon name="globe" size={20} color={PartnerColors.primary} />
              <Text style={styles.menuText}>Language</Text>
            </View>
            <View style={styles.languageSelector}>
              <Text style={styles.languageText}>{currentLanguage}</Text>
              <Icon name="chevron-down" size={18} color="#9E9E9E" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Account Settings Section */}
        <Text style={styles.sectionTitle}>Account & Settings</Text>
        <ProfileMenuItem icon="user" label="Account Settings" onPress={() => handleMenuPress('Account Settings')} color={PartnerColors.primary} />
        <ProfileMenuItem icon="lock" label="Change Password" onPress={() => handleMenuPress('Change Password')} color={PartnerColors.primary} />

        {/* Support Section */}
        <Text style={styles.sectionTitle}>Support</Text>
        <ProfileMenuItem icon="headphones" label="Contact Support" onPress={() => handleMenuPress('Contact Support')} color={PartnerColors.primary} />
        <ProfileMenuItem icon="file-text" label="Terms & Conditions" onPress={() => handleMenuPress('Terms & Conditions')} color={PartnerColors.primary} />
        <ProfileMenuItem icon="shield" label="Privacy Policy" onPress={() => handleMenuPress('Privacy Policy')} color={PartnerColors.primary} />

        {/* Logout */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout} 
          activeOpacity={0.8}
        >
          <Icon name="log-out" size={18} color={PartnerColors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={languageModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setLanguageModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Language</Text>

            <TouchableOpacity
              style={styles.languageOption}
              onPress={() => handleLanguageSelect('English')}
              activeOpacity={0.7}
            >
              <Text style={styles.languageOptionText}>English</Text>
              {currentLanguage === 'English' && (
                <Icon name="check" size={20} color={PartnerColors.primary} />
              )}
            </TouchableOpacity>

            <View style={styles.languageOptionDivider} />

            <TouchableOpacity
              style={styles.languageOption}
              onPress={() => handleLanguageSelect('العربية')}
              activeOpacity={0.7}
            >
              <Text style={styles.languageOptionText}>العربية</Text>
              {currentLanguage === 'العربية' && (
                <Icon name="check" size={20} color={PartnerColors.primary} />
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PartnerColors.light.background,
  },
  content: {
    padding: PartnerSpacing.xl,
  },
  profileCard: {
    backgroundColor: PartnerColors.light.surface,
    borderRadius: PartnerBorderRadius.xl,
    padding: PartnerSpacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: PartnerSpacing.xl,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: PartnerSpacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: PartnerColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: PartnerTypography.fontWeight.bold,
  },
  restaurantName: {
    fontSize: PartnerTypography.fontSize.xl,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: PartnerColors.light.text.primary,
  },
  restaurantStatus: {
    fontSize: PartnerTypography.fontSize.md,
    color: PartnerColors.light.text.tertiary,
    marginTop: 2,
  },
  editButton: {
    padding: 6,
    borderRadius: PartnerBorderRadius.sm,
    backgroundColor: PartnerColors.light.surfaceAlt,
  },
  sectionTitle: {
    fontSize: PartnerTypography.fontSize.base,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: PartnerColors.light.text.tertiary,
    marginTop: PartnerSpacing.sm,
    marginBottom: PartnerSpacing.sm,
  },
  menuItem: {
    backgroundColor: PartnerColors.light.surface,
    borderRadius: PartnerBorderRadius.lg,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: PartnerSpacing.sm,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuText: {
    fontSize: PartnerTypography.fontSize.lg,
    fontWeight: PartnerTypography.fontWeight.medium,
    color: PartnerColors.light.text.primary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0F0',
    borderRadius: PartnerBorderRadius.lg,
    paddingVertical: 14,
    marginTop: PartnerSpacing.xxl,
    gap: PartnerSpacing.sm,
  },
  logoutText: {
    fontSize: PartnerTypography.fontSize.lg,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: PartnerColors.error,
  },
  // Preferences Section
  preferencesCard: {
    backgroundColor: PartnerColors.light.surface,
    borderRadius: PartnerBorderRadius.lg,
    padding: 14,
    marginBottom: PartnerSpacing.sm,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  preferenceDivider: {
    height: 1,
    backgroundColor: PartnerColors.light.borderLight,
    marginVertical: 12,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  languageText: {
    fontSize: PartnerTypography.fontSize.base,
    color: PartnerColors.light.text.secondary,
    fontWeight: PartnerTypography.fontWeight.medium,
  },
  // Language Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: PartnerColors.light.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: PartnerSpacing.xl,
    paddingBottom: 32,
    paddingTop: 12,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: PartnerTypography.fontSize.xxl,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: PartnerColors.light.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  languageOptionText: {
    fontSize: PartnerTypography.fontSize.lg,
    color: PartnerColors.light.text.primary,
    fontWeight: PartnerTypography.fontWeight.medium,
  },
  languageOptionDivider: {
    height: 1,
    backgroundColor: PartnerColors.light.borderLight,
  },
});

export default PartnerMoreScreen;
