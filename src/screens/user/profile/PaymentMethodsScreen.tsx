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

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface PaymentMethod {
  id: string;
  type: 'card' | 'benefitpay' | 'cod';
  cardType?: 'visa' | 'mastercard';
  lastFour?: string;
  expiryDate?: string;
  isDefault: boolean;
  icon: string;
  label: string;
}

const PaymentMethodsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useLanguage();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'warning' | 'info' }>({ visible: false, message: '', type: 'success' });

  useEffect(() => {
    loadPaymentMethods();
    
    const unsubscribe = navigation.addListener('focus', () => {
      loadPaymentMethods();
    });

    return unsubscribe;
  }, [navigation]);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedMethods = data?.map(pm => ({
        id: pm.id,
        type: pm.type,
        cardType: null,
        lastFour: pm.card_number_last4,
        expiryDate: pm.expiry_month && pm.expiry_year ? `${pm.expiry_month}/${pm.expiry_year.slice(-2)}` : undefined,
        isDefault: pm.is_default,
        icon: pm.type === 'card' ? 'credit-card' : pm.type === 'cash' ? 'dollar-sign' : 'wallet',
        label: pm.type === 'card' ? `Card ••${pm.card_number_last4}` : pm.type === 'cash' ? 'Cash on Delivery' : 'Digital Wallet',
      })) || [];

      setPaymentMethods(transformedMethods);
    } catch (error) {
      console.error('Error loading payment methods:', error);
      showSnackbar(t('payment.loadError') || 'Failed to load payment methods', 'error');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPaymentMethods();
    setRefreshing(false);
  };

  const showSnackbar = (message: string, type: 'success' | 'error' = 'success') => {
    setSnackbar({ visible: true, message, type });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleDeletePayment = (id: string, label: string) => {
    Alert.alert(
      t('payment.removePayment'),
      t('payment.deleteConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.remove'),
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              const { error } = await supabase
                .from('payment_methods')
                .delete()
                .eq('id', id);

              if (error) throw error;

              setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
              showSnackbar(t('payment.removed') || 'Payment method removed', 'success');
            } catch (error) {
              console.error('Error deleting payment method:', error);
              showSnackbar(t('common.error'), 'error');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleSetDefault = async (id: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;

      setPaymentMethods(
        paymentMethods.map(pm => ({
          ...pm,
          isDefault: pm.id === id,
        }))
      );
      
      showSnackbar(t('payment.defaultUpdated') || 'Default payment method updated', 'success');
    } catch (error) {
      console.error('Error setting default payment:', error);
      showSnackbar(t('common.error'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPayment = () => {
    navigation.navigate('AddPaymentMethod');
  };

  const renderPaymentCard = (payment: PaymentMethod) => (
    <View key={payment.id} style={styles.paymentCard}>
      {/* Icon */}
      <View style={styles.paymentIconContainer}>
        <Icon name={payment.icon} size={20} color={colors.primary} />
      </View>

      {/* Payment Info */}
      <View style={styles.paymentInfo}>
        <View style={styles.paymentHeader}>
          <Text style={styles.paymentLabel}>
            {payment.label}
            {payment.lastFour && ` •••• ${payment.lastFour}`}
          </Text>
          {payment.isDefault && (
            <View style={styles.defaultBadge}>
              <MaterialCommunityIcons name="check-circle" size={14} color={colors.primary} />
              <Text style={styles.defaultText}>{t('payment.default') || t('addresses.default')}</Text>
            </View>
          )}
        </View>
        
        {payment.expiryDate && (
          <Text style={styles.expiryText}>{t('payment.expires')} {payment.expiryDate}</Text>
        )}

        {/* Action Buttons */}
        <View style={styles.paymentActions}>
          {!payment.isDefault && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleSetDefault(payment.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.actionButtonText}>{t('payment.setAsDefault')}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeletePayment(payment.id, payment.label)}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteButtonText}>{t('common.remove')}</Text>
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
          <Text style={styles.headerTitle}>{t('payment.title')}</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>{t('payment.loading') || 'Loading payment methods...'}</Text>
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
        <Text style={styles.headerTitle}>Payment Methods</Text>
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
        {paymentMethods.length === 0 ? (
          <EmptyState
            emoji="💳"
            title={t('payment.noMethods')}
            message={t('payment.noMethodsMessage')}
          />
        ) : (
          <View style={styles.paymentsContainer}>
            {paymentMethods.map(renderPaymentCard)}
          </View>
        )}

        {/* Add New Payment Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddPayment}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addButtonGradient}
          >
            <Icon name="plus" size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>{t('payment.addPaymentMethod')}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Bottom Spacing */}
        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>

      <LoadingSpinner visible={isLoading} message="Removing..." overlay />
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
  paymentsContainer: {
    padding: SPACING.lg,
  },
  paymentCard: {
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
  paymentIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: '#E6F7F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  paymentLabel: {
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
  expiryText: {
    fontSize: FONT_SIZE.sm,
    color: '#64748B',
    marginBottom: SPACING.md,
  },
  paymentActions: {
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

export default PaymentMethodsScreen;
