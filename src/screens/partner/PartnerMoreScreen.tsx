/**
 * Wajba Partner - More Screen
 * Settings, profile, and management hub for restaurant partners
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, StatusBar, Switch, Modal, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import PartnerTopNav from '../../components/partner/PartnerTopNav';
import ProfileMenuItem from '../../components/ProfileMenuItem';
import EditBusinessInfoModal from './EditBusinessInfoScreen';
import { PartnerColors, PartnerSpacing, PartnerBorderRadius, PartnerTypography } from '../../constants/partnerTheme';
import { getStrings } from '../../constants/partnerStrings';
import Snackbar, { SnackbarType } from '../../components/Snackbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import { getUserNotifications } from '../../services/notification.service';

const strings = getStrings('en');

const PartnerMoreScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t, language, changeLanguage } = useLanguage();
  const [currentLanguage, setCurrentLanguage] = useState(language === 'ar' ? 'العربية' : 'English');
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  // Update currentLanguage when language context changes
  useEffect(() => {
    setCurrentLanguage(language === 'ar' ? 'العربية' : 'English');
  }, [language]);
  const [editBusinessModalVisible, setEditBusinessModalVisible] = useState(false);
  
  // Snackbar state
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<SnackbarType>('success');

  const showSnackbar = (message: string, type: SnackbarType = 'success') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [businessData, setBusinessData] = useState({
    name: '',
    category: '',
    description: '',
    logo: null as string | null,
    isOpen: true,
    status: 'open' as 'open' | 'closed' | 'busy',
    avgPrepTime: '20-25 min',
    contactNumber: '',
    address: '',
    rating: 0,
    earnings: 'BD 0.00',
  });

  // Fetch restaurant data
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: restaurantData, error } = await supabase
          .from('restaurants')
          .select('*')
          .eq('partner_id', user.id)
          .single();

        if (error) throw error;

        if (restaurantData) {
          console.log('Restaurant logo URL:', restaurantData.logo);
          setRestaurantId(restaurantData.id);
          setIsActive(restaurantData.is_active ?? true);
          const status = restaurantData.status || 'closed';
          setBusinessData({
            name: restaurantData.name || '',
            category: restaurantData.category || '',
            description: restaurantData.description || '',
            logo: restaurantData.logo,
            isOpen: status === 'open',
            status: status as 'open' | 'closed' | 'busy',
            avgPrepTime: restaurantData.avg_prep_time || '20-25 min',
            contactNumber: restaurantData.phone || '',
            address: restaurantData.address || '',
            rating: restaurantData.rating || 0,
            earnings: 'BD 0.00', // TODO: Calculate from orders
          });
        }

        // Fetch notifications
        if (user) {
          const notifications = await getUserNotifications(user.id);
          setUnreadCount(notifications.filter((n: any) => !n.read).length);
        }
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
        showSnackbar('Failed to load restaurant data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, []);

  // Real-time subscription for restaurant changes
  useEffect(() => {
    if (!restaurantId) return;

    const restaurantSubscription = supabase
      .channel('partner-restaurant-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'restaurants',
          filter: `id=eq.${restaurantId}`,
        },
        (payload) => {
          console.log('Restaurant updated:', payload);
          const newData = payload.new as any;
          setIsActive(newData.is_active ?? true);
          
          // Show notification if deactivated
          if (newData.is_active === false) {
            showSnackbar('Your restaurant has been deactivated by admin', 'error');
          } else if (newData.is_active === true) {
            showSnackbar('Your restaurant has been activated', 'success');
          }
          
          // Update business data
          const status = newData.status || 'closed';
          setBusinessData({
            name: newData.name || '',
            category: newData.category || '',
            description: newData.description || '',
            logo: newData.logo,
            isOpen: status === 'open',
            status: status as 'open' | 'closed' | 'busy',
            avgPrepTime: newData.avg_prep_time || '20-25 min',
            contactNumber: newData.phone || '',
            address: newData.address || '',
            rating: newData.rating || 0,
            earnings: 'BD 0.00',
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(restaurantSubscription);
    };
  }, [restaurantId]);

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
              // Sign out from Supabase
              await supabase.auth.signOut();
              showSnackbar('Logged out successfully', 'success');
              // Navigate to Auth screen
              navigation.reset({
                index: 0,
                routes: [{ name: 'Auth' as never }],
              });
            } catch (error) {
              console.error('Logout error:', error);
              showSnackbar('Failed to logout', 'error');
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
    showSnackbar(`Language changed to ${lang}`, 'success');
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
      case 'Change Password':
        navigation.navigate('ChangePassword' as never);
        break;
      case 'Edit Business Info':
        setEditBusinessModalVisible(true);
        break;
      case 'Contact Support':
        Alert.alert(
          t('partner.contactSupportTitle'),
          `${t('partner.email')}: support@wajba.bh\n${t('partner.phone')}: +973 3356 0803\n\n${t('partner.supportAvailable')}`,
          [{ text: t('partner.ok') }]
        );
        break;
      case 'Terms & Conditions':
        navigation.navigate('Terms' as never);
        break;
      case 'Privacy Policy':
        navigation.navigate('Privacy' as never);
        break;
      default:
        console.log(`Pressed: ${label}`);
    }
  };

  const handleSaveBusinessInfo = async (updatedData: any) => {
    // Refetch restaurant data from database to get updated image_url
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: restaurantData, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('partner_id', user.id)
        .single();

      if (error) throw error;

      if (restaurantData) {
        const status = restaurantData.status || 'closed';
        setBusinessData({
          name: restaurantData.name || '',
          category: restaurantData.category || '',
          description: restaurantData.description || '',
          logo: restaurantData.logo,
          isOpen: status === 'open',
          status: status as 'open' | 'closed' | 'busy',
          avgPrepTime: restaurantData.avg_prep_time || '20-25 min',
          contactNumber: restaurantData.phone || '',
          address: restaurantData.address || '',
          rating: restaurantData.rating || 0,
          earnings: 'BD 0.00',
        });
      }
    } catch (error) {
      console.error('Error refreshing restaurant data:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner visible={true} message="Loading profile..." />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <PartnerTopNav
        title={t('partner.profile')}
        showBranding={true}
        showDropdown={false}
        showNotification={true}
        unreadCount={unreadCount}
        onNotificationPress={() => navigation.navigate('PartnerNotifications' as never)}
        restaurantLogo={businessData.logo}
      />

      <ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
      >
        {/* Deactivation Warning Banner */}
        {!isActive && (
          <View style={styles.deactivationBanner}>
            <Icon name="alert-circle" size={20} color="#FFFFFF" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.deactivationTitle}>Restaurant Deactivated</Text>
              <Text style={styles.deactivationText}>
                Your restaurant has been deactivated by admin. Please contact support for more information.
              </Text>
            </View>
          </View>
        )}

        {/* Restaurant Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileLeft}>
            <View style={styles.avatar}>
              {businessData.logo ? (
                <Image 
                  source={{ uri: businessData.logo }} 
                  style={styles.avatarImage}
                  key={businessData.logo}
                />
              ) : (
                <Text style={styles.avatarText}>{businessData.name.charAt(0)}</Text>
              )}
            </View>
            <View>
              <Text style={styles.restaurantName}>{businessData.name}</Text>
              <Text style={styles.restaurantStatus}>
                {businessData.isOpen ? 'Open' : 'Closed'} • {businessData.rating} ⭐
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.manageButton}
            onPress={() => handleMenuPress('Edit Business Info')}
            activeOpacity={0.8}
          >
            <Icon name="settings" size={16} color={PartnerColors.primary} />
            <Text style={styles.manageButtonText}>{t('partner.manage')}</Text>
          </TouchableOpacity>
        </View>

        {/* Management Section */}
        <Text style={styles.sectionTitle}>{t('partner.management')}</Text>
        <ProfileMenuItem icon="book-open" label={t('partner.editMenu')} onPress={() => handleMenuPress('Edit Menu')} color={PartnerColors.primary} />
        <ProfileMenuItem icon="file-text" label={t('partner.manageOrders')} onPress={() => handleMenuPress('Manage Orders')} color={PartnerColors.primary} />
        <ProfileMenuItem icon="bar-chart-2" label={t('partner.viewEarnings')} onPress={() => handleMenuPress('View Earnings')} color={PartnerColors.primary} />

        {/* App Preferences Section */}
        <Text style={styles.sectionTitle}>{t('partner.appPreferences')}</Text>
        
        {/* Language Selector */}
        <TouchableOpacity
          style={styles.preferenceCard}
          onPress={() => setLanguageModalVisible(true)}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <Icon name="globe" size={20} color={PartnerColors.primary} />
            <Text style={styles.menuText}>{t('partner.language')}</Text>
          </View>
          <View style={styles.languageSelector}>
            <Text style={styles.languageText}>{currentLanguage}</Text>
            <Icon name="chevron-down" size={18} color="#9E9E9E" />
          </View>
        </TouchableOpacity>

        {/* Notifications */}
        <ProfileMenuItem 
          icon="bell" 
          label={t('partner.notifications')} 
          onPress={() => navigation.navigate('PartnerNotifications' as never)} 
          color={PartnerColors.primary} 
        />

        {/* Security & Account Section */}
        <Text style={styles.sectionTitle}>{t('partner.securityAccount')}</Text>
        <ProfileMenuItem icon="lock" label={t('partner.changePassword')} onPress={() => handleMenuPress('Change Password')} color={PartnerColors.primary} />
        <ProfileMenuItem icon="log-out" label={t('partner.logout')} onPress={handleLogout} color={PartnerColors.primary} showChevron={false} />

        {/* Support Section */}
        <Text style={styles.sectionTitle}>{t('partner.support')}</Text>
        <ProfileMenuItem icon="headphones" label={t('partner.contactSupport')} onPress={() => handleMenuPress('Contact Support')} color={PartnerColors.primary} />
        <ProfileMenuItem icon="file-text" label={t('partner.termsConditions')} onPress={() => handleMenuPress('Terms & Conditions')} color={PartnerColors.primary} />
        <ProfileMenuItem icon="shield" label={t('partner.privacyPolicy')} onPress={() => handleMenuPress('Privacy Policy')} color={PartnerColors.primary} />

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

      {/* Edit Business Info Modal */}
      <EditBusinessInfoModal
        visible={editBusinessModalVisible}
        onClose={() => setEditBusinessModalVisible(false)}
        restaurantId={restaurantId}
        businessData={businessData}
        onSave={handleSaveBusinessInfo}
      />

      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        type={snackbarType}
        onDismiss={() => setSnackbarVisible(false)}
      />
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
  deactivationBanner: {
    backgroundColor: '#EF4444',
    borderRadius: PartnerBorderRadius.lg,
    padding: PartnerSpacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: PartnerSpacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  deactivationTitle: {
    fontSize: PartnerTypography.fontSize.md,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  deactivationText: {
    fontSize: PartnerTypography.fontSize.sm,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 20,
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
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: PartnerColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: PartnerSpacing.md,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: PartnerTypography.fontWeight.bold,
  },
  restaurantName: {
    fontSize: PartnerTypography.fontSize.lg,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: PartnerColors.light.text.primary,
  },
  restaurantStatus: {
    fontSize: PartnerTypography.fontSize.md,
    color: PartnerColors.light.text.tertiary,
    marginTop: 2,
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${PartnerColors.primary}14`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  manageButtonText: {
    fontSize: 13,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: PartnerColors.primary,
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
  // Preferences Section - Individual cards
  preferenceCard: {
    backgroundColor: PartnerColors.light.surface,
    borderRadius: PartnerBorderRadius.lg,
    padding: 14,
    marginBottom: PartnerSpacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
