-- Migration 032: Make partner_id nullable in restaurants table

-- Allow NULL values for partner_id (useful for seeding data without creating partner users)
ALTER TABLE restaurants 
ALTER COLUMN partner_id DROP NOT NULL;

-- Add comment
COMMENT ON COLUMN restaurants.partner_id IS 'Partner user ID (nullable for system-created restaurants)';
