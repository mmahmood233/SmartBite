-- Temporarily disable all notification triggers on orders table
-- This allows riders to accept orders without notification errors

-- Drop all notification-related triggers
DROP TRIGGER IF EXISTS order_status_notification_trigger ON orders;
DROP TRIGGER IF EXISTS partner_new_order_trigger ON orders;
DROP TRIGGER IF EXISTS admin_order_cancelled_trigger ON orders;

-- We can re-enable them later once all users are properly set up
