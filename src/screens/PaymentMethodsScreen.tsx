import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../constants';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface PaymentMethod {
  id: string;
  type: 'card' | 'benefitpay' | 'cod';
  cardType?: 'visa' | 'mastercard';
  lastFour?: string;
  expiryDate?: string;
  isDefault: boolean;
  icon: string;
  label: string;
}

const PaymentMethodsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      cardType: 'mastercard',
      lastFour: '3421',
      expiryDate: '02/28',
      isDefault: true,
      icon: 'credit-card',
      label: 'MasterCard',
    },
  ]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleDeletePayment = (id: string, label: string) => {
    Alert.alert(
      'Remove Payment Method',
      `Remove ${label} from your payment methods?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
          },
        },
      ]
    );
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map(pm => ({
        ...pm,
        isDefault: pm.id === id,
      }))
    );
  };

  const handleAddPayment = () => {
    navigation.navigate('AddPaymentMethod');
  };

  const renderPaymentCard = (payment: PaymentMethod) => (
    <View key={payment.id} style={styles.paymentCard}>
      {/* Icon */}
      <View style={styles.paymentIconContainer}>
        <Icon name={payment.icon} size={20} color={colors.primary} />
      </View>

      {/* Payment Info */}
      <View style={styles.paymentInfo}>
        <View style={styles.paymentHeader}>
          <Text style={styles.paymentLabel}>
            {payment.label}
            {payment.lastFour && ` •••• ${payment.lastFour}`}
          </Text>
          {payment.isDefault && (
            <View style={styles.defaultBadge}>
              <MaterialCommunityIcons name="check-circle" size={14} color={colors.primary} />
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>
        
        {payment.expiryDate && (
          <Text style={styles.expiryText}>Expires {payment.expiryDate}</Text>
        )}

        {/* Action Buttons */}
        <View style={styles.paymentActions}>
          {!payment.isDefault && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleSetDefault(payment.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.actionButtonText}>Set as Default</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeletePayment(payment.id, payment.label)}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.paymentsContainer}>
          {paymentMethods.map(renderPaymentCard)}
        </View>

        {/* Add New Payment Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddPayment}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addButtonGradient}
          >
            <Icon name="plus" size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Payment Method</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Bottom Spacing */}
        <View style={{ height: SPACING.xxxl }} />
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
  paymentsContainer: {
    padding: SPACING.lg,
  },
  paymentCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xxl,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  paymentIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: '#E6F7F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  paymentLabel: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: '#0F172A',
    marginRight: SPACING.sm,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F7F4',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    gap: 4,
  },
  defaultText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: colors.primary,
  },
  expiryText: {
    fontSize: FONT_SIZE.sm,
    color: '#64748B',
    marginBottom: SPACING.md,
  },
  paymentActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  actionButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    color: colors.primary,
  },
  deleteButton: {
    borderColor: '#FEE2E2',
  },
  deleteButtonText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    color: colors.error,
  },
  addButton: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  addButtonText: {
    fontSize: FONT_SIZE.base,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default PaymentMethodsScreen;
