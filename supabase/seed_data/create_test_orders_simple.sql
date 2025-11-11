-- Simple test orders for Krispy Kreme
-- This version uses hardcoded IDs from your database

-- First, let's get the IDs we need
DO $$
DECLARE
  v_restaurant_id uuid := 'a4c207a2-0ada-4cfa-a153-1033c4cd81c9'; -- Krispy Kreme ID from your logs
  v_customer_id uuid;
  v_address_id uuid;
  v_order_id uuid;
BEGIN
  -- Get any customer
  SELECT id INTO v_customer_id FROM users WHERE role = 'customer' LIMIT 1;
  
  IF v_customer_id IS NULL THEN
    RAISE EXCEPTION 'No customer found. Please sign up as a customer first.';
  END IF;
  
  RAISE NOTICE 'Using customer: %', v_customer_id;
  
  -- Get or create address
  SELECT id INTO v_address_id FROM user_addresses WHERE user_id = v_customer_id LIMIT 1;
  
  IF v_address_id IS NULL THEN
    INSERT INTO user_addresses (user_id, label, building, road, block, area, city, is_default)
    VALUES (v_customer_id, 'Home', 'Bldg 1', 'Road 1', 'Block 1', 'Juffair', 'Manama', true)
    RETURNING id INTO v_address_id;
  END IF;
  
  -- Order 1: Pending
  INSERT INTO orders (
    order_number, user_id, restaurant_id, delivery_address_id,
    status, subtotal, delivery_fee, discount_amount, total_amount,
    payment_method, payment_status, created_at, updated_at
  ) VALUES (
    'WAJ1001', v_customer_id, v_restaurant_id, v_address_id,
    'pending', 9.000, 0.500, 0.000, 9.500,
    'cash', 'pending', NOW(), NOW()
  ) RETURNING id INTO v_order_id;
  
  INSERT INTO order_items (order_id, dish_id, dish_name, quantity, unit_price, subtotal)
  SELECT v_order_id, id, name, 2, 4.500, 9.000
  FROM dishes WHERE restaurant_id = v_restaurant_id LIMIT 1;
  
  -- Order 2: Preparing
  INSERT INTO orders (
    order_number, user_id, restaurant_id, delivery_address_id,
    status, subtotal, delivery_fee, discount_amount, total_amount,
    payment_method, payment_status, created_at, updated_at
  ) VALUES (
    'WAJ1002', v_customer_id, v_restaurant_id, v_address_id,
    'preparing', 12.000, 0.500, 0.000, 12.500,
    'card', 'completed', NOW() - INTERVAL '10 minutes', NOW()
  ) RETURNING id INTO v_order_id;
  
  INSERT INTO order_items (order_id, dish_id, dish_name, quantity, unit_price, subtotal)
  SELECT v_order_id, id, name, 2, 6.000, 12.000
  FROM dishes WHERE restaurant_id = v_restaurant_id LIMIT 1;
  
  -- Order 3: Ready
  INSERT INTO orders (
    order_number, user_id, restaurant_id, delivery_address_id,
    status, subtotal, delivery_fee, discount_amount, total_amount,
    payment_method, payment_status, created_at, updated_at
  ) VALUES (
    'WAJ1003', v_customer_id, v_restaurant_id, v_address_id,
    'ready_for_pickup', 7.000, 0.500, 0.000, 7.500,
    'card', 'completed', NOW() - INTERVAL '20 minutes', NOW()
  ) RETURNING id INTO v_order_id;
  
  INSERT INTO order_items (order_id, dish_id, dish_name, quantity, unit_price, subtotal)
  SELECT v_order_id, id, name, 1, 7.000, 7.000
  FROM dishes WHERE restaurant_id = v_restaurant_id LIMIT 1;
  
  -- Order 4: Delivered
  INSERT INTO orders (
    order_number, user_id, restaurant_id, delivery_address_id,
    status, subtotal, delivery_fee, discount_amount, total_amount,
    payment_method, payment_status, created_at, updated_at
  ) VALUES (
    'WAJ1004', v_customer_id, v_restaurant_id, v_address_id,
    'delivered', 15.000, 0.500, 0.000, 15.500,
    'card', 'completed', NOW() - INTERVAL '1 hour', NOW()
  ) RETURNING id INTO v_order_id;
  
  INSERT INTO order_items (order_id, dish_id, dish_name, quantity, unit_price, subtotal)
  SELECT v_order_id, id, name, 3, 5.000, 15.000
  FROM dishes WHERE restaurant_id = v_restaurant_id LIMIT 1;
  
  RAISE NOTICE 'Created 4 test orders successfully!';
END $$;

-- Verify
SELECT 
  order_number,
  status,
  total_amount,
  TO_CHAR(created_at, 'HH12:MI AM') as time
FROM orders
WHERE restaurant_id = 'a4c207a2-0ada-4cfa-a153-1033c4cd81c9'
ORDER BY created_at DESC;
