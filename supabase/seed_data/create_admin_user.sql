-- ============================================
-- Create Admin User for Wajba
-- ============================================
-- This creates an admin account that can access the admin dashboard
-- 
-- CREDENTIALS:
-- Email: admin@wajba.bh
-- Password: 12345678
-- 
-- ⚠️ IMPORTANT: This script only creates the database entry.
-- You MUST create the auth user in Supabase Dashboard first!
-- ============================================

-- ============================================
-- STEP 1: Create Auth User (DO THIS FIRST!)
-- ============================================
-- Go to Supabase Dashboard → Authentication → Users
-- Click "Add User" → "Create new user"
-- Email: admin@wajba.bh
-- Password: 12345678
-- Auto Confirm User: YES (check this box)
-- Click "Create User"
-- 
-- Copy the UUID that was created (you'll need it for Step 2)
-- ============================================

-- ============================================
-- STEP 2: Update the user role in database
-- ============================================
-- Replace 'YOUR_AUTH_USER_ID' below with the UUID from Step 1
-- Then run this query:

UPDATE users 
SET 
  role = 'admin',
  full_name = 'Wajba Admin',
  phone = '+973-1234-5678',
  updated_at = NOW()
WHERE id = 'YOUR_AUTH_USER_ID';

-- If the user doesn't exist in users table yet, insert it:
-- (Replace 'YOUR_AUTH_USER_ID' with the actual UUID)
/*
INSERT INTO users (
  id,
  email,
  full_name,
  role,
  phone,
  created_at,
  updated_at
) VALUES (
  'YOUR_AUTH_USER_ID',
  'admin@wajba.bh',
  'Wajba Admin',
  'admin',
  '+973-1234-5678',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  full_name = 'Wajba Admin',
  phone = '+973-1234-5678',
  updated_at = NOW();
*/

-- ============================================
-- Verify Admin User Created
-- ============================================
SELECT 
  id,
  email,
  full_name,
  role,
  phone,
  created_at
FROM users 
WHERE email = 'admin@wajba.bh';

-- ============================================
-- NEXT STEPS:
-- ============================================
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Find the user with email: admin@wajba.bh
-- 3. Click "..." → Reset Password
-- 4. Set password to: 12345678
-- 
-- OR use Supabase CLI:
-- supabase auth update admin@wajba.bh --password 12345678
-- 
-- ⚠️ Remember to change this password after first login!
-- ============================================
