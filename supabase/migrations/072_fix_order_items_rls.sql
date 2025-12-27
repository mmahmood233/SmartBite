-- Fix RLS policy on order_items table to allow reading items

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow read access to order_items" ON order_items;

-- Create permissive SELECT policy for order_items
CREATE POLICY "Allow read access to order_items"
ON order_items
FOR SELECT
USING (true);
