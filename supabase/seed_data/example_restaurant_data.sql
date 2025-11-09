-- ============================================
-- EXAMPLE: Complete Restaurant Data Setup
-- ============================================
-- This script shows you how to add a complete restaurant with all details
-- Follow this exact pattern for adding more restaurants

-- ============================================
-- STEP 1: Get your user ID (partner_id)
-- ============================================
-- First, you need to know your user ID. Run this to find it:
-- SELECT id, email FROM users WHERE email = 'your-email@example.com';
-- Replace 'YOUR_USER_ID_HERE' below with the actual UUID

-- ============================================
-- STEP 2: Insert Restaurant
-- ============================================
INSERT INTO restaurants (
  partner_id,
  name,
  description,
  cuisine_type,
  address,
  phone,
  email,
  rating,
  total_reviews,
  delivery_time,
  minimum_order,
  delivery_fee,
  is_active,
  opening_time,
  closing_time,
  image_url,
  cover_image_url
) VALUES (
  'YOUR_USER_ID_HERE', -- Replace with your actual user ID
  'Al Qariah Restaurant',
  'Authentic Bahraini cuisine with traditional recipes passed down through generations. Experience the rich flavors of the Gulf.',
  'Bahraini',
  'Building 227, Road 15, Block 315, Manama, Bahrain',
  '+973 1729 9999',
  'info@alqariah.bh',
  4.5,
  328,
  '25-35 min',
  3.00,
  0.500,
  true,
  '10:00:00',
  '23:00:00',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', -- Restaurant logo/image
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200' -- Cover image
) RETURNING id; -- This will show you the restaurant ID - SAVE IT!

-- ============================================
-- STEP 3: Insert Dishes
-- ============================================
-- Replace 'RESTAURANT_ID_HERE' with the ID from Step 2

-- Dish 1: Chicken Kabsa
INSERT INTO dishes (
  restaurant_id,
  name,
  description,
  category,
  price,
  image_url,
  is_available,
  preparation_time,
  calories,
  is_vegetarian,
  is_spicy,
  rating,
  total_reviews
) VALUES (
  'RESTAURANT_ID_HERE',
  'Chicken Kabsa',
  'Traditional Bahraini rice dish with tender chicken, aromatic spices, and saffron. Served with tomato sauce and salad.',
  'Main Course',
  8.500,
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
  true,
  25,
  650,
  false,
  true,
  4.7,
  156
) RETURNING id; -- SAVE THIS DISH ID!

-- Dish 2: Lamb Mandi
INSERT INTO dishes (
  restaurant_id,
  name,
  description,
  category,
  price,
  image_url,
  is_available,
  preparation_time,
  calories,
  is_vegetarian,
  is_spicy,
  rating,
  total_reviews
) VALUES (
  'RESTAURANT_ID_HERE',
  'Lamb Mandi',
  'Slow-cooked lamb with fragrant basmati rice, topped with fried onions and raisins. A true Arabian delicacy.',
  'Main Course',
  12.000,
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
  true,
  35,
  850,
  false,
  false,
  4.8,
  203
) RETURNING id;

-- Dish 3: Hummus with Bread
INSERT INTO dishes (
  restaurant_id,
  name,
  description,
  category,
  price,
  image_url,
  is_available,
  preparation_time,
  calories,
  is_vegetarian,
  is_spicy,
  rating,
  total_reviews
) VALUES (
  'RESTAURANT_ID_HERE',
  'Hummus with Bread',
  'Creamy chickpea dip blended with tahini, lemon, and garlic. Served with warm pita bread.',
  'Appetizer',
  3.500,
  'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800',
  true,
  10,
  280,
  true,
  false,
  4.5,
  89
) RETURNING id;

-- Dish 4: Falafel Plate
INSERT INTO dishes (
  restaurant_id,
  name,
  description,
  category,
  price,
  image_url,
  is_available,
  preparation_time,
  calories,
  is_vegetarian,
  is_spicy,
  rating,
  total_reviews
) VALUES (
  'RESTAURANT_ID_HERE',
  'Falafel Plate',
  'Crispy falafel balls served with tahini sauce, pickles, and fresh vegetables.',
  'Appetizer',
  4.000,
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
  true,
  15,
  420,
  true,
  false,
  4.6,
  124
) RETURNING id;

-- Dish 5: Grilled Fish
INSERT INTO dishes (
  restaurant_id,
  name,
  description,
  category,
  price,
  image_url,
  is_available,
  preparation_time,
  calories,
  is_vegetarian,
  is_spicy,
  rating,
  total_reviews
) VALUES (
  'RESTAURANT_ID_HERE',
  'Grilled Hammour Fish',
  'Fresh local hammour fish grilled to perfection with lemon and herbs. Served with rice and salad.',
  'Main Course',
  15.000,
  'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800',
  true,
  30,
  550,
  false,
  false,
  4.9,
  178
) RETURNING id;

-- Dish 6: Kunafa Dessert
INSERT INTO dishes (
  restaurant_id,
  name,
  description,
  category,
  price,
  image_url,
  is_available,
  preparation_time,
  calories,
  is_vegetarian,
  is_spicy,
  rating,
  total_reviews
) VALUES (
  'RESTAURANT_ID_HERE',
  'Kunafa',
  'Sweet cheese pastry soaked in sugar syrup, topped with crushed pistachios. A Middle Eastern favorite.',
  'Dessert',
  5.000,
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
  true,
  20,
  480,
  true,
  false,
  4.7,
  145
) RETURNING id;

