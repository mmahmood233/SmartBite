-- Check the order_items table structure and foreign key

-- Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'order_items'
ORDER BY ordinal_position;

-- Check foreign key constraints
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'order_items'
AND tc.constraint_type = 'FOREIGN KEY';

-- Test direct query to see if items exist
SELECT 
  oi.id,
  oi.order_id,
  oi.dish_name,
  oi.quantity,
  o.order_number
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
WHERE o.user_id = '3acc0831-64f1-4342-93bf-3994912695c9'
LIMIT 5;
