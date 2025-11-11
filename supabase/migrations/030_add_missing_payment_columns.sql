-- Migration 030: Add missing columns to payment_methods table

-- Add missing columns if they don't exist
ALTER TABLE payment_methods 
ADD COLUMN IF NOT EXISTS card_holder_name VARCHAR(200);

ALTER TABLE payment_methods 
ADD COLUMN IF NOT EXISTS card_number_last4 VARCHAR(4);

ALTER TABLE payment_methods 
ADD COLUMN IF NOT EXISTS expiry_month VARCHAR(2);

ALTER TABLE payment_methods 
ADD COLUMN IF NOT EXISTS expiry_year VARCHAR(4);

-- Add comments
COMMENT ON COLUMN payment_methods.card_holder_name IS 'Name on the card';
COMMENT ON COLUMN payment_methods.card_number_last4 IS 'Last 4 digits of card (for security)';
COMMENT ON COLUMN payment_methods.expiry_month IS 'Card expiry month (MM)';
COMMENT ON COLUMN payment_methods.expiry_year IS 'Card expiry year (YYYY)';