-- Dish 7: Fresh Juice
INSERT INTO dishes (
  restaurant_id,
  name,
  description,
  category,
  price,
  image_url,
  is_available,
  preparation_time,
  calories,
  is_vegetarian,
  is_spicy,
  rating,
  total_reviews
) VALUES (
  'RESTAURANT_ID_HERE',
  'Fresh Orange Juice',
  'Freshly squeezed orange juice, no added sugar. Pure and refreshing.',
  'Beverage',
  2.500,
  'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800',
  true,
  5,
  120,
  true,
  false,
  4.4,
  67
) RETURNING id;

-- ============================================
-- STEP 4: Add Dish Add-ons (Optional)
-- ============================================
-- Replace 'CHICKEN_KABSA_DISH_ID' with the actual dish ID from Step 3

-- Add-ons for Chicken Kabsa
INSERT INTO dish_addons (
  dish_id,
  name,
  price,
  is_available
) VALUES 
  ('CHICKEN_KABSA_DISH_ID', 'Extra Chicken', 2.000, true),
  ('CHICKEN_KABSA_DISH_ID', 'Extra Rice', 1.000, true),
  ('CHICKEN_KABSA_DISH_ID', 'Extra Sauce', 0.500, true),
  ('CHICKEN_KABSA_DISH_ID', 'Spicy Level +', 0.000, true);

-- Add-ons for Lamb Mandi
INSERT INTO dish_addons (
  dish_id,
  name,
  price,
  is_available
) VALUES 
  ('LAMB_MANDI_DISH_ID', 'Extra Lamb', 3.000, true),
  ('LAMB_MANDI_DISH_ID', 'Extra Rice', 1.000, true),
  ('LAMB_MANDI_DISH_ID', 'Fried Onions', 0.500, true);

-- Add-ons for Beverages
INSERT INTO dish_addons (
  dish_id,
  name,
  price,
  is_available
) VALUES 
  ('FRESH_JUICE_DISH_ID', 'Extra Large', 1.000, true),
  ('FRESH_JUICE_DISH_ID', 'Add Ice', 0.000, true),
  ('FRESH_JUICE_DISH_ID', 'Add Mint', 0.500, true);

-- ============================================
-- COMPLETE EXAMPLE WITH ACTUAL IDs
-- ============================================
-- Here's a complete working example you can copy and modify:

-- Example: Adding "Mama's Kitchen" restaurant
/*
-- 1. Insert Restaurant
INSERT INTO restaurants (
  partner_id,
  name,
  description,
  cuisine_type,
  address,
  phone,
  email,
  rating,
  total_reviews,
  delivery_time,
  minimum_order,
  delivery_fee,
  is_active,
  opening_time,
  closing_time,
  image_url,
  cover_image_url
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000', -- Your user ID
  'Mama''s Kitchen',
  'Home-style cooking with love. Traditional recipes that remind you of home.',
  'Home Cooking',
  'Building 123, Road 45, Riffa, Bahrain',
  '+973 1234 5678',
  'contact@mamaskitchen.bh',
  4.6,
  245,
  '20-30 min',
  2.50,
  0.500,
  true,
  '09:00:00',
  '22:00:00',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
  'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200'
);

-- 2. Insert Dishes for Mama's Kitchen
INSERT INTO dishes (
  restaurant_id,
  name,
  description,
  category,
  price,
  image_url,
  is_available,
  preparation_time,
  calories,
  is_vegetarian,
  is_spicy
) VALUES 
  -- Dish 1
  (
    (SELECT id FROM restaurants WHERE name = 'Mama''s Kitchen' LIMIT 1),
    'Chicken Biryani',
    'Fragrant basmati rice cooked with tender chicken and aromatic spices.',
    'Main Course',
    7.500,
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
    true,
    30,
    720,
    false,
    true
  ),
  -- Dish 2
  (
    (SELECT id FROM restaurants WHERE name = 'Mama''s Kitchen' LIMIT 1),
    'Vegetable Curry',
    'Mixed vegetables in a creamy coconut curry sauce.',
    'Main Course',
    5.500,
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
    true,
    20,
    380,
    true,
    true
  ),
  -- Dish 3
  (
    (SELECT id FROM restaurants WHERE name = 'Mama''s Kitchen' LIMIT 1),
    'Garlic Naan',
    'Soft flatbread brushed with garlic butter.',
    'Bread',
    1.500,
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
    true,
    10,
    180,
    true,
    false
  );
*/

-- ============================================
-- TIPS FOR FINDING GOOD IMAGES
-- ============================================
-- Use Unsplash for free high-quality images:
-- 1. Go to https://unsplash.com
-- 2. Search for your dish (e.g., "kabsa", "biryani", "pizza")
-- 3. Click on an image
-- 4. Right-click and copy image URL
-- 5. Add ?w=800 at the end for optimized size
-- Example: https://images.unsplash.com/photo-xxxxx?w=800

-- ============================================
-- QUICK REFERENCE: All Categories
-- ============================================
-- Dish Categories:
-- - Appetizer
-- - Main Course
-- - Dessert
-- - Beverage
-- - Bread
-- - Salad
-- - Soup

-- Cuisine Types:
-- - Bahraini
-- - Arabic
-- - Indian
-- - Italian
-- - Chinese
-- - Fast Food
-- - Healthy
-- - Home Cooking

-- ============================================
-- HOW TO USE THIS FILE
-- ============================================
-- 1. Find your user ID:
--    SELECT id, email FROM users;
--
-- 2. Copy the INSERT statements above
--
-- 3. Replace placeholders:
--    - YOUR_USER_ID_HERE → Your actual user UUID
--    - RESTAURANT_ID_HERE → Restaurant ID from step 2
--    - DISH_ID_HERE → Dish IDs from step 3
--
-- 4. Run in Supabase SQL Editor
--
-- 5. Verify:
--    SELECT * FROM restaurants WHERE name = 'Al Qariah Restaurant';
--    SELECT * FROM dishes WHERE restaurant_id = 'YOUR_RESTAURANT_ID';
