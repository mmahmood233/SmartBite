import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';
import { getRiderProfile } from '../../services/rider.service';

interface ProfileMenuItemProps {
  icon: string;
  label: string;
  onPress: () => void;
  color?: string;
  showChevron?: boolean;
  rightElement?: React.ReactNode;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  icon,
  label,
  onPress,
  color = colors.primary,
  showChevron = true,
  rightElement,
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.menuItemLeft}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <Icon name={icon as any} size={20} color={color} />
      </View>
      <Text style={styles.menuItemText}>{label}</Text>
    </View>
    {rightElement || (showChevron && <Icon name="chevron-right" size={20} color="#9E9E9E" />)}
  </TouchableOpacity>
);

const RiderProfileScreen: React.FC = () => {
  const { t, language, changeLanguage } = useLanguage();
  const navigation = useNavigation();
  const [riderData, setRiderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [riderId, setRiderId] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState(language === 'ar' ? 'العربية' : 'English');
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  useEffect(() => {
    setCurrentLanguage(language === 'ar' ? 'العربية' : 'English');
  }, [language]);

  useEffect(() => {
    loadRiderProfile();
  }, []);

  const loadRiderProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const profile = await getRiderProfile(user.id);
        if (profile) {
          setRiderId(profile.id);
          setRiderData(profile);
        }
      }
    } catch (error) {
      console.error('Error loading rider profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t('partner.logoutTitle'),
      t('partner.logoutConfirm'),
      [
        {
          text: t('partner.cancel'),
          style: 'cancel',
        },
        {
          text: t('partner.logout'),
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await supabase.auth.signOut();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Auth' as never }],
              });
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleLanguageSelect = async (lang: string) => {
    const langCode = lang === 'العربية' ? 'ar' : 'en';
    await changeLanguage(langCode);
    setCurrentLanguage(lang);
    setLanguageModalVisible(false);
  };

  const handleMenuPress = (item: string) => {
    switch (item) {
      case 'Notifications':
        navigation.navigate('RiderNotifications' as never);
        break;
      case 'Contact Support':
        Alert.alert(
          t('partner.contactSupportTitle'),
          `${t('partner.email')}: support@wajba.bh\n${t('partner.phone')}: +973 3356 0803\n\n${t('partner.supportAvailable')}`,
          [{ text: t('partner.ok') }]
        );
        break;
      case 'Privacy Policy':
        navigation.navigate('Privacy' as never);
        break;
      case 'Terms & Conditions':
        navigation.navigate('Terms' as never);
        break;
      case 'Change Password':
        navigation.navigate('ChangePassword' as never);
        break;
      default:
        Alert.alert('Coming Soon', `${item} feature coming soon!`);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('rider.profile')}</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Icon name="user" size={40} color={colors.primary} />
            </View>
          </View>
          <Text style={styles.profileName}>{riderData?.full_name || 'Rider'}</Text>
          <Text style={styles.profileEmail}>{riderData?.email || ''}</Text>
        </View>

        {/* Stats Card */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="package" size={24} color={colors.primary} />
            <Text style={styles.statValue}>{riderData?.total_deliveries || 0}</Text>
            <Text style={styles.statLabel}>{t('rider.totalDeliveries')}</Text>
          </View>
        </View>

        {/* App Preferences */}
        <Text style={styles.sectionTitle}>{t('partner.appPreferences')}</Text>
        <ProfileMenuItem
          icon="globe"
          label={t('partner.language')}
          onPress={() => setLanguageModalVisible(true)}
          color={colors.primary}
          showChevron={false}
          rightElement={
            <View style={styles.languageSelector}>
              <Text style={styles.languageText}>{currentLanguage}</Text>
              <Icon name="chevron-down" size={18} color="#9E9E9E" />
            </View>
          }
        />
        <ProfileMenuItem
          icon="bell"
          label={t('partner.notifications')}
          onPress={() => handleMenuPress('Notifications')}
          color={colors.primary}
        />

        {/* Support */}
        <Text style={styles.sectionTitle}>{t('partner.support')}</Text>
        <ProfileMenuItem
          icon="headphones"
          label={t('partner.contactSupport')}
          onPress={() => handleMenuPress('Contact Support')}
          color={colors.primary}
        />
        <ProfileMenuItem
          icon="file-text"
          label={t('partner.termsConditions')}
          onPress={() => handleMenuPress('Terms & Conditions')}
          color={colors.primary}
        />
        <ProfileMenuItem
          icon="shield"
          label={t('partner.privacyPolicy')}
          onPress={() => handleMenuPress('Privacy Policy')}
          color={colors.primary}
        />

        {/* Security & Account */}
        <Text style={styles.sectionTitle}>{t('partner.securityAccount')}</Text>
        <ProfileMenuItem
          icon="lock"
          label={t('partner.changePassword')}
          onPress={() => handleMenuPress('Change Password')}
          color={colors.primary}
        />
        <ProfileMenuItem
          icon="log-out"
          label={t('partner.logout')}
          onPress={handleLogout}
          color="#EF4444"
          showChevron={false}
        />

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
            <Text style={styles.modalTitle}>{t('partner.language')}</Text>

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
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    fontSize: FONT_SIZE.lg,
    color: colors.textSecondary,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
    marginBottom: SPACING.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: SPACING.sm,
  },
  statLabel: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: colors.textSecondary,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  menuItemText: {
    fontSize: FONT_SIZE.md,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  languageText: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  // Language Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
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
    fontSize: FONT_SIZE.lg,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  languageOptionDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
});

export default RiderProfileScreen;
