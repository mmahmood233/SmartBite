// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather as Icon } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../../constants';
import { formatCurrency } from '../../../utils';
import { useCart } from '../../../contexts/CartContext';
import { supabase } from '../../../lib/supabase';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  addOns?: string[];
}

const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { cart, clearCart } = useCart();
  
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<'apple' | 'paypal' | 'card' | 'cash'>('card');
  const [contactlessDelivery, setContactlessDelivery] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Fetch user profile
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch user profile from users table
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const deliveryAddress = {
    name: userProfile?.full_name || 'User',
    address: userProfile?.address || 'No address set',
    phone: userProfile?.phone || 'No phone set',
    eta: '25–30 min',
  };

  const paymentMethod = {
    type: 'card',
    last4: '8834',
    brand: 'Mastercard',
  };

  const handleSaveAddress = async () => {
    if (!newAddress.trim() || !newPhone.trim()) {
      Alert.alert('Error', 'Please fill in both address and phone number');
      return;
    }

    setSavingProfile(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // @ts-ignore - Supabase types not updated yet
        const { error } = await supabase
          .from('users')
          .update({
            address: newAddress.trim(),
            phone: newPhone.trim(),
          })
          .eq('id', user.id);

        if (error) throw error;

        // Reload profile
        await loadUserProfile();
        setShowAddressModal(false);
        Alert.alert('Success', 'Address and phone number saved!');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save information');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.items.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty');
      return;
    }

    // Check if user has address and phone
    const missingFields = [];
    if (!userProfile?.address) missingFields.push('address');
    if (!userProfile?.phone) missingFields.push('phone number');

    if (missingFields.length > 0) {
      // Pre-fill existing data
      setNewAddress(userProfile?.address || '');
      setNewPhone(userProfile?.phone || '');
      setShowAddressModal(true);
      return;
    }

    setPlacingOrder(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create order in Supabase
      const orderData = {
        user_id: user.id,
        restaurant_id: cart.restaurantId,
        status: 'pending',
        total_amount: cart.total,
        delivery_fee: cart.deliveryFee,
        subtotal: cart.subtotal,
        delivery_address: userProfile?.address,
        delivery_phone: userProfile?.phone,
        delivery_notes: deliveryNotes || null,
        payment_method: selectedPayment,
        contactless_delivery: contactlessDelivery,
      };

      // @ts-ignore - Supabase types not updated yet
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.items.map(item => ({
        order_id: order.id,
        dish_id: item.dishId,
        dish_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity,
        special_request: item.specialRequest || null,
      }));

      // @ts-ignore - Supabase types not updated yet
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart after successful order
      await clearCart();
      
      // Navigate to order confirmation screen with order data
      // @ts-ignore - Navigation types not updated yet
      navigation.replace('OrderConfirmation', {
        orderId: order.id,
        orderNumber: order.order_number,
        restaurantName: cart.restaurantName,
        items: cart.items,
        total: cart.total,
      });
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.cartIconContainer}>
          <Icon name="shopping-cart" size={20} color={colors.primary} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Delivery Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>Delivering to:</Text>
            </View>
            <View style={styles.addressRow}>
              <Icon name="home" size={18} color={colors.primary} />
              <View style={styles.addressInfo}>
                <Text style={styles.addressName}>{deliveryAddress.name}</Text>
                <Text style={styles.addressText}>{deliveryAddress.address}</Text>
              </View>
            </View>
            <View style={styles.addressRow}>
              <Icon name="phone" size={18} color={colors.primary} />
              <Text style={styles.addressDetail}>{deliveryAddress.phone}</Text>
            </View>
            <View style={styles.addressRow}>
              <Icon name="clock" size={18} color={colors.primary} />
              <Text style={styles.addressDetail}>ETA: {deliveryAddress.eta}</Text>
            </View>
            <View style={styles.addressRow}>
              <Icon name="truck" size={18} color={colors.primary} />
              <Text style={styles.addressDetail}>Hand delivery • Contactless available</Text>
            </View>
            <TouchableOpacity style={styles.changeButtonFilled} activeOpacity={0.8}>
              <Text style={styles.changeButtonFilledText}>Change Address</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pay with</Text>
          <View style={styles.card}>
            {/* Apple Pay */}
            <TouchableOpacity
              style={styles.paymentOptionEnhanced}
              onPress={() => setSelectedPayment('apple')}
              activeOpacity={0.7}
            >
              <View style={styles.paymentOptionLeft}>
                <View style={styles.paymentIconContainer}>
                  <Text style={styles.applePayIcon}></Text>
                </View>
                <Text style={styles.paymentOptionText}>Apple Pay</Text>
              </View>
              <View style={[styles.radioButton, selectedPayment === 'apple' && styles.radioButtonActive]}>
                {selectedPayment === 'apple' && <View style={styles.radioButtonInner} />}
              </View>
            </TouchableOpacity>

            <View style={styles.paymentDivider} />

            {/* PayPal */}
            <TouchableOpacity
              style={styles.paymentOptionEnhanced}
              onPress={() => setSelectedPayment('paypal')}
              activeOpacity={0.7}
            >
              <View style={styles.paymentOptionLeft}>
                <View style={styles.paymentIconContainer}>
                  <Text style={styles.paypalIcon}>P</Text>
                </View>
                <Text style={styles.paymentOptionText}>PayPal</Text>
              </View>
              <View style={[styles.radioButton, selectedPayment === 'paypal' && styles.radioButtonActive]}>
                {selectedPayment === 'paypal' && <View style={styles.radioButtonInner} />}
              </View>
            </TouchableOpacity>

            <View style={styles.paymentDivider} />

            {/* Credit/Debit Card */}
            <TouchableOpacity
              style={styles.paymentOptionEnhanced}
              onPress={() => setSelectedPayment('card')}
              activeOpacity={0.7}
            >
              <View style={styles.paymentOptionLeft}>
                <View style={styles.paymentIconContainer}>
                  <Icon name="credit-card" size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.paymentOptionText}>Credit/Debit Card</Text>
                  {selectedPayment === 'card' && (
                    <Text style={styles.paymentSubtext}>•••• {paymentMethod.last4}</Text>
                  )}
                </View>
              </View>
              <View style={[styles.radioButton, selectedPayment === 'card' && styles.radioButtonActive]}>
                {selectedPayment === 'card' && <View style={styles.radioButtonInner} />}
              </View>
            </TouchableOpacity>

            <View style={styles.paymentDivider} />

            {/* Cash */}
            <TouchableOpacity
              style={styles.paymentOptionEnhanced}
              onPress={() => setSelectedPayment('cash')}
              activeOpacity={0.7}
            >
              <View style={styles.paymentOptionLeft}>
                <View style={styles.paymentIconContainer}>
                  <Icon name="dollar-sign" size={20} color={colors.primary} />
                </View>
                <Text style={styles.paymentOptionText}>Cash</Text>
              </View>
              <View style={[styles.radioButton, selectedPayment === 'cash' && styles.radioButtonActive]}>
                {selectedPayment === 'cash' && <View style={styles.radioButtonInner} />}
              </View>
            </TouchableOpacity>

            {/* Cash Note */}
            {selectedPayment === 'cash' && (
              <View style={styles.cashNote}>
                <Icon name="info" size={14} color="#666666" />
                <Text style={styles.cashNoteText}>
                  Please prepare exact amount — riders may carry limited change.
                </Text>
              </View>
            )}

            {/* Contactless Delivery Option */}
            <View style={styles.paymentDivider} />
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setContactlessDelivery(!contactlessDelivery)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, contactlessDelivery && styles.checkboxActive]}>
                {contactlessDelivery && <Icon name="check" size={14} color="#FFFFFF" />}
              </View>
              <Text style={styles.checkboxLabel}>Contactless delivery</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Order</Text>
          <View style={styles.summaryCard}>
            <Text style={styles.restaurantNameBold}>{cart.restaurantName || 'Restaurant'}</Text>
            
            {cart.items.map((item: any) => (
              <View key={item.id} style={styles.orderItem}>
                <View style={styles.orderItemLeft}>
                  <Text style={styles.orderItemName}>
                    {item.name} ×{item.quantity}
                  </Text>
                  {item.addOns && item.addOns.length > 0 && (
                    <View style={styles.addOnsContainer}>
                      {item.addOns.map((addOn: any, index: number) => (
                        <Text key={index} style={styles.addOnText}>+ {addOn}</Text>
                      ))}
                    </View>
                  )}
                </View>
                <Text style={styles.orderItemPrice}>
                  BD {(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>BD {cart.subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>BD {cart.deliveryFee.toFixed(2)}</Text>
            </View>
            {false && ( 
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Promo Discount</Text>
                <Text style={[styles.summaryValue, styles.discountText]}>
                  -BD 0.00
                </Text>
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>BD {cart.total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Notes (Optional)</Text>
          <View style={styles.card}>
            <View style={styles.notesInputContainer}>
              <Icon name="edit-3" size={16} color="#9E9E9E" style={styles.notesIcon} />
              <TextInput
                style={styles.notesInput}
                placeholder="Add delivery instructions (e.g., ring the bell, call when outside)"
                placeholderTextColor="#7D7D7D"
              value={deliveryNotes}
              onChangeText={setDeliveryNotes}
              multiline
              numberOfLines={3}
                maxLength={200}
                textAlignVertical="top"
              />
            </View>
            <Text style={styles.characterCount}>{deliveryNotes.length}/200</Text>
          </View>
        </View>

        {/* Spacing for sticky footer */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.footerEnhanced}>
        <View style={styles.footerLeft}>
          <Text style={styles.footerLabel}>Total</Text>
          <Text style={styles.footerTotalEnhanced}>BD {cart.total.toFixed(2)}</Text>
          <Text style={styles.footerSubtextEnhanced}>Includes delivery</Text>
        </View>
        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#00897B', '#26A69A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.placeOrderGradient}
          >
            <Text style={styles.placeOrderText}>Place Order</Text>
            <Icon name="arrow-right" size={18} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Address & Phone Modal */}
      <Modal
        visible={showAddressModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddressModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Delivery Information</Text>
            <Text style={styles.modalSubtitle}>
              Please provide your address and phone number to continue
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="+973 XXXX XXXX"
                value={newPhone}
                onChangeText={setNewPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Delivery Address</Text>
              <TextInput
                style={[styles.modalInput, styles.addressInput]}
                placeholder="Building, Road, Block, Area"
                value={newAddress}
                onChangeText={setNewAddress}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              <Text style={styles.inputHint}>
                📍 Location picker coming soon
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowAddressModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleSaveAddress}
                disabled={savingProfile}
              >
                {savingProfile ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalSaveText}>Save & Continue</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A4D47',
  },
  cartIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A4D47',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666666',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  addressInfo: {
    flex: 1,
    marginLeft: 12,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#6D6D6D',
    lineHeight: 20,
  },
  addressDetail: {
    fontSize: 14,
    color: '#6D6D6D',
    marginLeft: 12,
  },
  changeButton: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#F3F7F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 126, 115, 0.15)',
    alignSelf: 'flex-start',
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  changeButtonFilled: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 24,
    alignSelf: 'flex-start',
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  changeButtonFilledText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  paymentOptionEnhanced: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F7F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  applePayIcon: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  paypalIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: '#003087',
  },
  paymentOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
  },
  paymentSubtext: {
    fontSize: 13,
    color: '#6D6D6D',
    marginTop: 2,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CFCFCF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonActive: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  paymentDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 4,
  },
  cashNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF9E6',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  cashNoteText: {
    flex: 1,
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CFCFCF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#212121',
    flex: 1,
  },
  restaurantName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  restaurantNameBold: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderItemLeft: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#212121',
    marginBottom: 4,
  },
  addOnText: {
    fontSize: 12,
    color: '#6D6D6D',
    marginLeft: 8,
    marginTop: 2,
  },
  orderItemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
  },
  addOnsContainer: {
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
  notesInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9F9F9',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 12,
  },
  notesIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  notesInput: {
    flex: 1,
    fontSize: 14,
    color: '#212121',
    minHeight: 80,
    maxHeight: 120,
  },
  characterCount: {
    fontSize: 12,
    color: '#9E9E9E',
    textAlign: 'right',
    marginTop: 6,
  },
  footer: {
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
  footerEnhanced: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 22,
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
  footerTotalEnhanced: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
    lineHeight: 30,
    marginBottom: 2,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  footerSubtextEnhanced: {
    fontSize: 12,
    color: '#999999',
  },
  placeOrderButton: {
    flex: 1,
    marginLeft: 16,
  },
  placeOrderGradient: {
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
  placeOrderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#1A1A1A',
  },
  addressInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputHint: {
    fontSize: 12,
    color: '#999999',
    marginTop: 6,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalCancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666666',
  },
  modalSaveButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default CheckoutScreen;
