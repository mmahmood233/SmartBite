-- Migration 037: Seed McDonald's Bahrain with complete realistic data
-- This serves as a perfect template for adding more restaurants

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
  is_open,
  is_active,
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
  (SELECT id FROM users WHERE role = 'partner' LIMIT 1), -- Uses first partner, adjust as needed
  'McDonald''s Bahrain',
  'Fast Food',
  'World-famous burgers, fries, and breakfast. Serving quality fast food since 1940. Enjoy our iconic Big Mac, crispy fries, and refreshing beverages.',
  'https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg',
  'https://images.unsplash.com/photo-1619454016518-697bc231e7cb?w=1200',
  'Building 1456, Road 2825, Seef District, Manama',
  26.2285, -- Seef area coordinates
  50.5860,
  '+973 1758 8888',
  'mcdonalds.bahrain@bh.mcd.com',
  4.3,
  2847,
  15234,
  0.500, -- 500 fils delivery
  3.000, -- 3 BD minimum
  '15-25 mins',
  TRUE,
  TRUE,
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

INSERT INTO menu_categories (id, restaurant_id, name, display_order) VALUES
('22222222-2222-2222-2222-222222222221'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'Breakfast', 1),
('22222222-2222-2222-2222-222222222222'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'Burgers', 2),
('22222222-2222-2222-2222-222222222223'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'Chicken & Fish', 3),
('22222222-2222-2222-2222-222222222224'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'Sides', 4),
('22222222-2222-2222-2222-222222222225'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'Beverages', 5),
('22222222-2222-2222-2222-222222222226'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'Desserts', 6);

-- ============================================================================
-- INSERT DISHES WITH COMPLETE DATA
-- ============================================================================

-- BREAKFAST ITEMS
INSERT INTO dishes (
  id, restaurant_id, category_id, name, description, price, image, category,
  is_available, is_popular, is_vegetarian, is_vegan, is_spicy, preparation_time,
  calories, image_url,
  -- Enhanced nutritional fields
  protein_grams, carbs_grams, fat_grams, fiber_grams, sugar_grams, sodium_mg,
  -- Enhanced metadata
  spice_level, portion_size, meal_types, dietary_tags, allergens, suitable_occasions,
  flavor_profile, cooking_method, served_temperature, is_shareable, health_score,
  pairs_well_with, seasonal, is_comfort_food, is_trending, is_chef_special,
  is_customizable, meal_prep_friendly, is_kid_friendly, contains_alcohol, contains_caffeine
) VALUES
(
  '33333333-3333-3333-3333-333333333301'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '22222222-2222-2222-2222-222222222221'::uuid,
  'Egg McMuffin',
  'Freshly cracked egg, Canadian bacon, and melted cheese on a toasted English muffin. A breakfast classic.',
  1.800,
  'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400',
  'Breakfast',
  TRUE, TRUE, FALSE, FALSE, FALSE, 5,
  300, 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400',
  -- Nutrition
  18.0, 30.0, 13.0, 2.0, 3.0, 820.0,
  -- Metadata
  0, 'regular', ARRAY['breakfast', 'brunch'], ARRAY['high-protein'], 
  ARRAY['eggs', 'dairy', 'gluten', 'wheat'], ARRAY['quick-breakfast', 'on-the-go'],
  ARRAY['savory', 'rich'], ARRAY['grilled', 'fried'], 'hot', FALSE, 6,
  ARRAY['coffee', 'orange-juice'], FALSE, TRUE, FALSE, TRUE,
  TRUE, FALSE, TRUE, FALSE, FALSE
),
(
  '33333333-3333-3333-3333-333333333302'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '22222222-2222-2222-2222-222222222221'::uuid,
  'Hotcakes with Sausage',
  'Three fluffy hotcakes with butter, syrup, and a savory sausage patty.',
  2.200,
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
  'Breakfast',
  TRUE, TRUE, FALSE, FALSE, FALSE, 8,
  770, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
  -- Nutrition
  15.0, 102.0, 16.0, 3.0, 45.0, 930.0,
  -- Metadata
  0, 'large', ARRAY['breakfast'], ARRAY['high-carb'], 
  ARRAY['eggs', 'dairy', 'gluten', 'wheat', 'soy'], ARRAY['comfort-food', 'indulgent'],
  ARRAY['sweet', 'savory'], ARRAY['grilled'], 'hot', TRUE, 4,
  ARRAY['coffee', 'milk'], FALSE, TRUE, FALSE, FALSE,
  FALSE, FALSE, TRUE, FALSE, FALSE
),

