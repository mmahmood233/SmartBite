-- Migration 038: Complete McDonald's Bahrain Seed with Reviews
-- This is the PERFECT template with ALL fields filled correctly

-- ============================================================================
-- INSERT RESTAURANT: McDonald's Bahrain
-- ============================================================================

INSERT INTO restaurants (
  id,
  partner_id,
  name,
  category,
  description,
  logo,
  banner_image,
  address,
  latitude,
  longitude,
  phone,
  email,
  rating,
  total_reviews,
  total_orders,
  delivery_fee,
  min_order,
  avg_prep_time,
  is_active,
  status,
  opening_time,
  closing_time,
  auto_status_update,
  created_at,
  updated_at,
  -- New enhanced fields
  price_range,
  ambiance,
  cuisine_types,
  dietary_options,
  suitable_for,
  features,
  peak_hours,
  signature_dishes,
  seating_capacity,
  noise_level,
  dress_code,
  reservation_required,
  avg_meal_duration,
  operating_hours,
  popular_times,
  good_for_groups,
  service_options,
  delivery_radius,
  neighborhoods,
  city,
  country,
  nearby_landmark
) VALUES (
  '11111111-1111-1111-1111-111111111111'::uuid,
  '99999999-9999-9999-9999-999999999999'::uuid,
  'McDonald''s Bahrain',
  'Fast Food',
  'World-famous burgers, fries, and breakfast. Serving quality fast food since 1940. Enjoy our iconic Big Mac, crispy fries, and refreshing beverages. Family-friendly atmosphere with quick service.',
  NULL,
  NULL,
  'Building 1456, Road 2825, Seef District, Manama',
  26.2285,
  50.5860,
  '+973 1758 8888',
  'mcdonalds.bahrain@bh.mcd.com',
  0.0,
  0,
  0,
  0.500,
  3.000,
  '20',
  TRUE,
  'open',
  '00:00:00'::time,
  '23:59:59'::time,
  TRUE,
  NOW() - INTERVAL '2 years',
  NOW(),
  -- Enhanced fields
  'budget',
  ARRAY['casual', 'family-friendly', 'lively'],
  ARRAY['american', 'fast-food', 'burgers'],
  ARRAY['halal', 'vegetarian'],
  ARRAY['quick-bite', 'family-gathering', 'casual-dining', 'kids-meal', 'late-night'],
  ARRAY['drive-thru', 'wifi', 'parking', 'kids-menu', 'late-night', 'breakfast', 'takeaway', 'indoor-seating', 'air-conditioned'],
  '{"breakfast": "07:00-11:00", "lunch": "12:00-15:00", "dinner": "18:00-22:00"}'::jsonb,
  ARRAY['Big Mac', 'McChicken', 'French Fries', 'McFlurry', 'Egg McMuffin'],
  80,
  'moderate',
  'casual',
  FALSE,
  30,
  '{"sunday": "24 hours", "monday": "24 hours", "tuesday": "24 hours", "wednesday": "24 hours", "thursday": "24 hours", "friday": "24 hours", "saturday": "24 hours"}'::jsonb,
  ARRAY['lunch-weekday', 'dinner-weekend', 'breakfast-weekend'],
  TRUE,
  ARRAY['dine-in', 'takeout', 'delivery', 'drive-thru'],
  10.0,
  ARRAY['seef', 'manama', 'diplomatic-area'],
  'Manama',
  'Bahrain',
  'Near Seef Mall, opposite City Centre Bahrain'
);

-- ============================================================================
-- INSERT MENU CATEGORIES
-- ============================================================================

INSERT INTO menu_categories (id, restaurant_id, name, description, display_order, is_active) VALUES
('22222222-2222-2222-2222-222222222221'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'Breakfast', 'Start your day right with our breakfast menu', 1, TRUE),
('22222222-2222-2222-2222-222222222222'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'Burgers', 'Our signature burgers made with 100% beef', 2, TRUE),
('22222222-2222-2222-2222-222222222223'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'Chicken & Fish', 'Crispy chicken and fish options', 3, TRUE),
('22222222-2222-2222-2222-222222222224'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'Sides', 'Perfect sides to complete your meal', 4, TRUE),
('22222222-2222-2222-2222-222222222225'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'Beverages', 'Refreshing drinks and McCafé coffee', 5, TRUE),
('22222222-2222-2222-2222-222222222226'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'Desserts', 'Sweet treats and ice cream', 6, TRUE);

-- ============================================================================
-- INSERT DISHES WITH COMPLETE DATA
-- ============================================================================

