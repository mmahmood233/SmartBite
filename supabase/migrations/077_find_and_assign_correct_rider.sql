-- Find the correct rider ID
SELECT id, user_id, full_name, phone, status 
FROM riders 
LIMIT 10;

-- Check if the user exists in riders table
SELECT r.id, r.user_id, r.full_name, u.email
FROM riders r
JOIN auth.users u ON u.id = r.user_id
WHERE u.email = 'ali@wajba.bh';

-- If rider doesn't exist, create it
INSERT INTO riders (user_id, full_name, phone, vehicle_type, status, rating, total_deliveries)
SELECT 
    id,
    COALESCE(raw_user_meta_data->>'full_name', 'Ali'),
    COALESCE(raw_user_meta_data->>'phone', phone, '12345678'),
    'car',
    'online',
    5.0,
    0
FROM auth.users
WHERE email = 'ali@wajba.bh'
ON CONFLICT (user_id) DO NOTHING;

-- Get the rider ID
SELECT id FROM riders WHERE user_id = (SELECT id FROM auth.users WHERE email = 'ali@wajba.bh');

-- Now update the order with correct rider_id
UPDATE orders
SET 
    rider_id = (SELECT id FROM riders WHERE user_id = (SELECT id FROM auth.users WHERE email = 'ali@wajba.bh')),
    rider_assigned_at = NOW(),
    delivery_status = 'assigned',
    status = 'ready_for_pickup',
    updated_at = NOW()
WHERE order_number = 'WAJ99553';

-- Create delivery record with correct rider_id
INSERT INTO deliveries (order_id, rider_id, status, earnings, created_at, updated_at)
SELECT 
    o.id,
    r.id,
    'assigned',
    0,
    NOW(),
    NOW()
FROM orders o
CROSS JOIN riders r
WHERE o.order_number = 'WAJ99553'
AND r.user_id = (SELECT id FROM auth.users WHERE email = 'ali@wajba.bh')
ON CONFLICT (order_id) DO UPDATE SET
    rider_id = EXCLUDED.rider_id,
    status = EXCLUDED.status,
    updated_at = NOW();

-- Update rider status to busy
UPDATE riders
SET status = 'busy'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'ali@wajba.bh');

-- Verify
SELECT 
    o.order_number,
    o.status,
    o.delivery_status,
    r.full_name as rider_name,
    r.status as rider_status,
    d.status as delivery_status
FROM orders o
LEFT JOIN riders r ON r.id = o.rider_id
LEFT JOIN deliveries d ON d.order_id = o.id
WHERE o.order_number = 'WAJ99553';
