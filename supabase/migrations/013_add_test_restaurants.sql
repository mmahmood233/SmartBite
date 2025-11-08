-- Migration 013: Add Test Restaurants
-- This adds sample restaurants for testing

-- Get the first user from the database to use as partner_id
-- If you don't have any users yet, sign up first through the app
DO $$
DECLARE
  first_user_id uuid;
BEGIN
  -- Get the first user's ID
  SELECT id INTO first_user_id FROM users LIMIT 1;
  
  -- If no user exists, create a dummy one (you should replace this with a real user)
  IF first_user_id IS NULL THEN
    RAISE EXCEPTION 'No users found. Please sign up through the app first, then run this migration.';
  END IF;
  
  -- Insert test restaurants using the first user as partner
  INSERT INTO restaurants (id, partner_id, name, category, description, address, phone, rating, total_reviews, delivery_fee, min_order, avg_prep_time, is_open, is_active) VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    first_user_id,
    'Al Qariah',
    'Saudi',
    'Authentic Saudi traditional cuisine with a modern twist',
    'Manama, Bahrain',
    '+973 1234 5678',
    4.9,
    150,
    1.5,
    10.0,
    '20-30 mins',
    TRUE,
    TRUE
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    first_user_id,
    'Shawarma House',
    'Lebanese',
    'Best shawarma and grilled meats in town',
    'Riffa, Bahrain',
    '+973 1234 5679',
    4.7,
    200,
    1.0,
    5.0,
    '15-25 mins',
    TRUE,
    TRUE
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    first_user_id,
    'Manousheh Spot',
    'Lebanese',
    'Fresh Lebanese bakery specializing in manousheh',
    'Juffair, Bahrain',
    '+973 1234 5680',
    4.8,
    120,
    1.5,
    8.0,
    '15-20 mins',
    TRUE,
    TRUE
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    first_user_id,
    'Al Tazaj',
    'Lebanese',
    'Famous for grilled chicken and Lebanese specialties',
    'Seef, Bahrain',
    '+973 1234 5681',
    4.6,
    180,
    1.5,
    12.0,
    '25-35 mins',
    TRUE,
    TRUE
  ),
  (
    '10000000-0000-0000-0000-000000000005',
    first_user_id,
    'Mama''s Kitchen',
    'Saudi',
    'Home-style Saudi cooking that reminds you of home',
    'Isa Town, Bahrain',
    '+973 1234 5682',
    4.8,
    95,
    2.0,
    15.0,
    '30-40 mins',
    TRUE,
    TRUE
  ),
  (
    '10000000-0000-0000-0000-000000000006',
    first_user_id,
    'Falafel Corner',
    'Vegetarian',
    'Quick and healthy vegetarian options',
    'Adliya, Bahrain',
    '+973 1234 5683',
    4.5,
    110,
    1.0,
    5.0,
    '10-15 mins',
    TRUE,
    TRUE
  ),
  (
    '10000000-0000-0000-0000-000000000007',
    first_user_id,
    'Zaatar & Oil',
    'Breakfast',
    'Traditional breakfast and bakery items',
    'Budaiya, Bahrain',
    '+973 1234 5684',
    4.7,
    85,
    1.5,
    8.0,
    '15-20 mins',
    TRUE,
    TRUE
  ),
  (
    '10000000-0000-0000-0000-000000000008',
    first_user_id,
    'Pizza Hut',
    'Pizza',
    'Your favorite pizza delivered hot and fresh',
    'Saar, Bahrain',
    '+973 1234 5685',
    4.4,
    250,
    2.0,
    15.0,
    '30-40 mins',
    TRUE,
    TRUE
  ),
  (
    '10000000-0000-0000-0000-000000000009',
    first_user_id,
    'Papa Johns',
    'Pizza',
    'Better ingredients, better pizza',
    'Hamala, Bahrain',
    '+973 1234 5686',
    4.3,
    190,
    2.0,
    15.0,
    '30-40 mins',
    TRUE,
    TRUE
  )
  ON CONFLICT (id) DO NOTHING;
END $$;
