// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather as Icon } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../../constants';
import EmptyState from '../../../components/EmptyState';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Snackbar from '../../../components/Snackbar';
import { supabase } from '../../../lib/supabase';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getUserAddresses, deleteAddress, setDefaultAddress, formatAddress, UserAddress } from '../../../services/user-addresses.service';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Using UserAddress from service

const SavedAddressesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useLanguage();

  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'warning' | 'info' }>({ visible: false, message: '', type: 'success' });

  useEffect(() => {
    loadAddresses();
    
    // Reload addresses when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadAddresses();
    });

    return unsubscribe;
  }, [navigation]);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data
      const transformedAddresses = data?.map(addr => ({
        id: addr.id,
        title: addr.label,
        address: `${addr.address_line1}${addr.address_line2 ? ', ' + addr.address_line2 : ''}`,
        building: addr.building,
        area: addr.area,
        isDefault: addr.is_default,
        icon: addr.label.toLowerCase() === 'home' ? 'home' : addr.label.toLowerCase() === 'work' ? 'briefcase' : 'map-pin',
      })) || [];

      setAddresses(transformedAddresses);
    } catch (error) {
      console.error('Error loading addresses:', error);
      showSnackbar(t('addresses.loadError') || 'Failed to load addresses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAddresses();
    setRefreshing(false);
  };

  const showSnackbar = (message: string, type: 'success' | 'error' = 'success') => {
    setSnackbar({ visible: true, message, type });
  };


  const handleBack = () => {
    navigation.goBack();
  };

  const handleDeleteAddress = (id: string, title: string) => {
    Alert.alert(
      t('addresses.deleteAddress'),
      t('addresses.deleteConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              const { error } = await supabase
                .from('addresses')
                .delete()
                .eq('id', id);

              if (error) throw error;

              setAddresses(addresses.filter(addr => addr.id !== id));
              showSnackbar(t('addresses.addressRemoved'), 'success');
            } catch (error) {
              console.error('Error deleting address:', error);
              showSnackbar(t('common.error'), 'error');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleEditAddress = (address: Address) => {
    navigation.navigate('EditAddress', { addressId: address.id });
  };

  const handleSetDefault = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Update address to be default (trigger will handle unsetting others)
      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setAddresses(
        addresses.map(addr => ({
          ...addr,
          isDefault: addr.id === id,
        }))
      );
      
      showSnackbar(t('addresses.defaultUpdated') || 'Default address updated', 'success');
    } catch (error) {
      console.error('Error setting default address:', error);
      showSnackbar(t('common.error'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewAddress = () => {
    navigation.navigate('AddAddress');
  };

  const renderAddressCard = (address: Address) => (
    <View key={address.id} style={styles.addressCard}>
      {/* Icon */}
      <View style={styles.addressIconContainer}>
        <Icon name={address.icon} size={20} color={colors.primary} />
      </View>

      {/* Address Info */}
      <View style={styles.addressInfo}>
        <View style={styles.addressHeader}>
          <Text style={styles.addressTitle}>{address.title}</Text>
          {address.isDefault && (
            <View style={styles.defaultBadge}>
              <MaterialCommunityIcons name="check-circle" size={14} color={colors.primary} />
              <Text style={styles.defaultText}>{t('addresses.default')}</Text>
            </View>
          )}
        </View>
        <Text style={styles.addressText} numberOfLines={2}>
          {address.address}
        </Text>

        {/* Action Buttons */}
        <View style={styles.addressActions}>
          {!address.isDefault && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleSetDefault(address.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.actionButtonText}>{t('addresses.setAsDefault')}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditAddress(address)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>{t('common.edit')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteAddress(address.id, address.title)}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteButtonText}>{t('common.delete')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('addresses.title')}</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>{t('addresses.loading') || 'Loading addresses...'}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('addresses.title')}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {addresses.length === 0 ? (
          <EmptyState
            emoji="🏠"
            title={t('addresses.noAddresses')}
            message={t('addresses.noAddressesMessage')}
          />
        ) : (
          <View style={styles.addressesContainer}>
            {addresses.map(renderAddressCard)}
          </View>
        )}

        {/* Add New Address Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNewAddress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addButtonGradient}
          >
            <Icon name="plus" size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>{t('addresses.addNewAddress')}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Bottom Spacing */}
        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>

      <LoadingSpinner visible={isLoading} message="Deleting..." overlay />
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: '#0F172A',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  addressesContainer: {
    padding: SPACING.lg,
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xxl,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  addressIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: '#E6F7F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  addressInfo: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  addressTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: '#0F172A',
    marginRight: SPACING.sm,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F7F4',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    gap: 4,
  },
  defaultText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: colors.primary,
  },
  addressText: {
    fontSize: FONT_SIZE.md,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  addressActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  actionButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    color: colors.primary,
  },
  deleteButton: {
    borderColor: '#FEE2E2',
  },
  deleteButtonText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    color: colors.error,
  },
  addButton: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  addButtonText: {
    fontSize: FONT_SIZE.base,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default SavedAddressesScreen;
