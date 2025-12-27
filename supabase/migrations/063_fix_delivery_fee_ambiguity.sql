-- Fix ambiguous delivery_fee column reference in rider notification trigger

CREATE OR REPLACE FUNCTION notify_rider_delivery_complete()
RETURNS TRIGGER AS $$
DECLARE
  order_delivery_fee DECIMAL;  -- Renamed to avoid ambiguity
BEGIN
  -- Only proceed if delivery was just completed
  IF NEW.status = 'delivered' AND (OLD.status IS NULL OR OLD.status != 'delivered') THEN
    -- Get delivery fee from orders table
    SELECT o.delivery_fee INTO order_delivery_fee
    FROM orders o
    WHERE o.id = NEW.order_id;

    -- Insert notification for rider
    INSERT INTO notifications (user_id, type, title, message, metadata, read, created_at)
    VALUES (
      NEW.rider_id,
      'payment',
      'Delivery Completed! 💰',
      'You earned BD ' || COALESCE(order_delivery_fee::text, '0') || ' for this delivery. Great job!',
      jsonb_build_object(
        'orderId', NEW.order_id,
        'deliveryId', NEW.id,
        'earnings', order_delivery_fee
      ),
      FALSE,
      NOW()
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
