-- FORCE FIX - Check and update everything

-- 1. Check current state
SELECT order_number, status, delivery_status, rider_id 
FROM orders 
WHERE order_number = 'WAJ99553';

-- 2. Fix constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_delivery_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_delivery_status_check 
CHECK (delivery_status IS NULL OR delivery_status IN ('pending','assigned','rider_assigned','heading_to_restaurant','arrived_at_restaurant','picked_up','heading_to_customer','arrived_at_customer','delivered'));

-- 3. FORCE update order status to ready_for_pickup
UPDATE orders
SET status = 'ready_for_pickup'
WHERE order_number = 'WAJ99553';

-- 4. Check result
SELECT order_number, status, delivery_status, rider_id 
FROM orders 
WHERE order_number = 'WAJ99553';