-- BREAKFAST ITEMS
INSERT INTO dishes (
  id, restaurant_id, category_id, name, description, price, image, category,
  is_available, is_popular, is_vegetarian, is_vegan, is_spicy, preparation_time,
  calories, image_url,
  protein_grams, carbs_grams, fat_grams, fiber_grams, sugar_grams, sodium_mg,
  spice_level, portion_size, meal_types, dietary_tags, allergens, suitable_occasions,
  flavor_profile, cooking_method, served_temperature, is_shareable, health_score,
  pairs_well_with, seasonal, is_comfort_food, is_trending, is_chef_special,
  is_customizable, meal_prep_friendly, is_kid_friendly, contains_alcohol, contains_caffeine,
  created_at, updated_at
) VALUES
-- Egg McMuffin
(
  '33333333-3333-3333-3333-333333333301'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '22222222-2222-2222-2222-222222222221'::uuid,
  'Egg McMuffin',
  'Freshly cracked egg, Canadian bacon, and melted cheese on a toasted English muffin. A breakfast classic since 1971.',
  1.800, NULL, 'Breakfast',
  TRUE, TRUE, FALSE, FALSE, FALSE, 5,
  300, NULL,
  18.0, 30.0, 13.0, 2.0, 3.0, 820.0,
  0, 'regular', ARRAY['breakfast', 'brunch'], ARRAY['high-protein'], 
  ARRAY['eggs', 'dairy', 'gluten', 'wheat'], ARRAY['quick-breakfast', 'on-the-go'],
  ARRAY['savory', 'rich'], ARRAY['grilled', 'fried'], 'hot', FALSE, 6,
  ARRAY['coffee', 'orange-juice'], FALSE, TRUE, FALSE, TRUE,
  TRUE, FALSE, TRUE, FALSE, FALSE,
  NOW() - INTERVAL '1 year', NOW()
),
-- Hotcakes with Sausage
(
  '33333333-3333-3333-3333-333333333302'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '22222222-2222-2222-2222-222222222221'::uuid,
  'Hotcakes with Sausage',
  'Three fluffy hotcakes with butter, syrup, and a savory sausage patty. Perfect for a hearty breakfast.',
  2.200, NULL, 'Breakfast',
  TRUE, TRUE, FALSE, FALSE, FALSE, 8,
  770, NULL,
  15.0, 102.0, 16.0, 3.0, 45.0, 930.0,
  0, 'large', ARRAY['breakfast'], ARRAY['high-carb'], 
  ARRAY['eggs', 'dairy', 'gluten', 'wheat', 'soy'], ARRAY['comfort-food', 'indulgent'],
  ARRAY['sweet', 'savory'], ARRAY['grilled'], 'hot', TRUE, 4,
  ARRAY['coffee', 'milk'], FALSE, TRUE, FALSE, FALSE,
  FALSE, FALSE, TRUE, FALSE, FALSE,
  NOW() - INTERVAL '1 year', NOW()
),

