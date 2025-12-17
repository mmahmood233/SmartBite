-- Seed sample notifications for rider users
DO $$
DECLARE
  sample_rider_id UUID;
BEGIN
  -- Get a sample rider user
  SELECT id INTO sample_rider_id
  FROM users
  WHERE role = 'rider'
  LIMIT 1;

  -- Only insert if we have a rider
  IF sample_rider_id IS NOT NULL THEN
    
    -- New delivery assignment notification
    INSERT INTO notifications (user_id, type, title, message, read, created_at, metadata)
    VALUES (
      sample_rider_id,
      'delivery',
      'New Delivery Assigned! 📦',
      'Pick up order from McDonald''s Bahrain and deliver to customer.',
      FALSE,
      NOW() - INTERVAL '5 minutes',
      jsonb_build_object(
        'orderId', gen_random_uuid()::text,
        'deliveryId', gen_random_uuid()::text,
        'restaurantName', 'McDonald''s Bahrain',
        'deliveryAddress', 'Building 123, Road 456, Manama'
      )
    );

    -- Delivery completed notification
    INSERT INTO notifications (user_id, type, title, message, read, created_at, metadata)
    VALUES (
      sample_rider_id,
      'payment',
      'Delivery Completed! 💰',
      'You earned BD 2.50 for this delivery. Great job!',
      FALSE,
      NOW() - INTERVAL '1 hour',
      jsonb_build_object(
        'orderId', gen_random_uuid()::text,
        'deliveryId', gen_random_uuid()::text,
        'earnings', 2.50
      )
    );

    -- Another completed delivery
    INSERT INTO notifications (user_id, type, title, message, read, created_at, metadata)
    VALUES (
      sample_rider_id,
      'payment',
      'Delivery Completed! 💰',
      'You earned BD 3.00 for this delivery. Great job!',
      TRUE,
      NOW() - INTERVAL '3 hours',
      jsonb_build_object(
        'orderId', gen_random_uuid()::text,
        'deliveryId', gen_random_uuid()::text,
        'earnings', 3.00
      )
    );

    -- System notification
    INSERT INTO notifications (user_id, type, title, message, read, created_at, metadata)
    VALUES (
      sample_rider_id,
      'system',
      'Weekly Earnings Summary 📊',
      'You completed 24 deliveries this week and earned BD 65.50. Keep up the great work!',
      TRUE,
      NOW() - INTERVAL '1 day',
      jsonb_build_object(
        'totalDeliveries', 24,
        'totalEarnings', 65.50,
        'period', 'week'
      )
    );

    RAISE NOTICE 'Successfully seeded % notifications for rider %', 4, sample_rider_id;
  ELSE
    RAISE NOTICE 'No rider users found. Skipping rider notification seeding.';
  END IF;
END $$;
