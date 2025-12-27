-- Backfill delivery_address_id for orders that only have delivery_address text
-- This helps existing orders show customer addresses correctly

-- For orders with delivery_phone but no delivery_address_id,
-- try to find a matching address in user_addresses by phone
UPDATE orders o
SET delivery_address_id = ua.id
FROM user_addresses ua
WHERE o.delivery_address_id IS NULL
  AND o.delivery_phone IS NOT NULL
  AND ua.phone = o.delivery_phone
  AND ua.user_id = o.user_id
  AND ua.is_default = true;

-- Log how many orders were updated
DO $$
DECLARE
  updated_count INTEGER;
BEGIN
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RAISE NOTICE 'Updated % orders with delivery_address_id', updated_count;
END $$;
