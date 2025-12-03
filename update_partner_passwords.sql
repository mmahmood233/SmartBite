-- Update all partner passwords to 12345678
-- Run this in Supabase SQL Editor

UPDATE auth.users
SET encrypted_password = crypt('12345678', gen_salt('bf')),
    updated_at = NOW()
WHERE email IN (
  'partner@burgerking.bh',
  'partner@kfc.bh',
  'partner@mcdonalds.bh',
  'partner@pizzahut.bh',
  'partner@shakeshack.bh',
  'partner@starbucks.bh'
);

-- Verify the update
SELECT 
  email,
  raw_user_meta_data->>'full_name' as name,
  updated_at
FROM auth.users
WHERE email LIKE 'partner@%'
ORDER BY email;
