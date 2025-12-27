-- Add 'out_for_delivery' to order_status enum if it doesn't exist
-- This status is used when rider has picked up the order and is heading to customer

DO $$ 
BEGIN
    -- Check if the value already exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'out_for_delivery' 
        AND enumtypid = (
            SELECT oid FROM pg_type WHERE typname = 'order_status'
        )
    ) THEN
        -- Add the new enum value
        ALTER TYPE order_status ADD VALUE 'out_for_delivery' AFTER 'ready_for_pickup';
    END IF;
END $$;

-- Update any orders that have delivery_status indicating they're out for delivery
-- but order status is still at an earlier stage
UPDATE orders
SET status = 'out_for_delivery'
WHERE delivery_status IN ('picked_up', 'heading_to_customer', 'arrived_at_customer')
AND status NOT IN ('out_for_delivery', 'delivered', 'cancelled');

-- Create index for faster queries on delivery_status
CREATE INDEX IF NOT EXISTS idx_orders_delivery_status ON orders(delivery_status);
CREATE INDEX IF NOT EXISTS idx_orders_status_rider_id ON orders(status, rider_id);
