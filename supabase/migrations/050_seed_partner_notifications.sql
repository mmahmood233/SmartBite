-- Seed sample notifications for partner users
DO $$
DECLARE
  sample_partner_id UUID;
BEGIN
  -- Get a sample partner user
  SELECT id INTO sample_partner_id
  FROM users
  WHERE role = 'partner'
  LIMIT 1;

  -- Only insert if we have a partner
  IF sample_partner_id IS NOT NULL THEN
    
    -- New order notification
    INSERT INTO notifications (user_id, type, title, message, read, created_at, metadata)
    VALUES (
      sample_partner_id,
      'order',
      'New Order Received! 🎉',
      'You have a new order. Please confirm and start preparing.',
      FALSE,
      NOW() - INTERVAL '10 minutes',
      jsonb_build_object(
        'orderId', gen_random_uuid()::text,
        'orderTotal', 25.50,
        'status', 'pending'
      )
    );

    -- Payment received notification
    INSERT INTO notifications (user_id, type, title, message, read, created_at, metadata)
    VALUES (
      sample_partner_id,
      'payment',
      'Payment Received! 💰',
      'Payment of BD 32.75 has been received for order.',
      FALSE,
      NOW() - INTERVAL '1 hour',
      jsonb_build_object(
        'orderId', gen_random_uuid()::text,
        'amount', 32.75,
        'paymentMethod', 'benefit_pay'
      )
    );

    -- Order ready for pickup notification
    INSERT INTO notifications (user_id, type, title, message, read, created_at, metadata)
    VALUES (
      sample_partner_id,
      'order',
      'Order Ready for Pickup 📦',
      'Order is ready. Waiting for rider to pick up.',
      TRUE,
      NOW() - INTERVAL '2 hours',
      jsonb_build_object(
        'orderId', gen_random_uuid()::text,
        'status', 'ready_for_pickup'
      )
    );

    -- System notification
    INSERT INTO notifications (user_id, type, title, message, read, created_at, metadata)
    VALUES (
      sample_partner_id,
      'system',
      'Restaurant Performance Update 📊',
      'Your restaurant rating has improved to 4.8 stars! Keep up the great work.',
      TRUE,
      NOW() - INTERVAL '1 day',
      jsonb_build_object('rating', 4.8, 'totalOrders', 156)
    );

    RAISE NOTICE 'Successfully seeded % notifications for partner %', 4, sample_partner_id;
  ELSE
    RAISE NOTICE 'No partner users found. Skipping partner notification seeding.';
  END IF;
END $$;
