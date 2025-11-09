-- Migration 014: Add Test Dishes and Menu Items
-- This adds sample dishes for testing

-- Insert dishes for Al Qariah (Saudi restaurant)
INSERT INTO dishes (id, restaurant_id, name, description, price, calories, preparation_time, is_vegetarian, is_vegan, is_spicy, is_popular, is_available) VALUES
  (
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Kabsa',
    'Traditional Saudi rice dish with tender chicken, aromatic spices, and nuts',
    8.50,
    650,
    30,
    FALSE,
    FALSE,
    TRUE,
    TRUE,
    TRUE
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'Mandi',
    'Slow-cooked lamb with fragrant rice and traditional spices',
    12.00,
    750,
    35,
    FALSE,
    FALSE,
    FALSE,
    TRUE,
    TRUE
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000001',
    'Jareesh',
    'Creamy wheat porridge with chicken, a comfort food classic',
    7.00,
    500,
    25,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    TRUE
  );

-- Insert dishes for Shawarma House (Lebanese)
INSERT INTO dishes (id, restaurant_id, name, description, price, calories, preparation_time, is_vegetarian, is_vegan, is_spicy, is_popular, is_available) VALUES
  (
    '20000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000002',
    'Chicken Shawarma Wrap',
    'Marinated chicken with garlic sauce, pickles, and fresh vegetables',
    4.50,
    450,
    10,
    FALSE,
    FALSE,
    FALSE,
    TRUE,
    TRUE
  ),
  (
    '20000000-0000-0000-0000-000000000005',
    '10000000-0000-0000-0000-000000000002',
    'Beef Shawarma Plate',
    'Tender beef shawarma served with rice, salad, and tahini',
    6.50,
    600,
    15,
    FALSE,
    FALSE,
    FALSE,
    TRUE,
    TRUE
  ),
  (
    '20000000-0000-0000-0000-000000000006',
    '10000000-0000-0000-0000-000000000002',
    'Mixed Grill Platter',
    'Assorted grilled meats with hummus, grilled vegetables, and bread',
    15.00,
    850,
    20,
    FALSE,
    FALSE,
    FALSE,
    TRUE,
    TRUE
  ),
  (
    '20000000-0000-0000-0000-000000000007',
    '10000000-0000-0000-0000-000000000002',
    'Falafel Wrap',
    'Crispy falafel with tahini, fresh vegetables, and pickles',
    3.50,
    350,
    8,
    TRUE,
    TRUE,
    FALSE,
    FALSE,
    TRUE
  );

-- Insert dishes for Manousheh Spot (Lebanese Bakery)
INSERT INTO dishes (id, restaurant_id, name, description, price, calories, preparation_time, is_vegetarian, is_vegan, is_spicy, is_popular, is_available) VALUES
  (
    '20000000-0000-0000-0000-000000000008',
    '10000000-0000-0000-0000-000000000003',
    'Zaatar Manousheh',
    'Fresh baked flatbread with zaatar and olive oil',
    2.50,
    280,
    8,
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    TRUE
  ),
  (
    '20000000-0000-0000-0000-000000000009',
    '10000000-0000-0000-0000-000000000003',
    'Cheese Manousheh',
    'Melted akkawi cheese on fresh flatbread',
    3.00,
    320,
    8,
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    TRUE
  ),
  (
    '20000000-0000-0000-0000-000000000010',
    '10000000-0000-0000-0000-000000000003',
    'Labneh with Vegetables',
    'Creamy labneh spread with fresh vegetables and olive oil',
    3.50,
    250,
    5,
    TRUE,
    FALSE,
    FALSE,
    FALSE,
    TRUE
  );

-- Insert dishes for Pizza Hut
INSERT INTO dishes (id, restaurant_id, name, description, price, calories, preparation_time, is_vegetarian, is_vegan, is_spicy, is_popular, is_available) VALUES
  (
    '20000000-0000-0000-0000-000000000011',
    '10000000-0000-0000-0000-000000000008',
    'Pepperoni Pizza',
    'Classic pepperoni with mozzarella cheese and tomato sauce',
    10.00,
    800,
    25,
    FALSE,
    FALSE,
    FALSE,
    TRUE,
    TRUE
  ),
  (
    '20000000-0000-0000-0000-000000000012',
    '10000000-0000-0000-0000-000000000008',
    'Margherita Pizza',
    'Fresh mozzarella, tomatoes, and basil',
    8.50,
    650,
    20,
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    TRUE
  ),
  (
    '20000000-0000-0000-0000-000000000013',
    '10000000-0000-0000-0000-000000000008',
    'BBQ Chicken Pizza',
    'Grilled chicken with BBQ sauce, onions, and cheese',
    12.00,
    900,
    25,
    FALSE,
    FALSE,
    FALSE,
    TRUE,
    TRUE
  );

-- Insert dishes for Falafel Corner (Vegetarian)
INSERT INTO dishes (id, restaurant_id, name, description, price, calories, preparation_time, is_vegetarian, is_vegan, is_spicy, is_popular, is_available) VALUES
  (
    '20000000-0000-0000-0000-000000000014',
    '10000000-0000-0000-0000-000000000006',
    'Falafel Plate',
    'Crispy falafel balls with hummus, salad, and tahini',
    5.00,
    400,
    10,
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    TRUE
  ),
  (
    '20000000-0000-0000-0000-000000000015',
    '10000000-0000-0000-0000-000000000006',
    'Hummus Bowl',
    'Creamy hummus topped with olive oil and chickpeas',
    4.00,
    300,
    5,
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    TRUE
  ),
  (
    '20000000-0000-0000-0000-000000000016',
    '10000000-0000-0000-0000-000000000006',
    'Veggie Wrap',
    'Fresh vegetables with hummus and tahini in a wrap',
    4.50,
    350,
    8,
    TRUE,
    TRUE,
    FALSE,
    FALSE,
    TRUE
  );

-- Add some sample add-ons
INSERT INTO dish_addons (id, dish_id, name, price, is_available) VALUES
  -- For Shawarma
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', 'Extra Garlic Sauce', 0.50, TRUE),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000004', 'Extra Pickles', 0.30, TRUE),
  ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000004', 'Add Cheese', 1.00, TRUE),
  -- For Pizza
  ('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000011', 'Extra Cheese', 2.00, TRUE),
  ('30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000011', 'Extra Pepperoni', 2.50, TRUE),
  ('30000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000011', 'Stuffed Crust', 3.00, TRUE),
  -- For Falafel
  ('30000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000014', 'Extra Tahini', 0.50, TRUE),
  ('30000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000014', 'Add Fries', 1.50, TRUE)
ON CONFLICT (id) DO NOTHING;