-- BURGERS
(
  '33333333-3333-3333-3333-333333333303'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '22222222-2222-2222-2222-222222222222'::uuid,
  'Big Mac',
  'Two 100% beef patties, special sauce, lettuce, cheese, pickles, onions on a sesame seed bun. The iconic burger.',
  2.500,
  'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
  'Burgers',
  TRUE, TRUE, FALSE, FALSE, FALSE, 10,
  563, 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
  -- Nutrition
  25.0, 46.0, 30.0, 3.0, 9.0, 1010.0,
  -- Metadata
  0, 'regular', ARRAY['lunch', 'dinner'], ARRAY['high-protein'], 
  ARRAY['gluten', 'wheat', 'dairy', 'soy', 'eggs'], ARRAY['comfort-food', 'casual-dining'],
  ARRAY['savory', 'rich', 'tangy'], ARRAY['grilled', 'fried'], 'hot', FALSE, 5,
  ARRAY['fries', 'cola', 'milkshake'], FALSE, TRUE, TRUE, TRUE,
  TRUE, FALSE, TRUE, FALSE, FALSE
),
(
  '33333333-3333-3333-3333-333333333304'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '22222222-2222-2222-2222-222222222222'::uuid,
  'Quarter Pounder with Cheese',
  'Quarter pound of 100% fresh beef, melted cheese, pickles, onions, ketchup and mustard on a sesame seed bun.',
  2.800,
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
  'Burgers',
  TRUE, TRUE, FALSE, FALSE, FALSE, 12,
  520, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
  -- Nutrition
  30.0, 42.0, 26.0, 3.0, 10.0, 1120.0,
  -- Metadata
  0, 'regular', ARRAY['lunch', 'dinner'], ARRAY['high-protein'], 
  ARRAY['gluten', 'wheat', 'dairy', 'soy'], ARRAY['post-workout', 'comfort-food'],
  ARRAY['savory', 'rich'], ARRAY['grilled'], 'hot', FALSE, 5,
  ARRAY['fries', 'cola'], FALSE, TRUE, FALSE, TRUE,
  TRUE, FALSE, TRUE, FALSE, FALSE
),
(
  '33333333-3333-3333-3333-333333333305'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '22222222-2222-2222-2222-222222222222'::uuid,
  'McChicken',
  'Crispy chicken patty with lettuce and mayo on a soft bun. Simple and delicious.',
  1.900,
  'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400',
  'Burgers',
  TRUE, TRUE, FALSE, FALSE, FALSE, 10,
  400, 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400',
  -- Nutrition
  14.0, 40.0, 21.0, 2.0, 5.0, 560.0,
  -- Metadata
  0, 'regular', ARRAY['lunch', 'dinner', 'snack'], ARRAY[], 
  ARRAY['gluten', 'wheat', 'eggs', 'soy'], ARRAY['quick-bite', 'casual-dining'],
  ARRAY['savory', 'crispy'], ARRAY['fried'], 'hot', FALSE, 5,
  ARRAY['fries', 'cola'], FALSE, TRUE, FALSE, FALSE,
  TRUE, FALSE, TRUE, FALSE, FALSE
),

