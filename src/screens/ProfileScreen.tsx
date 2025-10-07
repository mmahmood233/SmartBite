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
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

interface MenuItem {
  icon: string;
  label: string;
  onPress: () => void;
  color?: string;
  showChevron?: boolean;
}

const ProfileScreen: React.FC = () => {
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
    // TODO: Navigate to Edit Profile screen
    console.log('Edit Profile');
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A4D47',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F7F9F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  avatarInitials: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 6,
  },
  userContact: {
    fontSize: 14,
    color: '#6D6D6D',
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#00856F',
    gap: 6,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  firstSection: {
    marginTop: 16,
  },
  preferencesSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1C',
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 4,
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
    paddingVertical: 16,
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
    borderRadius: 10,
    backgroundColor: 'rgba(0, 137, 123, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#212121',
  },
  divider: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginLeft: 64,
  },
  deleteSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  deleteDivider: {
    height: 1,
    backgroundColor: '#F3F3F3',
    marginBottom: 16,
  },
  deleteButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#D32F2F',
    opacity: 0.85,
  },
  footer: {
    marginTop: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  footerVersion: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.45)',
    marginBottom: 6,
  },
  footerCopyright: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.45)',
    textAlign: 'center',
  },
  // Preference Items
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#212121',
  },
  preferenceDivider: {
    height: 2,
    backgroundColor: '#F5F5F5',
    marginLeft: 64,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  languageText: {
    fontSize: 14,
    color: '#6D6D6D',
    opacity: 0.75,
  },
  // Language Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
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
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 20,
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  languageOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
  },
  languageOptionDivider: {
    height: 1,
    backgroundColor: '#F5F5F5',
  },
});

export default ProfileScreen;