-- BURGERS
-- Big Mac
(
  '33333333-3333-3333-3333-333333333303'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '22222222-2222-2222-2222-222222222222'::uuid,
  'Big Mac',
  'Two 100% beef patties, special sauce, lettuce, cheese, pickles, onions on a sesame seed bun. The world''s most iconic burger.',
  2.500, NULL, 'Burgers',
  TRUE, TRUE, FALSE, FALSE, FALSE, 10,
  563, NULL,
  25.0, 46.0, 30.0, 3.0, 9.0, 1010.0,
  0, 'regular', ARRAY['lunch', 'dinner'], ARRAY['high-protein'], 
  ARRAY['gluten', 'wheat', 'dairy', 'soy', 'eggs'], ARRAY['comfort-food', 'casual-dining'],
  ARRAY['savory', 'rich', 'tangy'], ARRAY['grilled', 'fried'], 'hot', FALSE, 5,
  ARRAY['fries', 'cola', 'milkshake'], FALSE, TRUE, TRUE, TRUE,
  TRUE, FALSE, TRUE, FALSE, FALSE,
  NOW() - INTERVAL '2 years', NOW()
),
-- Quarter Pounder with Cheese
(
  '33333333-3333-3333-3333-333333333304'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '22222222-2222-2222-2222-222222222222'::uuid,
  'Quarter Pounder with Cheese',
  'Quarter pound of 100% fresh beef, melted cheese, pickles, onions, ketchup and mustard on a sesame seed bun. Juicy and satisfying.',
  2.800, NULL, 'Burgers',
  TRUE, TRUE, FALSE, FALSE, FALSE, 12,
  520, NULL,
  30.0, 42.0, 26.0, 3.0, 10.0, 1120.0,
  0, 'regular', ARRAY['lunch', 'dinner'], ARRAY['high-protein'], 
  ARRAY['gluten', 'wheat', 'dairy', 'soy'], ARRAY['post-workout', 'comfort-food'],
  ARRAY['savory', 'rich'], ARRAY['grilled'], 'hot', FALSE, 5,
  ARRAY['fries', 'cola'], FALSE, TRUE, FALSE, TRUE,
  TRUE, FALSE, TRUE, FALSE, FALSE,
  NOW() - INTERVAL '2 years', NOW()
),
-- McChicken
(
  '33333333-3333-3333-3333-333333333305'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '22222222-2222-2222-2222-222222222222'::uuid,
  'McChicken',
  'Crispy chicken patty with lettuce and mayo on a soft bun. Simple, delicious, and satisfying.',
  1.900, NULL, 'Burgers',
  TRUE, TRUE, FALSE, FALSE, FALSE, 10,
  400, NULL,
  14.0, 40.0, 21.0, 2.0, 5.0, 560.0,
  0, 'regular', ARRAY['lunch', 'dinner', 'snack'], ARRAY[]::text[], 
  ARRAY['gluten', 'wheat', 'eggs', 'soy'], ARRAY['quick-bite', 'casual-dining'],
  ARRAY['savory', 'crispy'], ARRAY['fried'], 'hot', FALSE, 5,
  ARRAY['fries', 'cola'], FALSE, TRUE, FALSE, FALSE,
  TRUE, FALSE, TRUE, FALSE, FALSE,
  NOW() - INTERVAL '1 year', NOW()
),

-- CHICKEN & FISH
-- 6 Piece Chicken McNuggets
(
  '33333333-3333-3333-3333-333333333306'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '22222222-2222-2222-2222-222222222223'::uuid,
  '6 Piece Chicken McNuggets',
  'Tender chicken pieces in a crispy coating. Perfect for sharing or as a snack. Comes with your choice of dipping sauce.',
  2.000, NULL, 'Chicken',
  TRUE, TRUE, FALSE, FALSE, FALSE, 8,
  250, NULL,
  15.0, 15.0, 15.0, 1.0, 0.0, 470.0,
  0, 'small', ARRAY['lunch', 'dinner', 'snack'], ARRAY['high-protein'], 
  ARRAY['gluten', 'wheat', 'soy'], ARRAY['kids-favorite', 'sharing-plate', 'game-day'],
  ARRAY['savory', 'crispy'], ARRAY['fried'], 'hot', TRUE, 5,
  ARRAY['fries', 'cola', 'bbq-sauce', 'sweet-sour-sauce'], FALSE, TRUE, FALSE, FALSE,
  TRUE, FALSE, TRUE, FALSE, FALSE,
  NOW() - INTERVAL '2 years', NOW()
),
-- Filet-O-Fish
(
  '33333333-3333-3333-3333-333333333307'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '22222222-2222-2222-2222-222222222223'::uuid,
  'Filet-O-Fish',
  'Wild-caught Alaskan Pollock, tartar sauce and cheese on a steamed bun. A lighter seafood option.',
  2.300, NULL, 'Fish',
  TRUE, FALSE, FALSE, FALSE, FALSE, 10,
  390, NULL,
  15.0, 39.0, 19.0, 2.0, 5.0, 590.0,
  0, 'regular', ARRAY['lunch', 'dinner'], ARRAY[]::text[], 
  ARRAY['fish', 'gluten', 'wheat', 'dairy', 'eggs'], ARRAY['light-meal'],
  ARRAY['savory', 'tangy'], ARRAY['fried', 'steamed'], 'hot', FALSE, 6,
  ARRAY['fries', 'cola'], FALSE, FALSE, FALSE, FALSE,
  TRUE, FALSE, FALSE, FALSE, FALSE,
  NOW() - INTERVAL '1 year', NOW()
),

