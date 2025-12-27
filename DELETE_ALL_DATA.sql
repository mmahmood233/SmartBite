-- ⚠️  DELETE ALL DATA - Run in Supabase SQL Editor
-- This will delete EVERYTHING except admin users
-- Copy and paste this entire script into Supabase SQL Editor

BEGIN;

-- Step 1: Delete order-related data (foreign key dependencies)
DELETE FROM order_item_addons;
DELETE FROM order_items;
DELETE FROM orders;

-- Step 2: Delete delivery data
DELETE FROM deliveries;

-- Step 3: Delete reviews
DELETE FROM reviews;

-- Step 4: Delete user-related data
DELETE FROM user_favorites;
DELETE FROM user_addresses;
DELETE FROM payment_methods;
DELETE FROM cart_items;

-- Step 5: Delete notifications
DELETE FROM notifications;

-- Step 6: Delete dishes and menu data
DELETE FROM dish_addons;
DELETE FROM dishes;
DELETE FROM menu_categories;

-- Step 7: Delete restaurants
DELETE FROM restaurants;

-- Step 8: Delete users (KEEP ADMINS)
-- Store admin IDs first
DO $$
DECLARE
  admin_ids UUID[];
BEGIN
  -- Get all admin user IDs
  SELECT ARRAY_AGG(id) INTO admin_ids FROM users WHERE role = 'admin';
  
  -- Delete non-admin users from public.users
  DELETE FROM users WHERE role IN ('customer', 'partner', 'rider');
  
  -- Delete non-admin users from auth.users
  DELETE FROM auth.users WHERE id != ALL(admin_ids);
END $$;

-- Step 9: Delete promo codes
DELETE FROM promo_codes;

-- Step 10: Verify deletion counts
SELECT 
  'Restaurants' as table_name, 
  COUNT(*) as remaining_count 
FROM restaurants
UNION ALL
SELECT 'Dishes', COUNT(*) FROM dishes
UNION ALL
SELECT 'Users (non-admin)', COUNT(*) FROM users WHERE role != 'admin'
UNION ALL
SELECT 'Admin Users', COUNT(*) FROM users WHERE role = 'admin'
UNION ALL
SELECT 'Orders', COUNT(*) FROM orders
UNION ALL
SELECT 'Reviews', COUNT(*) FROM reviews;

COMMIT;

-- ✅ Done! All data deleted, admin users preserved
