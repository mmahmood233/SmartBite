-- Seed sample notifications for admin users
DO $$
DECLARE
  sample_admin_id UUID;
BEGIN
  -- Get a sample admin user
  SELECT id INTO sample_admin_id
  FROM users
  WHERE role = 'admin'
  LIMIT 1;

  -- Only insert if we have an admin
  IF sample_admin_id IS NOT NULL THEN
    
    -- New user registration notification
    INSERT INTO notifications (user_id, type, title, message, read, created_at, metadata)
    VALUES (
      sample_admin_id,
      'user',
      'New User Registered! 👤',
      'A new customer has joined the platform: John Doe',
      FALSE,
      NOW() - INTERVAL '15 minutes',
      jsonb_build_object(
        'userId', gen_random_uuid()::text,
        'userRole', 'customer',
        'userName', 'John Doe',
        'userEmail', 'john@example.com'
      )
    );

    -- Order cancelled notification
    INSERT INTO notifications (user_id, type, title, message, read, created_at, metadata)
    VALUES (
      sample_admin_id,
      'system',
      'Order Cancelled ⚠️',
      'Order from McDonald''s Bahrain was cancelled. Reason: Customer requested cancellation',
      FALSE,
      NOW() - INTERVAL '1 hour',
      jsonb_build_object(
        'orderId', gen_random_uuid()::text,
        'restaurantName', 'McDonald''s Bahrain',
        'reason', 'Customer requested cancellation'
      )
    );

    -- New partner registration
    INSERT INTO notifications (user_id, type, title, message, read, created_at, metadata)
    VALUES (
      sample_admin_id,
      'user',
      'New Partner Registered! 🏪',
      'A new partner has joined the platform: Ahmed''s Kitchen',
      TRUE,
      NOW() - INTERVAL '3 hours',
      jsonb_build_object(
        'userId', gen_random_uuid()::text,
        'userRole', 'partner',
        'userName', 'Ahmed''s Kitchen'
      )
    );

    -- System notification
    INSERT INTO notifications (user_id, type, title, message, read, created_at, metadata)
    VALUES (
      sample_admin_id,
      'system',
      'Platform Update Required 🔧',
      'System maintenance scheduled for tonight at 2 AM. Expected downtime: 30 minutes.',
      TRUE,
      NOW() - INTERVAL '1 day',
      jsonb_build_object('maintenanceTime', '2 AM', 'duration', '30 minutes')
    );

    RAISE NOTICE 'Successfully seeded % notifications for admin %', 4, sample_admin_id;
  ELSE
    RAISE NOTICE 'No admin users found. Skipping admin notification seeding.';
  END IF;
END $$;
