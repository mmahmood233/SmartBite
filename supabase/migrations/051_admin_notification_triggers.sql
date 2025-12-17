-- Function to notify admin when new user registers
CREATE OR REPLACE FUNCTION notify_admin_new_user()
RETURNS TRIGGER AS $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get admin user ID
  SELECT id INTO admin_user_id
  FROM users
  WHERE role = 'admin'
  LIMIT 1;

  -- Only send if admin exists and new user is not admin
  IF admin_user_id IS NOT NULL AND NEW.role != 'admin' THEN
    INSERT INTO notifications (user_id, type, title, message, metadata, read, created_at)
    VALUES (
      admin_user_id,
      'user',
      'New User Registered! 👤',
      'A new ' || NEW.role || ' has joined the platform: ' || COALESCE(NEW.full_name, NEW.email),
      jsonb_build_object(
        'userId', NEW.id,
        'userRole', NEW.role,
        'userName', NEW.full_name,
        'userEmail', NEW.email
      ),
      FALSE,
      NOW()
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new user registrations
DROP TRIGGER IF EXISTS admin_new_user_trigger ON users;
CREATE TRIGGER admin_new_user_trigger
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_new_user();

-- Function to notify admin of system issues (high order cancellation rate)
CREATE OR REPLACE FUNCTION notify_admin_order_cancelled()
RETURNS TRIGGER AS $$
DECLARE
  admin_user_id UUID;
  restaurant_name TEXT;
BEGIN
  -- Only proceed if order was cancelled
  IF NEW.status = 'cancelled' AND (OLD.status IS NULL OR OLD.status != 'cancelled') THEN
    -- Get admin user ID
    SELECT id INTO admin_user_id
    FROM users
    WHERE role = 'admin'
    LIMIT 1;

    -- Get restaurant name
    SELECT name INTO restaurant_name
    FROM restaurants
    WHERE id = NEW.restaurant_id;

    -- Send notification to admin
    IF admin_user_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, type, title, message, metadata, read, created_at)
      VALUES (
        admin_user_id,
        'system',
        'Order Cancelled ⚠️',
        'Order from ' || COALESCE(restaurant_name, 'restaurant') || ' was cancelled. Reason: ' || COALESCE(NEW.delivery_notes, 'Not specified'),
        jsonb_build_object(
          'orderId', NEW.id,
          'restaurantName', restaurant_name,
          'reason', NEW.delivery_notes
        ),
        FALSE,
        NOW()
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for cancelled orders
DROP TRIGGER IF EXISTS admin_order_cancelled_trigger ON orders;
CREATE TRIGGER admin_order_cancelled_trigger
  AFTER UPDATE OF status ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_order_cancelled();
