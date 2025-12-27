-- Function to notify partner when new order is placed
CREATE OR REPLACE FUNCTION notify_partner_new_order()
RETURNS TRIGGER AS $$
DECLARE
  partner_user_id UUID;
  restaurant_name TEXT;
BEGIN
  -- Get partner user ID from restaurant
  SELECT partner_id, name INTO partner_user_id, restaurant_name
  FROM restaurants
  WHERE id = NEW.restaurant_id;

  -- Only send if partner exists
  IF partner_user_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, title, message, metadata, read, created_at)
    VALUES (
      partner_user_id,
      'order',
      'New Order Received! 🎉',
      'You have a new order. Please confirm and start preparing.',
      jsonb_build_object(
        'orderId', NEW.id,
        'orderTotal', NEW.total_amount,
        'status', NEW.status
      ),
      FALSE,
      NOW()
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new orders
DROP TRIGGER IF EXISTS partner_new_order_trigger ON orders;
CREATE TRIGGER partner_new_order_trigger
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_partner_new_order();

-- Note: Payment notification trigger will be added when payments table is created
-- For now, we'll rely on order status notifications for partners
