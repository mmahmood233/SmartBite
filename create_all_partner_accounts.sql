-- Create Partner Accounts for All Restaurants
-- Password for ALL: 12345678

-- ============================================
-- STEP 1: UNLINK RESTAURANTS & DELETE OLD PARTNERS
-- ============================================

-- First, unlink all restaurants from their partners
UPDATE restaurants SET partner_id = NULL;

-- Now we can safely delete partner users
DELETE FROM users WHERE role = 'partner';
DELETE FROM auth.users WHERE email LIKE 'partner@%' OR email LIKE '%@wajba.bh';

-- ============================================
-- STEP 2: CREATE PARTNER ACCOUNTS
-- ============================================

DO $$
DECLARE
  mcdonalds_id UUID := '11111111-1111-1111-1111-111111111101'::uuid;
  blacktap_id UUID := '11111111-1111-1111-1111-111111111102'::uuid;
  calexico_id UUID := '11111111-1111-1111-1111-111111111103'::uuid;
  nomad_id UUID := '11111111-1111-1111-1111-111111111104'::uuid;
  pizzahut_id UUID := '11111111-1111-1111-1111-111111111105'::uuid;
  kfc_id UUID := '11111111-1111-1111-1111-111111111106'::uuid;
  shakeshack_id UUID := '11111111-1111-1111-1111-111111111107'::uuid;
