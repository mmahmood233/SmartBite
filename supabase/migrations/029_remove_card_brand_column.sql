-- Migration 029: Remove card_brand column from payment_methods

-- Remove card_brand column (not needed)
ALTER TABLE payment_methods 
DROP COLUMN IF EXISTS card_brand;
