-- Complete cleanup of all partner accounts
-- Run this first, then we'll create accounts properly

-- Step 1: Unlink all restaurants
UPDATE restaurants SET partner_id = NULL;

-- Step 2: Delete from users table
DELETE FROM users WHERE role = 'partner';

-- Step 3: Delete from auth.users (all @wajba.bh emails)
DELETE FROM auth.users WHERE email LIKE '%@wajba.bh';

-- Step 4: Verify cleanup
SELECT 'Remaining auth users' as check_type, COUNT(*) as count
FROM auth.users WHERE email LIKE '%@wajba.bh'
UNION ALL
SELECT 'Remaining user profiles', COUNT(*)
FROM users WHERE role = 'partner'
UNION ALL
SELECT 'Restaurants without partners', COUNT(*)
FROM restaurants WHERE partner_id IS NULL;

-- If all counts are 0 for first two and 7 for last one, cleanup is complete!
