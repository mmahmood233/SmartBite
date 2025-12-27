-- ========================================
-- RESTAURANT #1: KFC
-- ========================================

-- Step 1: Create Partner Account
-- Email: kfc@wajba.bh
-- Password: 12345678

DO $$
DECLARE
  partner_user_id UUID;
  new_restaurant_id UUID;
BEGIN
  -- Create partner user in auth.users (Supabase Auth)
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
  ) VALUES (
    gen_random_uuid(),
    'kfc@wajba.bh',
    crypt('12345678', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"KFC Manager"}',
    false,
    'authenticated'
  )
  RETURNING id INTO partner_user_id;

  -- Create partner in public.users table
  INSERT INTO users (
    id,
    email,
    full_name,
    phone,
    role,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    partner_user_id,
    'kfc@wajba.bh',
    'KFC Manager',
    '+973 1771 1771',
    'partner',
    true,
    NOW(),
    NOW()
  );

  -- Create restaurant
  INSERT INTO restaurants (
    id,
    partner_id,
    name,
    category,
    description,
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
    status,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    partner_user_id,
    'KFC',
    'Fast Food',
    'World-famous fried chicken and sides. Finger Lickin'' Good!',
    'Building 123, Road 2407, Block 324, Juffair, Manama, Bahrain',
    26.2235,
    50.6089,
    '+973 1771 1771',
    'kfc@wajba.bh',
    4.5,
    0,
    0,
    1.500,
    5.000,
    '20-25 min',
    'open',
    true,
    NOW(),
    NOW()
  )
  RETURNING id INTO new_restaurant_id;

  -- Create menu categories
  INSERT INTO menu_categories (restaurant_id, name, description, display_order, is_active) VALUES
  (new_restaurant_id, 'Chicken Meals', 'Our signature fried chicken meals', 1, true),
  (new_restaurant_id, 'Burgers & Sandwiches', 'Delicious burgers and sandwiches', 2, true),
  (new_restaurant_id, 'Sides', 'Perfect sides to complete your meal', 3, true),
  (new_restaurant_id, 'Drinks', 'Refreshing beverages', 4, true),
  (new_restaurant_id, 'Desserts', 'Sweet treats', 5, true);

  -- Add dishes
  -- Chicken Meals
  INSERT INTO dishes (
    restaurant_id,
    category_id,
    category,
    name,
    description,
    price,
    calories,
    preparation_time,
    is_vegetarian,
    is_vegan,
    is_spicy,
    is_popular,
    is_available
  )
  SELECT 
    new_restaurant_id,
    mc.id,
    'Main Course',
    'Zinger Meal',
    'Crispy Zinger fillet with fries and drink',
    3.200,
    850,
    15,
    false,
    false,
    true,
    true,
    true
  FROM menu_categories mc WHERE mc.restaurant_id = new_restaurant_id AND mc.name = 'Chicken Meals'
  UNION ALL
  SELECT 
    new_restaurant_id,
    mc.id,
    'Main Course',
    '3-Piece Chicken Meal',
    'Three pieces of Original Recipe chicken with fries and drink',
    3.500,
    920,
    15,
    false,
    false,
    false,
    true,
    true
  FROM menu_categories mc WHERE mc.restaurant_id = new_restaurant_id AND mc.name = 'Chicken Meals'
  UNION ALL
  SELECT 
    new_restaurant_id,
    mc.id,
    'Main Course',
    'Hot Wings Meal',
    '6 spicy hot wings with fries and drink',
    2.900,
    780,
    12,
    false,
    false,
    true,
    false,
    true
  FROM menu_categories mc WHERE mc.restaurant_id = new_restaurant_id AND mc.name = 'Chicken Meals';

  -- Burgers & Sandwiches
  INSERT INTO dishes (
    restaurant_id,
    category_id,
    category,
    name,
    description,
    price,
    calories,
    preparation_time,
    is_vegetarian,
    is_vegan,
    is_spicy,
    is_popular,
    is_available
  )
  SELECT 
    new_restaurant_id,
    mc.id,
    'Main Course',
    'Zinger Burger',
    'Crispy chicken fillet with lettuce and mayo',
    2.200,
    650,
    10,
    false,
    false,
    true,
    true,
    true
  FROM menu_categories mc WHERE mc.restaurant_id = new_restaurant_id AND mc.name = 'Burgers & Sandwiches'
  UNION ALL
  SELECT 
    new_restaurant_id,
    mc.id,
    'Main Course',
    'Twister Wrap',
    'Grilled chicken wrap with fresh vegetables',
    2.500,
    580,
    10,
    false,
    false,
    false,
    true,
    true
  FROM menu_categories mc WHERE mc.restaurant_id = new_restaurant_id AND mc.name = 'Burgers & Sandwiches';

  -- Sides
  INSERT INTO dishes (
    restaurant_id,
    category_id,
    category,
    name,
    description,
    price,
    calories,
    preparation_time,
    is_vegetarian,
    is_vegan,
    is_spicy,
    is_popular,
    is_available
  )
  SELECT 
    new_restaurant_id,
    mc.id,
    'Side',
    'Regular Fries',
    'Crispy golden fries',
    0.800,
    320,
    5,
    true,
    true,
    false,
    true,
    true
  FROM menu_categories mc WHERE mc.restaurant_id = new_restaurant_id AND mc.name = 'Sides'
  UNION ALL
  SELECT 
    new_restaurant_id,
    mc.id,
    'Side',
    'Coleslaw',
    'Fresh creamy coleslaw',
    0.700,
    150,
    5,
    true,
    false,
    false,
    false,
    true
  FROM menu_categories mc WHERE mc.restaurant_id = new_restaurant_id AND mc.name = 'Sides'
  UNION ALL
  SELECT 
    new_restaurant_id,
    mc.id,
    'Side',
    'Popcorn Chicken',
    'Bite-sized crispy chicken pieces',
    1.500,
    420,
    8,
    false,
    false,
    false,
    true,
    true
  FROM menu_categories mc WHERE mc.restaurant_id = new_restaurant_id AND mc.name = 'Sides';

  -- Drinks
  INSERT INTO dishes (
    restaurant_id,
    category_id,
    category,
    name,
    description,
    price,
    calories,
    preparation_time,
    is_vegetarian,
    is_vegan,
    is_spicy,
    is_popular,
    is_available
  )
  SELECT 
    new_restaurant_id,
    mc.id,
    'Beverage',
    'Pepsi Regular',
    'Chilled Pepsi',
    0.500,
    150,
    2,
    true,
    true,
    false,
    true,
    true
  FROM menu_categories mc WHERE mc.restaurant_id = new_restaurant_id AND mc.name = 'Drinks'
  UNION ALL
  SELECT 
    new_restaurant_id,
    mc.id,
    'Beverage',
    'Mountain Dew',
    'Refreshing Mountain Dew',
    0.500,
    170,
    2,
    true,
    true,
    false,
    false,
    true
  FROM menu_categories mc WHERE mc.restaurant_id = new_restaurant_id AND mc.name = 'Drinks';

  -- Desserts
  INSERT INTO dishes (
    restaurant_id,
    category_id,
    category,
    name,
    description,
    price,
    calories,
    preparation_time,
    is_vegetarian,
    is_vegan,
    is_spicy,
    is_popular,
    is_available
  )
  SELECT 
    new_restaurant_id,
    mc.id,
    'Dessert',
    'Chocolate Chip Cookie',
    'Warm chocolate chip cookie',
    0.600,
    280,
    5,
    true,
    false,
    false,
    false,
    true
  FROM menu_categories mc WHERE mc.restaurant_id = new_restaurant_id AND mc.name = 'Desserts';

  RAISE NOTICE '✅ KFC created successfully!';
  RAISE NOTICE '📧 Email: kfc@wajba.bh';
  RAISE NOTICE '🔑 Password: 12345678';
  RAISE NOTICE '🏪 Restaurant ID: %', new_restaurant_id;
  RAISE NOTICE '👤 Partner ID: %', partner_user_id;

END $$;
