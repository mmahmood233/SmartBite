-- Admin RLS Policies
-- Allow admins to view and manage all users

-- Drop existing policies if any
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;

-- Allow admins to SELECT all users
-- Using auth.jwt() to avoid infinite recursion
CREATE POLICY "Admins can view all users"
ON users
FOR SELECT
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  OR
  auth.uid() = id
);

-- Allow admins to UPDATE all users
CREATE POLICY "Admins can update all users"
ON users
FOR UPDATE
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Allow admins to DELETE users
CREATE POLICY "Admins can delete users"
ON users
FOR DELETE
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Verify policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;
