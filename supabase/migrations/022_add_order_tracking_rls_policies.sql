-- Migration 022: Add RLS policies for order_tracking table

-- Enable RLS (if not already enabled)
ALTER TABLE order_tracking ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own order tracking
CREATE POLICY "Users can view own order tracking"
ON order_tracking
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_tracking.order_id
    AND orders.user_id = auth.uid()
  )
);

-- Policy: Allow inserts for order tracking (triggered automatically)
-- This allows the trigger function to insert tracking records
CREATE POLICY "Allow order tracking inserts"
ON order_tracking
FOR INSERT
WITH CHECK (true);

-- Policy: Partners can view their restaurant's order tracking
CREATE POLICY "Partners can view restaurant order tracking"
ON order_tracking
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM orders o
    JOIN restaurants r ON o.restaurant_id = r.id
    WHERE o.id = order_tracking.order_id
    AND r.partner_id = auth.uid()
  )
);

-- Policy: Partners can update their restaurant's order tracking
CREATE POLICY "Partners can update restaurant order tracking"
ON order_tracking
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM orders o
    JOIN restaurants r ON o.restaurant_id = r.id
    WHERE o.id = order_tracking.order_id
    AND r.partner_id = auth.uid()
  )
);

-- Policy: Riders can view assigned order tracking
CREATE POLICY "Riders can view assigned order tracking"
ON order_tracking
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_tracking.order_id
    AND orders.rider_id = auth.uid()
  )
);

-- Policy: Riders can update assigned order tracking
CREATE POLICY "Riders can update assigned order tracking"
ON order_tracking
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_tracking.order_id
    AND orders.rider_id = auth.uid()
  )
);
