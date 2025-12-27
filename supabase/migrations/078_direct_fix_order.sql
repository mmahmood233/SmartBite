-- Direct fix - no subqueries, just hardcode everything

-- Step 1: Fix constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_delivery_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_delivery_status_check 
CHECK (delivery_status IN ('pending','assigned','rider_assigned','heading_to_restaurant','arrived_at_restaurant','picked_up','heading_to_customer','arrived_at_customer','delivered'));

-- Step 2: Get rider info
SELECT id, user_id, full_name FROM riders WHERE user_id = '823e35fb-9b15-4895-af56-b675946f4c51';

-- Step 3: If no rider found, create one
INSERT INTO riders (id, user_id, full_name, phone, vehicle_type, status, rating, total_deliveries, created_at, updated_at)
VALUES (
    '823e35fb-9b15-4895-af56-b675946f4c51',
    '823e35fb-9b15-4895-af56-b675946f4c51',
    'Ali',
    '12345678',
    'car',
    'busy',
    5.0,
    0,
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET status = 'busy', updated_at = NOW();

-- Step 4: Update order - SET STATUS TO READY_FOR_PICKUP (this is critical!)
UPDATE orders
SET 
    rider_id = '823e35fb-9b15-4895-af56-b675946f4c51',
    rider_assigned_at = NOW(),
    delivery_status = 'assigned',
    status = 'ready_for_pickup',  -- MUST be ready_for_pickup for pickup validation to pass
    updated_at = NOW()
WHERE order_number = 'WAJ99553';

-- Step 5: Create delivery
INSERT INTO deliveries (id, order_id, rider_id, status, earnings, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    id,
    '823e35fb-9b15-4895-af56-b675946f4c51',
    'assigned',
    0,
    NOW(),
    NOW()
FROM orders
WHERE order_number = 'WAJ99553'
ON CONFLICT (order_id) DO UPDATE SET
    rider_id = '823e35fb-9b15-4895-af56-b675946f4c51',
    status = 'assigned',
    updated_at = NOW();

-- Step 6: Verify
SELECT 
    o.order_number,
    o.status as order_status,
    o.delivery_status,
    o.rider_id,
    d.id as delivery_id,
    d.status as delivery_status,
    r.full_name as rider_name
FROM orders o
LEFT JOIN deliveries d ON d.order_id = o.id
LEFT JOIN riders r ON r.id = o.rider_id
WHERE o.order_number = 'WAJ99553';
