-- Migration 031: Add opening and closing time columns to restaurants table

-- Add opening_time column
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS opening_time TIME;

-- Add closing_time column
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS closing_time TIME;

-- Add comments
COMMENT ON COLUMN restaurants.opening_time IS 'Restaurant opening time';
COMMENT ON COLUMN restaurants.closing_time IS 'Restaurant closing time';

-- Set default values for existing restaurants (optional)
-- UPDATE restaurants SET opening_time = '09:00:00', closing_time = '23:00:00' WHERE opening_time IS NULL;
