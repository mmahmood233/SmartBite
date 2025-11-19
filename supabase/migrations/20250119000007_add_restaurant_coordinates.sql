-- Add latitude and longitude columns to restaurants table
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Add index for location-based queries
CREATE INDEX IF NOT EXISTS idx_restaurants_location ON restaurants(latitude, longitude);

-- Update existing restaurants with sample Bahrain coordinates
-- These are placeholder coordinates - you should update with real addresses
UPDATE restaurants
SET 
  latitude = 26.2285 + (RANDOM() * 0.1 - 0.05),  -- Bahrain latitude range
  longitude = 50.5860 + (RANDOM() * 0.1 - 0.05)  -- Bahrain longitude range
WHERE latitude IS NULL;

-- Add comment
COMMENT ON COLUMN restaurants.latitude IS 'Restaurant latitude coordinate';
COMMENT ON COLUMN restaurants.longitude IS 'Restaurant longitude coordinate';
