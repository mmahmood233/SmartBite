import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Feather as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants';
import { useLanguage } from '../../contexts/LanguageContext';
import { useActiveDelivery } from '../../hooks/useActiveDelivery';
import { updateDeliveryStatus } from '../../services/delivery.service';
import { getRiderProfile, insertRiderLocationPoint } from '../../services/rider.service';
import { supabase } from '../../lib/supabase';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'RiderActiveDelivery'>;

const RiderActiveDeliveryScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { t } = useLanguage();
  const [riderId, setRiderId] = useState<string | null>(null);
  const { delivery, loading, error, refetch } = useActiveDelivery(riderId || '');
  const [updating, setUpdating] = useState(false);

  // Load rider profile
  useEffect(() => {
    loadRiderProfile();
  }, []);

  const loadRiderProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const rider = await getRiderProfile(user.id);
      if (rider) {
        setRiderId(rider.id);
      }
    } catch (err) {
      console.error('Error loading rider profile:', err);
    }
  };

  const handleStatusUpdate = async () => {
    if (!delivery || !riderId) return;

    // ULTRA SIMPLE: Just mark as delivered instantly
    try {
      setUpdating(true);
      console.log('🚀 STARTING DELIVERY COMPLETION:', {
        deliveryId: delivery.id,
        orderId: delivery.order_id,
        riderId,
      });

      // Mock GPS location
      await insertRiderLocationPoint(
        riderId,
        delivery.order_id,
        26.2285,
        50.5860
      );
      console.log('✅ GPS location inserted');

      // Instantly mark as delivered
      console.log('📦 Calling updateDeliveryStatus...');
      const result = await updateDeliveryStatus(delivery.id, 'delivered' as any);
      console.log('✅ updateDeliveryStatus returned:', result);

      // Only navigate if successful
      console.log('✅ DELIVERY COMPLETED SUCCESSFULLY');
      Alert.alert(t('common.success'), 'Delivery Complete!');
      
      // Wait a bit before navigating
      setTimeout(() => {
        navigation.navigate('RiderHome');
      }, 1000);
    } catch (err: any) {
      console.error('❌ DELIVERY COMPLETION FAILED:', err);
      Alert.alert('Error', err.message || 'Failed to complete delivery');
    } finally {
      setUpdating(false);
    }
  };

  const openMaps = (address: string) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(address)}`,
      android: `geo:0,0?q=${encodeURIComponent(address)}`,
    });
    if (url) {
      Linking.openURL(url);
    }
  };

  const callPhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const getStatusText = () => {
    return 'Ready to Deliver';
  };

  const getButtonText = () => {
    return 'Complete Delivery';
  };

  const getProgressPercentage = () => {
    return 50;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>{t('common.loading')}...</Text>
      </View>
    );
  }

  if (!delivery) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Icon name="inbox" size={64} color={colors.textDisabled} />
        <Text style={styles.emptyTitle}>{t('rider.noActiveDelivery')}</Text>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.goBackButtonText}>{t('common.goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{t('rider.activeDelivery')}</Text>
          <Text style={styles.headerSubtitle}>Order #{delivery.order_id.slice(0, 8)}</Text>
        </View>
        <View style={styles.earningsBadge}>
          <Text style={styles.earningsText}>BD {delivery.total.toFixed(2)}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Status Progress */}
        <View style={styles.statusSection}>
          <View style={styles.statusHeader}>
            <Icon name="truck" size={24} color={colors.primary} />
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${getProgressPercentage()}%` }]} />
          </View>
          <Text style={styles.statusSubtitle}>
            Tap button below to complete delivery
          </Text>
        </View>

        {/* Pickup Location */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircleLarge}>
              <Icon name="shopping-bag" size={20} color={colors.primary} />
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardLabel}>{t('rider.pickupLocation')}</Text>
              <Text style={styles.cardTitle}>{delivery.pickup_location.name}</Text>
            </View>
          </View>

          <Text style={styles.address}>{delivery.pickup_location.address}</Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => callPhone(delivery.pickup_location.phone)}
            >
              <Icon name="phone" size={18} color={colors.primary} />
              <Text style={styles.actionButtonText}>{t('common.call')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => openMaps(delivery.pickup_location.address)}
            >
              <Icon name="navigation" size={18} color={colors.primary} />
              <Text style={styles.actionButtonText}>{t('common.navigate')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery Location */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircleLarge, { backgroundColor: '#FEE9E9' }]}>
              <Icon name="map-pin" size={20} color={colors.error} />
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardLabel}>{t('rider.deliveryLocation')}</Text>
              <Text style={styles.cardTitle}>{delivery.delivery_location.name}</Text>
            </View>
          </View>

          <Text style={styles.address}>{delivery.delivery_location.address}</Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => callPhone(delivery.delivery_location.phone)}
            >
              <Icon name="phone" size={18} color={colors.primary} />
              <Text style={styles.actionButtonText}>{t('common.call')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => openMaps(delivery.delivery_location.address)}
            >
              <Icon name="navigation" size={18} color={colors.primary} />
              <Text style={styles.actionButtonText}>{t('common.navigate')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Info */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>{t('rider.orderInformation')}</Text>
          
          {/* Order Items List */}
          {delivery.order_items.map((item: any, index: number) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.dish_name}</Text>
                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>
                BD {((item.unit_price || 0) * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('common.total')}</Text>
            <Text style={styles.infoValue}>BD {delivery.total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Action Button */}
      {delivery.status !== 'delivered' && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.statusButton}
            onPress={handleStatusUpdate}
            activeOpacity={0.8}
            disabled={updating}
          >
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.statusButtonGradient}
            >
              <Text style={styles.statusButtonText}>{getButtonText()}</Text>
              <Icon name="check" size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
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
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  earningsBadge: {
    backgroundColor: '#E8F7F4',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  earningsText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  statusSection: {
    backgroundColor: colors.surface,
    padding: SPACING.xl,
    marginBottom: SPACING.md,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statusText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  iconCircleLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F7F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: {
    flex: 1,
  },
  cardLabel: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  address: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    backgroundColor: colors.surfaceLight,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
  },
  actionButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: colors.primary,
  },
  cardSectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  earningsValue: {
    color: colors.primary,
    fontWeight: '700',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  statusButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  statusButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
  },
  statusButtonText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxxl,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  itemName: {
    fontSize: FONT_SIZE.md,
    color: colors.textPrimary,
    flex: 1,
  },
  itemQuantity: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  itemPrice: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  goBackButton: {
    padding: 8,
  },
  goBackButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default RiderActiveDeliveryScreen;
