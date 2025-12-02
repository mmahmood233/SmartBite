import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = NativeStackScreenProps<RootStackParamList, 'BenefitPay'>;

export default function BenefitPayScreen({ navigation, route }: Props) {
  const { amount, onSuccess } = route.params;
  
  const [cardNumber, setCardNumber] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'card' | 'pin' | 'processing'>('card');

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const handleCardSubmit = () => {
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      Alert.alert('Invalid Card', 'Please enter a valid 16-digit card number');
      return;
    }
    setStep('pin');
  };

  const handlePinSubmit = async () => {
    if (pin.length !== 4) {
      Alert.alert('Invalid PIN', 'Please enter your 4-digit PIN');
      return;
    }

    setStep('processing');
    setLoading(true);

    // Simulate BenefitPay processing
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Payment Successful',
        'Your payment has been processed successfully via BenefitPay',
        [
          {
            text: 'OK',
            onPress: () => {
              if (onSuccess) {
                onSuccess({
                  success: true,
                  paymentId: `ben_${Date.now()}`,
                });
              }
              navigation.goBack();
            },
          },
        ]
      );
    }, 2500);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>BenefitPay</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* BenefitPay Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoBox}>
          <Icon name="wallet" size={48} color="#E31837" />
          <Text style={styles.logoText}>BenefitPay</Text>
        </View>
      </View>

      {/* Amount */}
      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Amount to Pay</Text>
        <Text style={styles.amountValue}>BHD {amount.toFixed(3)}</Text>
      </View>

      {/* Card Entry Step */}
      {step === 'card' && (
        <View style={styles.formContainer}>
          <Text style={styles.stepTitle}>Enter Card Number</Text>
          <Text style={styles.stepSubtitle}>
            Enter your BenefitPay card number
          </Text>

          <View style={styles.inputContainer}>
            <Icon name="credit-card" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChangeText={(text) => {
                const formatted = formatCardNumber(text);
                if (formatted.length <= 19) {
                  setCardNumber(formatted);
                }
              }}
              keyboardType="numeric"
              maxLength={19}
            />
          </View>

          <Text style={styles.hint}>
            Test card: 4242 4242 4242 4242
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={handleCardSubmit}
          >
            <Text style={styles.buttonText}>Continue</Text>
            <Icon name="arrow-right" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* PIN Entry Step */}
      {step === 'pin' && (
        <View style={styles.formContainer}>
          <Text style={styles.stepTitle}>Enter PIN</Text>
          <Text style={styles.stepSubtitle}>
            Enter your 4-digit PIN to confirm payment
          </Text>

          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="••••"
              value={pin}
              onChangeText={setPin}
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
            />
          </View>

          <Text style={styles.hint}>
            Test PIN: 1234
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={handlePinSubmit}
          >
            <Text style={styles.buttonText}>Pay Now</Text>
            <Icon name="check" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setStep('card')}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Processing Step */}
      {step === 'processing' && (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color="#E31837" />
          <Text style={styles.processingText}>Processing Payment...</Text>
          <Text style={styles.processingSubtext}>
            Please wait while we verify your payment
          </Text>
        </View>
      )}

      {/* Security Info */}
      <View style={styles.securityInfo}>
        <Icon name="shield-check" size={16} color="#666" />
        <Text style={styles.securityText}>
          Secured by BenefitPay - Your payment is safe and encrypted
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#E31837',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
  },
  logoBox: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E31837',
    marginTop: 8,
  },
  amountContainer: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E31837',
  },
  formContainer: {
    flex: 1,
    padding: 24,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
  },
  hint: {
    fontSize: 12,
    color: '#E31837',
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E31837',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  backButton: {
    padding: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  processingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  processingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  securityText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#666',
  },
});
