-- Fix RLS policies for deliveries table to allow INSERT

-- Drop existing policies if any
DROP POLICY IF EXISTS "Riders can insert deliveries" ON deliveries;
DROP POLICY IF EXISTS "Admins can insert deliveries" ON deliveries;

-- Allow riders to insert delivery records when accepting orders
-- Using rider_id directly (refers to the NEW row being inserted)
CREATE POLICY "Riders can insert deliveries"
ON deliveries FOR INSERT
WITH CHECK (
  rider_id IN (
    SELECT riders.id FROM riders
    WHERE riders.user_id = auth.uid()
  )
);

-- Allow admins to insert delivery records
CREATE POLICY "Admins can insert deliveries"
ON deliveries FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);
