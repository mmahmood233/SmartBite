/**
 * Wajba Partner - Overview Dashboard
 * Talabat Partner inspired design - Mobile-first, clean, professional
 */

import React, { useState } from 'react';
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
import Icon from 'react-native-vector-icons/Feather';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

// Mock data
const STATS = [
  {
    id: '1',
    icon: 'shopping-bag',
    label: "Today's Orders",
    value: '45',
    subtext: '+5 from yesterday',
    color: '#00A896',
    bgColor: '#E6F7F5',
  },
  {
    id: '2',
    icon: 'dollar-sign',
    label: 'Earnings Today',
    value: 'BD 128.50',
    subtext: 'Weekly +12%',
    color: '#FFB703',
    bgColor: '#FFF8E6',
  },
  {
    id: '3',
    icon: 'star',
    label: 'Avg. Rating',
    value: '4.6 ★',
    subtext: 'From 256 reviews',
    color: '#FF6B9D',
    bgColor: '#FFE6F0',
  },
  {
    id: '4',
    icon: 'clock',
    label: 'Avg. Prep Time',
    value: '18 min',
    subtext: 'Goal ≤ 20 min',
    color: '#4ECDC4',
    bgColor: '#E6F9F7',
  },
];

const ACTIVE_ORDERS = [
  {
    id: '#12345',
    customer: 'Ahmed Isa',
    time: '4:10 PM',
    items: '3 items',
    status: 'preparing',
    statusLabel: 'Preparing',
    statusColor: '#FFB703',
  },
  {
    id: '#12346',
    customer: 'Sara Ali',
    time: '4:22 PM',
    items: '2 items',
    status: 'ready',
    statusLabel: 'Ready for Pickup',
    statusColor: '#00A896',
  },
  {
    id: '#12347',
    customer: 'Mohammed Hassan',
    time: '4:25 PM',
    items: '5 items',
    status: 'preparing',
    statusLabel: 'Preparing',
    statusColor: '#FFB703',
  },
];

const TOP_ITEMS = [
  { emoji: '🍔', name: 'Chicken Burger', orders: 45 },
  { emoji: '🥤', name: 'Pepsi', orders: 38 },
  { emoji: '🍕', name: 'Margherita Pizza', orders: 32 },
  { emoji: '🥗', name: 'Caesar Salad', orders: 28 },
  { emoji: '🍟', name: 'French Fries', orders: 25 },
];

const CHART_DATA = [30, 45, 38, 52, 48, 60, 55]; // Mon-Sun

const OverviewDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('today');
  const [activeNav, setActiveNav] = useState('overview');

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
      
      {/* Fixed Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <LinearGradient
              colors={['#00A896', '#4ECDC4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.logoGradient}
            >
              <Icon name="briefcase" size={18} color="#FFFFFF" />
            </LinearGradient>
            <View>
              <View style={styles.brandRow}>
                <Text style={styles.logoText}>Wajba Partner</Text>
                <Icon name="chevron-down" size={14} color="#9CA3AF" style={{ marginLeft: 4 }} />
              </View>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
              <Icon name="bell" size={22} color="#333" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>R</Text>
            </View>
          </View>
        </View>
        <Text style={styles.dateTime}>{getCurrentDateTime()}</Text>
      </View>

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
            <Text style={styles.sectionTitle}>Active Orders</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.viewAll}>View All →</Text>
            </TouchableOpacity>
          </View>
          
          {ACTIVE_ORDERS.map((order, index) => (
            <View key={order.id} style={[styles.orderCard, index > 0 && { marginTop: 12 }]}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>{order.id}</Text>
                <Text style={styles.orderTime}>{order.time}</Text>
              </View>
              <Text style={styles.orderCustomer}>{order.customer}</Text>
              <View style={styles.orderFooter}>
                <View style={styles.orderInfo}>
                  <Icon name="shopping-bag" size={14} color="#9CA3AF" />
                  <Text style={styles.orderItems}>{order.items}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: `${order.statusColor}20` }]}>
                    <View style={[styles.statusDot, { backgroundColor: order.statusColor }]} />
                    <Text style={[styles.statusText, { color: order.statusColor }]}>
                      {order.statusLabel}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.markReadyButton} activeOpacity={0.7}>
                  <Text style={styles.markReadyText}>Mark Ready</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Performance Overview */}
        <View style={styles.performanceSection}>
          <Text style={styles.sectionTitle}>Performance Overview</Text>
          
          {/* Bar Chart */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Orders Trend (Last 7 Days)</Text>
            <View style={styles.chart}>
              {CHART_DATA.map((value, index) => (
                <View key={index} style={styles.chartBarContainer}>
                  <LinearGradient
                    colors={['#00A896', '#00796B']}
                    style={[styles.chartBar, { height: `${(value / 60) * 100}%` }]}
                  />
                  <Text style={styles.chartLabel}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={styles.chartSubtext}>+8% vs previous week</Text>
          </View>

          {/* Top 5 Items */}
          <View style={styles.topItemsContainer}>
            <Text style={styles.chartTitle}>Top 5 Items</Text>
            {TOP_ITEMS.map((item, index) => (
              <View key={index} style={styles.topItem}>
                <View style={styles.topItemLeft}>
                  <Text style={styles.topItemEmoji}>{item.emoji}</Text>
                  <Text style={styles.topItemName}>{item.name}</Text>
                </View>
                <View style={styles.topItemRight}>
                  <View style={styles.topItemBarContainer}>
                    <LinearGradient
                      colors={['#FFB703', '#FF9500']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.topItemBar, { width: `${(item.orders / 45) * 100}%` }]}
                    />
                  </View>
                  <Text style={styles.topItemOrders}>{item.orders}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveNav('orders')}
          activeOpacity={0.7}
        >
          <Icon
            name="file-text"
            size={24}
            color={activeNav === 'orders' ? '#00A896' : '#A1A1A1'}
          />
          <Text style={[styles.navLabel, activeNav === 'orders' && styles.navLabelActive]}>
            Live Orders
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveNav('overview')}
          activeOpacity={0.7}
        >
          <Icon
            name="bar-chart-2"
            size={24}
            color={activeNav === 'overview' ? '#00A896' : '#A1A1A1'}
          />
          <Text style={[styles.navLabel, activeNav === 'overview' && styles.navLabelActive]}>
            Overview
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveNav('menu')}
          activeOpacity={0.7}
        >
          <Icon
            name="book-open"
            size={24}
            color={activeNav === 'menu' ? '#00A896' : '#A1A1A1'}
          />
          <Text style={[styles.navLabel, activeNav === 'menu' && styles.navLabelActive]}>
            Menu
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveNav('more')}
          activeOpacity={0.7}
        >
          <Icon
            name="more-horizontal"
            size={24}
            color={activeNav === 'more' ? '#00A896' : '#A1A1A1'}
          />
          <Text style={[styles.navLabel, activeNav === 'more' && styles.navLabelActive]}>
            More
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF9',
  },
  
  // Header
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: STATUS_BAR_HEIGHT + 12,
    paddingHorizontal: 20,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00A896',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: '#FF6B6B',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  dateTime: {
    fontSize: 13,
    color: '#A1A1A1',
  },
  
  // Scroll View
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
});

export default OverviewDashboard;
