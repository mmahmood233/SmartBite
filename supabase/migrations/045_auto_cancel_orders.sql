-- Auto-cancel orders that haven't been accepted within 5 minutes
-- This function will be called by a cron job or trigger

-- Function to auto-cancel pending orders after 5 minutes
CREATE OR REPLACE FUNCTION auto_cancel_expired_orders()
RETURNS void AS $$
BEGIN
  UPDATE public.orders
  SET 
    status = 'cancelled',
    delivery_notes = 'Order automatically cancelled - Restaurant did not respond within 5 minutes',
    updated_at = NOW()
  WHERE 
    status = 'pending'
    AND created_at < NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function that will be triggered on insert to schedule auto-cancellation
CREATE OR REPLACE FUNCTION schedule_order_cancellation()
RETURNS TRIGGER AS $$
BEGIN
  -- This will be handled by the app, but we can add a timestamp for reference
  NEW.estimated_delivery_time = NEW.created_at + INTERVAL '5 minutes';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set estimated time on order creation
DROP TRIGGER IF EXISTS set_order_cancellation_time ON orders;
CREATE TRIGGER set_order_cancellation_time
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.status = 'pending')
  EXECUTE FUNCTION schedule_order_cancellation();

-- Grant execute permission
GRANT EXECUTE ON FUNCTION auto_cancel_expired_orders() TO authenticated;
GRANT EXECUTE ON FUNCTION schedule_order_cancellation() TO authenticated;
