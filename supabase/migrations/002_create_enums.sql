-- Migration 002: Create ENUM Types
-- Define all enum types used across the database

-- User roles
CREATE TYPE user_role AS ENUM ('customer', 'partner', 'admin');

-- Order status
CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed',
  'preparing',
  'ready_for_pickup',
  'out_for_delivery',
  'delivered',
  'cancelled'
);

-- Payment methods
CREATE TYPE payment_method AS ENUM (
  'card',
  'benefitpay',
  'cash',
  'apple_pay'
);

-- Payment status
CREATE TYPE payment_status AS ENUM (
  'pending',
  'completed',
  'failed',
  'refunded'
);

-- Transaction status
CREATE TYPE transaction_status AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded'
);

-- Promo code discount type
CREATE TYPE discount_type AS ENUM (
  'percentage',
  'fixed',
  'free_delivery'
);

-- Comments
COMMENT ON TYPE user_role IS 'User account types';
COMMENT ON TYPE order_status IS 'Order lifecycle states';
COMMENT ON TYPE payment_method IS 'Available payment methods';
COMMENT ON TYPE payment_status IS 'Payment transaction states';
COMMENT ON TYPE transaction_status IS 'Transaction processing states';
COMMENT ON TYPE discount_type IS 'Promo code discount types';
