-- Add foreign key relationship between orders and user_addresses

-- First, set any invalid delivery_address_id to NULL
UPDATE orders
SET delivery_address_id = NULL
WHERE delivery_address_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM user_addresses WHERE id = orders.delivery_address_id);

-- Add foreign key constraint
ALTER TABLE orders
DROP CONSTRAINT IF EXISTS orders_delivery_address_id_fkey;

ALTER TABLE orders
ADD CONSTRAINT orders_delivery_address_id_fkey
FOREIGN KEY (delivery_address_id)
REFERENCES user_addresses(id)
ON DELETE SET NULL;

-- Make delivery_address_id nullable if it isn't already
ALTER TABLE orders
ALTER COLUMN delivery_address_id DROP NOT NULL;
