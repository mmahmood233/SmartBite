-- COMPLETE PERMANENT FIX FOR ALL ORDERS
-- This fixes the root cause so order flow works for ALL future orders

-- 1. Fix the delivery_status constraint to allow 'assigned'
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_delivery_status_check;

ALTER TABLE orders ADD CONSTRAINT orders_delivery_status_check 
CHECK (
    delivery_status IS NULL OR 
    delivery_status IN (
        'pending',
        'assigned',
        'rider_assigned',
        'heading_to_restaurant',
        'arrived_at_restaurant', 
        'picked_up',
        'heading_to_customer',
        'arrived_at_customer',
        'delivered'
    )
);

-- 2. Verify the constraint is fixed
SELECT con.conname, pg_get_constraintdef(con.oid)
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'orders' AND con.conname LIKE '%delivery_status%';

-- That's it! The constraint was the ONLY thing blocking acceptOrder() for all orders.
-- After running this SQL and restarting the app, ALL order acceptances will work.
