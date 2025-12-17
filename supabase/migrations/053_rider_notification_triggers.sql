-- Function to notify rider when assigned to delivery
CREATE OR REPLACE FUNCTION notify_rider_new_delivery()
RETURNS TRIGGER AS $$
DECLARE
  restaurant_name TEXT;
  delivery_address TEXT;
BEGIN
  -- Only proceed if rider was just assigned
  IF NEW.rider_id IS NOT NULL AND (OLD.rider_id IS NULL OR OLD.rider_id != NEW.rider_id) THEN
    -- Get restaurant name and delivery address
    SELECT r.name, o.delivery_address INTO restaurant_name, delivery_address
    FROM orders o
    JOIN restaurants r ON o.restaurant_id = r.id
    WHERE o.id = NEW.order_id;

    -- Send notification to rider
    INSERT INTO notifications (user_id, type, title, message, metadata, read, created_at)
    VALUES (
      NEW.rider_id,
      'delivery',
      'New Delivery Assigned! 📦',
      'Pick up order from ' || COALESCE(restaurant_name, 'restaurant') || ' and deliver to customer.',
      jsonb_build_object(
        'orderId', NEW.order_id,
        'deliveryId', NEW.id,
        'restaurantName', restaurant_name,
        'deliveryAddress', delivery_address
      ),
      FALSE,
      NOW()
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new delivery assignments
DROP TRIGGER IF EXISTS rider_new_delivery_trigger ON deliveries;
CREATE TRIGGER rider_new_delivery_trigger
  AFTER INSERT OR UPDATE OF rider_id ON deliveries
  FOR EACH ROW
  EXECUTE FUNCTION notify_rider_new_delivery();

-- Function to notify rider of delivery completion and earnings
CREATE OR REPLACE FUNCTION notify_rider_delivery_complete()
RETURNS TRIGGER AS $$
DECLARE
  delivery_fee DECIMAL;
BEGIN
  -- Only proceed if delivery was just completed
  IF NEW.status = 'delivered' AND (OLD.status IS NULL OR OLD.status != 'delivered') THEN
    -- Get delivery fee
    SELECT delivery_fee INTO delivery_fee
    FROM orders
    WHERE id = NEW.order_id;

    -- Send notification to rider
    INSERT INTO notifications (user_id, type, title, message, metadata, read, created_at)
    VALUES (
      NEW.rider_id,
      'payment',
      'Delivery Completed! 💰',
      'You earned BD ' || COALESCE(delivery_fee::text, '0') || ' for this delivery. Great job!',
      jsonb_build_object(
        'orderId', NEW.order_id,
        'deliveryId', NEW.id,
        'earnings', delivery_fee
      ),
      FALSE,
      NOW()
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for delivery completion
DROP TRIGGER IF EXISTS rider_delivery_complete_trigger ON deliveries;
CREATE TRIGGER rider_delivery_complete_trigger
  AFTER UPDATE OF status ON deliveries
  FOR EACH ROW
  EXECUTE FUNCTION notify_rider_delivery_complete();
