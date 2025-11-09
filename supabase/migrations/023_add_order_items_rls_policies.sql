-- Migration 023: Add RLS policies for order_items table

-- Enable RLS (if not already enabled)
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Allow order items inserts" ON order_items;
DROP POLICY IF EXISTS "Partners can view restaurant order items" ON order_items;
DROP POLICY IF EXISTS "Riders can view assigned order items" ON order_items;

-- Policy: Users can view their own order items
CREATE POLICY "Users can view own order items"
ON order_items
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

-- Policy: Allow inserts for order items (when creating orders)
CREATE POLICY "Allow order items inserts"
ON order_items
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

-- Policy: Partners can view their restaurant's order items
CREATE POLICY "Partners can view restaurant order items"
ON order_items
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM orders o
    JOIN restaurants r ON o.restaurant_id = r.id
    WHERE o.id = order_items.order_id
    AND r.partner_id = auth.uid()
  )
);

-- Policy: Riders can view assigned order items
CREATE POLICY "Riders can view assigned order items"
ON order_items
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.rider_id = auth.uid()
  )
);