-- SIDES
-- Medium French Fries
(
  '33333333-3333-3333-3333-333333333308'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '22222222-2222-2222-2222-222222222224'::uuid,
  'Medium French Fries',
  'World famous fries, golden and crispy. Made from real potatoes and cooked to perfection.',
  1.000, NULL, 'Sides',
  TRUE, TRUE, TRUE, TRUE, FALSE, 5,
  340, NULL,
  4.0, 44.0, 16.0, 4.0, 0.0, 190.0,
  0, 'regular', ARRAY['lunch', 'dinner', 'snack'], ARRAY['vegetarian', 'vegan'], 
  ARRAY['gluten'], ARRAY['sharing-plate', 'game-day'],
  ARRAY['savory', 'crispy'], ARRAY['fried'], 'hot', TRUE, 4,
  ARRAY['burger', 'ketchup', 'cola'], FALSE, TRUE, TRUE, FALSE,
  FALSE, FALSE, TRUE, FALSE, FALSE,
  NOW() - INTERVAL '2 years', NOW()
),
-- Apple Slices
(
  '33333333-3333-3333-3333-333333333309'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '22222222-2222-2222-2222-222222222224'::uuid,
  'Apple Slices',
  'Fresh apple slices. A healthy side option for kids and adults alike.',
  0.800, NULL, 'Sides',
  TRUE, FALSE, TRUE, TRUE, FALSE, 2,
  15, NULL,
  0.0, 4.0, 0.0, 1.0, 3.0, 0.0,
  0, 'small', ARRAY['breakfast', 'lunch', 'snack'], ARRAY['vegetarian', 'vegan', 'low-calorie', 'gluten-free'], 
  ARRAY[]::text[], ARRAY['healthy-choice', 'kids-favorite'],
  ARRAY['sweet', 'fresh'], ARRAY['raw'], 'cold', FALSE, 10,
  ARRAY['water', 'juice'], FALSE, FALSE, FALSE, FALSE,
  FALSE, TRUE, TRUE, FALSE, FALSE,
  NOW() - INTERVAL '1 year', NOW()
),

-- BEVERAGES
-- Coca-Cola Medium
(
  '33333333-3333-3333-3333-333333333310'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '22222222-2222-2222-2222-222222222225'::uuid,
  'Coca-Cola Medium',
  'Ice-cold Coca-Cola. The perfect pairing for your meal. Refreshing and classic.',
  0.600, NULL, 'Beverages',
  TRUE, TRUE, TRUE, TRUE, FALSE, 2,
  210, NULL,
  0.0, 58.0, 0.0, 0.0, 58.0, 15.0,
  0, 'regular', ARRAY['breakfast', 'lunch', 'dinner', 'snack'], ARRAY['vegetarian', 'vegan'], 
  ARRAY[]::text[], ARRAY['casual-dining'],
  ARRAY['sweet'], ARRAY[]::text[], 'cold', FALSE, 3,
  ARRAY['burger', 'fries', 'pizza'], FALSE, FALSE, FALSE, FALSE,
  FALSE, FALSE, TRUE, FALSE, TRUE,
  NOW() - INTERVAL '2 years', NOW()
),
-- McCafé Latte
(
  '33333333-3333-3333-3333-333333333311'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '22222222-2222-2222-2222-222222222225'::uuid,
  'McCafé Latte',
  'Espresso with steamed milk. Smooth, creamy, and perfectly balanced. Made with premium Arabica beans.',
  1.500, NULL, 'Beverages',
  TRUE, TRUE, TRUE, FALSE, FALSE, 5,
  150, NULL,
  8.0, 15.0, 6.0, 0.0, 14.0, 115.0,
  0, 'regular', ARRAY['breakfast', 'brunch'], ARRAY['vegetarian'], 
  ARRAY['dairy'], ARRAY['quick-breakfast'],
  ARRAY['creamy', 'rich'], ARRAY[]::text[], 'hot', FALSE, 6,
  ARRAY['breakfast-sandwich', 'muffin'], FALSE, FALSE, FALSE, FALSE,
  TRUE, FALSE, FALSE, FALSE, TRUE,
  NOW() - INTERVAL '1 year', NOW()
),

