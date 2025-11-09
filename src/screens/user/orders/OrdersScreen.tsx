// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';
import { Feather as Icon } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../../constants';
import { formatCurrency, formatDate, formatOrderNumber } from '../../../utils';
import EmptyState from '../../../components/EmptyState';
import { supabase } from '../../../lib/supabase';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type OrderStatus = 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered';
type TabType = 'active' | 'past';

interface Order {
  id: string;
  orderNumber: string;
  restaurant: {
    name: string;
    logo: string;
  };
  status: OrderStatus;
  eta?: string;
  total: number;
  createdAt: string;
  rating?: number;
  itemCount: number;
}

const OrdersScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Fetch orders with restaurant info and item count
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          total_amount,
          created_at,
          restaurants (
            name
          ),
          order_items (
            id
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data
      const transformedOrders = orders?.map(order => ({
        id: order.id,
        orderNumber: order.order_number,
        restaurant: {
          name: order.restaurants?.name || 'Restaurant',
          logo: '🍽️',
        },
        status: order.status,
        eta: '15–20 min', // Mock for now
        total: order.total_amount,
        createdAt: order.created_at,
        itemCount: order.order_items?.length || 0,
      })) || [];

      // Split into active and past
      const active = transformedOrders.filter(o => 
        ['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery'].includes(o.status)
      );
      const past = transformedOrders.filter(o => 
        ['delivered', 'cancelled'].includes(o.status)
      );

      setActiveOrders(active);
      setPastOrders(past);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const getStatusInfo = (status: OrderStatus) => {
    const statusMap = {
      pending: { text: 'Order placed', color: '#9E9E9E', icon: 'clock' },
      confirmed: { text: 'Confirmed', color: '#2196F3', icon: 'check' },
      preparing: { text: 'Preparing your order', color: '#FF9800', icon: 'package' },
      ready_for_pickup: { text: 'Ready for pickup', color: '#2196F3', icon: 'shopping-bag' },
      out_for_delivery: { text: 'Out for delivery', color: colors.primary, icon: 'truck' },
      delivered: { text: 'Delivered', color: '#4CAF50', icon: 'check-circle' },
      cancelled: { text: 'Cancelled', color: '#F44336', icon: 'x-circle' },
    };
    return statusMap[status] || { text: 'Unknown', color: '#9E9E9E', icon: 'help-circle' };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleTrackOrder = (orderNumber: string) => {
    navigation.navigate('OrderTracking', { orderNumber });
  };

  const handleViewDetails = (orderId: string, isActive: boolean = false) => {
    navigation.navigate('OrderDetails', { orderId, isActive });
  };

  const handleReorder = (orderId: string) => {
    // TODO: Add items to cart and show toast notification
    console.log('Reorder:', orderId);
    // Success feedback will be shown via toast/snackbar in production
  };

  const handleBrowseRestaurants = () => {
    navigation.navigate('MainTabs');
  };

  const renderActiveOrderCard = (order: Order) => {
    const statusInfo = getStatusInfo(order.status);
    
    return (
      <View key={order.id} style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View style={styles.restaurantInfo}>
            <View style={styles.restaurantLogo}>
              <Text style={styles.restaurantLogoText}>{order.restaurant.logo}</Text>
            </View>
            <View style={styles.restaurantDetails}>
              <Text style={styles.restaurantName}>{order.restaurant.name}</Text>
              <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: `${statusInfo.color}15` }]}>
            <View style={styles.statusDot}>
              <View style={[styles.pulseDot, { backgroundColor: statusInfo.color }]} />
            </View>
            <Icon name={statusInfo.icon as any} size={14} color={statusInfo.color} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.text}
            </Text>
          </View>
        </View>

        <View style={styles.orderMeta}>
          {order.eta && (
            <View style={styles.metaItem}>
              <Icon name="clock" size={14} color="#6D6D6D" />
              <Text style={styles.metaText}>ETA: {order.eta}</Text>
            </View>
          )}
          <View style={styles.metaItem}>
            <Icon name="shopping-bag" size={14} color="#6D6D6D" />
            <Text style={styles.metaText}>{order.itemCount} items</Text>
          </View>
          <Text style={styles.orderTotal}>BD {order.total.toFixed(2)}</Text>
        </View>

        <View style={styles.activeOrderActions}>
          <TouchableOpacity
            style={styles.trackButton}
            onPress={() => handleTrackOrder(order.orderNumber)}
            activeOpacity={0.7}
          >
            <Text style={styles.trackButtonText}>Track Order</Text>
            <Icon name="arrow-right" size={16} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.detailsButtonActive}
            onPress={() => handleViewDetails(order.id, true)}
            activeOpacity={0.7}
          >
            <Icon name="file-text" size={16} color="#6D6D6D" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPastOrderCard = (order: Order) => {
    return (
      <View key={order.id} style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View style={styles.restaurantInfo}>
            <View style={styles.restaurantLogo}>
              <Text style={styles.restaurantLogoText}>{order.restaurant.logo}</Text>
            </View>
            <View style={styles.restaurantDetails}>
              <View style={styles.restaurantTopRow}>
                <Text style={styles.restaurantName}>{order.restaurant.name}</Text>
                <Text style={styles.orderTotal}>BD {order.total.toFixed(2)}</Text>
              </View>
              <View style={styles.restaurantMetaRow}>
                {order.rating && (
                  <>
                    <View style={styles.ratingBadge}>
                      <Icon name="star" size={12} color="#FFB800" />
                      <Text style={styles.ratingText}>{order.rating.toFixed(1)}</Text>
                    </View>
                    <Text style={styles.metaDot}>•</Text>
                  </>
                )}
                <Text style={styles.orderDateCompact}>
                  Delivered {formatDate(order.createdAt)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.pastOrderActions}>
          <TouchableOpacity
            style={styles.reorderButton}
            onPress={() => handleReorder(order.id)}
            activeOpacity={0.7}
          >
            <Icon name="refresh-cw" size={16} color={colors.primary} />
            <Text style={styles.reorderButtonText}>Reorder</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => handleViewDetails(order.id, false)}
            activeOpacity={0.7}
          >
            <Text style={styles.detailsButtonText}>View Details</Text>
            <Icon name="chevron-right" size={16} color="#6D6D6D" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmptyState = (type: 'active' | 'past') => {
    if (type === 'active') {
      return (
        <EmptyState
          emoji="🍽️"
          title="No Active Orders"
          message="You don't have any orders in progress right now"
          buttonText="Browse Restaurants"
          onButtonPress={handleBrowseRestaurants}
        />
      );
    } else {
      return (
        <EmptyState
          emoji="📦"
          title="No Past Orders Yet"
          message="Your order history will appear here once you place your first order"
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Orders</Text>
          <Text style={styles.headerSubtitle}>View your active and past orders</Text>
        </View>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.tabActive]}
          onPress={() => setActiveTab('active')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
            Active
          </Text>
          {activeOrders.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activeOrders.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.tabActive]}
          onPress={() => setActiveTab('past')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.tabTextActive]}>
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        >
        <View style={styles.ordersContainer}>
          {activeTab === 'active' && (
            <>
              {activeOrders.length > 0 ? (
                activeOrders.map(renderActiveOrderCard)
              ) : (
                renderEmptyState('active')
              )}
            </>
          )}

          {activeTab === 'past' && (
            <>
              {pastOrders.length > 0 ? (
                pastOrders.map(renderPastOrderCard)
              ) : (
                renderEmptyState('past')
              )}
            </>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
      )}
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
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.sm,
    marginHorizontal: SPACING.xs,
  },
  tabActive: {
    backgroundColor: '#F3F7F5',
    shadowColor: colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tabText: {
    fontSize: FONT_SIZE.base,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabTextDisabled: {
    color: '#CFCFCF',
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    marginLeft: SPACING.sm,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  ordersContainer: {
    padding: SPACING.lg,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.lg + 2,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  orderHeader: {
    marginBottom: SPACING.md,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantLogo: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  restaurantLogoText: {
    fontSize: 24,
  },
  restaurantDetails: {
    flex: 1,
  },
  restaurantTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  restaurantMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  restaurantName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 13,
    color: '#6D6D6D',
  },
  orderDate: {
    fontSize: 13,
    color: '#8D8D8D',
  },
  orderDateCompact: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '500',
  },
  metaDot: {
    fontSize: 12,
    color: '#CFCFCF',
    marginHorizontal: 2,
  },
  statusContainer: {
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  orderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#6D6D6D',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 'auto',
  },
  activeOrderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  trackButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F7F5',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 126, 115, 0.25)',
    gap: 6,
    shadowColor: colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  trackButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  detailsButtonActive: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pastOrderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFF7E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#212121',
  },
  pastOrderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  reorderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F7F5',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(0, 126, 115, 0.3)',
    gap: 6,
    shadowColor: colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  reorderButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  detailsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 6,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6D6D6D',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#6D6D6D',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  browseButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default OrdersScreen;
