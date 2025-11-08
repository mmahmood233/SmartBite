-- Migration 008: Create Payment Tables

-- Payment methods
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type payment_method NOT NULL,
  card_type VARCHAR(50),
  card_last4 VARCHAR(4),
  expiry_date VARCHAR(7),
  is_default BOOLEAN DEFAULT FALSE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  payment_method payment_method NOT NULL,
  status transaction_status NOT NULL DEFAULT 'pending',
  gateway_transaction_id VARCHAR(255),
  gateway_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX idx_payment_methods_is_default ON payment_methods(is_default);

CREATE INDEX idx_transactions_order_id ON transactions(order_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- Comments
COMMENT ON TABLE payment_methods IS 'Saved payment methods for users';
COMMENT ON TABLE transactions IS 'Payment transaction records';

COMMENT ON COLUMN payment_methods.type IS 'Payment type: card, benefitpay, cash, apple_pay';
COMMENT ON COLUMN payment_methods.card_type IS 'Card brand: visa, mastercard, etc.';
COMMENT ON COLUMN payment_methods.card_last4 IS 'Last 4 digits of card number';
COMMENT ON COLUMN payment_methods.expiry_date IS 'Card expiry in MM/YY format';
COMMENT ON COLUMN transactions.gateway_transaction_id IS 'External payment gateway transaction ID';
COMMENT ON COLUMN transactions.gateway_response IS 'Full response from payment gateway (JSON)';
