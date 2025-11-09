-- Migration 021: Make delivery_address_id nullable in orders table
-- This allows orders to be placed with text address instead of requiring a saved address

ALTER TABLE orders 
ALTER COLUMN delivery_address_id DROP NOT NULL;

-- Add comment
COMMENT ON COLUMN orders.delivery_address_id IS 'Reference to saved address (optional, can use delivery_address text instead)';
