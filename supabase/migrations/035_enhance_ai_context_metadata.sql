-- Migration 035: Enhance AI Context Metadata for Restaurants and Dishes
-- This migration adds rich contextual data to enable accurate AI recommendations
-- for various scenarios: date nights, sports events, gym meals, etc.

-- ============================================================================
-- RESTAURANTS TABLE ENHANCEMENTS
-- ============================================================================

-- Add price range indicator
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS price_range VARCHAR(20) CHECK (price_range IN ('budget', 'mid-range', 'premium', 'luxury'));

-- Add ambiance and atmosphere tags
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS ambiance TEXT[] DEFAULT '{}';
-- Examples: ['romantic', 'casual', 'family-friendly', 'sports-bar', 'fine-dining', 'cozy', 'modern', 'traditional']

-- Add cuisine types (can be multiple)
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS cuisine_types TEXT[] DEFAULT '{}';
-- Examples: ['italian', 'chinese', 'indian', 'american', 'mediterranean', 'fusion', 'seafood', 'steakhouse']

-- Add dietary options offered
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS dietary_options TEXT[] DEFAULT '{}';
-- Examples: ['vegetarian', 'vegan', 'gluten-free', 'halal', 'keto', 'low-carb', 'high-protein']

-- Add occasion suitability
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS suitable_for TEXT[] DEFAULT '{}';
-- Examples: ['date-night', 'business-meeting', 'family-gathering', 'sports-watching', 'quick-bite', 'celebration', 'casual-dining']

-- Add special features
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS features TEXT[] DEFAULT '{}';
-- Examples: ['outdoor-seating', 'live-sports', 'wifi', 'parking', 'kids-menu', 'late-night', 'breakfast', 'delivery-only']

-- Add peak hours info
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS peak_hours JSONB DEFAULT '{}';
-- Example: {"lunch": "12:00-14:00", "dinner": "19:00-22:00"}

-- Add popular dishes (quick reference)
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS signature_dishes TEXT[] DEFAULT '{}';

-- Add seating capacity
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS seating_capacity INTEGER;

-- Add noise level
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS noise_level VARCHAR(20) CHECK (noise_level IN ('quiet', 'moderate', 'lively', 'loud'));

-- Add dress code
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS dress_code VARCHAR(20) CHECK (dress_code IN ('casual', 'smart-casual', 'business-casual', 'formal'));

-- Add reservation requirement
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS reservation_required BOOLEAN DEFAULT FALSE;

-- Add average meal duration
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS avg_meal_duration INTEGER; -- in minutes

-- Add operating hours
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS operating_hours JSONB DEFAULT '{}';
-- Example: {"monday": "09:00-22:00", "tuesday": "09:00-22:00", ...}

-- Add popular times (for crowd avoidance)
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS popular_times TEXT[] DEFAULT '{}';
-- Examples: ['lunch-weekday', 'dinner-weekend', 'brunch-sunday']

-- Add good for groups
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS good_for_groups BOOLEAN DEFAULT FALSE;

-- Add takeout/delivery options
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS service_options TEXT[] DEFAULT '{}';
-- Examples: ['dine-in', 'takeout', 'delivery', 'curbside-pickup']

-- Add delivery radius (in km)
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS delivery_radius DECIMAL(5,2) DEFAULT 5.0;
-- How far the restaurant delivers (in kilometers)

-- Add neighborhood/area tags
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS neighborhoods TEXT[] DEFAULT '{}';
-- Examples: ['seef', 'juffair', 'adliya', 'manama', 'riffa', 'muharraq']

-- Add city/region
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS city VARCHAR(100) DEFAULT 'Manama';

-- Add country
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'Bahrain';

-- Add landmark nearby (for easier finding)
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS nearby_landmark VARCHAR(255);
-- Examples: 'Near City Centre Mall', 'Opposite Seef Mall', 'Next to Bahrain Financial Harbour'

