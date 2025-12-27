-- Fix notification trigger to correctly get rider name

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
      -- Get rider name from riders table (not users table)
      SELECT full_name INTO rider_name
      FROM riders
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

  -- Insert notification only if user exists
  -- Check if user_id exists in users table
  IF EXISTS (SELECT 1 FROM users WHERE id = NEW.user_id) THEN
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
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
