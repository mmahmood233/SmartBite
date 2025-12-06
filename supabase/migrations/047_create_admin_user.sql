-- Create Admin User
-- Email: admin@wajba.bh
-- Password: 12345678

-- First, we need to create the auth user
-- Note: This needs to be run in Supabase Dashboard or via Supabase CLI
-- The password will be hashed automatically by Supabase Auth

-- Step 1: Create auth user (run this in Supabase Dashboard SQL Editor)
-- You'll need to run this manually or use Supabase CLI:
-- supabase auth users create admin@wajba.bh --password 12345678

-- Step 2: After creating the auth user, insert into users table
-- Replace 'AUTH_USER_ID' with the actual UUID from auth.users

-- For now, we'll create a function to handle this
CREATE OR REPLACE FUNCTION create_admin_user(
  admin_email TEXT,
  admin_password TEXT,
  admin_name TEXT DEFAULT 'Admin User'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
  result JSON;
BEGIN
  -- Note: In production, you should create the auth user via Supabase Dashboard
  -- This function assumes the auth user already exists
  
  -- Get the auth user ID
  SELECT id INTO new_user_id
  FROM auth.users
  WHERE email = admin_email;
  
  -- If user doesn't exist in auth, return error
  IF new_user_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Auth user not found. Please create via Supabase Dashboard first.',
      'instructions', 'Go to Authentication > Users > Add User in Supabase Dashboard'
    );
  END IF;
  
  -- Check if user already exists in users table
  IF EXISTS (SELECT 1 FROM users WHERE id = new_user_id) THEN
    -- Update existing user to admin
    UPDATE users
    SET 
      role = 'admin',
      updated_at = NOW()
    WHERE id = new_user_id;
    
    RETURN json_build_object(
      'success', true,
      'message', 'User updated to admin role',
      'user_id', new_user_id,
      'email', admin_email
    );
  ELSE
    -- Insert new user with admin role
    INSERT INTO users (
      id,
      email,
      full_name,
      role,
      created_at,
      updated_at
    ) VALUES (
      new_user_id,
      admin_email,
      admin_name,
      'admin',
      NOW(),
      NOW()
    );
    
    RETURN json_build_object(
      'success', true,
      'message', 'Admin user created successfully',
      'user_id', new_user_id,
      'email', admin_email
    );
  END IF;
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Error creating admin user',
      'error', SQLERRM
    );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION create_admin_user TO authenticated;
GRANT EXECUTE ON FUNCTION create_admin_user TO service_role;

-- Instructions for manual creation:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User"
-- 3. Enter:
--    - Email: admin@wajba.bh
--    - Password: 12345678
--    - Auto Confirm: Yes
-- 4. Copy the User ID (UUID)
-- 5. Run this SQL to add to users table:

/*
INSERT INTO users (
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
) VALUES (
  'PASTE_USER_ID_HERE',  -- Replace with actual UUID from step 4
  'admin@wajba.bh',
  'Admin User',
  'admin',
  NOW(),
  NOW()
);
*/

-- Alternative: If you have Supabase CLI, run:
-- supabase auth users create admin@wajba.bh --password 12345678
-- Then run: SELECT create_admin_user('admin@wajba.bh', '12345678', 'Admin User');
