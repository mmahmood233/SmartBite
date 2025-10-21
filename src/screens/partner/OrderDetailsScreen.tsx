/**
 * Order Details Screen
 * Complete order information with customer details, items, and status management
 * High-quality design matching Talabat Partner standards
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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PartnerColors, PartnerSpacing, PartnerBorderRadius, PartnerTypography } from '../../constants/partnerTheme';
import Snackbar, { SnackbarType } from '../../components/Snackbar';
import LoadingSpinner from '../../components/LoadingSpinner';

type OrderDetailsRouteProp = RouteProp<{ OrderDetails: { orderId: string } }, 'OrderDetails'>;

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface OrderDetails {
  id: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  items: OrderItem[];
  status: 'new' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  orderTime: string;
  estimatedTime?: string;
  deliveryType: 'delivery' | 'pickup';
  notes?: string;
}

// Mock data - will be replaced with API
const MOCK_ORDER: OrderDetails = {
  id: '#12349',
  customer: {
    name: 'Fatima Ahmed',
    phone: '+973 3999 8888',
    address: 'Building 123, Road 456, Block 789, Manama',
  },
  items: [
    { id: '1', name: 'Chicken Shawarma Wrap', quantity: 2, price: 2.5, notes: 'Extra garlic sauce' },
    { id: '2', name: 'French Fries', quantity: 1, price: 1.2 },
    { id: '3', name: 'Cola', quantity: 2, price: 0.8 },
  ],
  status: 'new',
  paymentMethod: 'Cash on Delivery',
  subtotal: 8.6,
  deliveryFee: 1.2,
  total: 9.8,
  orderTime: '2:45 PM',
  estimatedTime: '25-30 min',
  deliveryType: 'delivery',
  notes: 'Please ring the doorbell',
};

const OrderDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<OrderDetailsRouteProp>();
  const { orderId } = route.params;

  const [orderDetails] = useState<OrderDetails>(MOCK_ORDER);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<SnackbarType>('success');

  const showSnackbar = (message: string, type: SnackbarType = 'success') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  const handleAcceptOrder = async () => {
    setIsLoading(true);
    setLoadingMessage('Accepting order...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    showSnackbar('Order accepted successfully!', 'success');
    setTimeout(() => navigation.goBack(), 1500);
  };

  const handleRejectOrder = async () => {
    setIsLoading(true);
    setLoadingMessage('Rejecting order...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    showSnackbar('Order rejected', 'warning');
    setTimeout(() => navigation.goBack(), 1500);
  };

  const handleMarkReady = async () => {
    setIsLoading(true);
    setLoadingMessage('Updating status...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    showSnackbar('Order marked as ready!', 'success');
  };

  const handleMarkCompleted = async () => {
    setIsLoading(true);
    setLoadingMessage('Completing order...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    showSnackbar('Order completed!', 'success');
    setTimeout(() => navigation.goBack(), 1500);
  };

  const handleCallCustomer = () => {
    showSnackbar('Calling customer...', 'info');
  };

  const getStatusConfig = () => {
    switch (orderDetails.status) {
      case 'new':
        return { label: 'New Order', color: '#FF9500', icon: 'clock' as const };
      case 'preparing':
        return { label: 'Preparing', color: '#007AFF', icon: 'loader' as const };
      case 'ready':
        return { label: 'Ready for Pickup', color: '#34C759', icon: 'check-circle' as const };
      case 'completed':
        return { label: 'Completed', color: '#10B981', icon: 'check' as const };
      case 'cancelled':
        return { label: 'Cancelled', color: '#EF4444', icon: 'x-circle' as const };
      default:
        return { label: 'Unknown', color: '#9CA3AF', icon: 'help-circle' as const };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={PartnerColors.light.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Order Details</Text>
          <Text style={styles.headerSubtitle}>{orderDetails.id}</Text>
        </View>
        <TouchableOpacity onPress={handleCallCustomer} style={styles.callButton}>
          <Icon name="phone" size={20} color={PartnerColors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={[styles.statusBadge, { backgroundColor: `${statusConfig.color}15` }]}>
            <Icon name={statusConfig.icon} size={20} color={statusConfig.color} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
          <View style={styles.timeInfo}>
            <View style={styles.timeRow}>
              <Icon name="clock" size={16} color={PartnerColors.light.text.secondary} />
              <Text style={styles.timeLabel}>Order Time:</Text>
              <Text style={styles.timeValue}>{orderDetails.orderTime}</Text>
            </View>
            {orderDetails.estimatedTime && (
              <View style={styles.timeRow}>
                <Icon name="zap" size={16} color={PartnerColors.primary} />
                <Text style={styles.timeLabel}>Est. Time:</Text>
                <Text style={styles.timeValue}>{orderDetails.estimatedTime}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="user" size={18} color={PartnerColors.light.text.secondary} />
            <Text style={styles.sectionTitle}>CUSTOMER INFORMATION</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Icon name="user" size={16} color={PartnerColors.light.text.secondary} />
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{orderDetails.customer.name}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Icon name="phone" size={16} color={PartnerColors.light.text.secondary} />
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{orderDetails.customer.phone}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Icon name={orderDetails.deliveryType === 'delivery' ? 'map-pin' : 'shopping-bag'} size={16} color={PartnerColors.light.text.secondary} />
              <Text style={styles.infoLabel}>
                {orderDetails.deliveryType === 'delivery' ? 'Address' : 'Pickup'}
              </Text>
              <Text style={[styles.infoValue, styles.addressValue]}>
                {orderDetails.deliveryType === 'delivery' ? orderDetails.customer.address : 'In-store pickup'}
              </Text>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="shopping-bag" size={18} color={PartnerColors.light.text.secondary} />
            <Text style={styles.sectionTitle}>ORDER ITEMS ({orderDetails.items.length})</Text>
          </View>
          <View style={styles.itemsCard}>
            {orderDetails.items.map((item, index) => (
              <View key={item.id}>
                <View style={styles.itemRow}>
                  <View style={styles.itemLeft}>
                    <View style={styles.quantityBadge}>
                      <Text style={styles.quantityText}>{item.quantity}x</Text>
                    </View>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      {item.notes && (
                        <View style={styles.notesContainer}>
                          <Icon name="message-circle" size={12} color={PartnerColors.light.text.tertiary} />
                          <Text style={styles.itemNotes}>{item.notes}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <Text style={styles.itemPrice}>BD {(item.price * item.quantity).toFixed(3)}</Text>
                </View>
                {index < orderDetails.items.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        {/* Special Notes */}
        {orderDetails.notes && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="message-square" size={18} color={PartnerColors.light.text.secondary} />
              <Text style={styles.sectionTitle}>SPECIAL NOTES</Text>
            </View>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{orderDetails.notes}</Text>
            </View>
          </View>
        )}

        {/* Payment Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="credit-card" size={18} color={PartnerColors.light.text.secondary} />
            <Text style={styles.sectionTitle}>PAYMENT SUMMARY</Text>
          </View>
          <View style={styles.paymentCard}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Subtotal</Text>
              <Text style={styles.paymentValue}>BD {orderDetails.subtotal.toFixed(3)}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Delivery Fee</Text>
              <Text style={styles.paymentValue}>BD {orderDetails.deliveryFee.toFixed(3)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.paymentRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>BD {orderDetails.total.toFixed(3)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Payment Method</Text>
              <View style={styles.paymentMethodBadge}>
                <Icon name="dollar-sign" size={14} color={PartnerColors.primary} />
                <Text style={styles.paymentMethodText}>{orderDetails.paymentMethod}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Action Buttons */}
      {orderDetails.status === 'new' && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={handleRejectOrder}
            activeOpacity={0.8}
          >
            <Icon name="x" size={20} color="#EF4444" />
            <Text style={styles.rejectButtonText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.acceptButtonWrapper}
            onPress={handleAcceptOrder}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[PartnerColors.primary, PartnerColors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.acceptButton}
            >
              <Icon name="check" size={20} color="#FFFFFF" />
              <Text style={styles.acceptButtonText}>Accept Order</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {orderDetails.status === 'preparing' && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.singleActionButtonWrapper}
            onPress={handleMarkReady}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[PartnerColors.primary, PartnerColors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.singleActionButton}
            >
              <Icon name="check-circle" size={20} color="#FFFFFF" />
              <Text style={styles.singleActionButtonText}>Mark as Ready</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {orderDetails.status === 'ready' && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.singleActionButtonWrapper}
            onPress={handleMarkCompleted}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#10B981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.singleActionButton}
            >
              <Icon name="check" size={20} color="#FFFFFF" />
              <Text style={styles.singleActionButtonText}>Mark as Completed</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

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
    backgroundColor: PartnerColors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: PartnerSpacing.lg,
    paddingTop: Platform.OS === 'ios' ? 50 : PartnerSpacing.lg,
    paddingBottom: PartnerSpacing.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: PartnerColors.light.borderLight,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: PartnerTypography.fontSize.lg,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: PartnerColors.light.text.primary,
  },
  headerSubtitle: {
    fontSize: PartnerTypography.fontSize.sm,
    color: PartnerColors.light.text.secondary,
    marginTop: 2,
  },
  callButton: {
    padding: 8,
    marginRight: -8,
    backgroundColor: `${PartnerColors.primary}10`,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: PartnerSpacing.lg,
    marginTop: PartnerSpacing.lg,
    borderRadius: 16,
    padding: PartnerSpacing.lg,
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 15,
    fontWeight: PartnerTypography.fontWeight.semibold,
  },
  timeInfo: {
    marginTop: PartnerSpacing.md,
    gap: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeLabel: {
    fontSize: 14,
    color: PartnerColors.light.text.secondary,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: PartnerColors.light.text.primary,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: PartnerSpacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: PartnerSpacing.md,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: PartnerColors.light.text.secondary,
    letterSpacing: 0.5,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: PartnerSpacing.lg,
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: PartnerColors.light.text.secondary,
    width: 70,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: PartnerTypography.fontWeight.medium,
    color: PartnerColors.light.text.primary,
  },
  addressValue: {
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: PartnerColors.light.borderLight,
  },
  itemsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: PartnerSpacing.lg,
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
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  itemLeft: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  quantityBadge: {
    backgroundColor: `${PartnerColors.primary}15`,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 40,
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 13,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: PartnerColors.primary,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: PartnerTypography.fontWeight.medium,
    color: PartnerColors.light.text.primary,
    marginBottom: 4,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  itemNotes: {
    fontSize: 13,
    color: PartnerColors.light.text.tertiary,
    fontStyle: 'italic',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: PartnerColors.light.text.primary,
  },
  notesCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: PartnerSpacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  notesText: {
    fontSize: 14,
    color: PartnerColors.light.text.primary,
    lineHeight: 20,
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: PartnerSpacing.lg,
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
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  paymentLabel: {
    fontSize: 14,
    color: PartnerColors.light.text.secondary,
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: PartnerTypography.fontWeight.medium,
    color: PartnerColors.light.text.primary,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: PartnerColors.light.text.primary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: PartnerColors.primary,
  },
  paymentMethodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${PartnerColors.primary}10`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  paymentMethodText: {
    fontSize: 13,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: PartnerColors.primary,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: PartnerSpacing.lg,
    paddingVertical: PartnerSpacing.lg,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: PartnerColors.light.borderLight,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  rejectButtonText: {
    fontSize: 15,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: '#EF4444',
  },
  acceptButtonWrapper: {
    flex: 2,
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  acceptButtonText: {
    fontSize: 15,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: '#FFFFFF',
  },
  singleActionButtonWrapper: {
    flex: 1,
  },
  singleActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  singleActionButtonText: {
    fontSize: 15,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: '#FFFFFF',
  },
});

export default OrderDetailsScreen;
