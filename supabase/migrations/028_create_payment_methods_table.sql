-- Migration 028: Create payment_methods table

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'card', 'cash', 'wallet'
  card_holder_name VARCHAR(200),
  card_number_last4 VARCHAR(4), -- Only store last 4 digits
  expiry_month VARCHAR(2),
  expiry_year VARCHAR(4),
  is_default BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_is_default ON payment_methods(user_id, is_default);

-- Enable RLS
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own payment methods
CREATE POLICY "Users can view own payment methods"
ON payment_methods
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can add payment methods
CREATE POLICY "Users can add payment methods"
ON payment_methods
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can update their own payment methods
CREATE POLICY "Users can update own payment methods"
ON payment_methods
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Users can delete their own payment methods
CREATE POLICY "Users can delete own payment methods"
ON payment_methods
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Function to ensure only one default payment method per user
CREATE OR REPLACE FUNCTION ensure_single_default_payment()
RETURNS TRIGGER AS $$
BEGIN
  -- If setting this payment method as default
  IF NEW.is_default = true THEN
    -- Unset all other payment methods for this user
    UPDATE payment_methods
    SET is_default = false
    WHERE user_id = NEW.user_id
    AND id != NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce single default payment method
CREATE TRIGGER ensure_single_default_payment_trigger
BEFORE INSERT OR UPDATE ON payment_methods
FOR EACH ROW
EXECUTE FUNCTION ensure_single_default_payment();

-- Add comments
COMMENT ON TABLE payment_methods IS 'User payment methods';
COMMENT ON COLUMN payment_methods.type IS 'Payment type: card, cash, wallet';
COMMENT ON COLUMN payment_methods.card_number_last4 IS 'Last 4 digits of card (for security)';
COMMENT ON COLUMN payment_methods.is_default IS 'Whether this is the default payment method';
