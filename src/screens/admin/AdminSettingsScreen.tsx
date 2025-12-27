/**
 * Admin Settings Screen
 * Admin profile and platform settings
 */
// @ts-nocheck

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { PartnerColors, PartnerSpacing, PartnerTypography } from '../../constants/partnerTheme';
import Snackbar, { SnackbarType } from '../../components/Snackbar';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  getDefaultDeliveryFee,
  updateDefaultDeliveryFee,
  getMinOrderAmount,
  updateMinOrderAmount,
} from '../../services/platform-settings.service';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminSettingsScreen: React.FC = () => {
  const { t, language, changeLanguage } = useLanguage();
  const navigation = useNavigation();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<SnackbarType>('success');
  const [defaultDeliveryFee, setDefaultDeliveryFee] = useState('0.5');
  const [minOrderAmount, setMinOrderAmount] = useState('2');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adminName, setAdminName] = useState('Admin User');
  const [adminEmail, setAdminEmail] = useState('admin@wajba.bh');
  const [currentLanguage, setCurrentLanguage] = useState(language === 'ar' ? 'العربية' : 'English');
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  useEffect(() => {
    setCurrentLanguage(language === 'ar' ? 'العربية' : 'English');
  }, [language]);

  // Fetch platform settings and user data
  useEffect(() => {
    fetchSettings();
    fetchUserData();
  }, []);

  // Real-time subscription for settings changes
  useEffect(() => {
    const settingsSubscription = supabase
      .channel('platform-settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'platform_settings',
        },
        (payload) => {
          console.log('Platform setting changed:', payload);
          fetchSettings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(settingsSubscription);
    };
  }, []);

  const fetchSettings = async () => {
    try {
      const [fee, minOrder] = await Promise.all([
        getDefaultDeliveryFee(),
        getMinOrderAmount(),
      ]);
      setDefaultDeliveryFee(fee.toString());
      setMinOrderAmount(minOrder.toString());
    } catch (error) {
      console.error('Error fetching settings:', error);
      showSnackbar('Failed to load settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setAdminEmail(user.email || 'admin@wajba.bh');
        
        // Try to get name from user metadata or profile
        const name = user.user_metadata?.name || user.user_metadata?.full_name;
        if (name) {
          setAdminName(name);
        } else {
          // Fallback: try to fetch from profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();
          
          if (profile?.full_name) {
            setAdminName(profile.full_name);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const showSnackbar = (message: string, type: SnackbarType = 'success') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  const handleSaveSettings = async () => {
    const fee = parseFloat(defaultDeliveryFee);
    const minOrder = parseFloat(minOrderAmount);
    
    if (isNaN(fee) || fee < 0) {
      showSnackbar('Please enter a valid delivery fee', 'error');
      return;
    }

    if (isNaN(minOrder) || minOrder < 0) {
      showSnackbar('Please enter a valid minimum order amount', 'error');
      return;
    }

    setSaving(true);
    try {
      await Promise.all([
        updateDefaultDeliveryFee(fee),
        updateMinOrderAmount(minOrder),
      ]);
      showSnackbar('Settings saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      showSnackbar('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Sign out from Supabase
              const { error } = await supabase.auth.signOut();
              
              if (error) {
                throw error;
              }
              
              showSnackbar('Logged out successfully', 'success');
              
              // Navigate to auth screen after a short delay
              setTimeout(() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Auth' as never }],
                });
              }, 1000);
            } catch (error: any) {
              console.error('Logout error:', error);
              showSnackbar('Failed to logout', 'error');
            }
          },
        },
      ]
    );
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword' as never);
  };

  const handleLanguageSelect = async (lang: string) => {
    const langCode = lang === 'العربية' ? 'ar' : 'en';
    await changeLanguage(langCode);
    setCurrentLanguage(lang);
    setLanguageModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t('admin.settings')}</Text>
          <Text style={styles.headerSubtitle}>{t('admin.adminConfiguration')}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Admin Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Icon name="user" size={32} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.adminName}>{adminName}</Text>
          <Text style={styles.adminEmail}>{adminEmail}</Text>
          <View style={styles.roleBadge}>
            <Icon name="shield" size={14} color={PartnerColors.primary} />
            <Text style={styles.roleText}>{t('admin.platformAdministrator')}</Text>
          </View>
        </View>

        {/* App Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('admin.appPreferences').toUpperCase()}</Text>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setLanguageModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#E6F7F4' }]}>
                <Icon name="globe" size={20} color={PartnerColors.primary} />
              </View>
              <Text style={styles.menuItemText}>{t('settings.language')}</Text>
            </View>
            <View style={styles.languageSelector}>
              <Text style={styles.languageText}>{currentLanguage}</Text>
              <Icon name="chevron-down" size={18} color={PartnerColors.light.text.tertiary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('admin.account').toUpperCase()}</Text>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleChangePassword}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#E6F7F4' }]}>
                <Icon name="lock" size={20} color={PartnerColors.primary} />
              </View>
              <Text style={styles.menuItemText}>{t('settings.changePassword')}</Text>
            </View>
            <Icon name="chevron-right" size={20} color={PartnerColors.light.text.tertiary} />
          </TouchableOpacity>
        </View>

        {/* Other Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('admin.other').toUpperCase()}</Text>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('LogViewer' as never)}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#FEF3C7' }]}>
                <Icon name="file-text" size={20} color="#F59E0B" />
              </View>
              <Text style={styles.menuItemText}>{t('admin.viewLogs')}</Text>
            </View>
            <Icon name="chevron-right" size={20} color={PartnerColors.light.text.tertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              Alert.alert(
                'Advanced Settings',
                'Configure advanced platform features:\n\n• Payment Gateway Settings\n• Email & SMS Notifications\n• API Keys & Webhooks\n• Database Backup & Restore\n• System Maintenance Mode\n\nThese features are coming soon!',
                [{ text: 'OK' }]
              );
            }}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#F0F4FF' }]}>
                <Icon name="settings" size={20} color="#007AFF" />
              </View>
              <Text style={styles.menuItemText}>{t('admin.advancedSettings')}</Text>
            </View>
            <Icon name="chevron-right" size={20} color={PartnerColors.light.text.tertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              Alert.alert(
                'Analytics & Reports',
                'View comprehensive platform analytics:\n\n• Revenue & Sales Reports\n• User Growth & Engagement\n• Restaurant Performance\n• Order Statistics\n• Peak Hours Analysis\n• Customer Insights\n\nDetailed analytics dashboard coming soon!',
                [{ text: 'OK' }]
              );
            }}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#FFF4E6' }]}>
                <Icon name="bar-chart-2" size={20} color="#FF9500" />
              </View>
              <Text style={styles.menuItemText}>{t('admin.analyticsReports')}</Text>
            </View>
            <Icon name="chevron-right" size={20} color={PartnerColors.light.text.tertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('AdminNotifications' as never)}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#ECFDF5' }]}>
                <Icon name="bell" size={20} color="#10B981" />
              </View>
              <Text style={styles.menuItemText}>{t('admin.notifications')}</Text>
            </View>
            <Icon name="chevron-right" size={20} color={PartnerColors.light.text.tertiary} />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.support').toUpperCase()}</Text>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('FAQ' as never)}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#F0F4FF' }]}>
                <Icon name="help-circle" size={20} color="#007AFF" />
              </View>
              <Text style={styles.menuItemText}>{t('admin.helpCenter')}</Text>
            </View>
            <Icon name="chevron-right" size={20} color={PartnerColors.light.text.tertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              Alert.alert(
                'About Wajba',
                'Wajba Admin Portal v1.0.0\n\nManage your food delivery platform with ease.\n\n© 2025 Wajba. All rights reserved.',
                [
                  { text: 'Terms & Conditions', onPress: () => navigation.navigate('Terms' as never) },
                  { text: 'Privacy Policy', onPress: () => navigation.navigate('Privacy' as never) },
                  { text: 'OK', style: 'cancel' },
                ]
              );
            }}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#F9FAFB' }]}>
                <Icon name="info" size={20} color={PartnerColors.light.text.secondary} />
              </View>
              <Text style={styles.menuItemText}>{t('admin.about')}</Text>
            </View>
            <Icon name="chevron-right" size={20} color={PartnerColors.light.text.tertiary} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Icon name="log-out" size={20} color="#EF4444" />
            <Text style={styles.logoutButtonText}>{t('settings.logout')}</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Wajba Admin v1.0.0</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        type={snackbarType}
        onDismiss={() => setSnackbarVisible(false)}
      />

      <LoadingSpinner
        visible={loading || saving}
        message={saving ? 'Saving settings...' : 'Loading settings...'}
        overlay
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
            <Text style={styles.modalTitle}>{t('partner.language')}</Text>

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
  header: {
    paddingHorizontal: PartnerSpacing.xl,
    paddingTop: Platform.OS === 'ios' ? 50 : PartnerSpacing.lg,
    paddingBottom: PartnerSpacing.lg,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: PartnerColors.light.borderLight,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: PartnerColors.light.text.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: PartnerColors.light.text.secondary,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: PartnerSpacing.xl,
    marginTop: PartnerSpacing.lg,
    borderRadius: 16,
    padding: PartnerSpacing.xl,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: PartnerColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminName: {
    fontSize: 20,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: PartnerColors.light.text.primary,
    marginBottom: 4,
  },
  adminEmail: {
    fontSize: 14,
    color: PartnerColors.light.text.secondary,
    marginBottom: 12,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${PartnerColors.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  roleText: {
    fontSize: 13,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: PartnerColors.primary,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: PartnerSpacing.xl,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: PartnerColors.light.text.secondary,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: PartnerTypography.fontWeight.medium,
    color: PartnerColors.light.text.primary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: '#EF4444',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  versionText: {
    fontSize: 13,
    color: PartnerColors.light.text.tertiary,
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: PartnerSpacing.lg,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${PartnerColors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: PartnerColors.light.text.primary,
  },
  settingSubtitle: {
    fontSize: 13,
    color: PartnerColors.light.text.tertiary,
    marginTop: 2,
  },
  settingInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: PartnerColors.light.text.primary,
    borderWidth: 1,
    borderColor: PartnerColors.light.borderLight,
  },
  settingUnit: {
    fontSize: 16,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: PartnerColors.light.text.secondary,
  },
  saveSettingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: PartnerColors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  saveSettingsButtonText: {
    fontSize: 16,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: '#FFFFFF',
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  languageText: {
    fontSize: 16,
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
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
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
    fontSize: 18,
    color: PartnerColors.light.text.primary,
    fontWeight: PartnerTypography.fontWeight.medium,
  },
  languageOptionDivider: {
    height: 1,
    backgroundColor: PartnerColors.light.borderLight,
  },
});

export default AdminSettingsScreen;
