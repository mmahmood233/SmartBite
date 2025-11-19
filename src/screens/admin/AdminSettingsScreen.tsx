/**
 * Admin Settings Screen
 * Admin profile and platform settings
 */

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
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { PartnerColors, PartnerSpacing, PartnerTypography } from '../../constants/partnerTheme';
import Snackbar, { SnackbarType } from '../../components/Snackbar';
import { supabase } from '../../lib/supabase';
import {
  getDefaultDeliveryFee,
  updateDefaultDeliveryFee,
  getMinOrderAmount,
  updateMinOrderAmount,
} from '../../services/platform-settings.service';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminSettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<SnackbarType>('success');
  const [defaultDeliveryFee, setDefaultDeliveryFee] = useState('0.5');
  const [minOrderAmount, setMinOrderAmount] = useState('2');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch platform settings
  useEffect(() => {
    fetchSettings();
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
          onPress: () => {
            showSnackbar('Logged out successfully', 'success');
            setTimeout(() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Auth' as never }],
              });
            }, 1500);
          },
        },
      ]
    );
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword' as never);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Admin Configuration</Text>
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
          <Text style={styles.adminName}>Admin User</Text>
          <Text style={styles.adminEmail}>admin@smartbite.com</Text>
          <View style={styles.roleBadge}>
            <Icon name="shield" size={14} color={PartnerColors.primary} />
            <Text style={styles.roleText}>Platform Administrator</Text>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleChangePassword}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#E6F7F4' }]}>
                <Icon name="lock" size={20} color={PartnerColors.primary} />
              </View>
              <Text style={styles.menuItemText}>Change Password</Text>
            </View>
            <Icon name="chevron-right" size={20} color={PartnerColors.light.text.tertiary} />
          </TouchableOpacity>
        </View>

        {/* Platform Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PLATFORM CONFIGURATION</Text>
          
          {/* Default Delivery Fee */}
          <View style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <View style={styles.settingIconContainer}>
                <Icon name="truck" size={20} color={PartnerColors.primary} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Default Delivery Fee</Text>
                <Text style={styles.settingSubtitle}>Applied to new restaurants</Text>
              </View>
            </View>
            <View style={styles.settingInputRow}>
              <TextInput
                style={styles.settingInput}
                value={defaultDeliveryFee}
                onChangeText={setDefaultDeliveryFee}
                keyboardType="decimal-pad"
                placeholder="0.5"
                placeholderTextColor="#9CA3AF"
              />
              <Text style={styles.settingUnit}>BD</Text>
            </View>
          </View>

          {/* Minimum Order Amount */}
          <View style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <View style={styles.settingIconContainer}>
                <Icon name="shopping-bag" size={20} color={PartnerColors.primary} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Minimum Order Amount</Text>
                <Text style={styles.settingSubtitle}>Required for all orders</Text>
              </View>
            </View>
            <View style={styles.settingInputRow}>
              <TextInput
                style={styles.settingInput}
                value={minOrderAmount}
                onChangeText={setMinOrderAmount}
                keyboardType="decimal-pad"
                placeholder="2"
                placeholderTextColor="#9CA3AF"
              />
              <Text style={styles.settingUnit}>BD</Text>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveSettingsButton}
            onPress={handleSaveSettings}
            activeOpacity={0.8}
          >
            <Icon name="check-circle" size={20} color="#FFFFFF" />
            <Text style={styles.saveSettingsButtonText}>Save Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Other Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OTHER</Text>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => showSnackbar('Platform settings coming soon', 'info')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#F0F4FF' }]}>
                <Icon name="settings" size={20} color="#007AFF" />
              </View>
              <Text style={styles.menuItemText}>Advanced Settings</Text>
            </View>
            <Icon name="chevron-right" size={20} color={PartnerColors.light.text.tertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => showSnackbar('Analytics coming soon', 'info')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#FFF4E6' }]}>
                <Icon name="bar-chart-2" size={20} color="#FF9500" />
              </View>
              <Text style={styles.menuItemText}>Analytics & Reports</Text>
            </View>
            <Icon name="chevron-right" size={20} color={PartnerColors.light.text.tertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => showSnackbar('Notifications coming soon', 'info')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#ECFDF5' }]}>
                <Icon name="bell" size={20} color="#10B981" />
              </View>
              <Text style={styles.menuItemText}>Notifications</Text>
            </View>
            <Icon name="chevron-right" size={20} color={PartnerColors.light.text.tertiary} />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUPPORT</Text>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => showSnackbar('Help center coming soon', 'info')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#F0F4FF' }]}>
                <Icon name="help-circle" size={20} color="#007AFF" />
              </View>
              <Text style={styles.menuItemText}>Help Center</Text>
            </View>
            <Icon name="chevron-right" size={20} color={PartnerColors.light.text.tertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => showSnackbar('About coming soon', 'info')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#F9FAFB' }]}>
                <Icon name="info" size={20} color={PartnerColors.light.text.secondary} />
              </View>
              <Text style={styles.menuItemText}>About</Text>
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
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>SmartBite Admin v1.0.0</Text>
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
});

export default AdminSettingsScreen;
