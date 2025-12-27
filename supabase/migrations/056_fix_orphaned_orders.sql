-- Fix orders with user_id that don't exist in users table
-- This prevents foreign key constraint errors when triggers try to create notifications

-- First, let's see what we're dealing with
DO $$
DECLARE
  orphaned_count INTEGER;
BEGIN
  -- Count orders with user_id not in users table
  SELECT COUNT(*) INTO orphaned_count
  FROM orders o
  WHERE o.user_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM users u WHERE u.id = o.user_id);
  
  RAISE NOTICE 'Found % orders with invalid user_id', orphaned_count;
  
  -- Set user_id to NULL for orders where user doesn't exist
  -- This prevents foreign key errors in notification triggers
  UPDATE orders
  SET user_id = NULL
  WHERE user_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM users u WHERE u.id = orders.user_id);
  
  RAISE NOTICE 'Fixed % orphaned orders by setting user_id to NULL', orphaned_count;
END $$;

-- Alternative: If you want to keep the orders linked, you could create placeholder users
-- But for now, setting to NULL is safer and allows the app to work
