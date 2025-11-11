-- Create a new test order for Krispy Kreme
-- Run this to test real-time updates!

DO $$
DECLARE
  v_restaurant_id uuid := 'a4c207a2-0ada-4cfa-a153-1033c4cd81c9'; -- Krispy Kreme
  v_customer_id uuid;
  v_address_id uuid;
  v_order_id uuid;
BEGIN
  -- Get customer
  SELECT id INTO v_customer_id FROM users WHERE role = 'customer' LIMIT 1;
  
  -- Get address
  SELECT id INTO v_address_id FROM user_addresses WHERE user_id = v_customer_id LIMIT 1;
  
  -- Create NEW pending order
  INSERT INTO orders (
    order_number, user_id, restaurant_id, delivery_address_id,
    status, subtotal, delivery_fee, discount_amount, total_amount,
    payment_method, payment_status, delivery_notes, created_at, updated_at
  ) VALUES (
    'WAJ' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
    v_customer_id, v_restaurant_id, v_address_id,
    'pending', 15.000, 0.500, 0.000, 15.500,
    'cash', 'pending', 'Please call when you arrive', NOW(), NOW()
  ) RETURNING id INTO v_order_id;
  
  -- Add order items
  INSERT INTO order_items (order_id, dish_id, dish_name, quantity, unit_price, subtotal)
  SELECT v_order_id, id, name, 3, 5.000, 15.000
  FROM dishes WHERE restaurant_id = v_restaurant_id LIMIT 1;
  
  RAISE NOTICE '✅ New order created! Order ID: %', v_order_id;
  RAISE NOTICE '🔔 Check your partner app - it should appear instantly!';
END $$;

-- Show the new order
SELECT 
  order_number,
  status,
  total_amount,
  TO_CHAR(created_at, 'HH12:MI:SS AM') as time,
  delivery_notes
FROM orders
WHERE restaurant_id = 'a4c207a2-0ada-4cfa-a153-1033c4cd81c9'
  AND status = 'pending'
ORDER BY created_at DESC
LIMIT 1;
