-- Seed sample notifications for testing
-- This will add notifications for existing users

-- Insert sample notifications for the first customer user
DO $$
DECLARE
  sample_user_id UUID;
  sample_restaurant_id UUID;
BEGIN
  -- Get a sample customer user
  SELECT id INTO sample_user_id
  FROM users
  WHERE role = 'customer'
  LIMIT 1;

  -- Get a sample restaurant
  SELECT id INTO sample_restaurant_id
  FROM restaurants
  LIMIT 1;

  -- Only insert if we have a user
  IF sample_user_id IS NOT NULL THEN
    
    -- Welcome notification
    INSERT INTO notifications (user_id, type, title, message, read, created_at, metadata)
    VALUES (
      sample_user_id,
      'system',
      'Welcome to Wajba! 🎉',
      'Thank you for joining Wajba! Discover amazing restaurants and delicious meals near you.',
      FALSE,
      NOW() - INTERVAL '2 hours',
      jsonb_build_object('type', 'welcome')
    );

    -- Order confirmed notification
    INSERT INTO notifications (user_id, type, title, message, read, created_at, metadata)
    VALUES (
      sample_user_id,
      'order',
      'Order Confirmed! 🎉',
      'Your order has been confirmed and is being prepared.',
      FALSE,
      NOW() - INTERVAL '30 minutes',
      jsonb_build_object(
        'orderId', gen_random_uuid()::text,
        'restaurantName', COALESCE((SELECT name FROM restaurants WHERE id = sample_restaurant_id), 'Restaurant'),
        'status', 'confirmed'
      )
    );

    -- Order out for delivery notification
    INSERT INTO notifications (user_id, type, title, message, read, created_at, metadata)
    VALUES (
      sample_user_id,
      'delivery',
      'On the Way! 🚴',
      'Your rider is on the way with your order. Track your delivery in real-time!',
      FALSE,
      NOW() - INTERVAL '15 minutes',
      jsonb_build_object(
        'orderId', gen_random_uuid()::text,
        'riderName', 'Ahmed',
        'status', 'out_for_delivery'
      )
    );

    -- Promotion notification
    INSERT INTO notifications (user_id, type, title, message, read, created_at, metadata)
    VALUES (
      sample_user_id,
      'promotion',
      'Special Offer! 🎁',
      'Get 20% off on your next order. Use code: SAVE20',
      FALSE,
      NOW() - INTERVAL '1 hour',
      jsonb_build_object('promoCode', 'SAVE20', 'discount', 20)
    );

    -- Order delivered notification (read)
    INSERT INTO notifications (user_id, type, title, message, read, created_at, metadata)
    VALUES (
      sample_user_id,
      'order',
      'Order Delivered! ✅',
      'Your order has been delivered successfully. Enjoy your meal!',
      TRUE,
      NOW() - INTERVAL '1 day',
      jsonb_build_object(
        'orderId', gen_random_uuid()::text,
        'status', 'delivered'
      )
    );

    -- System notification (read)
    INSERT INTO notifications (user_id, type, title, message, read, created_at, metadata)
    VALUES (
      sample_user_id,
      'system',
      'App Update Available 📱',
      'A new version of Wajba is available. Update now for the best experience!',
      TRUE,
      NOW() - INTERVAL '2 days',
      jsonb_build_object('version', '2.0.0')
    );

    RAISE NOTICE 'Successfully seeded % notifications for user %', 6, sample_user_id;
  ELSE
    RAISE NOTICE 'No customer users found. Skipping notification seeding.';
  END IF;
END $$;
