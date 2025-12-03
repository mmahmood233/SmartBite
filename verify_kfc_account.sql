-- Complete verification of KFC account

-- 1. Check auth.users
SELECT 
  'AUTH.USERS' as table_name,
  id,
  email,
  encrypted_password IS NOT NULL as has_password,
  encrypted_password = crypt('12345678', encrypted_password) as password_matches,
  email_confirmed_at IS NOT NULL as email_confirmed,
  created_at,
  updated_at
FROM auth.users
WHERE email = 'kfcjuffair@wajba.bh';

-- 2. Check users table
SELECT 
  'USERS TABLE' as table_name,
  id,
  email,
  full_name,
  role,
  is_active,
  email_verified,
  created_at
FROM users
WHERE email = 'kfcjuffair@wajba.bh';

-- 3. Check if there are any auth issues
SELECT 
  email,
  banned_until,
  confirmation_sent_at,
  confirmed_at,
  email_confirmed_at,
  last_sign_in_at
FROM auth.users
WHERE email = 'kfcjuffair@wajba.bh';
