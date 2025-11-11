-- Test Orders for Krispy Kreme Bahrain
-- Run this to create sample orders for testing the partner dashboard

-- First, get the IDs we need
DO $$
DECLARE
  v_restaurant_id uuid;
  v_customer_id uuid;
  v_address_id uuid;
  v_order_id uuid;
  v_dish_id uuid;
BEGIN
  -- Get Krispy Kreme restaurant ID
  SELECT id INTO v_restaurant_id FROM restaurants WHERE name = 'Krispy Kreme Bahrain';
  
  -- Get a customer user (use existing customer or first available)
  SELECT id INTO v_customer_id FROM users WHERE role = 'customer' LIMIT 1;
  
  IF v_customer_id IS NULL THEN
    RAISE EXCEPTION 'No customer users found. Please create a customer account first by signing up in the app.';
  END IF;
  
  -- Get or create customer address
  SELECT id INTO v_address_id FROM user_addresses WHERE user_id = v_customer_id LIMIT 1;
  
  IF v_address_id IS NULL THEN
    INSERT INTO user_addresses (user_id, label, building, road, block, area, city, contact_number, is_default, created_at, updated_at)
    VALUES (v_customer_id, 'Home', 'Building 123', 'Road 45', 'Block 678', 'Juffair', 'Manama', '+973 3333 3333', true, NOW(), NOW())
    RETURNING id INTO v_address_id;
  END IF;
  
  -- Create Order 1: New/Pending Order
  INSERT INTO orders (
    order_number, user_id, restaurant_id, delivery_address_id, 
    status, subtotal, delivery_fee, discount_amount, total_amount,
    payment_method, payment_status, delivery_notes, created_at, updated_at
  ) VALUES (
    'WAJ' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
    v_customer_id, v_restaurant_id, v_address_id,
    'pending', 8.500, 0.500, 0.000, 9.000,
    'cash', 'pending', 'Please ring the doorbell', NOW() - INTERVAL '5 minutes', NOW()
  ) RETURNING id INTO v_order_id;
  
  -- Add items to Order 1
  SELECT id INTO v_dish_id FROM dishes WHERE restaurant_id = v_restaurant_id AND name ILIKE '%original glazed%' LIMIT 1;
  IF v_dish_id IS NOT NULL THEN
    INSERT INTO order_items (order_id, dish_id, dish_name, quantity, unit_price, subtotal, created_at)
    VALUES (v_order_id, v_dish_id, 'Original Glazed Dozen', 1, 4.500, 4.500, NOW());
  END IF;
  
  SELECT id INTO v_dish_id FROM dishes WHERE restaurant_id = v_restaurant_id AND name ILIKE '%chocolate%' LIMIT 1;
  IF v_dish_id IS NOT NULL THEN
    INSERT INTO order_items (order_id, dish_id, dish_name, quantity, unit_price, subtotal, created_at)
    VALUES (v_order_id, v_dish_id, 'Chocolate Iced Glazed', 1, 4.000, 4.000, NOW());
  END IF;
  
  -- Create Order 2: Preparing
  INSERT INTO orders (
    order_number, user_id, restaurant_id, delivery_address_id, 
    status, subtotal, delivery_fee, discount_amount, total_amount,
    payment_method, payment_status, estimated_delivery_time, created_at, updated_at
  ) VALUES (
    'WAJ' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
    v_customer_id, v_restaurant_id, v_address_id,
    'preparing', 12.000, 0.500, 0.000, 12.500,
    'card', 'completed', NOW() + INTERVAL '25 minutes', NOW() - INTERVAL '10 minutes', NOW()
  ) RETURNING id INTO v_order_id;
  
  SELECT id INTO v_dish_id FROM dishes WHERE restaurant_id = v_restaurant_id LIMIT 1 OFFSET 2;
  IF v_dish_id IS NOT NULL THEN
    INSERT INTO order_items (order_id, dish_id, dish_name, quantity, unit_price, subtotal, created_at)
    VALUES (v_order_id, v_dish_id, 'Assorted Dozen', 2, 6.000, 12.000, NOW());
  END IF;
  
  -- Create Order 3: Ready for Pickup
  INSERT INTO orders (
    order_number, user_id, restaurant_id, delivery_address_id, 
    status, subtotal, delivery_fee, discount_amount, total_amount,
    payment_method, payment_status, estimated_delivery_time, created_at, updated_at
  ) VALUES (
    'WAJ' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
    v_customer_id, v_restaurant_id, v_address_id,
    'ready_for_pickup', 6.500, 0.500, 0.000, 7.000,
    'card', 'completed', NOW() + INTERVAL '15 minutes', NOW() - INTERVAL '20 minutes', NOW()
  ) RETURNING id INTO v_order_id;
  
  SELECT id INTO v_dish_id FROM dishes WHERE restaurant_id = v_restaurant_id LIMIT 1;
  IF v_dish_id IS NOT NULL THEN
    INSERT INTO order_items (order_id, dish_id, dish_name, quantity, unit_price, subtotal, special_request, created_at)
    VALUES (v_order_id, v_dish_id, 'Original Glazed Half Dozen', 1, 6.500, 6.500, 'Extra napkins please', NOW());
  END IF;
  
  -- Create Order 4: Completed (Today)
  INSERT INTO orders (
    order_number, user_id, restaurant_id, delivery_address_id, 
    status, subtotal, delivery_fee, discount_amount, total_amount,
    payment_method, payment_status, estimated_delivery_time, actual_delivery_time, created_at, updated_at
  ) VALUES (
    'WAJ' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
    v_customer_id, v_restaurant_id, v_address_id,
    'delivered', 15.000, 0.500, 0.000, 15.500,
    'card', 'completed', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '5 minutes', NOW() - INTERVAL '1 hour', NOW()
  ) RETURNING id INTO v_order_id;
  
  SELECT id INTO v_dish_id FROM dishes WHERE restaurant_id = v_restaurant_id LIMIT 1 OFFSET 1;
  IF v_dish_id IS NOT NULL THEN
    INSERT INTO order_items (order_id, dish_id, dish_name, quantity, unit_price, subtotal, created_at)
    VALUES (v_order_id, v_dish_id, 'Chocolate Iced Dozen', 2, 7.500, 15.000, NOW());
  END IF;
  
  -- Create Order 5: Completed (Today)
  INSERT INTO orders (
    order_number, user_id, restaurant_id, delivery_address_id, 
    status, subtotal, delivery_fee, discount_amount, total_amount,
    payment_method, payment_status, estimated_delivery_time, actual_delivery_time, created_at, updated_at
  ) VALUES (
    'WAJ' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
    v_customer_id, v_restaurant_id, v_address_id,
    'delivered', 10.000, 0.500, 0.000, 10.500,
    'cash', 'completed', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour 30 minutes', NOW() - INTERVAL '2 hours 30 minutes', NOW()
  ) RETURNING id INTO v_order_id;
  
  SELECT id INTO v_dish_id FROM dishes WHERE restaurant_id = v_restaurant_id LIMIT 1;
  IF v_dish_id IS NOT NULL THEN
    INSERT INTO order_items (order_id, dish_id, dish_name, quantity, unit_price, subtotal, created_at)
    VALUES (v_order_id, v_dish_id, 'Original Glazed Dozen', 2, 5.000, 10.000, NOW());
  END IF;
  
  -- Create Order 6: Cancelled (Today)
  INSERT INTO orders (
    order_number, user_id, restaurant_id, delivery_address_id, 
    status, subtotal, delivery_fee, discount_amount, total_amount,
    payment_method, payment_status, delivery_notes, created_at, updated_at
  ) VALUES (
    'WAJ' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
    v_customer_id, v_restaurant_id, v_address_id,
    'cancelled', 8.000, 0.500, 0.000, 8.500,
    'card', 'refunded', 'Order cancelled by restaurant - Out of stock', NOW() - INTERVAL '3 hours', NOW()
  ) RETURNING id INTO v_order_id;
  
  SELECT id INTO v_dish_id FROM dishes WHERE restaurant_id = v_restaurant_id LIMIT 1 OFFSET 3;
  IF v_dish_id IS NOT NULL THEN
    INSERT INTO order_items (order_id, dish_id, dish_name, quantity, unit_price, subtotal, created_at)
    VALUES (v_order_id, v_dish_id, 'Strawberry Filled', 2, 4.000, 8.000, NOW());
  END IF;
  
  RAISE NOTICE 'Successfully created 6 test orders for Krispy Kreme Bahrain!';
  RAISE NOTICE 'Order statuses: 1 Pending, 1 Preparing, 1 Ready, 2 Completed, 1 Cancelled';
  
END $$;

-- Verify the orders were created
SELECT 
  order_number,
  status,
  total_amount,
  TO_CHAR(created_at, 'HH12:MI AM') as time,
  (SELECT COUNT(*) FROM order_items WHERE order_id = orders.id) as items_count
FROM orders
WHERE restaurant_id = (SELECT id FROM restaurants WHERE name = 'Krispy Kreme Bahrain')
ORDER BY created_at DESC;