-- Comments
COMMENT ON COLUMN restaurants.price_range IS 'Price range: budget (<5 BD), mid-range (5-15 BD), premium (15-30 BD), luxury (>30 BD)';
COMMENT ON COLUMN restaurants.ambiance IS 'Atmosphere tags for AI matching';
COMMENT ON COLUMN restaurants.cuisine_types IS 'Types of cuisine offered';
COMMENT ON COLUMN restaurants.dietary_options IS 'Special dietary options available';
COMMENT ON COLUMN restaurants.suitable_for IS 'Occasions/scenarios this restaurant is suitable for';
COMMENT ON COLUMN restaurants.features IS 'Special features and amenities';
COMMENT ON COLUMN restaurants.peak_hours IS 'Peak dining hours as JSON';
COMMENT ON COLUMN restaurants.signature_dishes IS 'Restaurant signature/popular dishes';
COMMENT ON COLUMN restaurants.noise_level IS 'Noise level for ambiance matching';
COMMENT ON COLUMN restaurants.dress_code IS 'Expected dress code';

-- ============================================================================
-- DISHES TABLE ENHANCEMENTS
-- ============================================================================

-- Add protein content (grams)
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS protein_grams DECIMAL(5,1);

-- Add carbs content (grams)
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS carbs_grams DECIMAL(5,1);

-- Add fat content (grams)
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS fat_grams DECIMAL(5,1);

-- Add fiber content (grams)
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS fiber_grams DECIMAL(5,1);

-- Add spice level (0-5 scale)
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS spice_level INTEGER CHECK (spice_level >= 0 AND spice_level <= 5) DEFAULT 0;

-- Add portion size indicator
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS portion_size VARCHAR(20) CHECK (portion_size IN ('small', 'regular', 'large', 'sharing'));

-- Add meal type suitability
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS meal_types TEXT[] DEFAULT '{}';
-- Examples: ['breakfast', 'brunch', 'lunch', 'dinner', 'snack', 'dessert', 'late-night']

-- Add dietary tags (more specific than boolean flags)
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS dietary_tags TEXT[] DEFAULT '{}';
-- Examples: ['high-protein', 'low-carb', 'keto-friendly', 'gluten-free', 'dairy-free', 'nut-free', 'paleo', 'whole30']

-- Add allergens
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS allergens TEXT[] DEFAULT '{}';
-- Examples: ['nuts', 'dairy', 'eggs', 'soy', 'wheat', 'shellfish', 'fish', 'sesame']

-- Add occasion suitability
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS suitable_occasions TEXT[] DEFAULT '{}';
-- Examples: ['date-night', 'post-workout', 'comfort-food', 'hangover-cure', 'kids-favorite', 'sharing-plate', 'game-day']

-- Add flavor profile
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS flavor_profile TEXT[] DEFAULT '{}';
-- Examples: ['savory', 'sweet', 'spicy', 'tangy', 'rich', 'light', 'creamy', 'crispy', 'smoky']

-- Add cooking method
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS cooking_method TEXT[] DEFAULT '{}';
-- Examples: ['grilled', 'fried', 'baked', 'steamed', 'raw', 'roasted', 'sauteed']

-- Add temperature served
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS served_temperature VARCHAR(20) CHECK (served_temperature IN ('hot', 'warm', 'room-temp', 'cold', 'frozen'));

-- Add shareability indicator
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS is_shareable BOOLEAN DEFAULT FALSE;

-- Add healthiness score (1-10)
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS health_score INTEGER CHECK (health_score >= 1 AND health_score <= 10);

-- Add best paired with
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS pairs_well_with TEXT[] DEFAULT '{}';
-- Examples: ['beer', 'wine', 'soda', 'coffee', 'fries', 'salad']

-- Add seasonal availability
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS seasonal BOOLEAN DEFAULT FALSE;

-- Add season (if seasonal)
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS available_seasons TEXT[] DEFAULT '{}';
-- Examples: ['spring', 'summer', 'fall', 'winter']

-- Add comfort food indicator
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS is_comfort_food BOOLEAN DEFAULT FALSE;

-- Add trending/new indicator
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS is_trending BOOLEAN DEFAULT FALSE;

-- Add chef special
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS is_chef_special BOOLEAN DEFAULT FALSE;

-- Add customizable indicator
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS is_customizable BOOLEAN DEFAULT FALSE;

-- Add meal prep friendly
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS meal_prep_friendly BOOLEAN DEFAULT FALSE;

-- Add kid-friendly indicator
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS is_kid_friendly BOOLEAN DEFAULT FALSE;

-- Add contains alcohol
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS contains_alcohol BOOLEAN DEFAULT FALSE;

