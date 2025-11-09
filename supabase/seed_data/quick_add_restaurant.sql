-- ============================================
-- QUICK ADD: Complete Restaurant with Dishes
-- ============================================
-- INSTRUCTIONS:
-- 1. Run this query first to get your user ID:
--    SELECT id, email FROM users;
-- 2. Copy the UUID and replace 'YOUR_USER_ID' below
-- 3. Run this entire script in Supabase SQL Editor
-- 4. Done! Your restaurant with all dishes will be added
-- ============================================

-- Step 1: Add Restaurant
WITH new_restaurant AS (
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
    'YOUR_USER_ID', -- ⚠️ REPLACE THIS WITH YOUR ACTUAL USER ID
    'Al Qariah Restaurant',
    'Authentic Bahraini cuisine with traditional recipes passed down through generations',
    'Bahraini',
    'Building 227, Road 15, Block 315, Manama',
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
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200'
  ) RETURNING id
),

-- Step 2: Add All Dishes
new_dishes AS (
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
  ) 
  SELECT 
    new_restaurant.id,
    dish_data.name,
    dish_data.description,
    dish_data.category,
    dish_data.price,
    dish_data.image_url,
    dish_data.is_available,
    dish_data.preparation_time,
    dish_data.calories,
    dish_data.is_vegetarian,
    dish_data.is_spicy,
    dish_data.rating,
    dish_data.total_reviews
  FROM new_restaurant,
  (VALUES
    -- Dish 1: Chicken Kabsa
    (
      'Chicken Kabsa',
      'Traditional Bahraini rice dish with tender chicken, aromatic spices, and saffron',
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
    ),
    -- Dish 2: Lamb Mandi
    (
      'Lamb Mandi',
      'Slow-cooked lamb with fragrant basmati rice, topped with fried onions and raisins',
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
    ),
    -- Dish 3: Hummus
    (
      'Hummus with Bread',
      'Creamy chickpea dip blended with tahini, lemon, and garlic. Served with warm pita',
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
    ),
    -- Dish 4: Falafel
    (
      'Falafel Plate',
      'Crispy falafel balls served with tahini sauce, pickles, and fresh vegetables',
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
    ),
    -- Dish 5: Grilled Fish
    (
      'Grilled Hammour Fish',
      'Fresh local hammour fish grilled to perfection with lemon and herbs',
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
    ),
    -- Dish 6: Kunafa
    (
      'Kunafa',
      'Sweet cheese pastry soaked in sugar syrup, topped with crushed pistachios',
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
    ),
    -- Dish 7: Fresh Juice
    (
      'Fresh Orange Juice',
      'Freshly squeezed orange juice, no added sugar. Pure and refreshing',
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
    ),
    -- Dish 8: Shawarma
    (
      'Chicken Shawarma Wrap',
      'Marinated chicken wrapped in fresh saj bread with garlic sauce and pickles',
      'Main Course',
      6.000,
      'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800',
      true,
      15,
      520,
      false,
      true,
      4.6,
      198
    )
  ) AS dish_data(
    name, description, category, price, image_url, 
    is_available, preparation_time, calories, 
    is_vegetarian, is_spicy, rating, total_reviews
  )
  RETURNING id, name
)

-- Show results
SELECT 
  'Restaurant added successfully!' as message,
  r.name as restaurant_name,
  r.id as restaurant_id,
  (SELECT COUNT(*) FROM new_dishes) as total_dishes_added
FROM new_restaurant r;

-- ============================================
-- VERIFY YOUR DATA
-- ============================================
-- After running, execute these queries to verify:

-- 1. Check restaurant:
-- SELECT * FROM restaurants WHERE name = 'Al Qariah Restaurant';

-- 2. Check dishes:
-- SELECT name, category, price FROM dishes 
-- WHERE restaurant_id = (SELECT id FROM restaurants WHERE name = 'Al Qariah Restaurant');

-- 3. Check everything:
-- SELECT 
--   r.name as restaurant,
--   d.name as dish,
--   d.category,
--   d.price
-- FROM restaurants r
-- JOIN dishes d ON d.restaurant_id = r.id
-- WHERE r.name = 'Al Qariah Restaurant'
-- ORDER BY d.category, d.name;
