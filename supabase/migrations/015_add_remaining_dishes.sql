-- Migration 015: Add Dishes for Remaining Restaurants

-- Insert dishes for Al Tazaj (Lebanese Grill)
INSERT INTO dishes (id, restaurant_id, name, description, price, calories, preparation_time, is_vegetarian, is_vegan, is_spicy, is_popular, is_available) VALUES
  (
    '20000000-0000-0000-0000-000000000017',
    '10000000-0000-0000-0000-000000000004',
    'Grilled Chicken',
    'Tender grilled chicken with Lebanese spices and garlic sauce',
    7.50,
    550,
    20,
    FALSE,
    FALSE,
    FALSE,
    TRUE,
    TRUE
  ),
  (
    '20000000-0000-0000-0000-000000000018',
    '10000000-0000-0000-0000-000000000004',
    'Shish Tawook',
    'Marinated chicken skewers with vegetables',
    8.00,
    500,
    18,
    FALSE,
    FALSE,
    FALSE,
    TRUE,
    TRUE
  ),
  (
    '20000000-0000-0000-0000-000000000019',
    '10000000-0000-0000-0000-000000000004',
    'Lamb Kebab',
    'Juicy lamb kebabs with onions and tomatoes',
    10.00,
    650,
    22,
    FALSE,
    FALSE,
    FALSE,
    TRUE,
    TRUE
  );

-- Insert dishes for Mama's Kitchen (Saudi Home-Style)
INSERT INTO dishes (id, restaurant_id, name, description, price, calories, preparation_time, is_vegetarian, is_vegan, is_spicy, is_popular, is_available) VALUES
  (
    '20000000-0000-0000-0000-000000000020',
    '10000000-0000-0000-0000-000000000005',
    'Chicken Machboos',
    'Traditional home-style rice with chicken and spices',
    9.00,
    700,
    35,
    FALSE,
    FALSE,
    TRUE,
    TRUE,
    TRUE
  ),
  (
    '20000000-0000-0000-0000-000000000021',
    '10000000-0000-0000-0000-000000000005',
    'Lamb Stew',
    'Slow-cooked lamb with vegetables and aromatic spices',
    11.00,
    800,
    40,
    FALSE,
    FALSE,
    FALSE,
    TRUE,
    TRUE
  ),
  (
    '20000000-0000-0000-0000-000000000022',
    '10000000-0000-0000-0000-000000000005',
    'Lentil Soup',
    'Hearty homemade lentil soup with bread',
    4.00,
    300,
    15,
    TRUE,
    TRUE,
    FALSE,
    FALSE,
    TRUE
  );

-- Insert dishes for Zaatar & Oil (Breakfast & Bakery)
INSERT INTO dishes (id, restaurant_id, name, description, price, calories, preparation_time, is_vegetarian, is_vegan, is_spicy, is_popular, is_available) VALUES
  (
    '20000000-0000-0000-0000-000000000023',
    '10000000-0000-0000-0000-000000000007',
    'Zaatar Croissant',
    'Buttery croissant filled with zaatar',
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
    '20000000-0000-0000-0000-000000000024',
    '10000000-0000-0000-0000-000000000007',
    'Labneh Sandwich',
    'Fresh labneh with cucumber, tomato, and mint',
    3.50,
    280,
    5,
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    TRUE
  ),
  (
    '20000000-0000-0000-0000-000000000025',
    '10000000-0000-0000-0000-000000000007',
    'Cheese Fatayer',
    'Baked pastry filled with cheese and herbs',
    2.50,
    250,
    10,
    TRUE,
    FALSE,
    FALSE,
    FALSE,
    TRUE
  );

-- Insert dishes for Papa Johns (Pizza)
INSERT INTO dishes (id, restaurant_id, name, description, price, calories, preparation_time, is_vegetarian, is_vegan, is_spicy, is_popular, is_available) VALUES
  (
    '20000000-0000-0000-0000-000000000026',
    '10000000-0000-0000-0000-000000000009',
    'The Works Pizza',
    'Loaded with pepperoni, sausage, peppers, and onions',
    13.00,
    950,
    25,
    FALSE,
    FALSE,
    FALSE,
    TRUE,
    TRUE
  ),
  (
    '20000000-0000-0000-0000-000000000027',
    '10000000-0000-0000-0000-000000000009',
    'Garden Fresh Pizza',
    'Fresh vegetables with mozzarella and tomato sauce',
    10.00,
    700,
    20,
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    TRUE
  ),
  (
    '20000000-0000-0000-0000-000000000028',
    '10000000-0000-0000-0000-000000000009',
    'Chicken Ranch Pizza',
    'Grilled chicken with ranch sauce and cheese',
    12.00,
    850,
    25,
    FALSE,
    FALSE,
    FALSE,
    TRUE,
    TRUE
  );

-- Add some add-ons for new dishes
INSERT INTO dish_addons (id, dish_id, name, price, is_available) VALUES
  -- For Al Tazaj
  ('30000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000017', 'Extra Garlic Sauce', 0.50, TRUE),
  ('30000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000017', 'Add Rice', 2.00, TRUE),
  -- For Papa Johns
  ('30000000-0000-0000-0000-000000000011', '20000000-0000-0000-0000-000000000026', 'Extra Cheese', 2.00, TRUE),
  ('30000000-0000-0000-0000-000000000012', '20000000-0000-0000-0000-000000000026', 'Stuffed Crust', 3.00, TRUE)
ON CONFLICT (id) DO NOTHING;