-- Add contains caffeine
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS contains_caffeine BOOLEAN DEFAULT FALSE;

-- Add sugar content (grams)
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS sugar_grams DECIMAL(5,1);

-- Add sodium content (mg)
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS sodium_mg DECIMAL(6,1);

-- Comments
COMMENT ON COLUMN dishes.protein_grams IS 'Protein content in grams';
COMMENT ON COLUMN dishes.carbs_grams IS 'Carbohydrate content in grams';
COMMENT ON COLUMN dishes.fat_grams IS 'Fat content in grams';
COMMENT ON COLUMN dishes.fiber_grams IS 'Fiber content in grams';
COMMENT ON COLUMN dishes.spice_level IS 'Spice level: 0=none, 1=mild, 2=medium, 3=hot, 4=very hot, 5=extreme';
COMMENT ON COLUMN dishes.portion_size IS 'Portion size indicator';
COMMENT ON COLUMN dishes.meal_types IS 'Suitable meal times';
COMMENT ON COLUMN dishes.dietary_tags IS 'Specific dietary classifications';
COMMENT ON COLUMN dishes.allergens IS 'Common allergens present';
COMMENT ON COLUMN dishes.suitable_occasions IS 'Occasions this dish is perfect for';
COMMENT ON COLUMN dishes.flavor_profile IS 'Flavor characteristics';
COMMENT ON COLUMN dishes.cooking_method IS 'How the dish is prepared';
COMMENT ON COLUMN dishes.health_score IS 'Healthiness rating 1-10 (10=very healthy)';
COMMENT ON COLUMN dishes.pairs_well_with IS 'Recommended pairings';

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Restaurant indexes
CREATE INDEX IF NOT EXISTS idx_restaurants_price_range ON restaurants(price_range);
CREATE INDEX IF NOT EXISTS idx_restaurants_ambiance ON restaurants USING GIN(ambiance);
CREATE INDEX IF NOT EXISTS idx_restaurants_cuisine_types ON restaurants USING GIN(cuisine_types);
CREATE INDEX IF NOT EXISTS idx_restaurants_dietary_options ON restaurants USING GIN(dietary_options);
CREATE INDEX IF NOT EXISTS idx_restaurants_suitable_for ON restaurants USING GIN(suitable_for);
CREATE INDEX IF NOT EXISTS idx_restaurants_features ON restaurants USING GIN(features);
CREATE INDEX IF NOT EXISTS idx_restaurants_neighborhoods ON restaurants USING GIN(neighborhoods);
CREATE INDEX IF NOT EXISTS idx_restaurants_city ON restaurants(city);

