-- Simple KFC Order Seeding - Just Works™
-- Creates 20 realistic orders quickly

DO $$
DECLARE
  kfc_id UUID := '11111111-1111-1111-1111-111111111116';
  cust_id UUID;
  ord_id UUID;
  i INT;
BEGIN
  -- Get customer
  SELECT id INTO cust_id FROM users WHERE role = 'customer' LIMIT 1;
  
  -- Create 20 orders
  FOR i IN 1..20 LOOP
    ord_id := gen_random_uuid();
    
    -- Insert order
    INSERT INTO orders (id, user_id, restaurant_id, status, subtotal, delivery_fee, total_amount, delivery_address, delivery_phone, payment_method, created_at)
    VALUES (
      ord_id, cust_id, kfc_id,
      (ARRAY['pending', 'confirmed', 'preparing', 'delivered', 'delivered', 'delivered'])[floor(random() * 6 + 1)]::order_status,
      (5 + random() * 20)::numeric(10,2),
      1.50,
      (6.50 + random() * 20)::numeric(10,2),
      'Test Address ' || i,
      '+973 3333 ' || lpad(i::text, 4, '0'),
      (ARRAY['card', 'cash', 'benefitpay'])[floor(random() * 3 + 1)]::payment_method,
      NOW() - (random() * INTERVAL '60 days')
    );
    
    -- Insert 1-3 random items per order
    INSERT INTO order_items (order_id, dish_id, dish_name, quantity, unit_price, subtotal)
    SELECT 
      ord_id,
      d.id,
      d.name,
      (1 + floor(random() * 3))::int,
      d.price,
      d.price * (1 + floor(random() * 3))
    FROM dishes d
    WHERE d.restaurant_id = kfc_id
    ORDER BY random()
    LIMIT (1 + floor(random() * 3))::int;
    
  END LOOP;
  
  RAISE NOTICE '✅ Created 20 KFC orders!';
END $$;

-- Show results
SELECT status, COUNT(*) as count, SUM(total_amount) as revenue
FROM orders
WHERE restaurant_id = '11111111-1111-1111-1111-111111111116'
GROUP BY status;
