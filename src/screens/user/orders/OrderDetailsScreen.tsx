// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather as Icon } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../../constants';
import { formatCurrency, formatDate, formatOrderNumber } from '../../../utils';
import { supabase } from '../../../lib/supabase';
import { useLanguage } from '../../../contexts/LanguageContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'OrderDetails'>;

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  addOns?: string[];
}

interface OrderDetailsScreenProps {
  navigation: NavigationProp;
  route: RouteProps;
}

const OrderDetailsScreen: React.FC<OrderDetailsScreenProps> = ({ route, navigation }) => {
  const { t } = useLanguage();
  const navigationProp = useNavigation<NavigationProp>();
  const routeProp = useRoute<RouteProps>();
  const { orderId, isActive } = routeProp.params;
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [riderData, setRiderData] = useState(null);

  useEffect(() => {
    loadOrderDetails();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Real-time subscription for order updates
  useEffect(() => {
    if (!orderId) return;

    const orderSubscription = supabase
      .channel('user-order-details')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          console.log('Order updated:', payload);
          loadOrderDetails();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orderSubscription);
    };
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch order with all related data including rider
      const { data: order, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          total_amount,
          subtotal,
          delivery_fee,
          delivery_address,
          delivery_phone,
          delivery_notes,
          created_at,
          rider_id,
          restaurants (
            name,
            rating
          ),
          order_items (
            id,
            dish_name,
            quantity,
            unit_price,
            subtotal,
            special_request
          ),
          riders (
            id,
            full_name,
            phone,
            vehicle_type
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;

      // Store rider data separately
      if (order.riders) {
        setRiderData(order.riders);
      }

      // Transform data
      const transformed = {
        riderId: order.rider_id,
        orderNumber: order.order_number,
        status: order.status,
        restaurant: {
          name: order.restaurants?.name || 'Restaurant',
          logo: '🍽️',
          rating: order.restaurants?.rating || 0,
        },
        deliveryDate: new Date(order.created_at).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        deliveryTime: '25–30 min',
        deliveryAddress: order.delivery_address,
        deliveryPhone: order.delivery_phone,
        deliveryNotes: order.delivery_notes,
        items: order.order_items?.map(item => ({
          id: item.id,
          name: item.dish_name,
          quantity: item.quantity,
          price: item.unit_price,
          addOns: item.special_request ? [item.special_request] : [],
        })) || [],
        subtotal: order.subtotal,
        deliveryFee: order.delivery_fee,
        discount: 0,
        total: order.total_amount,
        deliveryAddress: {
          label: "Delivery Address",
          address: order.delivery_address || 'No address',
          phone: order.delivery_phone || 'No phone',
        },
        payment: {
          method: 'Card',
          transactionId: order.order_number,
        },
      };

      setOrderData(transformed);
    } catch (error) {
      console.error('Error loading order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = () => {
    // TODO: Add all items to cart
    console.log('Reorder:', orderId);
  };

  const handleContactSupport = () => {
    // TODO: Open support chat
    console.log('Contact support');
  };

  const handleTrackOrder = () => {
    navigation.navigate('OrderTracking', { orderNumber: orderData.orderNumber });
  };

  if (loading || !orderData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('orders.orderDetails')}</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{t('orders.orderDetails')}</Text>
          <Text style={styles.headerSubtitle}>{t('orders.orderNumber')} #{orderData.orderNumber}</Text>
          <Text style={styles.headerMeta}>
            {orderData.items.length} {t('orders.items')} • BD {orderData.total.toFixed(2)} • {isActive ? t('orders.inProgress') : `${t('orders.delivered')} ${orderData.deliveryDate}`}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <Animated.ScrollView 
        style={[styles.scrollView, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]} 
        showsVerticalScrollIndicator={false}
      >
        {/* Restaurant Section */}
        <View style={styles.section}>
          <View style={styles.restaurantCard}>
            <View style={styles.restaurantHeader}>
              <View style={styles.restaurantLogo}>
                <Text style={styles.restaurantLogoText}>{orderData.restaurant.logo}</Text>
              </View>
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{orderData.restaurant.name}</Text>
                <View style={styles.restaurantMeta}>
                  <Text style={styles.statusText}>
                    {isActive ? t('orders.inProgress') : t('orders.delivered')}
                  </Text>
                  <Text style={styles.metaDot}>•</Text>
                  <Text style={styles.metaText}>{orderData.deliveryDate}</Text>
                  <Text style={styles.metaDot}>•</Text>
                  <Text style={styles.metaText}>{orderData.deliveryTime}</Text>
                </View>
                <View style={styles.ratingRow}>
                  <Icon name="star" size={14} color="#FFB800" />
                  <Text style={styles.ratingText}>{orderData.restaurant.rating}</Text>
                </View>
              </View>
            </View>

            <View style={styles.restaurantActions}>
              {isActive ? (
                <TouchableOpacity
                  style={styles.trackButtonPrimary}
                  onPress={handleTrackOrder}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={['#00897B', '#26A69A']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.trackButtonGradient}
                  >
                    <Icon name="navigation" size={16} color="#FFFFFF" />
                    <Text style={styles.trackButtonText}>{t('orders.trackOrder')}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.reorderButtonPrimary}
                  onPress={handleReorder}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={['#00897B', '#26A69A']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.reorderButtonGradient}
                  >
                    <Icon name="refresh-cw" size={16} color="#FFFFFF" />
                    <Text style={styles.reorderButtonText}>{t('orders.reorder')}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.supportButton}
                onPress={handleContactSupport}
                activeOpacity={0.7}
              >
                <Icon name="message-circle" size={16} color={colors.primary} />
                <Text style={styles.supportButtonText}>{t('orders.contactSupport')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Rider Information - Only show if rider is assigned */}
        {orderData.riderId && riderData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('orders.deliveryRider')}</Text>
            <View style={styles.card}>
              <View style={styles.riderInfoRow}>
                <View style={styles.riderAvatar}>
                  <Icon name="user" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.riderDetails}>
                  <Text style={styles.riderName}>{riderData.full_name}</Text>
                  <View style={styles.riderMeta}>
                    <Icon name="truck" size={12} color={colors.textSecondary} />
                    <Text style={styles.riderVehicle}>{riderData.vehicle_type || 'Vehicle'}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.riderCallButton}
                  onPress={() => Linking.openURL(`tel:${riderData.phone}`)}
                  activeOpacity={0.7}
                >
                  <Icon name="phone" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
              {isActive && (
                <TouchableOpacity
                  style={styles.trackRiderButton}
                  onPress={handleTrackOrder}
                  activeOpacity={0.7}
                >
                  <Icon name="navigation" size={16} color={colors.primary} />
                  <Text style={styles.trackRiderButtonText}>{t('orders.trackRider')}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Items Ordered */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('orders.itemsOrdered')}</Text>
          <View style={styles.card}>
            {orderData.items.map((item, index) => (
              <View key={item.id}>
                <View style={styles.orderItem}>
                  <View style={styles.itemLeft}>
                    <Text style={styles.itemName}>
                      {item.name} ×{item.quantity}
                    </Text>
                    {item.addOns && item.addOns.map((addOn, idx) => (
                      <Text key={idx} style={styles.addOnText}>  + {addOn}</Text>
                    ))}
                  </View>
                  <Text style={styles.itemPrice}>
                    BD {(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
                {index < orderData.items.length - 1 && <View style={styles.itemDivider} />}
              </View>
            ))}

            <View style={styles.subtotalDivider} />

            <View style={styles.receiptDivider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('cart.subtotal')}</Text>
              <Text style={styles.summaryValue}>BD {orderData.subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('cart.deliveryFee')}</Text>
              <Text style={styles.summaryValue}>BD {orderData.deliveryFee.toFixed(2)}</Text>
            </View>
            {orderData.discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Promo Discount</Text>
                <Text style={[styles.summaryValue, styles.discountValue]}>
                  -BD {orderData.discount.toFixed(2)}
                </Text>
              </View>
            )}

            <View style={styles.receiptDivider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{t('cart.total')}</Text>
              <Text style={styles.totalValue}>BD {orderData.total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('orders.deliveryInformation')}</Text>
          <View style={styles.deliveryCard}>
            <View style={styles.deliveryRow}>
              <View style={styles.deliveryIconContainer}>
                <Icon name="home" size={16} color={colors.primary} />
              </View>
              <Text style={styles.deliveryLabel}>{orderData.deliveryAddress.label}</Text>
            </View>
            <View style={styles.deliveryRow}>
              <View style={styles.deliveryIconContainer}>
                <Icon name="map-pin" size={16} color={colors.primary} />
              </View>
              <Text style={styles.deliveryText}>{orderData.deliveryAddress.address}</Text>
            </View>
            <View style={styles.deliveryRow}>
              <View style={styles.deliveryIconContainer}>
                <Icon name="phone" size={16} color={colors.primary} />
              </View>
              <Text style={styles.deliveryText}>{orderData.deliveryAddress.phone}</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </Animated.ScrollView>

      {/* Bottom Actions */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerReorderButton}
          onPress={handleReorder}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#00897B', '#26A69A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.footerReorderGradient}
          >
            <Text style={styles.footerReorderText}>{t('orders.reorder')}</Text>
            <Icon name="arrow-right" size={18} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerSupportButton}
          onPress={handleContactSupport}
          activeOpacity={0.7}
        >
          <Text style={styles.footerSupportText}>{t('orders.getHelp')}</Text>
        </TouchableOpacity>
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.sm + 1,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerMeta: {
    fontSize: FONT_SIZE.xs,
    color: colors.textDisabled,
    marginTop: SPACING.xs,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: SPACING.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  restaurantCard: {
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  restaurantHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  restaurantLogo: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md + 2,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  restaurantLogoText: {
    fontSize: 28,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: SPACING.sm,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  metaDot: {
    fontSize: 12,
    color: '#CFCFCF',
    marginHorizontal: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#6D6D6D',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
  },
  restaurantActions: {
    flexDirection: 'row',
    gap: 8,
  },
  trackButtonPrimary: {
    flex: 1,
  },
  trackButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 6,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  trackButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  reorderButtonPrimary: {
    flex: 1,
  },
  reorderButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 6,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  reorderButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  supportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    gap: 6,
  },
  supportButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  itemLeft: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#212121',
    marginBottom: 4,
  },
  addOnText: {
    fontSize: 12,
    color: '#6D6D6D',
    marginLeft: 12,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
    fontVariant: ['tabular-nums'],
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#F5F5F5',
  },
  subtotalDivider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginVertical: 12,
  },
  receiptDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6D6D6D',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212121',
    fontVariant: ['tabular-nums'],
  },
  discountValue: {
    color: '#E74C3C',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A4D47',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#6D6D6D',
    lineHeight: 20,
    marginLeft: 12,
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginVertical: 12,
  },
  deliveryCard: {
    backgroundColor: '#F7F9F8',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 137, 123, 0.1)',
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliveryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deliveryLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
  },
  deliveryText: {
    fontSize: 14,
    color: '#6D6D6D',
    flex: 1,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  paymentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  paymentLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  paymentId: {
    fontSize: 13,
    color: '#6D6D6D',
  },
  reviewContent: {
    paddingVertical: 4,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF7E0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  reviewRatingText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
  },
  reviewEmoji: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  reviewComment: {
    fontSize: 14,
    color: '#6D6D6D',
    lineHeight: 22,
  },
  noReview: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  noReviewText: {
    fontSize: 14,
    color: '#9E9E9E',
    marginBottom: 12,
  },
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -6 },
    elevation: 25,
  },
  footerReorderButton: {
    marginBottom: 12,
  },
  footerReorderGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 8,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  footerReorderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  footerSupportButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#F9F9F9',
  },
  footerSupportText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6D6D6D',
    letterSpacing: 0.2,
  },
});

export default OrderDetailsScreen;
