-- Cleanup script for failed restaurant creations
-- Run this in Supabase SQL Editor if you have auth users without corresponding data

-- Find auth users that don't have restaurants
SELECT 
  au.id,
  au.email,
  u.id as user_exists,
  r.id as restaurant_exists
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
LEFT JOIN public.restaurants r ON au.id = r.partner_id
WHERE au.email LIKE '%@wajba.bh'
  AND (u.id IS NULL OR r.id IS NULL);

-- To delete these orphaned auth users (CAREFUL - only run if needed):
-- DELETE FROM auth.users 
-- WHERE email IN (
--   'popcornpalace@wajba.bh',
--   'streetbites@wajba.bh',
--   'freshsqueeze@wajba.bh',
--   'fitfuel@wajba.bh',
--   'lavinoteca@wajba.bh',
--   'tokyosushi@wajba.bh'
-- );
