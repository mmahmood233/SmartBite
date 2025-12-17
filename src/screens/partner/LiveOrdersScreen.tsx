/**
 * Wajba Partner - Orders Screen
 * Complete order management - New, Preparing, Ready, Completed, Cancelled
 * Talabat Partner quality - Accept/Reject system, filters, professional polish
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import PartnerTopNav from '../../components/partner/PartnerTopNav';
import { PartnerColors, PartnerSpacing, PartnerBorderRadius, PartnerTypography } from '../../constants/partnerTheme';
import { getStrings } from '../../constants/partnerStrings';
import Snackbar, { SnackbarType } from '../../components/Snackbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  getPartnerOrders,
  getNewOrders,
  getActiveOrders,
  acceptOrder,
  rejectOrder,
  updateOrderStatus,
  PartnerOrder,
} from '../../services/partner-orders.service';
import { useFocusEffect } from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const strings = getStrings('en');

const LiveOrdersScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState('pending');
  
  // Refs for scrolling
  const scrollViewRef = useRef<ScrollView>(null);
  const newOrdersRef = useRef<View>(null);
  const activeOrdersRef = useRef<View>(null);
  
  // Data state
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [orders, setOrders] = useState<PartnerOrder[]>([]);
  const [newOrders, setNewOrders] = useState<PartnerOrder[]>([]);
  const [activeOrders, setActiveOrders] = useState<PartnerOrder[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  
  // Snackbar state
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<SnackbarType>('success');
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Processing...');
  const [initialLoading, setInitialLoading] = useState(true);

  // Filter tabs with dynamic badges
  const filterTabs = [
    { id: 'pending', label: t('partner.newOrders'), badge: newOrders.length || null },
    { id: 'active', label: t('partner.activeOrders'), badge: activeOrders.length || null },
    { id: 'delivered', label: t('partner.completedOrders'), badge: orders.filter(o => o.status === 'delivered').length || null },
  ];

  const showSnackbar = (message: string, type: SnackbarType = 'success') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  // Get partner's restaurant ID
  useEffect(() => {
    const fetchRestaurantId = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Current user:', user?.email);
        if (!user) {
          console.log('No user logged in');
          return;
        }

        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single();

        console.log('User data:', userData);

        if (userData) {
          const { data: restaurant, error: restaurantError } = await supabase
            .from('restaurants')
            .select('id, name')
            .eq('partner_id', userData.id)
            .single();

          console.log('Restaurant data:', restaurant);
          console.log('Restaurant error:', restaurantError);

          if (restaurant) {
            console.log('Setting restaurant ID:', restaurant.id, 'Name:', restaurant.name);
            setRestaurantId(restaurant.id);
          } else {
            console.log('No restaurant found for this partner');
          }
        }
      } catch (error) {
        console.error('Error fetching restaurant ID:', error);
      }
    };

    fetchRestaurantId();
  }, []);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    if (!restaurantId) {
      console.log('No restaurant ID yet');
      return;
    }

    console.log('Fetching orders for restaurant:', restaurantId);
    console.log('Selected filter:', selectedFilter);

    try {
      const [allOrders, newOrdersList, activeOrdersList] = await Promise.all([
        getPartnerOrders(restaurantId, selectedFilter),
        getNewOrders(restaurantId),
        getActiveOrders(restaurantId),
      ]);

      console.log('Sample order with rider:', allOrders[0]);

      console.log('All orders:', allOrders.length);
      console.log('New orders:', newOrdersList.length);
      console.log('Active orders:', activeOrdersList.length);

      setOrders(allOrders);
      setNewOrders(newOrdersList);
      setActiveOrders(activeOrdersList);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showSnackbar('Failed to load orders', 'error');
    } finally {
      setInitialLoading(false);
      setRefreshing(false);
    }
  }, [restaurantId, selectedFilter]);

  // Load orders on mount and when filter changes
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (restaurantId) {
        fetchOrders();
      }
    }, [restaurantId, fetchOrders])
  );

  // Real-time subscription for new orders
  useEffect(() => {
    if (!restaurantId) return;

    console.log('Setting up real-time subscription for restaurant:', restaurantId);

    // Subscribe to orders table changes
    const ordersSubscription = supabase
      .channel('partner-orders')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'orders',
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          console.log('Real-time order update:', payload);
          
          // Refresh orders when any change happens
          fetchOrders();
          
          // Show notification for new orders
          if (payload.eventType === 'INSERT') {
            showSnackbar('🔔 New order received!', 'success');
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(ordersSubscription);
    };
  }, [restaurantId, fetchOrders]);

  const handleAcceptOrder = async (orderId: string) => {
    setIsLoading(true);
    setLoadingMessage('Accepting order...');
    try {
      await acceptOrder(orderId, 30); // 30 minutes estimated time
      showSnackbar('Order accepted successfully', 'success');
      await fetchOrders(); // Refresh orders
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to accept order', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    setIsLoading(true);
    setLoadingMessage('Rejecting order...');
    try {
      await rejectOrder(orderId, 'Restaurant is busy');
      showSnackbar('Order rejected', 'warning');
      await fetchOrders(); // Refresh orders
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to reject order', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkReady = async (orderId: string) => {
    setIsLoading(true);
    setLoadingMessage('Updating status...');
    try {
      await updateOrderStatus(orderId, 'ready_for_pickup');
      showSnackbar('Order marked as ready', 'success');
      await fetchOrders(); // Refresh orders
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to update status', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Removed - Restaurant cannot mark as delivered, only rider can
  // const handleMarkCompleted = async (orderId: string) => {
  //   Restaurant can only mark as ready_for_pickup
  // };

  const handleStartPreparing = async (orderId: string) => {
    setIsLoading(true);
    setLoadingMessage('Updating status...');
    try {
      await updateOrderStatus(orderId, 'preparing');
      showSnackbar('Order is now being prepared', 'success');
      await fetchOrders(); // Refresh orders
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to update status', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter selection and scroll to section
  const handleFilterSelect = (filterId: string) => {
    setSelectedFilter(filterId);
    
    // Scroll to appropriate section
    setTimeout(() => {
      if (filterId === 'pending' && newOrdersRef.current) {
        newOrdersRef.current.measureLayout(
          scrollViewRef.current as any,
          (x, y) => {
            scrollViewRef.current?.scrollTo({ y: y - 20, animated: true });
          },
          () => {}
        );
      } else if (filterId === 'active' && activeOrdersRef.current) {
        activeOrdersRef.current.measureLayout(
          scrollViewRef.current as any,
          (x, y) => {
            scrollViewRef.current?.scrollTo({ y: y - 20, animated: true });
          },
          () => {}
        );
      } else {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }
    }, 100);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Top Navigation Bar */}
      <PartnerTopNav 
        title={t('partner.orders')}
        showBranding={true}
        showDropdown={false}
        showNotification={true}
        hasNotification={true}
      />

      {/* Filter Tabs */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
        {filterTabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.filterTab, selectedFilter === tab.id && styles.filterTabActive]}
            onPress={() => handleFilterSelect(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterTabText, selectedFilter === tab.id && styles.filterTabTextActive]}>
              {tab.label}
            </Text>
            {tab.badge && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{tab.badge}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
        </ScrollView>
      </View>

      <View style={styles.sectionDivider} />

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* New Orders Section */}
        {selectedFilter === 'pending' && (
          <View ref={newOrdersRef} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionIcon}>🆕</Text>
                <Text style={styles.sectionTitle}>{t('partner.newOrders')}</Text>
              </View>
            </View>

            {newOrders.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="inbox" size={48} color="#D1D5DB" />
                <Text style={styles.emptyStateTitle}>{t('partner.noNewOrders')}</Text>
                <Text style={styles.emptyStateText}>{t('partner.allCaughtUp')}</Text>
              </View>
            ) : (
              newOrders.map((order) => (
              <TouchableOpacity
                key={order.id}
                style={styles.newOrderCard}
                onPress={() => navigation.navigate('PartnerOrderDetails', { orderId: order.id })}
                activeOpacity={0.9}
              >
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>{order.order_number}</Text>
                  <Text style={styles.orderTotal}>BD {order.total_amount.toFixed(3)}</Text>
                  <View style={styles.orderTimeContainer}>
                    <Icon name="clock" size={12} color="#9CA3AF" />
                    <Text style={styles.orderTime}>{new Date(order.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</Text>
                  </View>
                </View>

                <Text style={styles.orderCustomer}>{order.users?.full_name || t('partner.customer')} • {order.order_items?.length || 0} {order.order_items?.length === 1 ? t('partner.item') : t('partner.items')}</Text>

                {order.rider_id && order.riders && (
                  <View style={styles.riderInfo}>
                    <Icon name="truck" size={12} color={colors.textSecondary} />
                    <Text style={styles.riderText}>Rider: {order.riders.full_name}</Text>
                  </View>
                )}

                <View style={styles.expiresContainer}>
                  <Icon name="alert-circle" size={14} color="#FF9500" />
                  <Text style={styles.expiresText}>New order - Please respond</Text>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => handleAcceptOrder(order.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.acceptButtonText}>{t('partner.accept')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => handleRejectOrder(order.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.rejectButtonText}>{t('partner.reject')}</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {/* Active Orders Section */}
        {selectedFilter === 'active' && (
        <View ref={activeOrdersRef} style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionIcon}>📦</Text>
              <Text style={styles.sectionTitle}>{t('partner.activeOrders')}</Text>
            </View>
          </View>

          {activeOrders.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="package" size={48} color="#D1D5DB" />
              <Text style={styles.emptyStateTitle}>{t('partner.noActiveOrders')}</Text>
              <Text style={styles.emptyStateText}>{t('partner.ordersBeingPrepared')}</Text>
            </View>
          ) : (
            activeOrders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.activeOrderCard}
              onPress={() => navigation.navigate('PartnerOrderDetails', { orderId: order.id })}
              activeOpacity={0.9}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>{order.order_number}</Text>
                <Text style={styles.orderTime}>{new Date(order.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</Text>
                <Text style={styles.orderTotal}>BD {order.total_amount.toFixed(3)}</Text>
              </View>

              <Text style={styles.orderCustomer}>{order.users?.full_name || 'Customer'} • {order.order_items?.length || 0} items</Text>

              {order.rider_id && order.riders && (
                <View style={styles.riderInfo}>
                  <Icon name="truck" size={12} color={colors.textSecondary} />
                  <Text style={styles.riderText}>Rider: {order.riders.full_name}</Text>
                </View>
              )}

              <View style={styles.orderFooter}>
                <View style={[styles.statusPill, { backgroundColor: order.status === 'preparing' ? '#FFF5CC' : '#E3F2FD' }]}>
                  <View style={[styles.statusDot, { backgroundColor: order.status === 'preparing' ? '#FFB703' : '#2196F3' }]} />
                  <Text style={[styles.statusText, { color: order.status === 'preparing' ? '#FFB703' : '#2196F3' }]}>
                    {order.status === 'preparing' ? 'Preparing' : order.status === 'ready_for_pickup' ? 'Ready for Pickup' : order.status}
                  </Text>
                </View>
                {order.status === 'preparing' && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleMarkReady(order.id);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.actionButtonText}>{t('partner.markReady')}</Text>
                  </TouchableOpacity>
                )}
                {order.status === 'ready_for_pickup' && (
                  <View style={styles.waitingBadge}>
                    <Icon name="clock" size={14} color="#007AFF" />
                    <Text style={styles.waitingText}>{t('partner.waitingForRider')}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            ))
          )}
        </View>
        )}

        {/* Completed Orders - shown when filtered */}
        {selectedFilter === 'delivered' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionIcon}>✅</Text>
                <Text style={styles.sectionTitle}>{t('partner.completedOrders')}</Text>
              </View>
            </View>

            {orders.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="check-circle" size={48} color="#D1D5DB" />
                <Text style={styles.emptyStateTitle}>{t('partner.noCompletedOrders')}</Text>
                <Text style={styles.emptyStateText}>{t('partner.deliveredOrders')}</Text>
              </View>
            ) : (
              orders.map((order) => (
              <TouchableOpacity
                key={order.id}
                style={styles.activeOrderCard}
                onPress={() => navigation.navigate('PartnerOrderDetails', { orderId: order.id })}
                activeOpacity={0.9}
              >
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>{order.order_number}</Text>
                  <Text style={styles.orderTime}>{new Date(order.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</Text>
                  <Text style={styles.orderTotal}>BD {order.total_amount.toFixed(3)}</Text>
                </View>

                <Text style={styles.orderCustomer}>{order.users?.full_name || t('partner.customer')} • {order.order_items?.length || 0} {order.order_items?.length === 1 ? t('partner.item') : t('partner.items')}</Text>

                <View style={styles.orderFooter}>
                  <View style={[styles.statusPill, { backgroundColor: selectedFilter === 'delivered' ? '#E8F5E9' : '#FFEBEE' }]}>
                    <View style={[styles.statusDot, { backgroundColor: selectedFilter === 'delivered' ? '#4CAF50' : '#F44336' }]} />
                    <Text style={[styles.statusText, { color: selectedFilter === 'delivered' ? '#4CAF50' : '#F44336' }]}>
                      {selectedFilter === 'delivered' ? 'Completed' : 'Cancelled'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              ))
            )}
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        type={snackbarType}
        onDismiss={() => setSnackbarVisible(false)}
      />

      {/* Loading Spinner */}
      <LoadingSpinner
        visible={isLoading}
        message={loadingMessage}
        overlay
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF9',
  },
  
  // Filter Tabs
  filterWrapper: {
    backgroundColor: '#FFFFFF',
  },
  filterContainer: {
    flexGrow: 0,
  },
  filterContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
    gap: 8,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#F7F7F7',
    marginRight: 8,
    gap: 6,
  },
  filterTabActive: {
    backgroundColor: '#00A896',
    shadowColor: '#00A896',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444444',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  filterBadge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  filterBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginVertical: 8,
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  
  // Section
  section: {
    marginTop: 4,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIcon: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222222',
  },
  viewAll: {
    fontSize: 13,
    fontWeight: '600',
    color: '#00A896',
  },
  
  // New Order Card
  newOrderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    overflow: 'hidden',
  },
  timerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#FFE6CC',
  },
  timerProgress: {
    height: '100%',
    backgroundColor: '#FF9500',
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  orderId: {
    fontSize: 15,
    fontWeight: '700',
    color: '#00A896',
  },
  orderTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222222',
  },
  orderTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
  },
  orderTime: {
    fontSize: 12,
    color: '#777777',
  },
  orderCustomer: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222222',
    marginBottom: 12,
  },
  expiresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  expiresText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#777777',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#00A896',
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E53935',
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E53935',
  },
  
  // Active Order Card
  activeOrderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  actionButton: {
    backgroundColor: '#00A896',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // History Card
  historyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyIcon: {
    fontSize: 18,
  },
  historyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  historyDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#DDDDDD',
  },
  historySubtext: {
    fontSize: 12,
    color: '#999999',
    marginLeft: 'auto',
  },
  
  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.06)',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#A1A1A1',
  },
  navLabelActive: {
    color: '#00A896',
  },
  riderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    marginBottom: 4,
  },
  riderText: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default LiveOrdersScreen;