BEGIN

  -- ============================================
  -- MCDONALD'S BAHRAIN
  -- ============================================
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
  ) VALUES (
    mcdonalds_id, '00000000-0000-0000-0000-000000000000',
    'mcdonaldsbahrain@wajba.bh', crypt('12345678', gen_salt('bf')), NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"McDonald''s Bahrain Manager"}'::jsonb,
    NOW(), NOW(), 'authenticated', 'authenticated'
  );

  INSERT INTO users (
    id, email, full_name, phone, role, is_active,
    email_verified, phone_verified, created_at, updated_at
  ) VALUES (
    mcdonalds_id, 'mcdonaldsbahrain@wajba.bh', 'McDonald''s Bahrain Manager',
    '+973 1758 8888', 'partner', TRUE, TRUE, TRUE, NOW(), NOW()
  );

  UPDATE restaurants SET partner_id = mcdonalds_id 
  WHERE name = 'McDonald''s Bahrain';

  -- ============================================
  -- BLACK TAP
  -- ============================================
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
  ) VALUES (
    blacktap_id, '00000000-0000-0000-0000-000000000000',
    'blacktapbahrain@wajba.bh', crypt('12345678', gen_salt('bf')), NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Black Tap Manager"}'::jsonb,
    NOW(), NOW(), 'authenticated', 'authenticated'
  );

  INSERT INTO users (
    id, email, full_name, phone, role, is_active,
    email_verified, phone_verified, created_at, updated_at
  ) VALUES (
    blacktap_id, 'blacktapbahrain@wajba.bh', 'Black Tap Manager',
    '+973 1700 1000', 'partner', TRUE, TRUE, TRUE, NOW(), NOW()
  );

  UPDATE restaurants SET partner_id = blacktap_id 
  WHERE name LIKE 'Black Tap%';

  -- ============================================
  -- CALEXICO
  -- ============================================
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
  ) VALUES (
    calexico_id, '00000000-0000-0000-0000-000000000000',
    'calexicoadliya@wajba.bh', crypt('12345678', gen_salt('bf')), NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Calexico Adliya Manager"}'::jsonb,
    NOW(), NOW(), 'authenticated', 'authenticated'
  );

  INSERT INTO users (
    id, email, full_name, phone, role, is_active,
    email_verified, phone_verified, created_at, updated_at
  ) VALUES (
    calexico_id, 'calexicoadliya@wajba.bh', 'Calexico Adliya Manager',
    '+973 1700 2000', 'partner', TRUE, TRUE, TRUE, NOW(), NOW()
  );

  UPDATE restaurants SET partner_id = calexico_id 
  WHERE name LIKE 'Calexico%';

  -- ============================================
  -- NOMAD
  -- ============================================
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
  ) VALUES (
    nomad_id, '00000000-0000-0000-0000-000000000000',
    'nomadurbaneatery@wajba.bh', crypt('12345678', gen_salt('bf')), NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Nomad Urban Eatery Manager"}'::jsonb,
    NOW(), NOW(), 'authenticated', 'authenticated'
  );

  INSERT INTO users (
    id, email, full_name, phone, role, is_active,
    email_verified, phone_verified, created_at, updated_at
  ) VALUES (
    nomad_id, 'nomadurbaneatery@wajba.bh', 'Nomad Urban Eatery Manager',
    '+973 1700 3000', 'partner', TRUE, TRUE, TRUE, NOW(), NOW()
  );

  UPDATE restaurants SET partner_id = nomad_id 
  WHERE name LIKE 'Nomad%';

  -- ============================================
  -- PIZZA HUT
  -- ============================================
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
  ) VALUES (
    pizzahut_id, '00000000-0000-0000-0000-000000000000',
    'pizzahutriffa@wajba.bh', crypt('12345678', gen_salt('bf')), NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Pizza Hut Riffa Manager"}'::jsonb,
    NOW(), NOW(), 'authenticated', 'authenticated'
  );

  INSERT INTO users (
    id, email, full_name, phone, role, is_active,
    email_verified, phone_verified, created_at, updated_at
  ) VALUES (
    pizzahut_id, 'pizzahutriffa@wajba.bh', 'Pizza Hut Riffa Manager',
    '+973 1700 4000', 'partner', TRUE, TRUE, TRUE, NOW(), NOW()
  );

  UPDATE restaurants SET partner_id = pizzahut_id 
  WHERE name LIKE 'Pizza Hut%';

  -- ============================================
  -- KFC
  -- ============================================
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
  ) VALUES (
    kfc_id, '00000000-0000-0000-0000-000000000000',
    'kfcjuffair@wajba.bh', crypt('12345678', gen_salt('bf')), NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"KFC Juffair Manager"}'::jsonb,
    NOW(), NOW(), 'authenticated', 'authenticated'
  );

  INSERT INTO users (
    id, email, full_name, phone, role, is_active,
    email_verified, phone_verified, created_at, updated_at
  ) VALUES (
    kfc_id, 'kfcjuffair@wajba.bh', 'KFC Juffair Manager',
    '+973 1700 5000', 'partner', TRUE, TRUE, TRUE, NOW(), NOW()
  );

  UPDATE restaurants SET partner_id = kfc_id 
  WHERE name LIKE 'KFC%';

  -- ============================================
  -- SHAKE SHACK
  -- ============================================
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
  ) VALUES (
    shakeshack_id, '00000000-0000-0000-0000-000000000000',
    'shakeshackbahrain@wajba.bh', crypt('12345678', gen_salt('bf')), NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Shake Shack Manager"}'::jsonb,
    NOW(), NOW(), 'authenticated', 'authenticated'
  );

  INSERT INTO users (
    id, email, full_name, phone, role, is_active,
    email_verified, phone_verified, created_at, updated_at
  ) VALUES (
    shakeshack_id, 'shakeshackbahrain@wajba.bh', 'Shake Shack Manager',
    '+973 1700 6000', 'partner', TRUE, TRUE, TRUE, NOW(), NOW()
  );

  UPDATE restaurants SET partner_id = shakeshack_id 
  WHERE name LIKE 'Shake Shack%';

END $$;

-- ============================================
-- VERIFICATION
-- ============================================

SELECT 
  r.name as restaurant,
  u.email as partner_email,
  u.full_name as partner_name,
  '✅' as status
FROM restaurants r
JOIN users u ON r.partner_id = u.id
WHERE u.role = 'partner'
ORDER BY r.name;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ All Partner Accounts Created!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '🍔 McDonald''s: mcdonaldsbahrain@wajba.bh';
  RAISE NOTICE '🍔 Black Tap: blacktapbahrain@wajba.bh';
  RAISE NOTICE '🌮 Calexico: calexicoadliya@wajba.bh';
  RAISE NOTICE '🍽️  Nomad: nomadurbaneatery@wajba.bh';
  RAISE NOTICE '🍕 Pizza Hut: pizzahutriffa@wajba.bh';
  RAISE NOTICE '🍗 KFC: kfcjuffair@wajba.bh';
  RAISE NOTICE '🍔 Shake Shack: shakeshackbahrain@wajba.bh';
  RAISE NOTICE '';
  RAISE NOTICE '🔑 Password for ALL: 12345678';
  RAISE NOTICE '========================================';
END $$;