-- DESSERTS
-- McFlurry with Oreo
(
  '33333333-3333-3333-3333-333333333312'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '22222222-2222-2222-2222-222222222226'::uuid,
  'McFlurry with Oreo',
  'Creamy vanilla soft serve mixed with Oreo cookie pieces. A fan favorite dessert.',
  1.800, NULL, 'Desserts',
  TRUE, TRUE, TRUE, FALSE, FALSE, 5,
  510, NULL,
  10.0, 80.0, 17.0, 1.0, 64.0, 280.0,
  0, 'regular', ARRAY['dessert', 'snack'], ARRAY[]::text[], 
  ARRAY['dairy', 'gluten', 'wheat', 'soy'], ARRAY['indulgent', 'celebration'],
  ARRAY['sweet', 'creamy'], ARRAY[]::text[], 'cold', TRUE, 3,
  ARRAY['coffee'], FALSE, TRUE, TRUE, FALSE,
  TRUE, FALSE, TRUE, FALSE, FALSE,
  NOW() - INTERVAL '2 years', NOW()
),
-- Apple Pie
(
  '33333333-3333-3333-3333-333333333313'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '22222222-2222-2222-2222-222222222226'::uuid,
  'Apple Pie',
  'Warm apple pie with a crispy, flaky crust and sweet apple filling. Baked fresh daily.',
  1.200, NULL, 'Desserts',
  TRUE, TRUE, TRUE, FALSE, FALSE, 3,
  230, NULL,
  2.0, 32.0, 11.0, 4.0, 13.0, 100.0,
  0, 'small', ARRAY['dessert', 'snack'], ARRAY['vegetarian'], 
  ARRAY['gluten', 'wheat', 'soy'], ARRAY['comfort-food', 'indulgent'],
  ARRAY['sweet', 'crispy'], ARRAY['baked', 'fried'], 'hot', FALSE, 4,
  ARRAY['coffee', 'vanilla-shake'], FALSE, TRUE, FALSE, TRUE,
  FALSE, FALSE, TRUE, FALSE, FALSE,
  NOW() - INTERVAL '2 years', NOW()
);

-- ============================================================================
-- INSERT SAMPLE REVIEWS
-- ============================================================================

-- Note: These reviews require existing orders. For demo purposes, we'll create them
-- only if orders exist. In production, reviews come from real customer orders.

-- Sample review data (to be inserted after orders are created):
/*
INSERT INTO reviews (user_id, restaurant_id, order_id, rating, comment, is_visible, created_at) VALUES
((SELECT id FROM users WHERE role = 'customer' LIMIT 1), '11111111-1111-1111-1111-111111111111'::uuid, 
 (SELECT id FROM orders LIMIT 1), 5, 
 'Amazing Big Mac as always! Fast delivery and food arrived hot. The fries were perfectly crispy.', 
 TRUE, NOW() - INTERVAL '5 days'),
 
((SELECT id FROM users WHERE role = 'customer' LIMIT 1 OFFSET 1), '11111111-1111-1111-1111-111111111111'::uuid, 
 (SELECT id FROM orders LIMIT 1 OFFSET 1), 4, 
 'Good food, quick service. The McFlurry was delicious. Only complaint is the delivery took a bit longer than expected.', 
 TRUE, NOW() - INTERVAL '10 days'),
 
((SELECT id FROM users WHERE role = 'customer' LIMIT 1 OFFSET 2), '11111111-1111-1111-1111-111111111111'::uuid, 
 (SELECT id FROM orders LIMIT 1 OFFSET 2), 5, 
 'Best breakfast spot! The Egg McMuffin is my go-to. Always fresh and tasty.', 
 TRUE, NOW() - INTERVAL '15 days');
*/

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$
DECLARE
  restaurant_count INTEGER;
  dish_count INTEGER;
  category_count INTEGER;
  r_name VARCHAR;
  r_city VARCHAR;
  r_latitude DECIMAL;
  r_longitude DECIMAL;
  r_rating DECIMAL;
  r_reviews INTEGER;
  r_signature TEXT[];
BEGIN
  -- Get counts
  SELECT COUNT(*) INTO restaurant_count FROM restaurants WHERE id = '11111111-1111-1111-1111-111111111111'::uuid;
  SELECT COUNT(*) INTO dish_count FROM dishes WHERE restaurant_id = '11111111-1111-1111-1111-111111111111'::uuid;
  SELECT COUNT(*) INTO category_count FROM menu_categories WHERE restaurant_id = '11111111-1111-1111-1111-111111111111'::uuid;
  
  -- Get restaurant details dynamically
  SELECT name, city, latitude, longitude, rating, total_reviews, signature_dishes
  INTO r_name, r_city, r_latitude, r_longitude, r_rating, r_reviews, r_signature
  FROM restaurants 
  WHERE id = '11111111-1111-1111-1111-111111111111'::uuid;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ % Seed Complete!', r_name;
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Restaurant inserted: %', restaurant_count;
  RAISE NOTICE 'Menu categories: %', category_count;
  RAISE NOTICE 'Dishes inserted: %', dish_count;
  RAISE NOTICE '📍 Location: %, % (%, %)', r_city, 'Bahrain', r_latitude, r_longitude;
  RAISE NOTICE '⭐ Rating: % (% reviews)', r_rating, r_reviews;
  RAISE NOTICE '🍔 Signature dishes: %', array_to_string(r_signature, ', ');
  RAISE NOTICE '========================================';
END $$;
