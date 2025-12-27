-- Diagnostic: Check if rider accounts are properly set up

-- 1. Check if user exists in auth.users
SELECT 
  'Auth Users' as table_name,
  au.id,
  au.email,
  au.raw_user_meta_data->>'role' as metadata_role,
  au.created_at
FROM auth.users au
WHERE au.email LIKE '%ali%' OR au.email LIKE '%rider%'
ORDER BY au.created_at DESC
LIMIT 5;

-- 2. Check if user exists in users table
SELECT 
  'Users Table' as table_name,
  u.id,
  u.email,
  u.full_name,
  u.role,
  u.created_at
FROM users u
WHERE u.email LIKE '%ali%' OR u.email LIKE '%rider%' OR u.role = 'rider'
ORDER BY u.created_at DESC
LIMIT 5;

-- 3. Check if rider profile exists
SELECT 
  'Riders Table' as table_name,
  r.id as rider_id,
  r.user_id,
  r.full_name,
  r.phone,
  r.vehicle_type,
  r.status,
  u.email
FROM riders r
LEFT JOIN users u ON u.id = r.user_id
ORDER BY r.created_at DESC
LIMIT 5;

-- 4. Check for orphaned riders (rider profile without user)
SELECT 
  'Orphaned Riders' as issue,
  r.id as rider_id,
  r.user_id,
  r.full_name,
  'User does not exist' as problem
FROM riders r
WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = r.user_id);

-- 5. Check for users with rider role but no rider profile
SELECT 
  'Missing Rider Profile' as issue,
  u.id as user_id,
  u.email,
  u.full_name,
  'Rider profile missing' as problem
FROM users u
WHERE u.role = 'rider'
AND NOT EXISTS (SELECT 1 FROM riders r WHERE r.user_id = u.id);
