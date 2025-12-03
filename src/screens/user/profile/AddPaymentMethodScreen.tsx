// @ts-nocheck
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather as Icon } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../../constants';
import { validateRequired } from '../../../utils';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Snackbar from '../../../components/Snackbar';
import { supabase } from '../../../lib/supabase';
import { useLanguage } from '../../../contexts/LanguageContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AddPaymentMethodScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useLanguage();

  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'warning' | 'info' }>({ visible: false, message: '', type: 'success' });

  const showSnackbar = (message: string, type: 'success' | 'error' = 'success') => {
    setSnackbar({ visible: true, message, type });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const formatCardNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    
    // Detect card type
    if (cleaned.startsWith('4')) {
      setCardType('visa');
    } else if (cleaned.startsWith('5')) {
      setCardType('mastercard');
    } else {
      setCardType(null);
    }

    // Add spaces every 4 digits
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    setCardNumber(formatted.substring(0, 19)); // Max 16 digits + 3 spaces
  };

  const formatExpiryDate = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    
    if (cleaned.length === 0) {
      setExpiryDate('');
      return;
    }
    
    // Auto-add leading zero for single digit months (1-9 becomes 01-09)
    if (cleaned.length === 1) {
      const digit = parseInt(cleaned);
      // If user types 2-9, add leading zero
      if (digit >= 2 && digit <= 9) {
        setExpiryDate(`0${cleaned} / `);
      } else {
        setExpiryDate(cleaned);
      }
    } else if (cleaned.length === 2) {
      const month = parseInt(cleaned);
      // Validate month (01-12)
      if (month > 12) {
        setExpiryDate('12');
      } else {
        setExpiryDate(`${cleaned} / `);
      }
    } else if (cleaned.length >= 3) {
      const month = cleaned.substring(0, 2);
      const year = cleaned.substring(2, 4);
      setExpiryDate(`${month} / ${year}`);
    }
  };

  const formatCVV = (text: string) => {
    // Only allow digits, max 3
    const cleaned = text.replace(/\D/g, '');
    setCvv(cleaned.substring(0, 3));
  };

  const handleSaveCard = async () => {
    // Validation
    if (!validateRequired(cardholderName)) {
      showSnackbar('Please enter cardholder name', 'error');
      return;
    }
    
    // Simple card number validation (13-19 digits)
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      showSnackbar('Please enter a valid card number', 'error');
      return;
    }
    
    // Simple expiry validation (MM/YY format)
    const cleanExpiry = expiryDate.replace(/\s|\//g, '');
    if (cleanExpiry.length !== 4) {
      showSnackbar('Please enter a valid expiry date (MM/YY)', 'error');
      return;
    }
    
    // Extract expiry month and year for validation
    const expiryMonth = cleanExpiry.substring(0, 2);
    const expiryYear = '20' + cleanExpiry.substring(2, 4);
    
    // Validate month (01-12)
    const monthNum = parseInt(expiryMonth);
    if (monthNum < 1 || monthNum > 12) {
      showSnackbar('Invalid month. Please enter 01-12', 'error');
      return;
    }
    
    // Check if card is expired
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 0-indexed
    const cardYear = parseInt(expiryYear);
    const cardMonth = parseInt(expiryMonth);
    
    if (cardYear < currentYear || (cardYear === currentYear && cardMonth < currentMonth)) {
      showSnackbar('Card has expired. Please use a valid card', 'error');
      return;
    }
    
    // Simple CVV validation (3 digits)
    if (cvv.length !== 3) {
      showSnackbar('Please enter a valid 3-digit CVV', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        showSnackbar('Please login first', 'error');
        return;
      }

      // Extract last 4 digits
      const last4 = cleanCardNumber.slice(-4);

      // Insert payment method (NEVER store full card number or CVV)
      const { error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: user.id,
          type: 'card',
          card_holder_name: cardholderName.trim(),
          card_number_last4: last4,
          expiry_month: expiryMonth,
          expiry_year: expiryYear,
          is_default: isDefault,
        });

      if (error) throw error;

      showSnackbar('Card added successfully', 'success');
      setTimeout(() => navigation.goBack(), 1500);
    } catch (error) {
      console.error('Error saving card:', error);
      showSnackbar('Failed to add card', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (
    icon: string,
    placeholder: string,
    value: string,
    onChangeText: (text: string) => void,
    keyboardType: 'default' | 'numeric' | 'number-pad' = 'default',
    maxLength?: number,
    secureTextEntry: boolean = false
  ) => (
    <View style={styles.inputContainer}>
      <View style={styles.inputIconContainer}>
        <Icon name={icon} size={18} color={colors.primary} />
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        maxLength={maxLength}
        secureTextEntry={secureTextEntry}
      />
      {icon === 'credit-card' && cardType && (
        <View style={styles.cardTypeIndicator}>
          <MaterialCommunityIcons
            name={cardType === 'visa' ? 'credit-card' : 'credit-card'}
            size={24}
            color={cardType === 'visa' ? '#1A1F71' : '#EB001B'}
          />
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Payment Method</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          {/* Cardholder Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Cardholder Name *</Text>
            {renderInput('user', 'Ahmed Faisal', cardholderName, setCardholderName)}
          </View>

          {/* Card Number */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Card Number *</Text>
            {renderInput('credit-card', '•••• •••• •••• ••••', cardNumber, formatCardNumber, 'number-pad', 19)}
          </View>

          {/* Expiry Date & CVV */}
          <View style={styles.rowGroup}>
            <View style={[styles.fieldGroup, styles.fieldHalf]}>
              <Text style={styles.fieldLabel}>Expiry Date *</Text>
              {renderInput('calendar', 'MM / YY', expiryDate, formatExpiryDate, 'number-pad', 7)}
            </View>

            <View style={[styles.fieldGroup, styles.fieldHalf]}>
              <Text style={styles.fieldLabel}>CVV *</Text>
              {renderInput('lock', '•••', cvv, formatCVV, 'number-pad', 3, true)}
            </View>
          </View>

          {/* Set as Default */}
          <TouchableOpacity
            style={styles.checkboxToggle}
            onPress={() => setIsDefault(!isDefault)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, isDefault && styles.checkboxActive]}>
              {isDefault && <Icon name="check" size={14} color="#FFFFFF" />}
            </View>
            <Text style={styles.checkboxText}>Set as Default Payment Method</Text>
          </TouchableOpacity>

          {/* Security Notice */}
          <View style={styles.securityNotice}>
            <Icon name="lock" size={16} color="#64748B" />
            <Text style={styles.securityText}>
              Your details are encrypted and stored securely
            </Text>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>

      <LoadingSpinner visible={isLoading} message="Adding card..." overlay />
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
      />

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveCard}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButtonGradient}
          >
            <Text style={styles.saveButtonText}>Save Card</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
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
    color: '#0F172A',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    padding: SPACING.lg,
  },
  fieldGroup: {
    marginBottom: SPACING.xl,
  },
  fieldHalf: {
    flex: 1,
  },
  rowGroup: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  fieldLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: SPACING.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E6E9EE',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  inputIconContainer: {
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.base,
    color: '#0F172A',
    padding: 0,
  },
  cardTypeIndicator: {
    marginLeft: SPACING.sm,
  },
  checkboxToggle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: SPACING.sm,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxText: {
    fontSize: FONT_SIZE.base,
    color: '#0F172A',
    fontWeight: '500',
  },
  checkboxSubtext: {
    fontSize: FONT_SIZE.sm,
    color: '#64748B',
    marginTop: 2,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: SPACING.md,
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  securityText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: '#64748B',
    lineHeight: 18,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: SPACING.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: SPACING.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: SPACING.lg,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FONT_SIZE.base,
    fontWeight: '600',
    color: '#64748B',
  },
  saveButton: {
    flex: 2,
  },
  saveButtonGradient: {
    paddingVertical: SPACING.lg,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: FONT_SIZE.base,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default AddPaymentMethodScreen;
