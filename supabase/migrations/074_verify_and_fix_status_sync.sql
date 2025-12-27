-- First, check if out_for_delivery exists in enum
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'order_status')
ORDER BY enumsortorder;

-- Add out_for_delivery if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'out_for_delivery' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'order_status')
    ) THEN
        ALTER TYPE order_status ADD VALUE 'out_for_delivery';
    END IF;
END $$;

-- Check current order status for the specific order
SELECT 
    order_number,
    status,
    delivery_status,
    rider_id,
    updated_at
FROM orders 
WHERE order_number = 'WAJ99553';

-- Force update the order status to out_for_delivery if rider has picked up
UPDATE orders
SET 
    status = 'out_for_delivery',
    updated_at = NOW()
WHERE order_number = 'WAJ99553'
AND delivery_status = 'picked_up';

-- Check the result
SELECT 
    order_number,
    status,
    delivery_status,
    rider_id,
    updated_at
FROM orders 
WHERE order_number = 'WAJ99553';
