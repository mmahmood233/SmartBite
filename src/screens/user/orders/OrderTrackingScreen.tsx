import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';
import Icon from 'react-native-vector-icons/Feather';
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

const OrderTrackingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { orderNumber } = route.params;

  const [currentStep, setCurrentStep] = useState(1);

  const orderData = {
    restaurant: 'Al Qariah',
    orderNumber: orderNumber,
    eta: '22 min',
    rider: {
      name: 'Ahmed',
      phone: '+973 33560803',
      rating: 4.8,
    },
  };

  const timelineSteps: TimelineStep[] = [
    {
      id: '1',
      title: 'Order Confirmed',
      subtitle: 'We received your order',
      icon: 'check-circle',
      completed: true,
      active: false,
    },
    {
      id: '2',
      title: 'Preparing',
      subtitle: "Chef is preparing your meal",
      icon: 'package',
      completed: currentStep > 1,
      active: currentStep === 1,
    },
    {
      id: '3',
      title: 'Ready for Pickup',
      subtitle: 'Order is ready',
      icon: 'shopping-bag',
      completed: currentStep > 2,
      active: currentStep === 2,
    },
    {
      id: '4',
      title: 'Out for Delivery',
      subtitle: 'Rider is on the way',
      icon: 'truck',
      completed: currentStep > 3,
      active: currentStep === 3,
    },
    {
      id: '5',
      title: 'Delivered',
      subtitle: 'Enjoy your meal!',
      icon: 'home',
      completed: currentStep > 4,
      active: currentStep === 4,
    },
  ];

  const handleCallRider = () => {
    console.log('Calling rider...');
  };

  const handleContactSupport = () => {
    console.log('Contact support...');
  };

  const handleDeliveryComplete = () => {
    navigation.navigate('DeliveryComplete');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Track Order</Text>
          <Text style={styles.headerSubtitle}>
            {orderData.restaurant} • #{orderData.orderNumber}
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
            <Text style={styles.etaLabel}>Estimated Arrival</Text>
            <Text style={styles.etaTime}>{orderData.eta}</Text>
          </View>
        </View>

        {/* Map Section */}
        <View style={styles.mapSection}>
          <Image
            source={require('../../../../assets/map_sample.png')}
            style={styles.mapImage}
            resizeMode="cover"
          />
          <View style={styles.mapOverlay}>
            <View style={styles.riderCard}>
              <View style={styles.riderAvatar}>
                <Icon name="user" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.riderInfo}>
                <Text style={styles.riderName}>{orderData.rider.name} (Rider)</Text>
                <View style={styles.riderRating}>
                  <Icon name="star" size={12} color="#FFB800" />
                  <Text style={styles.riderRatingText}>{orderData.rider.rating}</Text>
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
        </View>

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
});

export default OrderTrackingScreen;
