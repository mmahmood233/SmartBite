-- Add all auth users to users table with proper roles
-- Based on email patterns or default to 'user'

-- Insert all auth users that don't exist in users table
INSERT INTO users (
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', 
           SPLIT_PART(au.email, '@', 1)) as full_name,
  CASE 
    WHEN au.email LIKE '%admin%' THEN 'admin'::user_role
    WHEN au.email LIKE '%rider%' THEN 'rider'::user_role
    WHEN au.email LIKE '%partner%' OR au.email LIKE '%restaurant%' THEN 'partner'::user_role
    ELSE 'customer'::user_role
  END as role,
  au.created_at,
  au.updated_at
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM users u WHERE u.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- Show all users now
SELECT 
  u.id,
  u.email,
  u.full_name,
  u.role,
  u.created_at
FROM users u
ORDER BY u.created_at DESC;
