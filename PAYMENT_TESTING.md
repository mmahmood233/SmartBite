# Payment Testing Guide

## Overview
SmartBite uses Stripe in **test mode** for payment processing. No real money is charged during testing.

## Test Cards

Use these test card numbers to simulate different payment scenarios:

### ✅ Successful Payments

**Visa**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/25`)
- CVV: Any 3 digits (e.g., `123`)
- Name: Any name

**Mastercard**
- Card: `5555 5555 5555 4444`
- Expiry: Any future date
- CVV: Any 3 digits

**American Express**
- Card: `3782 822463 10005`
- Expiry: Any future date
- CVV: Any 4 digits (e.g., `1234`)

### ❌ Failed Payments

**Declined Card**
- Card: `4000 0000 0000 0002`
- Result: Card declined

**Insufficient Funds**
- Card: `4000 0000 0000 9995`
- Result: Insufficient funds

**Expired Card**
- Card: `4000 0000 0000 0069`
- Result: Expired card

## Payment Methods

### 1. Credit/Debit Card
- Uses Stripe payment processing
- Validates card number, expiry, CVV
- Shows card type (Visa, Mastercard, Amex)
- Instant payment confirmation

### 2. Cash on Delivery
- No card details required
- Payment collected on delivery
- Suitable for users without cards

### 3. BenefitPay (Mock)
- Bahrain's local payment system
- Currently simulated for demo
- Would redirect to BenefitPay in production

## Testing Flow

1. **Add items to cart**
2. **Proceed to checkout**
3. **Select payment method**
4. **For card payment:**
   - Enter test card number: `4242 4242 4242 4242`
   - Enter any future expiry: `12/25`
   - Enter any CVV: `123`
   - Enter any name: `Test User`
5. **Click "Pay"**
6. **See success confirmation**

## Features

✅ **Card Validation**
- Luhn algorithm for card number
- Expiry date validation
- CVV length check (3 for Visa/MC, 4 for Amex)
- Card type detection

✅ **Security**
- CVV is masked
- Secure payment processing
- Encrypted data transmission

✅ **User Experience**
- Auto-formatting card number
- Real-time validation
- Clear error messages
- Loading states

## Integration Status

### ✅ Implemented
- Payment method selection
- Card input form with validation
- Mock payment processing
- Success/failure handling
- Test mode configuration

### 🚧 Production Ready
To make this production-ready:
1. Get real Stripe account
2. Add backend API for payment processing
3. Implement 3D Secure authentication
4. Add webhook handlers for payment events
5. Store payment records in database

## Environment Variables

```bash
# Test Mode (Current)
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_TYooMQauvdEDq54NiTphI7jx

# Production (When ready)
# EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
```

## Notes

- All payments in test mode are simulated
- No real money is charged
- Test cards work only in test mode
- Production keys require Stripe account verification

## Support

For Stripe documentation: https://stripe.com/docs/testing

---

**Last Updated**: December 2, 2025
