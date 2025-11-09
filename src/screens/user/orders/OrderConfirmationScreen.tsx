import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather as Icon } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../../constants';
import { formatCurrency, formatOrderNumber } from '../../../utils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type OrderConfirmationRouteProp = RouteProp<RootStackParamList, 'OrderConfirmation'>;

const OrderConfirmationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<OrderConfirmationRouteProp>();
  
  // Get real order data from route params or use defaults
  const {
    orderId = '',
    orderNumber = 'WAJ' + Math.floor(Math.random() * 10000),
    restaurantName = 'Restaurant',
    items = [],
    total = 0,
  } = route.params || {};

  const handleTrackOrder = () => {
    navigation.navigate('OrderTracking', { orderNumber });
  };

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Success Header */}
        <View style={styles.successHeader}>
          <View style={styles.checkmarkContainer}>
            <LinearGradient
              colors={['#00897B', '#26A69A']}
              style={styles.checkmarkGradient}
            >
              <Icon name="check" size={48} color="#FFFFFF" />
            </LinearGradient>
          </View>
          <Text style={styles.successTitle}>Order Placed Successfully!</Text>
          <Text style={styles.successSubtext}>
            We've sent your order to {restaurantName}. Get ready for delicious food!
          </Text>
        </View>

        {/* Order Summary Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.restaurantHeader}>
              <View style={styles.restaurantLogo}>
                <Text style={styles.restaurantLogoText}>🍽️</Text>
              </View>
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{restaurantName}</Text>
                <Text style={styles.orderNumber}>Order #{orderNumber}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {items.map((item: any, index: number) => (
              <View key={index} style={styles.orderItem}>
                <Text style={styles.itemName}>
                  {item.name} ×{item.quantity}
                </Text>
                <Text style={styles.itemPrice}>
                  BD {(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>BD {total.toFixed(2)}</Text>
            </View>

            <View style={styles.etaContainer}>
              <Icon name="clock" size={16} color={colors.primary} />
              <Text style={styles.etaText}>ETA: 25–30 min</Text>
            </View>
          </View>
        </View>

        {/* Delivery Tracker Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Status</Text>
          <View style={styles.trackerCard}>
            <Image
              source={require('../../../../assets/map_sample.png')}
              style={styles.mapPreview}
              resizeMode="cover"
            />
            <View style={styles.trackerOverlay}>
              <View style={styles.trackerInfo}>
                <Icon name="map-pin" size={20} color={colors.primary} />
                <Text style={styles.trackerText}>Your rider will be assigned soon</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Spacing for buttons */}
        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.trackButton}
          onPress={handleTrackOrder}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#00897B', '#26A69A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.trackButtonGradient}
          >
            <Text style={styles.trackButtonText}>Track My Order</Text>
            <Icon name="navigation" size={18} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={handleBackToHome}
          activeOpacity={0.7}
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
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
  scrollView: {
    flex: 1,
  },
  successHeader: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  checkmarkContainer: {
    marginBottom: SPACING.xxl,
  },
  checkmarkGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  successTitle: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  successSubtext: {
    fontSize: FONT_SIZE.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SPACING.xl,
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
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
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
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: FONT_SIZE.lg + 1,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: SPACING.xs,
  },
  orderNumber: {
    fontSize: 13,
    color: '#6D6D6D',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemName: {
    fontSize: 15,
    color: '#212121',
    flex: 1,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A4D47',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 8,
  },
  etaText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  trackerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  mapPreview: {
    width: '100%',
    height: 180,
  },
  trackerOverlay: {
    padding: 16,
  },
  trackerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trackerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6D6D6D',
    flex: 1,
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
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    elevation: 20,
  },
  trackButton: {
    marginBottom: 12,
  },
  trackButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#00897B',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  trackButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  homeButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: 0.2,
  },
});

export default OrderConfirmationScreen;
