// @ts-nocheck

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  PAYMENT_METHODS,
  processPayment,
  formatCardNumber,
  validateCardNumber,
  validateExpiryDate,
  validateCVV,
  getCardType,
} from '../../../services/payment.service';
import { supabase } from '../../../lib/supabase';
import { colors } from '../../../theme/colors';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useCart } from '../../../contexts/CartContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

const PaymentScreen: React.FC<Props> = ({ route, navigation }) => {
  const { t } = useLanguage();
  const { amount, orderData } = route.params || { amount: 0, orderData: null };
  const { cart, clearCart } = useCart();

  const [selectedMethod, setSelectedMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    if (formatted.length <= 19) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (text: string) => {
    let formatted = text.replace(/\D/g, '');
    if (formatted.length >= 2) {
      formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4);
    }
    setExpiryDate(formatted);
  };

  const validateForm = (): boolean => {
    if (selectedMethod === 'card') {
      if (!cardNumber || !validateCardNumber(cardNumber)) {
        Alert.alert('Invalid Card', 'Please enter a valid card number');
        return false;
      }
      if (!cardHolder || cardHolder.length < 3) {
        Alert.alert('Invalid Name', 'Please enter cardholder name');
        return false;
      }
      if (!expiryDate || !validateExpiryDate(expiryDate)) {
        Alert.alert('Invalid Expiry', 'Please enter a valid expiry date');
        return false;
      }
      const cardType = getCardType(cardNumber);
      if (!cvv || !validateCVV(cvv, cardType)) {
        Alert.alert('Invalid CVV', 'Please enter a valid CVV');
        return false;
      }
    }
    return true;
  };

  const createOrderInDB = async (paymentResult: any) => {
    // Create order in database after successful payment
    // @ts-ignore - Supabase types
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: orderData.user_id,
        restaurant_id: orderData.restaurant_id,
        status: 'pending',
        total_amount: orderData.total_amount,
        delivery_fee: orderData.delivery_fee,
        subtotal: orderData.subtotal,
        delivery_address_id: orderData.delivery_address_id,
        delivery_address: orderData.delivery_address,
        delivery_phone: orderData.delivery_phone,
        delivery_notes: orderData.delivery_notes,
        payment_method: selectedMethod,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = orderData.items.map((item: any) => ({
      order_id: order.id,
      dish_id: item.dishId,
      dish_name: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      subtotal: item.price * item.quantity,
      special_request: item.specialRequest || null,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Clear cart
    await clearCart();

    // Navigate to confirmation
    navigation.replace('OrderConfirmation', {
      orderId: order.id,
      orderNumber: order.order_number,
      paymentId: paymentResult.paymentId!,
      restaurantName: orderData.restaurantName,
      restaurantLogo: cart.restaurantLogo,
      items: orderData.items,
      total: amount,
    });
  };

  const handlePayment = async () => {
    // If BenefitPay, navigate to BenefitPay screen
    if (selectedMethod === 'benefitpay') {
      // @ts-ignore
      navigation.navigate('BenefitPay', {
        amount,
        onSuccess: async (result: any) => {
          try {
            await createOrderInDB(result);
          } catch (error) {
            console.error('Order creation error:', error);
            Alert.alert('Error', 'Failed to create order. Please try again.');
          }
        },
      });
      return;
    }

    // If cash payment, skip payment processing and create order directly
    if (selectedMethod === 'cash') {
      setLoading(true);
      try {
        const cashPaymentResult = {
          success: true,
          paymentId: `CASH-${Date.now()}`,
          method: 'cash',
        };
        
        await createOrderInDB(cashPaymentResult);
        Alert.alert(
          'Order Confirmed!',
          'Your order has been placed. Pay with cash when delivered.'
        );
      } catch (error) {
        console.error('Order creation error:', error);
        Alert.alert('Error', 'Failed to create order. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Process payment for card/benefit
      const result = await processPayment(amount, selectedMethod, {
        cardNumber,
        cardHolder,
        expiryDate,
        cvv,
      });

      if (result.success) {
        await createOrderInDB(result);
        Alert.alert(
          'Payment Successful!',
          `Your order has been confirmed.\nPayment ID: ${result.paymentId}`
        );
      } else {
        Alert.alert('Payment Failed', result.error || 'Please try again');
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.container}>

      <View style={styles.amountCard}>
        <Text style={styles.amountLabel}>Total Amount</Text>
        <Text style={styles.amountValue}>BHD {amount.toFixed(3)}</Text>
      </View>

      <Text style={styles.sectionTitle}>Select Payment Method</Text>

      {PAYMENT_METHODS.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.methodCard,
            selectedMethod === method.id && styles.methodCardSelected,
          ]}
          onPress={() => setSelectedMethod(method.id)}
        >
          <Icon
            name={method.icon}
            size={24}
            color={selectedMethod === method.id ? '#00A86B' : '#666'}
          />
          <Text
            style={[
              styles.methodName,
              selectedMethod === method.id && styles.methodNameSelected,
            ]}
          >
            {method.name}
          </Text>
          {selectedMethod === method.id && (
            <Icon name="check-circle" size={20} color="#00A86B" />
          )}
        </TouchableOpacity>
      ))}

      {selectedMethod === 'card' && (
        <View style={styles.cardForm}>
          <Text style={styles.formTitle}>Card Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChangeText={handleCardNumberChange}
              keyboardType="numeric"
              maxLength={19}
            />
            <Text style={styles.hint}>
              Test: 4242 4242 4242 4242
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Cardholder Name</Text>
            <TextInput
              style={styles.input}
              placeholder="JOHN DOE"
              value={cardHolder}
              onChangeText={setCardHolder}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                value={expiryDate}
                onChangeText={handleExpiryChange}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>CVV</Text>
              <TextInput
                style={styles.input}
                placeholder="123"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>
        </View>
      )}

      {selectedMethod === 'cash' && (
        <View style={styles.infoCard}>
          <Icon name="information" size={20} color="#00A86B" />
          <Text style={styles.infoText}>
            Pay with cash when your order is delivered
          </Text>
        </View>
      )}

      {selectedMethod === 'benefit' && (
        <View style={styles.infoCard}>
          <Icon name="information" size={20} color="#00A86B" />
          <Text style={styles.infoText}>
            You will be redirected to BenefitPay to complete payment
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.payButton, loading && styles.payButtonDisabled]}
        onPress={handlePayment}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.payButtonText}>
              Pay BHD {amount.toFixed(3)}
            </Text>
            <Icon name="arrow-right" size={20} color="#fff" />
          </>
        )}
      </TouchableOpacity>

      <View style={styles.secureInfo}>
        <Icon name="lock" size={16} color="#666" />
        <Text style={styles.secureText}>
          Your payment information is secure and encrypted
        </Text>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  amountCard: {
    backgroundColor: '#00A86B',
    margin: 16,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  amountLabel: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  amountValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#eee',
  },
  methodCardSelected: {
    borderColor: '#00A86B',
    backgroundColor: '#f0fdf7',
  },
  methodName: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  methodNameSelected: {
    color: '#00A86B',
    fontWeight: '600',
  },
  cardForm: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  hint: {
    fontSize: 12,
    color: '#00A86B',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf7',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00A86B',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    color: '#00A86B',
    fontSize: 14,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00A86B',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  secureInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  secureText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#666',
  },
});

export default PaymentScreen;
