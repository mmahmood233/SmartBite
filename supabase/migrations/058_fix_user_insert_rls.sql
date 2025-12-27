-- Fix RLS policy to allow trigger to insert users

-- Add policy to allow service role to insert users (for the trigger)
DROP POLICY IF EXISTS "Service role can insert users" ON users;
CREATE POLICY "Service role can insert users"
ON users FOR INSERT
WITH CHECK (true);

-- Also ensure the trigger function has proper permissions
-- Recreate the trigger function with SECURITY DEFINER
CREATE OR REPLACE FUNCTION handle_new_auth_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
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
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the auth signup
    RAISE WARNING 'Error in handle_new_auth_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