-- CHICKEN & FISH
(
  '33333333-3333-3333-3333-333333333306'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '22222222-2222-2222-2222-222222222223'::uuid,
  '6 Piece Chicken McNuggets',
  'Tender chicken pieces in a crispy coating. Perfect for sharing or as a snack.',
  2.000,
  'https://images.unsplash.com/photo-1562967914-608f82629710?w=400',
  'Chicken',
  TRUE, TRUE, FALSE, FALSE, FALSE, 8,
  250, 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400',
  -- Nutrition
  15.0, 15.0, 15.0, 1.0, 0.0, 470.0,
  -- Metadata
  0, 'small', ARRAY['lunch', 'dinner', 'snack'], ARRAY['high-protein'], 
  ARRAY['gluten', 'wheat', 'soy'], ARRAY['kids-favorite', 'sharing-plate', 'game-day'],
  ARRAY['savory', 'crispy'], ARRAY['fried'], 'hot', TRUE, 5,
  ARRAY['fries', 'cola', 'bbq-sauce', 'sweet-sour-sauce'], FALSE, TRUE, FALSE, FALSE,
  TRUE, FALSE, TRUE, FALSE, FALSE
),
(
  '33333333-3333-3333-3333-333333333307'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '22222222-2222-2222-2222-222222222223'::uuid,
  'Filet-O-Fish',
  'Wild-caught Alaskan Pollock, tartar sauce and cheese on a steamed bun.',
  2.300,
  'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400',
  'Fish',
  TRUE, FALSE, FALSE, FALSE, FALSE, 10,
  390, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400',
  -- Nutrition
  15.0, 39.0, 19.0, 2.0, 5.0, 590.0,
  -- Metadata
  0, 'regular', ARRAY['lunch', 'dinner'], ARRAY[], 
  ARRAY['fish', 'gluten', 'wheat', 'dairy', 'eggs'], ARRAY['light-meal'],
  ARRAY['savory', 'tangy'], ARRAY['fried', 'steamed'], 'hot', FALSE, 6,
  ARRAY['fries', 'cola'], FALSE, FALSE, FALSE, FALSE,
  TRUE, FALSE, FALSE, FALSE, FALSE
),

-- SIDES
(
  '33333333-3333-3333-3333-333333333308'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '22222222-2222-2222-2222-222222222224'::uuid,
  'Medium French Fries',
  'World famous fries, golden and crispy. Made from real potatoes.',
  1.000,
  'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
  'Sides',
  TRUE, TRUE, TRUE, TRUE, FALSE, 5,
  340, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
  -- Nutrition
  4.0, 44.0, 16.0, 4.0, 0.0, 190.0,
  -- Metadata
  0, 'regular', ARRAY['lunch', 'dinner', 'snack'], ARRAY['vegetarian', 'vegan'], 
  ARRAY['gluten'], ARRAY['sharing-plate', 'game-day'],
  ARRAY['savory', 'crispy'], ARRAY['fried'], 'hot', TRUE, 4,
  ARRAY['burger', 'ketchup', 'cola'], FALSE, TRUE, TRUE, FALSE,
  FALSE, FALSE, TRUE, FALSE, FALSE
),
(
  '33333333-3333-3333-3333-333333333309'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '22222222-2222-2222-2222-222222222224'::uuid,
  'Apple Slices',
  'Fresh apple slices. A healthy side option.',
  0.800,
  'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400',
  'Sides',
  TRUE, FALSE, TRUE, TRUE, FALSE, 2,
  15, 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400',
  -- Nutrition
  0.0, 4.0, 0.0, 1.0, 3.0, 0.0,
  -- Metadata
  0, 'small', ARRAY['breakfast', 'lunch', 'snack'], ARRAY['vegetarian', 'vegan', 'low-calorie', 'gluten-free'], 
  ARRAY[], ARRAY['healthy-choice', 'kids-favorite'],
  ARRAY['sweet', 'fresh'], ARRAY['raw'], 'cold', FALSE, 10,
  ARRAY['water', 'juice'], FALSE, FALSE, FALSE, FALSE,
  FALSE, TRUE, TRUE, FALSE, FALSE
),

