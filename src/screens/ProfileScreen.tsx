import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Switch,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE, ICON_SIZE, AVATAR_SIZE } from '../constants';
import { getInitials } from '../utils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface MenuItem {
  icon: string;
  label: string;
  onPress: () => void;
  color?: string;
  showChevron?: boolean;
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  // Mock user data - will be replaced with real data
  const user = {
    name: 'Ahmed Faisal',
    email: 'ahmed.faisal@example.com',
    phone: '+973 3356 0803',
    avatar: null, // Will use initials if no avatar
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleFavorites = () => {
    // TODO: Navigate to Favorites screen
    console.log('Favorites');
  };

  const handleAddresses = () => {
    // TODO: Navigate to Saved Addresses screen
    console.log('Saved Addresses');
  };

  const handlePaymentMethods = () => {
    // TODO: Navigate to Payment Methods screen
    console.log('Payment Methods');
  };

  const handleOffers = () => {
    // TODO: Navigate to Offers screen
    console.log('Offers & Promotions');
  };

  const handleSupport = () => {
    // TODO: Navigate to Help & Support screen
    console.log('Help & Support');
  };

  const handleDarkModeToggle = (value: boolean) => {
    setIsDarkMode(value);
    // TODO: Apply dark mode theme
    console.log('Dark Mode:', value);
  };

  const handleLanguageSelect = (language: string) => {
    setCurrentLanguage(language);
    setLanguageModalVisible(false);
    // TODO: Apply language change
    console.log('Language changed to:', language);
  };

  const handleChangePassword = () => {
    // TODO: Navigate to Change Password screen
    console.log('Change Password');
  };

  const handleLogout = () => {
    // TODO: Show confirmation dialog then logout
    console.log('Logout');
  };

  const handleDeleteAccount = () => {
    // TODO: Show confirmation dialog then delete account
    console.log('Delete Account');
  };

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.label}
      style={styles.menuItem}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <View style={[
          styles.iconContainer,
          item.color ? { backgroundColor: item.color + '15' } : undefined
        ]}>
          <Icon name={item.icon} size={20} color={item.color || colors.primary} />
        </View>
        <Text style={[
          styles.menuItemLabel,
          item.color ? { color: item.color } : undefined
        ]}>
          {item.label}
        </Text>
      </View>
      {item.showChevron !== false && (
        <Icon name="chevron-right" size={20} color="#BDBDBD" />
      )}
    </TouchableOpacity>
  );

  // Using imported getInitials utility

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton} activeOpacity={0.7}>
          <Icon name="settings" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <LinearGradient
                colors={['#00897B', '#26A69A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarGradient}
              >
                <Text style={styles.avatarInitials}>{getInitials(user.name)}</Text>
              </LinearGradient>
            )}
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userContact}>{user.email}</Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
            activeOpacity={0.7}
          >
            <Icon name="edit-2" size={15} color={colors.primary} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* My Account Section */}
        <View style={[styles.section, styles.firstSection]}>
          <Text style={styles.sectionTitle}>My Account</Text>
          <View style={styles.card}>
            {renderMenuItem({ icon: 'heart', label: 'Favorites', onPress: handleFavorites })}
            <View style={styles.divider} />
            {renderMenuItem({ icon: 'home', label: 'Saved Addresses', onPress: handleAddresses })}
            <View style={styles.divider} />
            {renderMenuItem({ icon: 'credit-card', label: 'Payment Methods', onPress: handlePaymentMethods })}
            <View style={styles.divider} />
            {renderMenuItem({ icon: 'gift', label: 'Offers & Promotions', onPress: handleOffers })}
            <View style={styles.divider} />
            {renderMenuItem({ icon: 'message-circle', label: 'Help & Support', onPress: handleSupport })}
          </View>
        </View>

        {/* App Preferences Section */}
        <View style={[styles.section, styles.preferencesSection]}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          <View style={styles.card}>
            {/* Dark Mode Toggle */}
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceLeft}>
                <View style={styles.iconContainer}>
                  <Icon name="moon" size={20} color={colors.primary} />
                </View>
                <Text style={styles.preferenceLabel}>Dark Mode</Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={handleDarkModeToggle}
                trackColor={{ false: '#E0E0E0', true: colors.primary }}
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
              <View style={styles.preferenceLeft}>
                <View style={styles.iconContainer}>
                  <Icon name="globe" size={20} color={colors.primary} />
                </View>
                <Text style={styles.preferenceLabel}>Language</Text>
              </View>
              <View style={styles.languageSelector}>
                <Text style={styles.languageText}>{currentLanguage}</Text>
                <Icon name="chevron-down" size={18} color="#9E9E9E" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Security & Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security & Account</Text>
          <View style={styles.card}>
            {renderMenuItem({ icon: 'lock', label: 'Change Password', onPress: handleChangePassword })}
            <View style={styles.divider} />
            {renderMenuItem({ icon: 'log-out', label: 'Logout', onPress: handleLogout, showChevron: false })}
          </View>
        </View>

        {/* Delete Account */}
        <View style={styles.deleteSection}>
          <View style={styles.deleteDivider} />
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerVersion}>Wajba v1.0.0</Text>
          <Text style={styles.footerCopyright}>© 2025 — Made with ❤️ in Bahrain 🇧🇭</Text>
        </View>

        <View style={{ height: 80 }} />
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
                <Icon name="check" size={20} color={colors.primary} />
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
                <Icon name="check" size={20} color={colors.primary} />
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
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: FONT_SIZE.huge,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: colors.surface,
    paddingVertical: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatarContainer: {
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: AVATAR_SIZE.xl,
    height: AVATAR_SIZE.xl,
    borderRadius: AVATAR_SIZE.xl / 2,
  },
  avatarGradient: {
    width: AVATAR_SIZE.xl,
    height: AVATAR_SIZE.xl,
    borderRadius: AVATAR_SIZE.xl / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  avatarInitials: {
    fontSize: FONT_SIZE.xxxl + 12,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  userName: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: SPACING.sm,
  },
  userContact: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
    marginBottom: SPACING.lg,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: SPACING.xxl,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    gap: SPACING.sm,
  },
  editButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: colors.primary,
  },
  section: {
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  firstSection: {
    marginTop: SPACING.lg,
  },
  preferencesSection: {
    marginTop: SPACING.xxl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: SPACING.md,
    marginLeft: SPACING.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: 'rgba(17, 137, 127, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  menuItemLabel: {
    fontSize: FONT_SIZE.base,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 64,
  },
  deleteSection: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  deleteDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: SPACING.lg,
  },
  deleteButton: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
    color: colors.error,
    opacity: 0.85,
  },
  footer: {
    marginTop: SPACING.xxxl,
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  footerVersion: {
    fontSize: FONT_SIZE.sm,
    color: colors.textDisabled,
    marginBottom: SPACING.sm,
  },
  footerCopyright: {
    fontSize: FONT_SIZE.sm,
    color: colors.textDisabled,
    textAlign: 'center',
  },
  // Preference Items
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceLabel: {
    fontSize: FONT_SIZE.base,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  preferenceDivider: {
    height: 2,
    backgroundColor: colors.border,
    marginLeft: 64,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  languageText: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
    opacity: 0.75,
  },
  // Language Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: BORDER_RADIUS.xxl,
    borderTopRightRadius: BORDER_RADIUS.xxl,
    paddingHorizontal: SPACING.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : SPACING.xl,
    paddingTop: SPACING.md,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: BORDER_RADIUS.xs,
    alignSelf: 'center',
    marginBottom: SPACING.xl,
  },
  modalTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.lg + 2,
    paddingHorizontal: SPACING.lg,
  },
  languageOptionText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  languageOptionDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
});

export default ProfileScreen;
