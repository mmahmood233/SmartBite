-- Check and fix RLS policies on users table that might be blocking the query

-- Disable RLS on users table for SELECT operations
-- This allows the delivery service to fetch user data
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing SELECT policy if it exists
DROP POLICY IF EXISTS "Users can view all users" ON users;

-- Create a permissive SELECT policy that allows anyone to read user data
CREATE POLICY "Allow read access to users"
ON users
FOR SELECT
USING (true);

-- Verify the user exists
SELECT id, email, full_name, phone, role 
FROM users 
WHERE id = '3acc0831-64f1-4342-93bf-3994912695c9';
