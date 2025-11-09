-- ============================================
-- COMPLETE SETUP: Partners + Restaurants + Dishes
-- ============================================
-- This script creates everything in one go:
-- 1. Partner users (restaurant owners)
-- 2. Restaurants (linked to partners)
-- 3. Dishes (linked to restaurants)
-- ============================================

DO $$
DECLARE
  v_partner1_id UUID;
  v_partner2_id UUID;
  v_partner3_id UUID;
  v_restaurant_id UUID;
BEGIN

-- ============================================
-- STEP 1: Create Partner Users
-- ============================================

-- Partner 1: Al Qariah Owner
INSERT INTO users (
  id, email, full_name, role, phone, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'alqariah@smartbite.bh',
  'Ahmed Al-Khalifa',
  'partner',
  '+973 1729 9999',
  NOW(),
  NOW()
) RETURNING id INTO v_partner1_id;

RAISE NOTICE '✅ Created partner: Ahmed Al-Khalifa (ID: %)', v_partner1_id;

-- Partner 2: Mama's Kitchen Owner
INSERT INTO users (
  id, email, full_name, role, phone, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'mamas@smartbite.bh',
  'Fatima Hassan',
  'partner',
  '+973 1234 5678',
  NOW(),
  NOW()
) RETURNING id INTO v_partner2_id;

RAISE NOTICE '✅ Created partner: Fatima Hassan (ID: %)', v_partner2_id;

-- Partner 3: Pizza Palace Owner
INSERT INTO users (
  id, email, full_name, role, phone, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'pizza@smartbite.bh',
  'Marco Rossi',
  'partner',
  '+973 9876 5432',
  NOW(),
  NOW()
) RETURNING id INTO v_partner3_id;

RAISE NOTICE '✅ Created partner: Marco Rossi (ID: %)', v_partner3_id;

-- ============================================
-- STEP 2: Create Restaurants with Dishes
-- ============================================

-- RESTAURANT 1: Al Qariah (Bahraini)
INSERT INTO restaurants (
  partner_id, name, description, cuisine_type, address, phone, email,
  rating, total_reviews, delivery_time, minimum_order, delivery_fee,
  is_active, opening_time, closing_time, image_url, cover_image_url
) VALUES (
  v_partner1_id,
  'Al Qariah Restaurant',
  'Authentic Bahraini cuisine with traditional recipes passed down through generations',
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
  (v_restaurant_id, 'Falafel Plate', 'Crispy falafel balls with tahini sauce', 'Appetizer', 4.000, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800', true, 15, 420, true, false, 4.6, 124),
  (v_restaurant_id, 'Grilled Hammour Fish', 'Fresh local fish grilled with lemon and herbs', 'Main Course', 15.000, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800', true, 30, 550, false, false, 4.9, 178),
  (v_restaurant_id, 'Kunafa', 'Sweet cheese pastry with pistachios', 'Dessert', 5.000, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800', true, 20, 480, true, false, 4.7, 145),
  (v_restaurant_id, 'Fresh Orange Juice', 'Freshly squeezed orange juice', 'Beverage', 2.500, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800', true, 5, 120, true, false, 4.4, 67),
  (v_restaurant_id, 'Chicken Shawarma Wrap', 'Marinated chicken in saj bread with garlic sauce', 'Main Course', 6.000, 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800', true, 15, 520, false, true, 4.6, 198);

RAISE NOTICE '✅ Created Al Qariah Restaurant with 8 dishes';

-- RESTAURANT 2: Mama's Kitchen (Home Cooking)
INSERT INTO restaurants (
  partner_id, name, description, cuisine_type, address, phone, email,
  rating, total_reviews, delivery_time, minimum_order, delivery_fee,
  is_active, opening_time, closing_time, image_url, cover_image_url
) VALUES (
  v_partner2_id,
  'Mama''s Kitchen',
  'Home-style cooking with love and traditional recipes that remind you of home',
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
  (v_restaurant_id, 'Dal Tadka', 'Yellow lentils tempered with spices', 'Main Course', 4.500, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800', true, 20, 320, true, false, 4.4, 98),
  (v_restaurant_id, 'Garlic Naan', 'Soft flatbread brushed with garlic butter', 'Bread', 1.500, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800', true, 10, 180, true, false, 4.6, 98),
  (v_restaurant_id, 'Samosa (3 pcs)', 'Crispy pastry filled with spiced potatoes', 'Appetizer', 2.000, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800', true, 12, 280, true, false, 4.5, 145),
  (v_restaurant_id, 'Mango Lassi', 'Sweet yogurt drink with fresh mango', 'Beverage', 2.500, 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800', true, 5, 150, true, false, 4.4, 76),
  (v_restaurant_id, 'Gulab Jamun (2 pcs)', 'Sweet milk dumplings in sugar syrup', 'Dessert', 3.000, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800', true, 10, 380, true, false, 4.7, 112);

RAISE NOTICE '✅ Created Mama''s Kitchen with 8 dishes';

-- RESTAURANT 3: Pizza Palace (Italian)
INSERT INTO restaurants (
  partner_id, name, description, cuisine_type, address, phone, email,
  rating, total_reviews, delivery_time, minimum_order, delivery_fee,
  is_active, opening_time, closing_time, image_url, cover_image_url
) VALUES (
  v_partner3_id,
  'Pizza Palace',
  'Authentic Italian pizzas made in a wood-fired oven with fresh ingredients',
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
  (v_restaurant_id, 'Vegetarian Supreme', 'Loaded with fresh vegetables and cheese', 'Main Course', 10.000, 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800', true, 22, 620, true, false, 4.5, 187),
  (v_restaurant_id, 'Caesar Salad', 'Crisp romaine with parmesan and croutons', 'Salad', 5.500, 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800', true, 10, 320, true, false, 4.5, 156),
  (v_restaurant_id, 'Garlic Bread', 'Toasted bread with garlic butter and herbs', 'Appetizer', 3.000, 'https://images.unsplash.com/photo-1573140401552-3fab0b24f2b6?w=800', true, 12, 280, true, false, 4.6, 187),
  (v_restaurant_id, 'Tiramisu', 'Classic Italian coffee-flavored dessert', 'Dessert', 6.000, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800', true, 15, 420, true, false, 4.9, 223),
  (v_restaurant_id, 'Italian Soda', 'Sparkling water with fruit syrup', 'Beverage', 2.500, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800', true, 5, 80, true, false, 4.3, 89);

RAISE NOTICE '✅ Created Pizza Palace with 8 dishes';

END $$;

-- ============================================
-- VERIFY EVERYTHING
-- ============================================

-- Show all partners
SELECT 
  '👤 PARTNERS' as type,
  id,
  email,
  full_name,
  role,
  phone
FROM users
WHERE role = 'partner'
ORDER BY created_at DESC;

-- Show all restaurants with partner info
SELECT 
  '🍽️ RESTAURANTS' as type,
  r.id as restaurant_id,
  r.name as restaurant_name,
  r.cuisine_type,
  r.rating,
  u.full_name as owner_name,
  u.email as owner_email,
  (SELECT COUNT(*) FROM dishes WHERE dishes.restaurant_id = r.id) as dish_count
FROM restaurants r
JOIN users u ON u.id = r.partner_id
WHERE u.role = 'partner'
ORDER BY r.created_at DESC;

-- Summary
SELECT 
  '📊 SUMMARY' as report,
  (SELECT COUNT(*) FROM users WHERE role = 'partner') as total_partners,
  (SELECT COUNT(*) FROM restaurants) as total_restaurants,
  (SELECT COUNT(*) FROM dishes) as total_dishes;
