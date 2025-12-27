-- Manually assign order WAJ99553 to rider for testing
-- This simulates what acceptOrder() should do

-- First, get the rider ID (assuming it's the one who tried to accept)
-- Replace with actual rider_id if different

-- Update the order with rider assignment
UPDATE orders
SET 
    rider_id = '823e35fb-9b15-4895-af56-b675946f4c51',  -- Ali's rider ID from earlier logs
    rider_assigned_at = NOW(),
    delivery_status = 'assigned',
    status = 'ready_for_pickup',  -- Keep as ready_for_pickup until picked up
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

-- Update rider status to busy
UPDATE riders
SET status = 'busy'
WHERE id = '823e35fb-9b15-4895-af56-b675946f4c51';

-- Verify the setup
SELECT 
    o.order_number,
    o.status as order_status,
    o.delivery_status,
    o.rider_id,
    d.id as delivery_id,
    d.status as delivery_status,
    r.full_name as rider_name,
    r.status as rider_status
FROM orders o
LEFT JOIN deliveries d ON d.order_id = o.id
LEFT JOIN riders r ON r.id = o.rider_id
WHERE o.order_number = 'WAJ99553';
