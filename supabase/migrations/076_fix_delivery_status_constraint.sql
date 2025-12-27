-- Check current delivery_status constraint
SELECT con.conname, pg_get_constraintdef(con.oid)
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'orders' AND con.conname LIKE '%delivery_status%';

-- Drop the old constraint if it exists
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_delivery_status_check;

-- Add new constraint with all valid delivery statuses
ALTER TABLE orders ADD CONSTRAINT orders_delivery_status_check 
CHECK (delivery_status IN (
    'pending',
    'assigned',
    'rider_assigned',
    'heading_to_restaurant',
    'arrived_at_restaurant', 
    'picked_up',
    'heading_to_customer',
    'arrived_at_customer',
    'delivered'
));

-- Now update the order
UPDATE orders
SET 
    rider_id = '823e35fb-9b15-4895-af56-b675946f4c51',
    rider_assigned_at = NOW(),
    delivery_status = 'assigned',
    status = 'ready_for_pickup',
    updated_at = NOW()
WHERE order_number = 'WAJ99553';

-- Create delivery record
INSERT INTO deliveries (order_id, rider_id, status, earnings, created_at, updated_at)
SELECT 
    id,
    '823e35fb-9b15-4895-af56-b675946f4c51',
    'assigned',
    0,
    NOW(),
    NOW()
FROM orders
WHERE order_number = 'WAJ99553'
ON CONFLICT (order_id) DO UPDATE SET
    rider_id = EXCLUDED.rider_id,
    status = EXCLUDED.status,
    updated_at = NOW();
