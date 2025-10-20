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
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE, ICON_SIZE, AVATAR_SIZE } from '../../../constants';
import { getInitials } from '../../../utils';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Snackbar from '../../../components/Snackbar';
import ProfileMenuItem from '../../../components/ProfileMenuItem';

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
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'warning' | 'info' }>({ visible: false, message: '', type: 'success' });

  const showSnackbar = (message: string, type: 'success' | 'error' = 'success') => {
    setSnackbar({ visible: true, message, type });
  };

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
    navigation.navigate('Favorites');
  };

  const handleAddresses = () => {
    navigation.navigate('SavedAddresses');
  };

  const handlePaymentMethods = () => {
    navigation.navigate('PaymentMethods');
  };

  const handleOffers = () => {
    navigation.navigate('Offers');
  };

  const handleHelp = () => {
    navigation.navigate('HelpSupport');
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
    navigation.navigate('ChangePassword');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              // TODO: Clear user session/token
              // TODO: Navigate to Auth screen
              // await logout();
              // await AsyncStorage.clear();
              console.log('User logged out');
              showSnackbar('Logged out successfully', 'success');
              // navigation.navigate('Auth');
            } catch (error) {
              showSnackbar('Failed to logout', 'error');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Show second confirmation for critical action
            Alert.alert(
              'Final Confirmation',
              'This will permanently delete your account. Are you absolutely sure?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Yes, Delete My Account',
                  style: 'destructive',
                  onPress: async () => {
                    setIsLoading(true);
                    try {
                      // TODO: Delete account from backend
                      // TODO: Clear all local data
                      // TODO: Navigate to Auth screen
                      // await deleteAccount();
                      // await AsyncStorage.clear();
                      console.log('Account deleted');
                      showSnackbar('Account deleted successfully', 'success');
                      // navigation.navigate('Auth');
                    } catch (error) {
                      showSnackbar('Failed to delete account', 'error');
                    } finally {
                      setIsLoading(false);
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
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

        {/* Partner Portal Test Button */}
        <View style={[styles.section, styles.firstSection]}>
          <TouchableOpacity
            style={styles.partnerButton}
            onPress={() => navigation.navigate('PartnerPortal')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#00A896', '#4ECDC4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.partnerGradient}
            >
              <View style={styles.partnerContent}>
                <View style={styles.partnerLeft}>
                  <Icon name="briefcase" size={24} color="#FFFFFF" />
                  <View>
                    <Text style={styles.partnerTitle}>Wajba Partner</Text>
                    <Text style={styles.partnerSubtitle}>Restaurant Portal</Text>
                  </View>
                </View>
                <Icon name="arrow-right" size={20} color="#FFFFFF" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* My Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Account</Text>
          <ProfileMenuItem icon="heart" label="Favorites" onPress={handleFavorites} color={colors.primary} />
          <ProfileMenuItem icon="home" label="Saved Addresses" onPress={handleAddresses} color={colors.primary} />
          <ProfileMenuItem icon="credit-card" label="Payment Methods" onPress={handlePaymentMethods} color={colors.primary} />
          <ProfileMenuItem icon="gift" label="Offers & Promotions" onPress={handleOffers} color={colors.primary} />
          <ProfileMenuItem icon="message-circle" label="Help & Support" onPress={handleHelp} color={colors.primary} />
        </View>

        {/* App Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          
          {/* Dark Mode Toggle */}
          <View style={styles.preferenceCard}>
            <View style={styles.menuLeft}>
              <Icon name="moon" size={20} color={colors.primary} />
              <Text style={styles.menuText}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: '#E0E0E0', true: colors.primary }}
              thumbColor={isDarkMode ? '#FFFFFF' : '#F5F5F5'}
              ios_backgroundColor="#E0E0E0"
            />
          </View>

          {/* Language Selector */}
          <TouchableOpacity
            style={styles.preferenceCard}
            onPress={() => setLanguageModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Icon name="globe" size={20} color={colors.primary} />
              <Text style={styles.menuText}>Language</Text>
            </View>
            <View style={styles.languageSelector}>
              <Text style={styles.languageText}>{currentLanguage}</Text>
              <Icon name="chevron-down" size={18} color="#9E9E9E" />
            </View>
          </TouchableOpacity>
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
          <Text style={styles.footerTagline}>Don't scroll. Just ask. 🍴🤖</Text>
          <Text style={styles.footerVersion}>Wajba v1.0.0</Text>
          <Text style={styles.footerCopyright}>© 2025 — Made with ❤️ in Bahrain 🇧🇭</Text>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      <LoadingSpinner visible={isLoading} message="Processing..." overlay />
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
      />

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
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 8,
    marginBottom: 8,
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
  footerTagline: {
    fontSize: FONT_SIZE.base,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
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
  // Partner Portal Button
  partnerButton: {
    marginBottom: SPACING.md,
  },
  partnerGradient: {
    borderRadius: BORDER_RADIUS.xl,
    padding: 20,
    shadowColor: '#00A896',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  partnerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  partnerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  partnerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  partnerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
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
  // New styles matching partner design
  preferenceCard: {
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
  },
});

export default ProfileScreen;
