-- Migration 020: Add missing columns to orders table

-- Add delivery_address column
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS delivery_address TEXT;

-- Add delivery_phone column
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS delivery_phone TEXT;

-- Add delivery_notes column
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS delivery_notes TEXT;

-- Add payment_method column
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method TEXT;

-- Add contactless_delivery column
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS contactless_delivery BOOLEAN DEFAULT false;

-- Add comments
COMMENT ON COLUMN orders.delivery_address IS 'Customer delivery address';
COMMENT ON COLUMN orders.delivery_phone IS 'Customer phone number for delivery';
COMMENT ON COLUMN orders.delivery_notes IS 'Special delivery instructions';
COMMENT ON COLUMN orders.payment_method IS 'Payment method: card, cash, apple, paypal';
COMMENT ON COLUMN orders.contactless_delivery IS 'Whether contactless delivery is requested';
