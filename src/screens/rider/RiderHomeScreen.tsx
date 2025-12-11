import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Feather as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants';
import { useLanguage } from '../../contexts/LanguageContext';
import { useRiderOrders } from '../../hooks/useRiderOrders';
import { getRiderProfile, updateRiderStatus } from '../../services/rider.service';
import { acceptOrder, getActiveDelivery } from '../../services/delivery.service';
import { supabase } from '../../lib/supabase';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RiderHomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useLanguage();
  const { orders, loading, error, refetch } = useRiderOrders();
  const [isOnline, setIsOnline] = useState(false);
  const [riderId, setRiderId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [activeDelivery, setActiveDelivery] = useState<any>(null);

  // Load rider profile and status
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
        setIsOnline(rider.status === 'online');
        
        // Check for active delivery
        const delivery = await getActiveDelivery(rider.id);
        setActiveDelivery(delivery);
      }
    } catch (err) {
      console.error('Error loading rider profile:', err);
    }
  };

  const toggleOnlineStatus = async () => {
    if (!riderId) {
      Alert.alert('Error', 'Rider profile not found. Please contact support.');
      return;
    }

    try {
      const newStatus = isOnline ? 'offline' : 'online';
      const success = await updateRiderStatus(riderId, newStatus);
      if (success) {
        setIsOnline(!isOnline);
      } else {
        Alert.alert('Error', 'Failed to update status. Please try again.');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleAcceptOrder = async (orderId: string) => {
    if (!riderId) {
      Alert.alert('Error', 'Rider profile not found');
      return;
    }

    // Check if rider already has an active delivery
    if (activeDelivery) {
      Alert.alert(
        'Active Delivery in Progress',
        'You can only handle one delivery at a time. Please complete your current delivery before accepting a new order.',
        [
          {
            text: 'View Current Delivery',
            onPress: () => navigation.navigate('RiderActiveDelivery', { orderId: activeDelivery.order_id }),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
      return;
    }

    try {
      setAccepting(true);
      // Find the order to get earnings
      const order = orders.find(o => o.id === orderId);
      const earnings = order?.estimated_earnings || 0;
      
      const success = await acceptOrder(orderId, riderId, earnings);
      
      if (success) {
        // Refresh to get the new active delivery
        await loadRiderProfile();
        
        Alert.alert(
          t('common.success'),
          'Order accepted successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('RiderActiveDelivery', { orderId }),
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to accept order');
      }
    } catch (err: any) {
      console.error('Error accepting order:', err);
      Alert.alert('Error', err.message || 'Failed to accept order');
    } finally {
      setAccepting(false);
    }
  };

  const renderOrderCard = (order: any) => (
    <View key={order.id} style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>Order #{order.id.slice(0, 8)}</Text>
          <Text style={styles.restaurantName}>{order.restaurant_name}</Text>
        </View>
        <View style={styles.earningsBadge}>
          <Text style={styles.earningsText}>BD {order.earnings}</Text>
        </View>
      </View>

      <View style={styles.locationSection}>
        <View style={styles.locationRow}>
          <View style={styles.iconCircle}>
            <Icon name="shopping-bag" size={16} color={colors.primary} />
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Pickup</Text>
            <Text style={styles.locationAddress}>{order.restaurant_address}</Text>
          </View>
        </View>

        <View style={styles.dashedLine} />

        <View style={styles.locationRow}>
          <View style={styles.iconCircle}>
            <Icon name="map-pin" size={16} color={colors.error} />
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Delivery</Text>
            <Text style={styles.locationAddress}>{order.delivery_address}</Text>
          </View>
        </View>
      </View>

      <View style={styles.orderMeta}>
        <View style={styles.metaItem}>
          <Icon name="navigation" size={14} color={colors.textSecondary} />
          <Text style={styles.metaText}>{order.distance} km</Text>
        </View>
        <View style={styles.metaItem}>
          <Icon name="clock" size={14} color={colors.textSecondary} />
          <Text style={styles.metaText}>{order.estimated_time} min</Text>
        </View>
        <View style={styles.metaItem}>
          <Icon name="package" size={14} color={colors.textSecondary} />
          <Text style={styles.metaText}>{order.items_count} items</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.acceptButton, activeDelivery && styles.acceptButtonDisabled]}
        onPress={() => handleAcceptOrder(order.id)}
        activeOpacity={0.8}
        disabled={!!activeDelivery}
      >
        <LinearGradient
          colors={activeDelivery 
            ? [colors.textDisabled, colors.textDisabled] 
            : [colors.gradientStart, colors.gradientMid, colors.gradientEnd]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.acceptButtonGradient}
        >
          <Text style={styles.acceptButtonText}>
            {activeDelivery ? 'Busy with Delivery' : 'Accept Order'}
          </Text>
          <Icon name={activeDelivery ? 'lock' : 'arrow-right'} size={18} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Available Orders</Text>
          <Text style={styles.headerSubtitle}>
            {isOnline ? 'You are online' : 'You are offline'}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.statusToggle, isOnline && styles.statusToggleOnline]}
          onPress={toggleOnlineStatus}
          activeOpacity={0.7}
        >
          <Icon
            name={isOnline ? 'zap' : 'zap-off'}
            size={20}
            color={isOnline ? '#FFFFFF' : colors.textSecondary}
          />
          <Text style={[styles.statusText, isOnline && styles.statusTextOnline]}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Active Delivery Banner */}
      {activeDelivery && (
        <TouchableOpacity
          style={styles.activeDeliveryBanner}
          onPress={() => navigation.navigate('RiderActiveDelivery', { orderId: activeDelivery.order_id })}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#00A896', '#02C39A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.activeDeliveryGradient}
          >
            <View style={styles.activeDeliveryContent}>
              <View style={styles.activeDeliveryIcon}>
                <Icon name="truck" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.activeDeliveryText}>
                <Text style={styles.activeDeliveryTitle}>Active Delivery</Text>
                <Text style={styles.activeDeliverySubtitle}>
                  Order #{activeDelivery.orders?.order_number || 'N/A'}
                </Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      )}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {!isOnline ? (
          <View style={styles.offlineState}>
            <Icon name="zap-off" size={64} color={colors.textDisabled} />
            <Text style={styles.offlineTitle}>You're Offline</Text>
            <Text style={styles.offlineText}>
              Go online to start receiving delivery requests
            </Text>
            <TouchableOpacity
              style={styles.goOnlineButton}
              onPress={toggleOnlineStatus}
            >
              <Text style={styles.goOnlineButtonText}>Go Online</Text>
            </TouchableOpacity>
          </View>
        ) : loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading orders...</Text>
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="inbox" size={64} color={colors.textDisabled} />
            <Text style={styles.emptyTitle}>{t('rider.noOrders')}</Text>
            <Text style={styles.emptyText}>
              {t('rider.noOrdersMessage')}
            </Text>
          </View>
        ) : (
          <View style={styles.ordersContainer}>
            {orders.map(renderOrderCard)}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statusToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: colors.surfaceLight,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
  },
  activeDeliveryBanner: {
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activeDeliveryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  activeDeliveryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  activeDeliveryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDeliveryText: {
    flex: 1,
  },
  activeDeliveryTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  activeDeliverySubtitle: {
    fontSize: FONT_SIZE.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  statusToggleOnline: {
    backgroundColor: colors.primary,
  },
  statusText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  statusTextOnline: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  ordersContainer: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  orderNumber: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: colors.textPrimary,
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
  locationSection: {
    marginBottom: SPACING.lg,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: FONT_SIZE.md,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  dashedLine: {
    height: 24,
    width: 2,
    marginLeft: 17,
    marginVertical: 4,
    borderLeftWidth: 2,
    borderLeftColor: colors.border,
    borderStyle: 'dashed',
  },
  orderMeta: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
  },
  acceptButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  acceptButtonDisabled: {
    opacity: 0.6,
  },
  acceptButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  acceptButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  offlineState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: 100,
  },
  offlineTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  offlineText: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  goOnlineButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  goOnlineButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
  },
});

export default RiderHomeScreen;