-- Geospatial index for location-based queries (latitude, longitude)
CREATE INDEX IF NOT EXISTS idx_restaurants_location ON restaurants(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Dish indexes
CREATE INDEX IF NOT EXISTS idx_dishes_protein_grams ON dishes(protein_grams) WHERE protein_grams IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_dishes_calories ON dishes(calories) WHERE calories IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_dishes_spice_level ON dishes(spice_level);
CREATE INDEX IF NOT EXISTS idx_dishes_meal_types ON dishes USING GIN(meal_types);
CREATE INDEX IF NOT EXISTS idx_dishes_dietary_tags ON dishes USING GIN(dietary_tags);
CREATE INDEX IF NOT EXISTS idx_dishes_allergens ON dishes USING GIN(allergens);
CREATE INDEX IF NOT EXISTS idx_dishes_suitable_occasions ON dishes USING GIN(suitable_occasions);
CREATE INDEX IF NOT EXISTS idx_dishes_health_score ON dishes(health_score) WHERE health_score IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_dishes_is_vegetarian ON dishes(is_vegetarian) WHERE is_vegetarian = TRUE;
CREATE INDEX IF NOT EXISTS idx_dishes_is_vegan ON dishes(is_vegan) WHERE is_vegan = TRUE;

-- ============================================================================
-- HELPER VIEWS FOR AI QUERIES
-- ============================================================================

-- View for high-protein dishes (gym/fitness)
CREATE OR REPLACE VIEW high_protein_dishes AS
SELECT 
  d.*,
  r.name as restaurant_name,
  r.rating as restaurant_rating
FROM dishes d
JOIN restaurants r ON d.restaurant_id = r.id
WHERE d.protein_grams >= 20 
  AND d.is_available = TRUE
  AND r.is_active = TRUE
ORDER BY d.protein_grams DESC;

-- View for date-night restaurants
CREATE OR REPLACE VIEW date_night_restaurants AS
SELECT *
FROM restaurants
WHERE 'date-night' = ANY(suitable_for)
  AND is_active = TRUE
  AND (ambiance && ARRAY['romantic', 'cozy', 'fine-dining'])
ORDER BY rating DESC;

-- View for sports-watching venues
CREATE OR REPLACE VIEW sports_venues AS
SELECT *
FROM restaurants
WHERE 'sports-watching' = ANY(suitable_for)
  OR 'live-sports' = ANY(features)
  AND is_active = TRUE
ORDER BY rating DESC;

-- View for healthy options
CREATE OR REPLACE VIEW healthy_dishes AS
SELECT 
  d.*,
  r.name as restaurant_name,
  r.rating as restaurant_rating
FROM dishes d
JOIN restaurants r ON d.restaurant_id = r.id
WHERE d.health_score >= 7
  AND d.is_available = TRUE
  AND r.is_active = TRUE
ORDER BY d.health_score DESC, d.calories ASC;

-- View for quick meals
CREATE OR REPLACE VIEW quick_meals AS
SELECT 
  d.*,
  r.name as restaurant_name,
  r.avg_prep_time as restaurant_prep_time
FROM dishes d
JOIN restaurants r ON d.restaurant_id = r.id
WHERE d.preparation_time <= 15
  AND d.is_available = TRUE
  AND r.is_active = TRUE
ORDER BY d.preparation_time ASC;

-- ============================================================================
-- LOCATION-BASED FUNCTIONS
-- ============================================================================

-- Function to calculate distance between two points (Haversine formula)
-- Returns distance in kilometers
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 DECIMAL,
  lon1 DECIMAL,
  lat2 DECIMAL,
  lon2 DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
  earth_radius DECIMAL := 6371; -- Earth's radius in kilometers
  dlat DECIMAL;
  dlon DECIMAL;
  a DECIMAL;
  c DECIMAL;
BEGIN
  -- Convert degrees to radians
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  
  -- Haversine formula
  a := sin(dlat/2) * sin(dlat/2) + 
       cos(radians(lat1)) * cos(radians(lat2)) * 
       sin(dlon/2) * sin(dlon/2);
  c := 2 * atan2(sqrt(a), sqrt(1-a));
  
  RETURN earth_radius * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get nearby restaurants
-- Usage: SELECT * FROM get_nearby_restaurants(26.2285, 50.5860, 5.0);
CREATE OR REPLACE FUNCTION get_nearby_restaurants(
  user_lat DECIMAL,
  user_lon DECIMAL,
  radius_km DECIMAL DEFAULT 5.0
) RETURNS TABLE (
  id UUID,
  name VARCHAR,
  address VARCHAR,
  latitude DECIMAL,
  longitude DECIMAL,
  distance_km DECIMAL,
  rating DECIMAL,
  delivery_fee DECIMAL,
  price_range VARCHAR,
  cuisine_types TEXT[],
  ambiance TEXT[],
  suitable_for TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.name,
    r.address,
    r.latitude,
    r.longitude,
    calculate_distance(user_lat, user_lon, r.latitude, r.longitude) as distance_km,
    r.rating,
    r.delivery_fee,
    r.price_range,
    r.cuisine_types,
    r.ambiance,
    r.suitable_for
  FROM restaurants r
  WHERE r.is_active = TRUE
    AND r.latitude IS NOT NULL
    AND r.longitude IS NOT NULL
    AND calculate_distance(user_lat, user_lon, r.latitude, r.longitude) <= radius_km
  ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant access to views
GRANT SELECT ON high_protein_dishes TO authenticated, anon;
GRANT SELECT ON date_night_restaurants TO authenticated, anon;
GRANT SELECT ON sports_venues TO authenticated, anon;
GRANT SELECT ON healthy_dishes TO authenticated, anon;
GRANT SELECT ON quick_meals TO authenticated, anon;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION calculate_distance(DECIMAL, DECIMAL, DECIMAL, DECIMAL) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_nearby_restaurants(DECIMAL, DECIMAL, DECIMAL) TO authenticated, anon;
