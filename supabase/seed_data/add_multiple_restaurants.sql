-- ============================================
-- ADD MULTIPLE RESTAURANTS AT ONCE
-- ============================================
-- This script adds 3 complete restaurants with dishes
-- Just replace YOUR_USER_ID and run!
-- ============================================

-- ⚠️ FIRST: Get your user ID
-- Run this query: SELECT id, email FROM users;
-- Then replace YOUR_USER_ID below with your actual UUID

DO $$
DECLARE
  v_user_id UUID := 'YOUR_USER_ID'; -- ⚠️ REPLACE THIS
  v_restaurant_id UUID;
BEGIN

-- ============================================
-- RESTAURANT 1: Al Qariah (Bahraini)
-- ============================================
INSERT INTO restaurants (
  partner_id, name, description, cuisine_type, address, phone, email,
  rating, total_reviews, delivery_time, minimum_order, delivery_fee,
  is_active, opening_time, closing_time, image_url, cover_image_url
) VALUES (
  v_user_id,
  'Al Qariah Restaurant',
  'Authentic Bahraini cuisine with traditional recipes',
  'Bahraini',
  'Building 227, Road 15, Block 315, Manama',
  '+973 1729 9999',
  'info@alqariah.bh',
  4.5, 328, '25-35 min', 3.00, 0.500, true,
  '10:00:00', '23:00:00',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200'
) RETURNING id INTO v_restaurant_id;

