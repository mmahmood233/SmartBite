-- Function to send notification when order status changes
CREATE OR REPLACE FUNCTION notify_order_status_change()
RETURNS TRIGGER AS $$
DECLARE
  restaurant_name TEXT;
  rider_name TEXT;
  notification_title TEXT;
  notification_message TEXT;
  notification_type TEXT;
BEGIN
  -- Only proceed if status actually changed
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  -- Get restaurant name
  SELECT name INTO restaurant_name
  FROM restaurants
  WHERE id = NEW.restaurant_id;

  -- Determine notification based on new status
  CASE NEW.status
    WHEN 'confirmed' THEN
      notification_title := 'Order Confirmed! 🎉';
      notification_message := 'Your order from ' || COALESCE(restaurant_name, 'the restaurant') || ' has been confirmed and is being prepared.';
      notification_type := 'order';
      
    WHEN 'preparing' THEN
      notification_title := 'Order is Being Prepared 👨‍🍳';
      notification_message := 'Your order from ' || COALESCE(restaurant_name, 'the restaurant') || ' is now being prepared.';
      notification_type := 'order';
      
    WHEN 'ready_for_pickup' THEN
      notification_title := 'Order Ready! 🍽️';
      notification_message := 'Your order from ' || COALESCE(restaurant_name, 'the restaurant') || ' is ready for pickup!';
      notification_type := 'order';
      
    WHEN 'out_for_delivery' THEN
      -- Get rider name if assigned
      SELECT full_name INTO rider_name
      FROM users
      WHERE id = NEW.rider_id;
      
      notification_title := 'On the Way! 🚴';
      notification_message := COALESCE(rider_name, 'Your rider') || ' is on the way with your order. Track your delivery in real-time!';
      notification_type := 'delivery';
      
    WHEN 'delivered' THEN
      notification_title := 'Order Delivered! ✅';
      notification_message := 'Your order has been delivered successfully. Enjoy your meal!';
      notification_type := 'order';
      
    WHEN 'cancelled' THEN
      notification_title := 'Order Cancelled';
      notification_message := 'Your order has been cancelled. ' || COALESCE(NEW.delivery_notes, 'Please contact support for more information.');
      notification_type := 'system';
      
    ELSE
      -- Don't send notification for other statuses
      RETURN NEW;
  END CASE;

  -- Insert notification
  INSERT INTO notifications (user_id, type, title, message, metadata, read, created_at)
  VALUES (
    NEW.user_id,
    notification_type,
    notification_title,
    notification_message,
    jsonb_build_object(
      'orderId', NEW.id,
      'restaurantName', restaurant_name,
      'status', NEW.status
    ),
    FALSE,
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for order status changes
DROP TRIGGER IF EXISTS order_status_notification_trigger ON orders;
CREATE TRIGGER order_status_notification_trigger
  AFTER UPDATE OF status ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_order_status_change();

-- Function to send welcome notification to new users
CREATE OR REPLACE FUNCTION send_welcome_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Only send if role is customer
  IF NEW.role = 'customer' THEN
    INSERT INTO notifications (user_id, type, title, message, read, created_at)
    VALUES (
      NEW.id,
      'system',
      'Welcome to Wajba! 🎉',
      'Thank you for joining Wajba! Discover amazing restaurants and delicious meals near you.',
      FALSE,
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new user welcome
DROP TRIGGER IF EXISTS new_user_welcome_trigger ON users;
CREATE TRIGGER new_user_welcome_trigger
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION send_welcome_notification();
