-- Check which orders have items and which don't

-- Find orders with items
SELECT 
  o.id,
  o.order_number,
  o.status,
  o.user_id,
  COUNT(oi.id) as items_count
FROM orders o
LEFT JOIN order_items oi ON oi.order_id = o.id
WHERE o.status IN ('confirmed', 'preparing', 'ready_for_pickup')
GROUP BY o.id, o.order_number, o.status, o.user_id
ORDER BY o.created_at DESC
LIMIT 10;

-- Check the specific order
SELECT 
  o.id as order_id,
  o.order_number,
  o.user_id,
  COUNT(oi.id) as items_count,
  json_agg(
    json_build_object(
      'id', oi.id,
      'dish_name', oi.dish_name,
      'quantity', oi.quantity
    )
  ) FILTER (WHERE oi.id IS NOT NULL) as items
FROM orders o
LEFT JOIN order_items oi ON oi.order_id = o.id
WHERE o.user_id = '3acc0831-64f1-4342-93bf-3994912695c9'
AND o.status IN ('confirmed', 'preparing', 'ready_for_pickup')
GROUP BY o.id, o.order_number, o.user_id;
