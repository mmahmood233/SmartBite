-- Automatically create user record when someone signs up through auth
-- This ensures all auth users are always in the users table

-- Create function to handle new auth user
CREATE OR REPLACE FUNCTION handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into users table
  INSERT INTO users (
    id,
    email,
    full_name,
    phone,
    role,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'phone',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer'::user_role),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(users.full_name, EXCLUDED.full_name),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_auth_user();

-- Also sync any existing auth users that aren't in users table yet
INSERT INTO users (
  id,
  email,
  full_name,
  phone,
  role,
  created_at,
  updated_at
)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email) as full_name,
  au.raw_user_meta_data->>'phone' as phone,
  COALESCE((au.raw_user_meta_data->>'role')::user_role, 'customer'::user_role) as role,
  au.created_at,
  au.updated_at
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM users u WHERE u.id = au.id
)
ON CONFLICT (id) DO NOTHING;
