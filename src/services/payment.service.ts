import { Alert } from 'react-native';

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  type: 'card' | 'cash' | 'benefit';
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: 'credit-card',
    type: 'card',
  },
  {
    id: 'cash',
    name: 'Cash on Delivery',
    icon: 'money',
    type: 'cash',
  },
  {
    id: 'benefit',
    name: 'BenefitPay',
    icon: 'wallet',
    type: 'benefit',
  },
];

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
}

/**
 * Process payment (mock implementation for demo)
 * In production, this would integrate with Stripe backend
 */
export const processPayment = async (
  amount: number,
  paymentMethod: string,
  cardDetails?: any
): Promise<PaymentResult> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock payment processing
    if (paymentMethod === 'card') {
      // In production: Call Stripe API
      return {
        success: true,
        paymentId: `pay_${Date.now()}`,
      };
    } else if (paymentMethod === 'cash') {
      return {
        success: true,
        paymentId: `cod_${Date.now()}`,
      };
    } else if (paymentMethod === 'benefit') {
      return {
        success: true,
        paymentId: `ben_${Date.now()}`,
      };
    }

    return {
      success: false,
      error: 'Invalid payment method',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Payment failed',
    };
  }
};

/**
 * Validate card number (basic Luhn algorithm)
 */
export const validateCardNumber = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(cleaned)) return false;

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Format card number with spaces
 */
export const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\s/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cleaned;
};

/**
 * Get card type from number
 */
export const getCardType = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(cleaned)) return 'Visa';
  if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
  if (/^3[47]/.test(cleaned)) return 'Amex';
  
  return 'Card';
};

/**
 * Validate expiry date
 */
export const validateExpiryDate = (expiry: string): boolean => {
  const [month, year] = expiry.split('/').map(v => parseInt(v));
  
  if (!month || !year || month < 1 || month > 12) return false;
  
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  
  return true;
};

/**
 * Validate CVV
 */
export const validateCVV = (cvv: string, cardType: string): boolean => {
  if (cardType === 'Amex') {
    return /^\d{4}$/.test(cvv);
  }
  return /^\d{3}$/.test(cvv);
};
