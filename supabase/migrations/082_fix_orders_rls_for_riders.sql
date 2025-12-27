-- Fix RLS policy on orders table to allow riders to update order status

-- Drop existing policies that might be blocking rider updates
DROP POLICY IF EXISTS "Riders can update assigned orders" ON orders;
DROP POLICY IF EXISTS "Riders can view assigned orders" ON orders;

-- Allow riders to view orders assigned to them
CREATE POLICY "Riders can view assigned orders"
ON orders FOR SELECT
TO authenticated
USING (
  rider_id IN (
    SELECT id FROM riders WHERE user_id = auth.uid()
  )
);

-- Allow riders to update orders assigned to them
CREATE POLICY "Riders can update assigned orders"
ON orders FOR UPDATE
TO authenticated
USING (
  rider_id IN (
    SELECT id FROM riders WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  rider_id IN (
    SELECT id FROM riders WHERE user_id = auth.uid()
  )
);

-- Verify the policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'orders' AND policyname LIKE '%Riders%';