-- BEVERAGES
(
  '33333333-3333-3333-3333-333333333310'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '22222222-2222-2222-2222-222222222225'::uuid,
  'Coca-Cola Medium',
  'Ice-cold Coca-Cola. The perfect pairing for your meal.',
  0.600,
  'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
  'Beverages',
  TRUE, TRUE, TRUE, TRUE, FALSE, 2,
  210, 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
  -- Nutrition
  0.0, 58.0, 0.0, 0.0, 58.0, 15.0,
  -- Metadata
  0, 'regular', ARRAY['breakfast', 'lunch', 'dinner', 'snack'], ARRAY['vegetarian', 'vegan'], 
  ARRAY[], ARRAY['casual-dining'],
  ARRAY['sweet'], ARRAY[], 'cold', FALSE, 3,
  ARRAY['burger', 'fries', 'pizza'], FALSE, FALSE, FALSE, FALSE,
  FALSE, FALSE, TRUE, FALSE, TRUE
),
(
  '33333333-3333-3333-3333-333333333311'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '22222222-2222-2222-2222-222222222225'::uuid,
  'McCafé Latte',
  'Espresso with steamed milk. Smooth and creamy.',
  1.500,
  'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
  'Beverages',
  TRUE, TRUE, TRUE, FALSE, FALSE, 5,
  150, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
  -- Nutrition
  8.0, 15.0, 6.0, 0.0, 14.0, 115.0,
  -- Metadata
  0, 'regular', ARRAY['breakfast', 'brunch'], ARRAY['vegetarian'], 
  ARRAY['dairy'], ARRAY['quick-breakfast'],
  ARRAY['creamy', 'rich'], ARRAY[], 'hot', FALSE, 6,
  ARRAY['breakfast-sandwich', 'muffin'], FALSE, FALSE, FALSE, FALSE,
  TRUE, FALSE, FALSE, FALSE, TRUE
),

-- DESSERTS
(
  '33333333-3333-3333-3333-333333333312'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '22222222-2222-2222-2222-222222222226'::uuid,
  'McFlurry with Oreo',
  'Creamy vanilla soft serve mixed with Oreo cookie pieces.',
  1.800,
  'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
  'Desserts',
  TRUE, TRUE, TRUE, FALSE, FALSE, 5,
  510, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
  -- Nutrition
  10.0, 80.0, 17.0, 1.0, 64.0, 280.0,
  -- Metadata
  0, 'regular', ARRAY['dessert', 'snack'], ARRAY[], 
  ARRAY['dairy', 'gluten', 'wheat', 'soy'], ARRAY['indulgent', 'celebration'],
  ARRAY['sweet', 'creamy'], ARRAY[], 'cold', TRUE, 3,
  ARRAY['coffee'], FALSE, TRUE, TRUE, FALSE,
  TRUE, FALSE, TRUE, FALSE, FALSE
),
(
  '33333333-3333-3333-3333-333333333313'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '22222222-2222-2222-2222-222222222226'::uuid,
  'Apple Pie',
  'Warm apple pie with a crispy, flaky crust and sweet apple filling.',
  1.200,
  'https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=400',
  'Desserts',
  TRUE, TRUE, TRUE, FALSE, FALSE, 3,
  230, 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=400',
  -- Nutrition
  2.0, 32.0, 11.0, 4.0, 13.0, 100.0,
  -- Metadata
  0, 'small', ARRAY['dessert', 'snack'], ARRAY['vegetarian'], 
  ARRAY['gluten', 'wheat', 'soy'], ARRAY['comfort-food', 'indulgent'],
  ARRAY['sweet', 'crispy'], ARRAY['baked', 'fried'], 'hot', FALSE, 4,
  ARRAY['coffee', 'vanilla-shake'], FALSE, TRUE, FALSE, TRUE,
  FALSE, FALSE, TRUE, FALSE, FALSE
);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$
DECLARE
  restaurant_count INTEGER;
  dish_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO restaurant_count FROM restaurants WHERE name = 'McDonald''s Bahrain';
  SELECT COUNT(*) INTO dish_count FROM dishes WHERE restaurant_id = '11111111-1111-1111-1111-111111111111'::uuid;
  
  RAISE NOTICE '✅ Restaurant inserted: %', restaurant_count;
  RAISE NOTICE '✅ Dishes inserted: %', dish_count;
  RAISE NOTICE '📍 Location: Seef, Manama (26.2285, 50.5860)';
  RAISE NOTICE '🍔 Categories: Breakfast, Burgers, Chicken & Fish, Sides, Beverages, Desserts';
END $$;
