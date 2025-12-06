-- Sync all auth users to users table
-- This ensures all users who can login are visible in the CRM

-- First, let's see what we have
-- SELECT email FROM auth.users;

-- Insert any auth users that don't exist in users table
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
  COALESCE(au.raw_user_meta_data->>'full_name', au.email) as full_name,
  COALESCE(au.raw_user_meta_data->>'role', 'user')::user_role as role,
  au.created_at,
  au.updated_at
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM users u WHERE u.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- Update existing users with metadata from auth if missing
UPDATE users u
SET 
  email = au.email,
  full_name = COALESCE(u.full_name, au.raw_user_meta_data->>'full_name', au.email),
  role = COALESCE(u.role, (au.raw_user_meta_data->>'role')::user_role, 'user'::user_role),
  updated_at = NOW()
FROM auth.users au
WHERE u.id = au.id
  AND (u.email IS NULL OR u.full_name IS NULL OR u.role IS NULL);

-- Show results
SELECT 
  u.id,
  u.email,
  u.full_name,
  u.role,
  u.created_at
FROM users u
ORDER BY u.created_at DESC;
