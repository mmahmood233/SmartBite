-- Debug: Check what restaurant_id the orders actually have

-- 1. Show the Krispy Kreme restaurant ID
SELECT id, name FROM restaurants WHERE name = 'Krispy Kreme Bahrain';

-- 2. Show all orders and their restaurant IDs
SELECT 
  order_number,
  restaurant_id,
  (SELECT name FROM restaurants WHERE id = orders.restaurant_id) as restaurant_name,
  status,
  created_at
FROM orders
ORDER BY created_at DESC
LIMIT 10;

-- 3. Check if restaurant IDs match
SELECT 
  'Expected Restaurant ID' as label,
  id as value
FROM restaurants 
WHERE name = 'Krispy Kreme Bahrain'
UNION ALL
SELECT 
  'Actual Restaurant ID from orders' as label,
  restaurant_id as value
FROM orders
LIMIT 1;
