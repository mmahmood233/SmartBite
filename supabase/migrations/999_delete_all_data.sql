-- Migration 999: Delete ALL data (restaurants, dishes, users, orders, etc.)
-- WARNING: This will delete EVERYTHING except admin users
-- Run this in Supabase SQL Editor

-- Step 1: Delete all order-related data (must go first due to foreign keys)
DELETE FROM order_item_addons;
DELETE FROM order_items;
DELETE FROM orders;

-- Step 2: Delete delivery-related data
DELETE FROM deliveries;

-- Step 3: Delete reviews and ratings
DELETE FROM reviews;

-- Step 4: Delete user-related data
DELETE FROM user_favorites;
DELETE FROM user_addresses;
DELETE FROM payment_methods;
DELETE FROM cart_items;

-- Step 5: Delete notifications
DELETE FROM notifications;

-- Step 6: Delete dishes and related data
DELETE FROM dish_addons;
DELETE FROM dishes;
DELETE FROM menu_categories;

-- Step 7: Delete restaurants
DELETE FROM restaurants;

-- Step 8: Delete users (except admins)
-- Keep admin users, delete customers, partners, riders
DELETE FROM users WHERE role IN ('customer', 'partner', 'rider');

-- Step 9: Delete promo codes and admin data
DELETE FROM promo_codes;
DELETE FROM admin_settings;

-- Step 10: Reset sequences if needed (optional)
-- This ensures new IDs start fresh

-- Verify deletion
SELECT 'Restaurants' as table_name, COUNT(*) as count FROM restaurants
UNION ALL
SELECT 'Dishes', COUNT(*) FROM dishes
UNION ALL
SELECT 'Users (non-admin)', COUNT(*) FROM users WHERE role != 'admin'
UNION ALL
SELECT 'Orders', COUNT(*) FROM orders
UNION ALL
SELECT 'Order Items', COUNT(*) FROM order_items
UNION ALL
SELECT 'Reviews', COUNT(*) FROM reviews
UNION ALL
SELECT 'Deliveries', COUNT(*) FROM deliveries
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ All data deleted successfully!';
  RAISE NOTICE '📊 Admin users preserved';
  RAISE NOTICE '🔄 Ready for fresh data seeding';
END $$;
