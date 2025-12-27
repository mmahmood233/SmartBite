-- PERMANENT FIX: Update delivery_status constraint to allow all valid statuses

-- Drop the old constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_delivery_status_check;

-- Add new constraint with ALL valid delivery statuses
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

-- Verify the constraint
SELECT con.conname, pg_get_constraintdef(con.oid)
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'orders' AND con.conname LIKE '%delivery_status%';
