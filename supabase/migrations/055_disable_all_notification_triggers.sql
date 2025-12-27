-- Disable all notification triggers to fix foreign key constraint errors
-- This migration runs after all trigger-creating migrations (047, 049, 051, 053)

-- Drop order status notification trigger (from 047)
DROP TRIGGER IF EXISTS order_status_notification_trigger ON orders;

-- Drop partner notification trigger (from 049)
DROP TRIGGER IF EXISTS partner_new_order_trigger ON orders;

-- Drop admin notification trigger (from 051)
DROP TRIGGER IF EXISTS admin_order_cancelled_trigger ON orders;

-- Drop rider notification trigger (from 053)
DROP TRIGGER IF EXISTS rider_order_accepted_trigger ON orders;

-- Drop new user welcome trigger
DROP TRIGGER IF EXISTS new_user_welcome_trigger ON users;

-- Note: These can be re-enabled later once all users are properly set up in the users table
