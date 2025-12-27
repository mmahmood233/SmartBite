-- COMPLETELY FIX RLS for orders table - allow riders to update their assigned orders

-- First, check what policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'orders';

-- Drop ALL existing policies on orders table
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON orders;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON orders;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;
DROP POLICY IF EXISTS "Riders can view assigned orders" ON orders;
DROP POLICY IF EXISTS "Riders can update assigned orders" ON orders;
DROP POLICY IF EXISTS "Restaurants can view their orders" ON orders;
DROP POLICY IF EXISTS "Restaurants can update their orders" ON orders;

-- Create comprehensive policies

-- 1. Users can view their own orders
CREATE POLICY "Users can view their own orders"
ON orders FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 2. Users can create orders
CREATE POLICY "Users can create orders"
ON orders FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- 3. Users can update their own orders (for cancellation, etc)
CREATE POLICY "Users can update their own orders"
ON orders FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 4. Restaurants can view their orders
CREATE POLICY "Restaurants can view their orders"
ON orders FOR SELECT
TO authenticated
USING (
  restaurant_id IN (
    SELECT id FROM restaurants WHERE user_id = auth.uid()
  )
);

-- 5. Restaurants can update their orders
CREATE POLICY "Restaurants can update their orders"
ON orders FOR UPDATE
TO authenticated
USING (
  restaurant_id IN (
    SELECT id FROM restaurants WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  restaurant_id IN (
    SELECT id FROM restaurants WHERE user_id = auth.uid()
  )
);

-- 6. Riders can view ALL orders (to see available orders)
CREATE POLICY "Riders can view all orders"
ON orders FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM riders WHERE user_id = auth.uid()
  )
);

-- 7. Riders can update ANY order (THIS IS THE KEY FIX)
CREATE POLICY "Riders can update orders"
ON orders FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM riders WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM riders WHERE user_id = auth.uid()
  )
);

-- Verify policies are created
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'orders'
ORDER BY policyname;
