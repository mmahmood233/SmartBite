-- Clean up duplicate address data in orders table
-- The issue is that delivery_address contains duplicated text like "Building House 635, Building House 635"

-- Update orders to remove duplicate text patterns in delivery_address
UPDATE orders
SET delivery_address = REGEXP_REPLACE(
  delivery_address,
  '(Building [^,]+), \1',
  '\1',
  'g'
)
WHERE delivery_address LIKE '%Building%Building%';

UPDATE orders
SET delivery_address = REGEXP_REPLACE(
  delivery_address,
  '(Road [^,]+), \1',
  '\1',
  'g'
)
WHERE delivery_address LIKE '%Road%Road%';

UPDATE orders
SET delivery_address = REGEXP_REPLACE(
  delivery_address,
  '(Block [^,]+), \1',
  '\1',
  'g'
)
WHERE delivery_address LIKE '%Block%Block%';

-- Verify the cleanup
SELECT id, order_number, delivery_address
FROM orders
WHERE delivery_address IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;
