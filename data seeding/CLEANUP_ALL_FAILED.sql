-- COMPREHENSIVE CLEANUP for all failed restaurant creation attempts
-- Run this in Supabase SQL Editor to remove ALL orphaned auth users

-- Step 1: See what will be deleted
SELECT 
  au.id,
  au.email,
  au.created_at,
  CASE WHEN u.id IS NULL THEN '❌ No user record' ELSE '✅ Has user record' END as user_status,
  CASE WHEN r.id IS NULL THEN '❌ No restaurant' ELSE '✅ Has restaurant' END as restaurant_status
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
LEFT JOIN public.restaurants r ON au.id = r.partner_id
WHERE au.email IN (
  'popcornpalace@wajba.bh',
  'streetbites@wajba.bh',
  'freshsqueeze@wajba.bh',
  'fitfuel@wajba.bh',
  'lavinoteca@wajba.bh',
  'tokyosushi@wajba.bh'
)
ORDER BY au.email, au.created_at;

-- Step 2: Delete ALL auth users with these emails (removes all duplicates)
DELETE FROM auth.users 
WHERE email IN (
  'popcornpalace@wajba.bh',
  'streetbites@wajba.bh',
  'freshsqueeze@wajba.bh',
  'fitfuel@wajba.bh',
  'lavinoteca@wajba.bh',
  'tokyosushi@wajba.bh'
);

-- Step 3: Also clean up any partial records in users table
DELETE FROM public.users
WHERE email IN (
  'popcornpalace@wajba.bh',
  'streetbites@wajba.bh',
  'freshsqueeze@wajba.bh',
  'fitfuel@wajba.bh',
  'lavinoteca@wajba.bh',
  'tokyosushi@wajba.bh'
);

-- Step 4: Verify cleanup
SELECT 
  'Auth users remaining' as check_type,
  COUNT(*) as count
FROM auth.users
WHERE email IN (
  'popcornpalace@wajba.bh',
  'streetbites@wajba.bh',
  'freshsqueeze@wajba.bh',
  'fitfuel@wajba.bh',
  'lavinoteca@wajba.bh',
  'tokyosushi@wajba.bh'
)
UNION ALL
SELECT 
  'Public users remaining' as check_type,
  COUNT(*) as count
FROM public.users
WHERE email IN (
  'popcornpalace@wajba.bh',
  'streetbites@wajba.bh',
  'freshsqueeze@wajba.bh',
  'fitfuel@wajba.bh',
  'lavinoteca@wajba.bh',
  'tokyosushi@wajba.bh'
);

-- Both counts should be 0 after cleanup
