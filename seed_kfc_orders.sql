-- Seed KFC Orders with Realistic Data
-- 60+ orders with various statuses, dates, and combinations
-- Restaurant ID: 11111111-1111-1111-1111-111111111116 (KFC Juffair)

-- First, let's get some customer IDs (we'll use existing customers)
-- If you don't have customers, we'll create a few test ones

DO $$
DECLARE
  kfc_restaurant_id UUID := '11111111-1111-1111-1111-111111111116';
  customer_id UUID;
  order_id UUID;
  order_date TIMESTAMP;
  order_status order_status;
  base_date TIMESTAMP := NOW() - INTERVAL '90 days';
  
BEGIN
  -- Get the first customer from users table
  SELECT id INTO customer_id FROM users WHERE role = 'customer' LIMIT 1;
  
  IF customer_id IS NULL THEN
    RAISE EXCEPTION 'No customer found. Please create at least one customer user first.';
  END IF;
  
  RAISE NOTICE 'Using customer ID: %', customer_id;
  
  -- Create 60 orders with various combinations
  FOR i IN 1..60 LOOP
    
    -- Random date in last 90 days
    order_date := base_date + (random() * INTERVAL '90 days');
    
    -- Random status based on date (older orders more likely delivered)
    IF order_date < NOW() - INTERVAL '30 days' THEN
      order_status := CASE floor(random() * 10)::int
        WHEN 0 THEN 'cancelled'
        ELSE 'delivered'
      END;
    ELSIF order_date < NOW() - INTERVAL '7 days' THEN
      order_status := CASE floor(random() * 8)::int
        WHEN 0 THEN 'cancelled'
        ELSE 'delivered'
      END;
    ELSIF order_date < NOW() - INTERVAL '1 day' THEN
      order_status := CASE floor(random() * 6)::int
        WHEN 0 THEN 'cancelled'
        WHEN 1 THEN 'pending'
        ELSE 'delivered'
      END;
    ELSE
      order_status := CASE floor(random() * 6)::int
        WHEN 0 THEN 'pending'
        WHEN 1 THEN 'confirmed'
        WHEN 2 THEN 'preparing'
        WHEN 3 THEN 'ready_for_pickup'
        WHEN 4 THEN 'out_for_delivery'
        ELSE 'delivered'
      END;
    END IF;
    
    order_id := gen_random_uuid();
    
    -- Order 1-5: Family Buckets with sides
    IF i <= 5 THEN
      INSERT INTO orders (id, user_id, restaurant_id, status, subtotal, delivery_fee, total_amount, delivery_address, delivery_phone, payment_method, created_at, updated_at)
      VALUES (
        order_id, customer_id, kfc_restaurant_id, order_status,
        13.80, 1.50, 15.30,
        'Building 123, Road 456, Manama', '+973 3333 4444',
        (CASE floor(random() * 3)::int WHEN 0 THEN 'card' WHEN 1 THEN 'cash' ELSE 'benefitpay' END)::payment_method,
        order_date, order_date
      );
      
      INSERT INTO order_items (order_id, dish_id, dish_name, quantity, unit_price, subtotal, special_request)
      SELECT order_id, d.id, d.name, q.quantity, d.price, d.price * q.quantity, q.special_request
      FROM (VALUES
        ('33333333-3333-3333-3333-333333333453', 1, NULL),
        ('33333333-3333-3333-3333-333333333456', 2, NULL),
        ('33333333-3333-3333-3333-333333333457', 2, NULL),
        ('33333333-3333-3333-3333-333333333458', 3, NULL)
      ) AS q(dish_id, quantity, special_request)
      JOIN dishes d ON d.id = q.dish_id::uuid;
    
    -- Order 6-10: Individual Meals
    ELSIF i <= 10 THEN
      INSERT INTO orders (id, user_id, restaurant_id, status, subtotal, delivery_fee, total_amount, delivery_address, delivery_phone, payment_method, created_at, updated_at)
      VALUES (
        order_id, customer_id, kfc_restaurant_id, order_status,
        4.50, 1.50, 6.00,
        'Flat 45, Building 789, Juffair', '+973 3333 5555',
        (CASE floor(random() * 3)::int WHEN 0 THEN 'card' WHEN 1 THEN 'cash' ELSE 'benefitpay' END)::payment_method,
        order_date, order_date
      );
      
      INSERT INTO order_items (order_id, dish_id, quantity, special_instructions)
      VALUES 
        (order_id, '33333333-3333-3333-3333-33333333345c', 1, 'Extra spicy please'), -- 2-pc Meal
        (order_id, '33333333-3333-3333-3333-333333333458', 1, NULL), -- Pepsi
        (order_id, '33333333-3333-3333-3333-33333333345a', 1, NULL); -- Chocolate Sundae
    
    -- Order 11-20: Burgers & Sandwiches
    ELSIF i <= 20 THEN
      INSERT INTO orders (id, user_id, restaurant_id, status, subtotal, delivery_fee, total_amount, delivery_address, delivery_phone, payment_method, created_at, updated_at)
      VALUES (
        order_id, customer_id, kfc_restaurant_id, order_status,
        CASE floor(random() * 3)::int 
          WHEN 0 THEN 5.80
          WHEN 1 THEN 7.20
          ELSE 4.50
        END,
        1.50,
        CASE floor(random() * 3)::int 
          WHEN 0 THEN 7.30
          WHEN 1 THEN 8.70
          ELSE 6.00
        END,
        'Villa 22, Amwaj Islands', '+973 3333 6666',
        (CASE floor(random() * 3)::int WHEN 0 THEN 'card' WHEN 1 THEN 'cash' ELSE 'benefitpay' END)::payment_method,
        order_date, order_date
      );
      
      -- Random burger combo
      IF random() < 0.5 THEN
        INSERT INTO order_items (order_id, dish_id, quantity, special_instructions)
        VALUES 
          (order_id, '33333333-3333-3333-3333-333333333451', 2, 'No lettuce'), -- Zinger x2
          (order_id, '33333333-3333-3333-3333-333333333456', 1, NULL), -- Fries
          (order_id, '33333333-3333-3333-3333-333333333462', 2, NULL); -- 7Up x2
      ELSE
        INSERT INTO order_items (order_id, dish_id, quantity, special_instructions)
        VALUES 
          (order_id, '33333333-3333-3333-3333-333333333460', 2, NULL), -- Spicy Twister x2
          (order_id, '33333333-3333-3333-3333-33333333345d', 1, NULL), -- Popcorn Chicken
          (order_id, '33333333-3333-3333-3333-333333333459', 1, NULL); -- Mojito
      END IF;
    
    -- Order 21-30: Hot & Spicy Buckets
    ELSIF i <= 30 THEN
      INSERT INTO orders (id, user_id, restaurant_id, status, subtotal, delivery_fee, total_amount, delivery_address, delivery_phone, payment_method, created_at, updated_at)
      VALUES (
        order_id, customer_id, kfc_restaurant_id, order_status,
        10.20, 1.50, 11.70,
        'Office 301, Seef District', '+973 3333 7777',
        (CASE floor(random() * 3)::int WHEN 0 THEN 'card' WHEN 1 THEN 'cash' ELSE 'benefitpay' END)::payment_method,
        order_date, order_date
      );
      
      INSERT INTO order_items (order_id, dish_id, quantity, special_instructions)
      VALUES 
        (order_id, '33333333-3333-3333-3333-333333333454', 1, 'Extra hot sauce'), -- Hot & Spicy Bucket
        (order_id, '33333333-3333-3333-3333-333333333456', 2, NULL), -- Fries x2
        (order_id, '33333333-3333-3333-3333-33333333345e', 3, NULL), -- Garlic Dip x3
        (order_id, '33333333-3333-3333-3333-333333333458', 2, NULL); -- Pepsi x2
    
    -- Order 31-40: Mixed orders
    ELSIF i <= 40 THEN
      INSERT INTO orders (id, user_id, restaurant_id, status, subtotal, delivery_fee, total_amount, delivery_address, delivery_phone, payment_method, created_at, updated_at)
      VALUES (
        order_id, customer_id, kfc_restaurant_id, order_status,
        8.90, 1.50, 10.40,
        'Apartment 12B, Adliya', '+973 3333 8888',
        (CASE floor(random() * 3)::int WHEN 0 THEN 'card' WHEN 1 THEN 'cash' ELSE 'benefitpay' END)::payment_method,
        order_date, order_date
      );
      
      INSERT INTO order_items (order_id, dish_id, quantity, special_instructions)
      VALUES 
        (order_id, '33333333-3333-3333-3333-333333333455', 1, NULL), -- 3-pc Meal
        (order_id, '33333333-3333-3333-3333-333333333451', 1, NULL), -- Zinger
        (order_id, '33333333-3333-3333-3333-333333333461', 1, NULL), -- Tenders
        (order_id, '33333333-3333-3333-3333-333333333464', 1, NULL); -- Cheesecake
    
    -- Order 41-50: Quick snacks
    ELSIF i <= 50 THEN
      INSERT INTO orders (id, user_id, restaurant_id, status, subtotal, delivery_fee, total_amount, delivery_address, delivery_phone, payment_method, created_at, updated_at)
      VALUES (
        order_id, customer_id, kfc_restaurant_id, order_status,
        4.20, 1.50, 5.70,
        'Building 555, Riffa', '+973 3333 9999',
        (CASE floor(random() * 3)::int WHEN 0 THEN 'card' WHEN 1 THEN 'cash' ELSE 'benefitpay' END)::payment_method,
        order_date, order_date
      );
      
      INSERT INTO order_items (order_id, dish_id, quantity, special_instructions)
      VALUES 
        (order_id, '33333333-3333-3333-3333-33333333345d', 1, NULL), -- Popcorn Chicken
        (order_id, '33333333-3333-3333-3333-333333333461', 1, NULL), -- Tenders
        (order_id, '33333333-3333-3333-3333-333333333463', 1, NULL); -- Water
    
    -- Order 51-60: Large family orders
    ELSE
      INSERT INTO orders (id, user_id, restaurant_id, status, subtotal, delivery_fee, total_amount, delivery_address, delivery_phone, payment_method, created_at, updated_at)
      VALUES (
        order_id, customer_id, kfc_restaurant_id, order_status,
        22.50, 1.50, 24.00,
        'House 88, Saar', '+973 3333 0000',
        (CASE floor(random() * 3)::int WHEN 0 THEN 'card' WHEN 1 THEN 'cash' ELSE 'benefitpay' END)::payment_method,
        order_date, order_date
      );
      
      INSERT INTO order_items (order_id, dish_id, quantity, special_instructions)
      VALUES 
        (order_id, '33333333-3333-3333-3333-333333333453', 2, NULL), -- Original Bucket x2
        (order_id, '33333333-3333-3333-3333-333333333456', 3, NULL), -- Fries x3
        (order_id, '33333333-3333-3333-3333-333333333457', 2, NULL), -- Coleslaw x2
        (order_id, '33333333-3333-3333-3333-333333333458', 4, NULL), -- Pepsi x4
        (order_id, '33333333-3333-3333-3333-33333333345a', 2, NULL); -- Sundae x2
    END IF;
    
    -- Add reviews for delivered orders (70% chance)
    IF order_status = 'delivered' AND random() < 0.7 THEN
      INSERT INTO reviews (
        user_id,
        restaurant_id,
        order_id,
        rating,
        comment,
        created_at
      ) VALUES (
        customer_id,
        kfc_restaurant_id,
        order_id,
        CASE floor(random() * 10)::int
          WHEN 0 THEN 3
          WHEN 1 THEN 3
          WHEN 2 THEN 4
          ELSE 5
        END,
        CASE floor(random() * 8)::int
          WHEN 0 THEN 'Delicious! Always fresh and hot.'
          WHEN 1 THEN 'Great food, fast delivery!'
          WHEN 2 THEN 'Love the crispy chicken!'
          WHEN 3 THEN 'Best KFC in Bahrain!'
          WHEN 4 THEN 'Good value for money.'
          WHEN 5 THEN 'Tasty but a bit oily.'
          WHEN 6 THEN 'Perfect for family dinner!'
          ELSE 'Highly recommended!'
        END,
        order_date + INTERVAL '1 hour'
      );
    END IF;
    
  END LOOP;
  
  RAISE NOTICE '✅ Created 60 orders for KFC Juffair!';
  
END $$;

-- Verify the seeded data
SELECT 
  status,
  COUNT(*) as order_count,
  SUM(total_amount) as total_revenue
FROM orders
WHERE restaurant_id = '11111111-1111-1111-1111-111111111116'
GROUP BY status
ORDER BY status;

-- Show date distribution
SELECT 
  DATE(created_at) as order_date,
  COUNT(*) as orders,
  SUM(total_amount) as revenue
FROM orders
WHERE restaurant_id = '11111111-1111-1111-1111-111111111116'
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY order_date DESC
LIMIT 10;

-- Show review stats
SELECT 
  rating,
  COUNT(*) as review_count
FROM reviews
WHERE restaurant_id = '11111111-1111-1111-1111-111111111116'
GROUP BY rating
ORDER BY rating DESC;
