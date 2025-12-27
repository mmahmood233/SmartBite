-- Fix RLS policies for riders table to allow user creation by admin

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own rider profile" ON riders;
DROP POLICY IF EXISTS "Users can update their own rider profile" ON riders;
DROP POLICY IF EXISTS "Users can insert their own rider profile" ON riders;

-- Allow users to insert their own rider profile
CREATE POLICY "Users can insert their own rider profile"
ON riders FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own rider profile
CREATE POLICY "Users can view their own rider profile"
ON riders FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to update their own rider profile
CREATE POLICY "Users can update their own rider profile"
ON riders FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow admins to view all rider profiles
CREATE POLICY "Admins can view all rider profiles"
ON riders FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Allow admins to update all rider profiles
CREATE POLICY "Admins can update all rider profiles"
ON riders FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);