-- Dishes for Al Qariah
INSERT INTO dishes (restaurant_id, name, description, category, price, image_url, is_available, preparation_time, calories, is_vegetarian, is_spicy, rating, total_reviews) VALUES
  (v_restaurant_id, 'Chicken Kabsa', 'Traditional rice dish with tender chicken and aromatic spices', 'Main Course', 8.500, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', true, 25, 650, false, true, 4.7, 156),
  (v_restaurant_id, 'Lamb Mandi', 'Slow-cooked lamb with fragrant basmati rice', 'Main Course', 12.000, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800', true, 35, 850, false, false, 4.8, 203),
  (v_restaurant_id, 'Hummus with Bread', 'Creamy chickpea dip with warm pita bread', 'Appetizer', 3.500, 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800', true, 10, 280, true, false, 4.5, 89),
  (v_restaurant_id, 'Grilled Hammour Fish', 'Fresh local fish grilled with lemon and herbs', 'Main Course', 15.000, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800', true, 30, 550, false, false, 4.9, 178),
  (v_restaurant_id, 'Kunafa', 'Sweet cheese pastry with pistachios', 'Dessert', 5.000, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800', true, 20, 480, true, false, 4.7, 145);

RAISE NOTICE 'Added Al Qariah Restaurant with % dishes', (SELECT COUNT(*) FROM dishes WHERE restaurant_id = v_restaurant_id);

-- ============================================
-- RESTAURANT 2: Mama's Kitchen (Home Cooking)
-- ============================================
INSERT INTO restaurants (
  partner_id, name, description, cuisine_type, address, phone, email,
  rating, total_reviews, delivery_time, minimum_order, delivery_fee,
  is_active, opening_time, closing_time, image_url, cover_image_url
) VALUES (
  v_user_id,
  'Mama''s Kitchen',
  'Home-style cooking with love and traditional recipes',
  'Home Cooking',
  'Building 123, Road 45, Riffa',
  '+973 1234 5678',
  'contact@mamaskitchen.bh',
  4.6, 245, '20-30 min', 2.50, 0.500, true,
  '09:00:00', '22:00:00',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
  'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200'
) RETURNING id INTO v_restaurant_id;

-- Dishes for Mama's Kitchen
INSERT INTO dishes (restaurant_id, name, description, category, price, image_url, is_available, preparation_time, calories, is_vegetarian, is_spicy, rating, total_reviews) VALUES
  (v_restaurant_id, 'Chicken Biryani', 'Fragrant basmati rice with tender chicken', 'Main Course', 7.500, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', true, 30, 720, false, true, 4.7, 189),
  (v_restaurant_id, 'Vegetable Curry', 'Mixed vegetables in creamy coconut curry', 'Main Course', 5.500, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800', true, 20, 380, true, true, 4.5, 134),
  (v_restaurant_id, 'Butter Chicken', 'Creamy tomato-based curry with tender chicken', 'Main Course', 8.000, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800', true, 25, 680, false, true, 4.8, 256),
  (v_restaurant_id, 'Garlic Naan', 'Soft flatbread brushed with garlic butter', 'Bread', 1.500, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800', true, 10, 180, true, false, 4.6, 98),
  (v_restaurant_id, 'Mango Lassi', 'Sweet yogurt drink with fresh mango', 'Beverage', 2.500, 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800', true, 5, 150, true, false, 4.4, 76);

RAISE NOTICE 'Added Mama''s Kitchen with % dishes', (SELECT COUNT(*) FROM dishes WHERE restaurant_id = v_restaurant_id);

-- ============================================
-- RESTAURANT 3: Pizza Palace (Italian)
-- ============================================
INSERT INTO restaurants (
  partner_id, name, description, cuisine_type, address, phone, email,
  rating, total_reviews, delivery_time, minimum_order, delivery_fee,
  is_active, opening_time, closing_time, image_url, cover_image_url
) VALUES (
  v_user_id,
  'Pizza Palace',
  'Authentic Italian pizzas made in a wood-fired oven',
  'Italian',
  'Building 456, Road 78, Juffair',
  '+973 9876 5432',
  'hello@pizzapalace.bh',
  4.7, 512, '30-40 min', 4.00, 0.750, true,
  '11:00:00', '00:00:00',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
  'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=1200'
) RETURNING id INTO v_restaurant_id;

-- Dishes for Pizza Palace
INSERT INTO dishes (restaurant_id, name, description, category, price, image_url, is_available, preparation_time, calories, is_vegetarian, is_spicy, rating, total_reviews) VALUES
  (v_restaurant_id, 'Margherita Pizza', 'Classic pizza with tomato, mozzarella, and basil', 'Main Course', 9.000, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800', true, 20, 580, true, false, 4.6, 234),
  (v_restaurant_id, 'Pepperoni Pizza', 'Loaded with pepperoni and extra cheese', 'Main Course', 11.000, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800', true, 20, 720, false, false, 4.8, 389),
  (v_restaurant_id, 'BBQ Chicken Pizza', 'Grilled chicken with BBQ sauce and onions', 'Main Course', 12.000, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', true, 25, 680, false, false, 4.7, 298),
  (v_restaurant_id, 'Caesar Salad', 'Crisp romaine with parmesan and croutons', 'Salad', 5.500, 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800', true, 10, 320, true, false, 4.5, 156),
  (v_restaurant_id, 'Garlic Bread', 'Toasted bread with garlic butter and herbs', 'Appetizer', 3.000, 'https://images.unsplash.com/photo-1573140401552-3fab0b24f2b6?w=800', true, 12, 280, true, false, 4.6, 187),
  (v_restaurant_id, 'Tiramisu', 'Classic Italian coffee-flavored dessert', 'Dessert', 6.000, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800', true, 15, 420, true, false, 4.9, 223);

RAISE NOTICE 'Added Pizza Palace with % dishes', (SELECT COUNT(*) FROM dishes WHERE restaurant_id = v_restaurant_id);

END $$;

-- ============================================
-- VERIFY ALL DATA
-- ============================================
SELECT 
  '✅ RESTAURANTS ADDED SUCCESSFULLY!' as status,
  COUNT(*) as total_restaurants,
  SUM((SELECT COUNT(*) FROM dishes WHERE dishes.restaurant_id = restaurants.id)) as total_dishes
FROM restaurants
WHERE partner_id = 'YOUR_USER_ID'; -- ⚠️ Replace this too

-- Show all restaurants with dish count
SELECT 
  r.name as restaurant,
  r.cuisine_type,
  r.rating,
  r.delivery_time,
  COUNT(d.id) as total_dishes
FROM restaurants r
LEFT JOIN dishes d ON d.restaurant_id = r.id
WHERE r.partner_id = 'YOUR_USER_ID' -- ⚠️ Replace this too
GROUP BY r.id, r.name, r.cuisine_type, r.rating, r.delivery_time
ORDER BY r.name;
