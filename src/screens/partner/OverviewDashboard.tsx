/**
 * Wajba Partner - Overview Dashboard
 * Talabat Partner inspired design - Mobile-first, clean, professional
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather as Icon } from '@expo/vector-icons';
import PartnerTopNav from '../../components/partner/PartnerTopNav';
import { supabase } from '../../lib/supabase';
import { getOrderStats, getActiveOrders, PartnerOrder } from '../../services/partner-orders.service';
import { useFocusEffect } from '@react-navigation/native';
import { useLanguage } from '../../contexts/LanguageContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

const OverviewDashboard: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useLanguage();
  
  // State
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [activeOrders, setActiveOrders] = useState<PartnerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('today');
  const [activeNav, setActiveNav] = useState('overview');

  // Get partner's restaurant ID
  useEffect(() => {
    const fetchRestaurantId = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single();

        if (userData) {
          const { data: restaurant } = await supabase
            .from('restaurants')
            .select('id')
            .eq('partner_id', userData.id)
            .single();

          if (restaurant) {
            setRestaurantId(restaurant.id);
          }
        }
      } catch (error) {
        console.error('Error fetching restaurant ID:', error);
      }
    };

    fetchRestaurantId();
  }, []);

  // Get number of days based on selected tab
  const getDaysForTab = (tab: string) => {
    switch (tab) {
      case 'today': return 1;
      case 'yesterday': return 2;
      case '7days': return 7;
      case '30days': return 30;
      default: return 1;
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!restaurantId) return;

    try {
      const days = getDaysForTab(selectedTab);
      const [statsData, ordersData] = await Promise.all([
        getOrderStats(restaurantId, days),
        getActiveOrders(restaurantId),
      ]);

      setStats(statsData);
      setActiveOrders(ordersData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [restaurantId, selectedTab]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useFocusEffect(
    useCallback(() => {
      if (restaurantId) {
        fetchDashboardData();
      }
    }, [restaurantId, fetchDashboardData])
  );

  // Real-time subscription for orders
  useEffect(() => {
    if (!restaurantId) return;

    console.log('OverviewDashboard: Setting up real-time subscription');

    // Subscribe to orders table changes
    const ordersSubscription = supabase
      .channel('overview-orders')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events
          schema: 'public',
          table: 'orders',
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          console.log('OverviewDashboard: Real-time update:', payload.eventType);
          
          // Refresh dashboard data
          fetchDashboardData();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      console.log('OverviewDashboard: Cleaning up real-time subscription');
      supabase.removeChannel(ordersSubscription);
    };
  }, [restaurantId, fetchDashboardData]);

  const getTimePeriodLabel = () => {
    switch (selectedTab) {
      case 'today': return 'Today';
      case 'yesterday': return 'Yesterday';
      case '7days': return 'Last 7 Days';
      case '30days': return 'Last 30 Days';
      default: return 'Today';
    }
  };

  const STATS = stats ? [
    {
      id: '1',
      icon: 'shopping-bag',
      label: `${getTimePeriodLabel()} Orders`,
      value: stats.totalOrders.toString(),
      subtext: `${stats.completedOrders} completed`,
      color: '#00A896',
      bgColor: '#E6F7F5',
    },
    {
      id: '2',
      icon: 'dollar-sign',
      label: `Earnings ${getTimePeriodLabel()}`,
      value: `BD ${stats.totalRevenue.toFixed(3)}`,
      subtext: `${stats.totalOrders} orders`,
      color: '#FFB703',
      bgColor: '#FFF8E6',
    },
    {
      id: '3',
      icon: 'check-circle',
      label: 'Completed',
      value: stats.completedOrders.toString(),
      subtext: getTimePeriodLabel(),
      color: '#00A896',
      bgColor: '#E6F7F5',
    },
    {
      id: '4',
      icon: 'x-circle',
      label: 'Cancelled',
      value: stats.cancelledOrders.toString(),
      subtext: getTimePeriodLabel(),
      color: '#FF6B6B',
      bgColor: '#FFE6E6',
    },
  ] : [];

  const getCurrentDateTime = () => {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayName = days[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${dayName}, ${day} ${month}, ${displayHours}:${displayMinutes} ${ampm}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Top Navigation */}
      <PartnerTopNav 
        title="Wajba Partner"
        showBranding={true}
        showDropdown={true}
        showNotification={true}
        hasNotification={true}
      />
      
      {/* Date/Time Bar */}
      <View style={styles.dateTimeBar}>
        <Text style={styles.dateTime}>{getCurrentDateTime()}</Text>
      </View>

      {/* AI Assistant Banner */}
      <TouchableOpacity 
        style={styles.aiBanner}
        onPress={() => navigation.navigate('PartnerAIChat')}
        activeOpacity={0.8}
      >
        <View style={styles.aiIconContainer}>
          <Icon name="cpu" size={24} color="#00A86B" />
        </View>
        <View style={styles.aiTextContainer}>
          <Text style={styles.aiTitle}>AI Business Assistant</Text>
          <Text style={styles.aiSubtitle}>Get insights, tips & analytics</Text>
        </View>
        <Icon name="chevron-right" size={20} color="#666" />
      </TouchableOpacity>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'today' && styles.tabActive]}
            onPress={() => setSelectedTab('today')}
            activeOpacity={0.7}
          >
            <Icon name="calendar" size={14} color={selectedTab === 'today' ? '#FFFFFF' : '#9CA3AF'} />
            <Text style={[styles.tabText, selectedTab === 'today' && styles.tabTextActive]}>
              Today
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'yesterday' && styles.tabActive]}
            onPress={() => setSelectedTab('yesterday')}
            activeOpacity={0.7}
          >
            <Icon name="clock" size={14} color={selectedTab === 'yesterday' ? '#FFFFFF' : '#9CA3AF'} />
            <Text style={[styles.tabText, selectedTab === 'yesterday' && styles.tabTextActive]}>
              Yesterday
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === '7days' && styles.tabActive]}
            onPress={() => setSelectedTab('7days')}
            activeOpacity={0.7}
          >
            <Icon name="trending-up" size={14} color={selectedTab === '7days' ? '#FFFFFF' : '#9CA3AF'} />
            <Text style={[styles.tabText, selectedTab === '7days' && styles.tabTextActive]}>
              7 Days
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === '30days' && styles.tabActive]}
            onPress={() => setSelectedTab('30days')}
            activeOpacity={0.7}
          >
            <Icon name="bar-chart" size={14} color={selectedTab === '30days' ? '#FFFFFF' : '#9CA3AF'} />
            <Text style={[styles.tabText, selectedTab === '30days' && styles.tabTextActive]}>
              30 Days
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Key Stats Grid */}
        <View style={styles.statsGrid}>
          {STATS.map((stat) => (
            <View key={stat.id} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.bgColor }]}>
                <Icon name={stat.icon} size={20} color={stat.color} />
              </View>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statSubtext}>{stat.subtext}</Text>
            </View>
          ))}
        </View>

        {/* Active Orders Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.headerTitle}>{t('partner.dashboard')}</Text>
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => navigation.navigate('LiveOrders' as never)}
            >
              <Text style={styles.viewAll}>View All →</Text>
            </TouchableOpacity>
          </View>
          
          {activeOrders.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="inbox" size={48} color="#D1D5DB" />
              <Text style={styles.emptyStateTitle}>No Active Orders</Text>
              <Text style={styles.emptyStateText}>
                When you have orders being prepared or ready for pickup, they'll appear here
              </Text>
            </View>
          ) : (
            activeOrders.slice(0, 3).map((order: PartnerOrder, index: number) => (
              <View key={order.id} style={[styles.orderCard, index > 0 && { marginTop: 12 }]}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>{order.order_number}</Text>
                  <Text style={styles.orderTime}>{new Date(order.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</Text>
                </View>
                <Text style={styles.orderCustomer}>{order.users?.full_name || 'Customer'}</Text>
                <View style={styles.orderFooter}>
                  <View style={styles.orderInfo}>
                    <Icon name="shopping-bag" size={14} color="#9CA3AF" />
                    <Text style={styles.orderItems}>{order.order_items?.length || 0} items</Text>
                    <View style={[styles.statusBadge, { backgroundColor: order.status === 'preparing' ? '#FFF5CC' : '#E3F2FD' }]}>
                      <View style={[styles.statusDot, { backgroundColor: order.status === 'preparing' ? '#FFB703' : '#2196F3' }]} />
                      <Text style={[styles.statusText, { color: order.status === 'preparing' ? '#FFB703' : '#2196F3' }]}>
                        {order.status === 'preparing' ? 'Preparing' : 'Ready'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>


        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F7F4',
  },
  
  // Date/Time Bar
  dateTimeBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
  },
  dateTime: {
    fontSize: 13,
    color: '#A1A1A1',
  },

  // AI Assistant Banner
  aiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00A86B20',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  aiIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00A86B10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  aiTextContainer: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  aiSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  
  // 2-Column Layout
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  
  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#00A896',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    width: (SCREEN_WIDTH - 52) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  
  // Section
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00A896',
  },
  
  // Order Cards
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 15,
    fontWeight: '700',
    color: '#00A896',
  },
  orderTime: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  orderCustomer: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  orderItems: {
    fontSize: 13,
    color: '#6B7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  markReadyButton: {
    backgroundColor: '#00A896',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  markReadyText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Performance Section
  performanceSection: {
    marginTop: 24,
    backgroundColor: '#FDFBF8',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  chartContainer: {
    marginTop: 16,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 12,
  },
  chartBarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  chartBar: {
    width: '70%',
    borderRadius: 4,
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  chartSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  
  // Top Items
  topItemsContainer: {
    marginTop: 24,
  },
  topItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  topItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  topItemEmoji: {
    fontSize: 24,
  },
  topItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  topItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  topItemBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#FFE6CC',
    borderRadius: 4,
    overflow: 'hidden',
  },
  topItemBar: {
    height: '100%',
    borderRadius: 4,
  },
  topItemOrders: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    minWidth: 24,
    textAlign: 'right',
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
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default OverviewDashboard;
