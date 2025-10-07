import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../constants';
import { formatCurrency } from '../utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: any;
  addOns?: string[];
  specialRequest?: string;
}

interface Restaurant {
  name: string;
  cuisine: string;
  location: string;
  deliveryTime: string;
  deliveryFee: number;
  image?: any;
}

const CartScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  // Mock data - will be replaced with actual cart state
  const [restaurant] = useState<Restaurant>({
    name: 'Al Qariah',
    cuisine: 'Saudi • Home-Style • Grill',
    location: 'Manama',
    deliveryTime: '25 min',
    deliveryFee: 0.5,
  });

  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Kabsa Rice with Chicken',
      price: 8.5,
      quantity: 1,
      image: require('../../assets/food.png'),
      addOns: ['Extra Chicken (+BD 1.00)'],
    },
    {
      id: '2',
      name: 'Lamb Mandi',
      price: 12.0,
      quantity: 2,
      image: require('../../assets/food.png'),
    },
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity;
      return sum + itemTotal;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + restaurant.deliveryFee - discount;
  };

  const updateQuantity = (id: string, change: number) => {
    setCartItems(prev =>
      prev
        .map(item =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const [showClearModal, setShowClearModal] = useState(false);

  const clearCart = () => {
    setShowClearModal(true);
  };

  const confirmClearCart = () => {
    setCartItems([]);
    setShowClearModal(false);
  };

  const applyPromoCode = () => {
    // Mock promo code logic
    if (promoCode.toUpperCase() === 'WAJBA10') {
      setDiscount(1.0);
      setPromoApplied(true);
    }
  };

  const handleCheckout = () => {
    navigation.navigate('Checkout');
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Order</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Empty State */}
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🛍️</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add something delicious!</Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.browseButtonText}>Browse Restaurants</Text>
          </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Your Order</Text>
        <TouchableOpacity onPress={clearCart} style={styles.clearButton}>
          <Icon name="trash-2" size={20} color="#E74C3C" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Restaurant Info Card */}
        <View style={styles.restaurantCard}>
          <View style={styles.restaurantThumbnail}>
            <Text style={styles.thumbnailEmoji}>🍽️</Text>
          </View>
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <Text style={styles.restaurantCuisine}>{restaurant.cuisine}</Text>
            <View style={styles.restaurantMeta}>
              <View style={styles.metaItem}>
                <Icon name="map-pin" size={12} color="#6D6D6D" />
                <Text style={styles.metaText}>{restaurant.location}</Text>
              </View>
              <Text style={styles.metaDot}>•</Text>
              <View style={styles.metaItem}>
                <Icon name="clock" size={12} color="#6D6D6D" />
                <Text style={styles.metaText}>{restaurant.deliveryTime}</Text>
              </View>
              <Text style={styles.metaDot}>•</Text>
              <View style={styles.metaItem}>
                <Icon name="truck" size={12} color="#6D6D6D" />
                <Text style={styles.metaText}>BD {restaurant.deliveryFee.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Items List */}
        <View style={styles.itemsSection}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {cartItems.map(item => (
            <View key={item.id} style={styles.cartItem}>
              <Image source={item.image} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.addOns && item.addOns.length > 0 && (
                  <View style={styles.addOnsContainer}>
                    {item.addOns.map((addOn, index) => (
                      <Text key={index} style={styles.addOnText}>+ {addOn}</Text>
                    ))}
                  </View>
                )}
                <View style={styles.itemFooter}>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, -1)}
                      activeOpacity={0.7}
                    >
                      <Icon name="minus" size={16} color={colors.primary} />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, 1)}
                      activeOpacity={0.7}
                    >
                      <Icon name="plus" size={16} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.itemPrice}>
                    BD {(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Promo Code */}
        <View style={styles.promoSection}>
          <Text style={styles.sectionTitle}>Promo Code</Text>
          <View style={styles.promoInputContainer}>
            <TextInput
              style={styles.promoInput}
              placeholder="Have a discount? Enter your code here"
              placeholderTextColor="#9E9E9E"
              value={promoCode}
              onChangeText={setPromoCode}
              editable={!promoApplied}
            />
            <TouchableOpacity
              style={[styles.applyButton, promoApplied && styles.applyButtonDisabled]}
              onPress={applyPromoCode}
              disabled={promoApplied}
              activeOpacity={0.7}
            >
              <Text style={styles.applyButtonText}>
                {promoApplied ? '✓ Applied' : 'Apply'}
              </Text>
            </TouchableOpacity>
          </View>
          {promoApplied && (
            <Text style={styles.promoSuccess}>
              ✓ Code applied – BD {discount.toFixed(2)} off
            </Text>
          )}
        </View>

        {/* Order Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>BD {calculateSubtotal().toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>BD {restaurant.deliveryFee.toFixed(2)}</Text>
            </View>
            {discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount</Text>
                <Text style={[styles.summaryValue, styles.discountText]}>
                  -BD {discount.toFixed(2)}
                </Text>
              </View>
            )}
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>BD {calculateTotal().toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Spacing for sticky footer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Checkout Button */}
      <View style={styles.checkoutFooter}>
        <View style={styles.footerLeft}>
          <Text style={styles.footerLabel}>Total</Text>
          <Text style={styles.footerTotal}>BD {calculateTotal().toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#00897B', '#26A69A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.checkoutGradient}
          >
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            <Icon name="arrow-right" size={18} color="#FFFFFF" />
          </LinearGradient>
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
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  clearButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  restaurantCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  restaurantThumbnail: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  thumbnailEmoji: {
    fontSize: 24,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: SPACING.xs,
  },
  restaurantCuisine: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
    marginBottom: SPACING.sm,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
  },
  metaDot: {
    fontSize: 12,
    color: '#9E9E9E',
    marginHorizontal: 6,
  },
  itemsSection: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: SPACING.md,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.md,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: FONT_SIZE.base,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: SPACING.xs,
  },
  addOnsContainer: {
    marginBottom: 8,
    paddingLeft: 8,
  },
  addOnText: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  promoSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  promoInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  promoInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#212121',
  },
  applyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  applyButtonDisabled: {
    backgroundColor: '#80BBB7',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  promoSuccess: {
    fontSize: 13,
    color: colors.primary,
    marginTop: 8,
    fontWeight: '500',
  },
  summarySection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6D6D6D',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212121',
  },
  discountText: {
    color: '#E74C3C',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A4D47',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  checkoutFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  footerLeft: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 4,
  },
  footerTotal: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    lineHeight: 26,
  },
  checkoutButton: {
    flex: 1,
    marginLeft: 16,
  },
  checkoutGradient: {
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
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A4D47',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6D6D6D',
    marginBottom: 24,
    textAlign: 'center',
  },
  browseButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default CartScreen;
