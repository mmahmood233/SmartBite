-- Fix missing user in users table and check order items

-- First, check if user exists in auth.users but not in users table
-- and insert them if missing
INSERT INTO users (id, email, full_name, phone, role, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', 'Customer'),
  COALESCE(au.raw_user_meta_data->>'phone', au.phone),
  COALESCE((au.raw_user_meta_data->>'role')::user_role, 'customer'::user_role),
  au.created_at,
  NOW()
FROM auth.users au
WHERE au.id = '3acc0831-64f1-4342-93bf-3994912695c9'
AND NOT EXISTS (
  SELECT 1 FROM users u WHERE u.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- Check order_items for the active order
SELECT 
  o.id as order_id,
  o.order_number,
  COUNT(oi.id) as items_count,
  json_agg(json_build_object(
    'id', oi.id,
    'dish_name', oi.dish_name,
    'quantity', oi.quantity
  )) as items
FROM orders o
LEFT JOIN order_items oi ON oi.order_id = o.id
WHERE o.user_id = '3acc0831-64f1-4342-93bf-3994912695c9'
AND o.status IN ('confirmed', 'preparing', 'ready_for_pickup')
GROUP BY o.id, o.order_number;
