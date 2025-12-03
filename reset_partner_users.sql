-- Reset Partner Users - Clean slate for all restaurant partners
-- This will DELETE all existing partner users and create new ones
-- Password for all: 12345678

-- ============================================
-- STEP 1: DELETE ALL EXISTING PARTNER USERS
-- ============================================

-- Delete from users table first (due to foreign key constraints)
DELETE FROM users WHERE role = 'partner';

-- Delete from auth.users
DELETE FROM auth.users WHERE email LIKE 'partner@%';

-- ============================================
-- STEP 2: CREATE FRESH PARTNER ACCOUNTS
-- ============================================

DO $$
DECLARE
  burger_king_id UUID := '11111111-1111-1111-1111-111111111111'::uuid;
  kfc_id UUID := '22222222-2222-2222-2222-222222222222'::uuid;
  mcdonalds_id UUID := '99999999-9999-9999-9999-999999999999'::uuid;
  pizzahut_id UUID := '44444444-4444-4444-4444-444444444444'::uuid;
  shakeshack_id UUID := '55555555-5555-5555-5555-555555555555'::uuid;
  starbucks_id UUID := '66666666-6666-6666-6666-666666666666'::uuid;
BEGIN

  -- ============================================
  -- BURGER KING
  -- ============================================
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
  ) VALUES (
    burger_king_id, '00000000-0000-0000-0000-000000000000',
    'partner@burgerking.bh', crypt('12345678', gen_salt('bf')), NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Burger King Juffair Manager"}'::jsonb,
    NOW(), NOW(), 'authenticated', 'authenticated'
  );

  INSERT INTO users (
    id, email, full_name, phone, role, is_active, 
    email_verified, phone_verified, created_at, updated_at
  ) VALUES (
    burger_king_id, 'partner@burgerking.bh', 'Burger King Juffair Manager',
    '+973 1700 0000', 'partner', TRUE, TRUE, TRUE, NOW(), NOW()
  );

  UPDATE restaurants SET owner_id = burger_king_id WHERE name = 'Burger King';

  -- ============================================
  -- KFC
  -- ============================================
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
  ) VALUES (
    kfc_id, '00000000-0000-0000-0000-000000000000',
    'partner@kfc.bh', crypt('12345678', gen_salt('bf')), NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"KFC Juffair Manager"}'::jsonb,
    NOW(), NOW(), 'authenticated', 'authenticated'
  );

  INSERT INTO users (
    id, email, full_name, phone, role, is_active,
    email_verified, phone_verified, created_at, updated_at
  ) VALUES (
    kfc_id, 'partner@kfc.bh', 'KFC Juffair Manager',
    '+973 1700 1111', 'partner', TRUE, TRUE, TRUE, NOW(), NOW()
  );

  UPDATE restaurants SET owner_id = kfc_id WHERE name = 'KFC';

  -- ============================================
  -- MCDONALD'S
  -- ============================================
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
  ) VALUES (
    mcdonalds_id, '00000000-0000-0000-0000-000000000000',
    'partner@mcdonalds.bh', crypt('12345678', gen_salt('bf')), NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"McDonald''s Manager"}'::jsonb,
    NOW(), NOW(), 'authenticated', 'authenticated'
  );

  INSERT INTO users (
    id, email, full_name, phone, role, is_active,
    email_verified, phone_verified, created_at, updated_at
  ) VALUES (
    mcdonalds_id, 'partner@mcdonalds.bh', 'McDonald''s Manager',
    '+973 1758 8888', 'partner', TRUE, TRUE, TRUE, NOW(), NOW()
  );

  UPDATE restaurants SET owner_id = mcdonalds_id WHERE name = 'McDonald''s';

  -- ============================================
  -- PIZZA HUT
  -- ============================================
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
  ) VALUES (
    pizzahut_id, '00000000-0000-0000-0000-000000000000',
    'partner@pizzahut.bh', crypt('12345678', gen_salt('bf')), NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Pizza Hut Juffair Manager"}'::jsonb,
    NOW(), NOW(), 'authenticated', 'authenticated'
  );

  INSERT INTO users (
    id, email, full_name, phone, role, is_active,
    email_verified, phone_verified, created_at, updated_at
  ) VALUES (
    pizzahut_id, 'partner@pizzahut.bh', 'Pizza Hut Juffair Manager',
    '+973 1700 2222', 'partner', TRUE, TRUE, TRUE, NOW(), NOW()
  );

  UPDATE restaurants SET owner_id = pizzahut_id WHERE name = 'Pizza Hut';

  -- ============================================
  -- SHAKE SHACK
  -- ============================================
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
  ) VALUES (
    shakeshack_id, '00000000-0000-0000-0000-000000000000',
    'partner@shakeshack.bh', crypt('12345678', gen_salt('bf')), NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Shake Shack Manager"}'::jsonb,
    NOW(), NOW(), 'authenticated', 'authenticated'
  );

  INSERT INTO users (
    id, email, full_name, phone, role, is_active,
    email_verified, phone_verified, created_at, updated_at
  ) VALUES (
    shakeshack_id, 'partner@shakeshack.bh', 'Shake Shack Manager',
    '+973 1700 3333', 'partner', TRUE, TRUE, TRUE, NOW(), NOW()
  );

  UPDATE restaurants SET owner_id = shakeshack_id WHERE name = 'Shake Shack';

  -- ============================================
  -- STARBUCKS
  -- ============================================
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
  ) VALUES (
    starbucks_id, '00000000-0000-0000-0000-000000000000',
    'partner@starbucks.bh', crypt('12345678', gen_salt('bf')), NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Starbucks Partner"}'::jsonb,
    NOW(), NOW(), 'authenticated', 'authenticated'
  );

  INSERT INTO users (
    id, email, full_name, phone, role, is_active,
    email_verified, phone_verified, created_at, updated_at
  ) VALUES (
    starbucks_id, 'partner@starbucks.bh', 'Starbucks Partner',
    '+973 1700 4444', 'partner', TRUE, TRUE, TRUE, NOW(), NOW()
  );

  UPDATE restaurants SET owner_id = starbucks_id WHERE name = 'Starbucks';

END $$;

-- ============================================
-- VERIFICATION
-- ============================================

SELECT 
  u.email,
  u.full_name,
  u.phone,
  r.name as restaurant,
  u.created_at
FROM users u
LEFT JOIN restaurants r ON r.owner_id = u.id
WHERE u.role = 'partner'
ORDER BY u.email;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ Partner Users Reset Complete!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '🍔 Burger King: partner@burgerking.bh';
  RAISE NOTICE '🍗 KFC: partner@kfc.bh';
  RAISE NOTICE '🍔 McDonald''s: partner@mcdonalds.bh';
  RAISE NOTICE '🍕 Pizza Hut: partner@pizzahut.bh';
  RAISE NOTICE '🍔 Shake Shack: partner@shakeshack.bh';
  RAISE NOTICE '☕ Starbucks: partner@starbucks.bh';
  RAISE NOTICE '';
  RAISE NOTICE '🔑 Password for ALL: 12345678';
  RAISE NOTICE '========================================';
END $$;
