import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';
import { Feather as Icon } from '@expo/vector-icons';
import { supabase } from '../../../lib/supabase';
import { useLanguage } from '../../../contexts/LanguageContext';
import { colors } from '../../../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../../constants';
import { formatOrderNumber } from '../../../utils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'OrderTracking'>;

interface TimelineStep {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  completed: boolean;
  active: boolean;
}

interface OrderTrackingScreenProps {
  navigation: NavigationProp;
  route: RouteProps;
}

const OrderTrackingScreen: React.FC<OrderTrackingScreenProps> = ({ route, navigation }) => {
  const { t } = useLanguage();
  const navigationProp = useNavigation<NavigationProp>();
  const routeProp = useRoute<RouteProps>();
  const { orderNumber } = routeProp.params;

  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);
  const [riderData, setRiderData] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Load order and rider data
  useEffect(() => {
    loadOrderData();
  }, []);

  // Real-time subscription for order updates
  useEffect(() => {
    if (!orderData?.id) return;

    const orderSubscription = supabase
      .channel('user-order-tracking')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderData.id}`,
        },
        (payload) => {
          console.log('Order updated:', payload);
          loadOrderData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orderSubscription);
    };
  }, [orderData?.id]);

  const loadOrderData = async () => {
    try {
      setLoading(true);
      
      // Fetch order with rider and restaurant info
      const { data: order, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          delivery_status,
          rider_id,
          estimated_delivery_time,
          restaurants (
            name
          ),
          riders (
            id,
            full_name,
            phone,
            vehicle_type,
            rating
          )
        `)
        .eq('order_number', orderNumber)
        .single();

      if (error) throw error;

      console.log('📦 ORDER DATA:', {
        order_number: order.order_number,
        status: order.status,
        delivery_status: order.delivery_status,
        rider_id: order.rider_id
      });

      setOrderData(order);
      setRiderData(order.riders);
      
      // Update step based on delivery status
      updateStepFromStatus(order.status, order.delivery_status);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStepFromStatus = (status: string, deliveryStatus?: string | null) => {
    console.log('Updating step - Status:', status, 'Delivery Status:', deliveryStatus);
    
    // PRIORITY: Use delivery_status if it exists (more accurate for tracking)
    if (deliveryStatus && deliveryStatus !== null) {
      const deliveryStatusMap: Record<string, number> = {
        'assigned': 2,
        'heading_to_restaurant': 2,
        'arrived_at_restaurant': 2,
        'picked_up': 3,
        'heading_to_customer': 3,
        'arrived_at_customer': 3,
        'delivered': 4,
      };
      const step = deliveryStatusMap[deliveryStatus];
      if (step !== undefined) {
        console.log('Using delivery status, step:', step);
        setCurrentStep(step);
        return;
      }
    }

    // Fallback to order status
    const statusMap: Record<string, number> = {
      'pending': 0,
      'confirmed': 1,
      'preparing': 1,
      'ready_for_pickup': 2,
      'rider_assigned': 2,
      'picked_up': 3,
      'out_for_delivery': 3,
      'delivered': 4,
    };
    const step = statusMap[status] || 0;
    console.log('Using order status, step:', step);
    setCurrentStep(step);
  };

  const getSubtitle = (step: number) => {
    if (step === 2 && orderData?.delivery_status) {
      if (orderData.delivery_status === 'heading_to_restaurant') return 'Rider heading to restaurant';
      if (orderData.delivery_status === 'arrived_at_restaurant') return 'Rider at restaurant';
    }
    if (step === 3 && orderData?.delivery_status) {
      if (orderData.delivery_status === 'picked_up') return 'Order picked up';
      if (orderData.delivery_status === 'heading_to_customer') return 'Rider heading to you';
      if (orderData.delivery_status === 'arrived_at_customer') return 'Rider has arrived';
    }
    return null;
  };

  const timelineSteps: TimelineStep[] = [
    {
      id: '1',
      title: 'Order Confirmed',
      subtitle: 'Restaurant accepted your order',
      icon: 'check-circle',
      completed: currentStep >= 1,
      active: currentStep === 1,
    },
    {
      id: '2',
      title: 'Preparing',
      subtitle: getSubtitle(2) || "Chef is preparing your meal",
      icon: 'package',
      completed: currentStep > 2,
      active: currentStep === 2,
    },
    {
      id: '3',
      title: 'Out for Delivery',
      subtitle: getSubtitle(3) || 'Rider is on the way',
      icon: 'truck',
      completed: currentStep > 3,
      active: currentStep === 3,
    },
    {
      id: '4',
      title: 'Delivered',
      subtitle: 'Enjoy your meal!',
      icon: 'home',
      completed: currentStep >= 4,
      active: currentStep === 4,
    },
  ];

  const handleCallRider = () => {
    if (riderData?.phone) {
      Linking.openURL(`tel:${riderData.phone}`);
    }
  };

  const handleContactSupport = () => {
    console.log('Contact support...');
  };

  const handleDeliveryComplete = () => {
    navigation.navigate('DeliveryComplete');
  };

  if (loading || !orderData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{t('orders.trackOrder')}</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>{t('common.loading')}...</Text>
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
          <Text style={styles.headerTitle}>{t('orders.trackOrder')}</Text>
          <Text style={styles.headerSubtitle}>
            {orderData.restaurants?.name || 'Restaurant'} • #{orderData.order_number}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* ETA Card */}
        <View style={styles.etaCard}>
          <View style={styles.etaIconContainer}>
            <Icon name="clock" size={32} color={colors.primary} />
          </View>
          <View style={styles.etaInfo}>
            <Text style={styles.etaLabel}>{t('orders.estimatedArrival')}</Text>
            <Text style={styles.etaTime}>
              {orderData.estimated_delivery_time 
                ? new Date(orderData.estimated_delivery_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                : '25-30 min'}
            </Text>
          </View>
        </View>

        {/* Rider Card - Only show if rider is assigned */}
        {riderData && (
          <View style={styles.mapSection}>
            <View style={styles.riderCard}>
              <View style={styles.riderAvatar}>
                <Icon name="user" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.riderInfo}>
                <Text style={styles.riderName}>{riderData.full_name} ({t('common.rider')})</Text>
                <View style={styles.riderDetails}>
                  <Icon name="truck" size={12} color={colors.textSecondary} />
                  <Text style={styles.riderVehicle}>{riderData.vehicle_type || 'Vehicle'}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.callButton}
                onPress={handleCallRider}
                activeOpacity={0.7}
              >
                <Icon name="phone" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Timeline */}
        <View style={styles.timelineSection}>
          <Text style={styles.sectionTitle}>Order Progress</Text>
          <View style={styles.timeline}>
            {timelineSteps.map((step, index) => (
              <View key={step.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View
                    style={[
                      styles.timelineIcon,
                      step.completed && styles.timelineIconCompleted,
                      step.active && styles.timelineIconActive,
                    ]}
                  >
                    <Icon
                      name={step.icon}
                      size={18}
                      color={step.completed || step.active ? '#FFFFFF' : '#9E9E9E'}
                    />
                  </View>
                  {index < timelineSteps.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        step.completed && styles.timelineLineCompleted,
                      ]}
                    />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text
                    style={[
                      styles.timelineTitle,
                      (step.completed || step.active) && styles.timelineTitleActive,
                    ]}
                  >
                    {step.title}
                  </Text>
                  <Text style={styles.timelineSubtitle}>{step.subtitle}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Support Button */}
        <View style={styles.supportSection}>
          <TouchableOpacity
            style={styles.supportButton}
            onPress={handleContactSupport}
            activeOpacity={0.7}
          >
            <Icon name="message-circle" size={20} color={colors.primary} />
            <Text style={styles.supportButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        {/* Temporary: Simulate Delivery Complete */}
        <View style={styles.supportSection}>
          <TouchableOpacity
            style={styles.deliveryCompleteButton}
            onPress={handleDeliveryComplete}
            activeOpacity={0.7}
          >
            <Text style={styles.deliveryCompleteText}>🎉 Simulate Delivery Complete</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
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
  scrollView: {
    flex: 1,
  },
  etaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    margin: SPACING.lg,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  etaIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  etaInfo: {
    flex: 1,
  },
  etaLabel: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
    marginBottom: SPACING.xs,
  },
  etaTime: {
    fontSize: FONT_SIZE.massive,
    fontWeight: '700',
    color: colors.primary,
  },
  mapSection: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  mapImage: {
    width: '100%',
    height: 240,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: SPACING.lg,
    left: SPACING.lg,
    right: SPACING.lg,
  },
  riderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: SPACING.md,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  riderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  riderInfo: {
    flex: 1,
  },
  riderName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  riderRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  riderRatingText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6D6D6D',
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  timelineSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A4D47',
    marginBottom: 16,
  },
  timeline: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineIconCompleted: {
    backgroundColor: colors.primary,
  },
  timelineIconActive: {
    backgroundColor: colors.primary,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
  },
  timelineLineCompleted: {
    backgroundColor: colors.primary,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 20,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9E9E9E',
    marginBottom: 4,
  },
  timelineTitleActive: {
    color: '#212121',
  },
  timelineSubtitle: {
    fontSize: 13,
    color: '#9E9E9E',
  },
  supportSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    gap: 8,
  },
  supportButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  deliveryCompleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE5B4',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFB800',
  },
  deliveryCompleteText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8B6914',
  },
  deliveryCompleteButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF9500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxxl,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
  },
  riderDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  riderVehicle: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
});

export default OrderTrackingScreen;
