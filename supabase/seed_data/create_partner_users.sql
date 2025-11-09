-- ============================================
-- CREATE PARTNER USERS FOR RESTAURANTS
-- ============================================
-- This script creates partner accounts that can own restaurants
-- Each partner gets their own login credentials
-- ============================================

-- ⚠️ IMPORTANT NOTES:
-- 1. These users are created in the 'users' table only
-- 2. For actual authentication, you need to create them in Supabase Auth
-- 3. This script creates the database records for partners
-- 4. You can use these IDs for the restaurants

-- ============================================
-- METHOD 1: Create Partners Manually
-- ============================================

-- Partner 1: Al Qariah Restaurant Owner
INSERT INTO users (
  id,
  email,
  full_name,
  role,
  phone,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'alqariah@smartbite.bh',
  'Ahmed Al-Khalifa',
  'partner',
  '+973 1729 9999',
  NOW(),
  NOW()
) RETURNING id, email, full_name;

-- Partner 2: Mama's Kitchen Owner
INSERT INTO users (
  id,
  email,
  full_name,
  role,
  phone,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'mamas@smartbite.bh',
  'Fatima Hassan',
  'partner',
  '+973 1234 5678',
  NOW(),
  NOW()
) RETURNING id, email, full_name;

-- Partner 3: Pizza Palace Owner
INSERT INTO users (
  id,
  email,
  full_name,
  role,
  phone,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'pizza@smartbite.bh',
  'Marco Rossi',
  'partner',
  '+973 9876 5432',
  NOW(),
  NOW()
) RETURNING id, email, full_name;

-- ============================================
-- METHOD 2: Create Multiple Partners at Once
-- ============================================

-- This creates all partners in one go and shows their IDs
WITH new_partners AS (
  INSERT INTO users (
    id,
    email,
    full_name,
    role,
    phone,
    created_at,
    updated_at
  ) VALUES 
    (gen_random_uuid(), 'alqariah@smartbite.bh', 'Ahmed Al-Khalifa', 'partner', '+973 1729 9999', NOW(), NOW()),
    (gen_random_uuid(), 'mamas@smartbite.bh', 'Fatima Hassan', 'partner', '+973 1234 5678', NOW(), NOW()),
    (gen_random_uuid(), 'pizza@smartbite.bh', 'Marco Rossi', 'partner', '+973 9876 5432', NOW(), NOW()),
    (gen_random_uuid(), 'shawarma@smartbite.bh', 'Ali Mohammed', 'partner', '+973 3333 4444', NOW(), NOW()),
    (gen_random_uuid(), 'sushi@smartbite.bh', 'Yuki Tanaka', 'partner', '+973 5555 6666', NOW(), NOW())
  RETURNING id, email, full_name, role
)
SELECT 
  '✅ Partner Created' as status,
  id as partner_id,
  email,
  full_name,
  role
FROM new_partners
ORDER BY email;

-- ============================================
-- VERIFY PARTNERS
-- ============================================
SELECT 
  id as partner_id,
  email,
  full_name,
  role,
  phone,
  created_at
FROM users
WHERE role = 'partner'
ORDER BY created_at DESC;

-- ============================================
-- GET PARTNER IDs FOR RESTAURANTS
-- ============================================
-- Use this to get the IDs you need for add_multiple_restaurants.sql

SELECT 
  id as partner_id,
  email,
  full_name,
  '-- Use this ID for: ' || full_name as note
FROM users
WHERE role = 'partner'
ORDER BY email;
