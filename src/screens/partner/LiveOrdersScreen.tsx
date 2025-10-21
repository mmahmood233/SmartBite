/**
 * Wajba Partner - Orders Screen
 * Complete order management - New, Preparing, Ready, Completed, Cancelled
 * Talabat Partner quality - Accept/Reject system, filters, professional polish
 */

import React, { useState } from 'react';
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
import PartnerTopNav from '../../components/partner/PartnerTopNav';
import { PartnerColors, PartnerSpacing, PartnerBorderRadius, PartnerTypography } from '../../constants/partnerTheme';
import { getStrings } from '../../constants/partnerStrings';
import Snackbar, { SnackbarType } from '../../components/Snackbar';

const strings = getStrings('en');

// Mock data
const NEW_ORDERS = [
  {
    id: '#12349',
    customer: 'Fatima Ahmed',
    items: 2,
    total: 'BD 9.800',
    time: '6:35 PM',
    expiresIn: '1:25',
    timeLeft: 85, // seconds
  },
  {
    id: '#12350',
    customer: 'Mohammed Ali',
    items: 4,
    total: 'BD 15.500',
    time: '6:38 PM',
    expiresIn: '2:15',
    timeLeft: 135,
  },
];

const ACTIVE_ORDERS = [
  {
    id: '#12345',
    customer: 'Ahmed Isa',
    items: 3,
    total: 'BD 12.800',
    time: '4:10 PM',
    status: 'preparing',
    statusLabel: 'Preparing',
    statusColor: '#FFB703',
    statusBg: '#FFF5CC',
  },
  {
    id: '#12346',
    customer: 'Sara Ali',
    items: 2,
    total: 'BD 8.500',
    time: '4:22 PM',
    status: 'ready',
    statusLabel: 'Ready for Pickup',
    statusColor: '#2196F3',
    statusBg: '#E3F2FD',
  },
  {
    id: '#12347',
    customer: 'Khalid Hassan',
    items: 5,
    total: 'BD 18.200',
    time: '4:28 PM',
    status: 'preparing',
    statusLabel: 'Preparing',
    statusColor: '#FFB703',
    statusBg: '#FFF5CC',
  },
];

const FILTER_TABS = [
  { id: 'all', label: 'All', badge: null },
  { id: 'new', label: 'New', badge: 2 },
  { id: 'preparing', label: 'Preparing', badge: null },
  { id: 'ready', label: 'Ready for Pickup', badge: null },
  { id: 'completed', label: 'Completed', badge: null },
  { id: 'cancelled', label: 'Cancelled', badge: null },
];

const LiveOrdersScreen: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Snackbar state
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<SnackbarType>('success');

  const showSnackbar = (message: string, type: SnackbarType = 'success') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  const handleAcceptOrder = (orderId: string) => {
    showSnackbar(`Order ${orderId} accepted`, 'success');
    // TODO: API call to accept order
  };

  const handleRejectOrder = (orderId: string) => {
    showSnackbar(`Order ${orderId} rejected`, 'warning');
    // TODO: API call to reject order
  };

  const handleMarkReady = (orderId: string) => {
    showSnackbar(`Order ${orderId} marked as ready`, 'success');
    // TODO: API call to mark ready
  };

  const handleMarkCompleted = (orderId: string) => {
    showSnackbar(`Order ${orderId} completed`, 'success');
    // TODO: API call to mark completed
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Top Navigation Bar */}
      <PartnerTopNav 
        title={strings.nav.liveOrders}
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
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.filterTab, selectedFilter === tab.id && styles.filterTabActive]}
            onPress={() => setSelectedFilter(tab.id)}
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
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* New Orders Section */}
        {NEW_ORDERS.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionIcon}>🆕</Text>
                <Text style={styles.sectionTitle}>New Orders</Text>
              </View>
            </View>

            {NEW_ORDERS.map((order) => (
              <View key={order.id} style={styles.newOrderCard}>
                {/* Timer Bar */}
                <View style={styles.timerBar}>
                  <View style={[styles.timerProgress, { width: `${(order.timeLeft / 180) * 100}%` }]} />
                </View>

                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <Text style={styles.orderTotal}>{order.total}</Text>
                  <View style={styles.orderTimeContainer}>
                    <Icon name="clock" size={12} color="#9CA3AF" />
                    <Text style={styles.orderTime}>{order.time}</Text>
                  </View>
                </View>

                <Text style={styles.orderCustomer}>{order.customer} • {order.items} items</Text>

                <View style={styles.expiresContainer}>
                  <Icon name="alert-circle" size={14} color="#FF9500" />
                  <Text style={styles.expiresText}>Expires in {order.expiresIn}</Text>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => handleAcceptOrder(order.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.acceptButtonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => handleRejectOrder(order.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.rejectButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Active Orders Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionIcon}>📦</Text>
              <Text style={styles.sectionTitle}>Active Orders</Text>
            </View>
          </View>

          {ACTIVE_ORDERS.map((order) => (
            <View key={order.id} style={styles.activeOrderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>{order.id}</Text>
                <Text style={styles.orderTime}>{order.time}</Text>
                <Text style={styles.orderTotal}>{order.total}</Text>
              </View>

              <Text style={styles.orderCustomer}>{order.customer} • {order.items} items</Text>

              <View style={styles.orderFooter}>
                <View style={[styles.statusPill, { backgroundColor: order.statusBg }]}>
                  <View style={[styles.statusDot, { backgroundColor: order.statusColor }]} />
                  <Text style={[styles.statusText, { color: order.statusColor }]}>
                    {order.statusLabel}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => order.status === 'preparing' 
                    ? handleMarkReady(order.id) 
                    : handleMarkCompleted(order.id)
                  }
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionButtonText}>
                    {order.status === 'preparing' ? 'Mark Ready' : 'Mark Completed'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* History Summary */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.historyCard} activeOpacity={0.7}>
            <View style={styles.historyItem}>
              <Text style={styles.historyIcon}>✅</Text>
              <Text style={styles.historyText}>5 Completed</Text>
            </View>
            <View style={styles.historyDivider} />
            <View style={styles.historyItem}>
              <Text style={styles.historyIcon}>❌</Text>
              <Text style={styles.historyText}>2 Cancelled</Text>
            </View>
            <Text style={styles.historySubtext}>(Today)</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        type={snackbarType}
        onDismiss={() => setSnackbarVisible(false)}
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
});

export default LiveOrdersScreen;
