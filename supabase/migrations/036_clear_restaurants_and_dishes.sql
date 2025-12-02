-- Migration 036: Clear all restaurants and dishes for fresh data seeding
-- WARNING: This will delete ALL existing restaurant and dish data
-- Run this ONLY if you want to start fresh with new data

-- ============================================================================
-- DELETE ALL DATA (WITH ORDER HANDLING)
-- ============================================================================

-- OPTION 1: Delete orders first (if you want to clear all order history)
-- Uncomment these lines to delete all orders and start completely fresh
-- DELETE FROM order_items;
-- DELETE FROM orders;

-- OPTION 2: Keep orders but set dish references to NULL
-- This preserves order history but removes dish references
-- First, we need to make the foreign key nullable (if it isn't already)
-- ALTER TABLE order_items ALTER COLUMN dish_id DROP NOT NULL;
-- UPDATE order_items SET dish_id = NULL;

-- OPTION 3: Only delete dishes that are NOT in any orders
-- This is the safest option - keeps order history intact
DELETE FROM dishes 
WHERE id NOT IN (
  SELECT DISTINCT dish_id 
  FROM order_items 
  WHERE dish_id IS NOT NULL
);

-- Delete restaurants that have no dishes left
DELETE FROM restaurants 
WHERE id NOT IN (
  SELECT DISTINCT restaurant_id 
  FROM dishes
);

-- Delete menu categories for deleted restaurants
DELETE FROM menu_categories
WHERE restaurant_id NOT IN (
  SELECT id FROM restaurants
);

-- Delete all restaurant categories (if you want to redefine them)
-- Uncomment the line below if you want to clear restaurant categories too
-- DELETE FROM restaurant_categories;

-- ============================================================================
-- RESET SEQUENCES (Optional - if you want IDs to start from 1 again)
-- ============================================================================

-- Note: UUIDs don't use sequences, so this is not needed for UUID primary keys
-- But if you have any serial/sequence columns, you can reset them here

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check counts (should all be 0)
DO $$
DECLARE
  dish_count INTEGER;
  restaurant_count INTEGER;
  menu_cat_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO dish_count FROM dishes;
  SELECT COUNT(*) INTO restaurant_count FROM restaurants;
  SELECT COUNT(*) INTO menu_cat_count FROM menu_categories;
  
  RAISE NOTICE 'Dishes remaining: %', dish_count;
  RAISE NOTICE 'Restaurants remaining: %', restaurant_count;
  RAISE NOTICE 'Menu categories remaining: %', menu_cat_count;
  
  IF dish_count = 0 AND restaurant_count = 0 AND menu_cat_count = 0 THEN
    RAISE NOTICE '✅ All data cleared successfully!';
  ELSE
    RAISE WARNING '⚠️ Some data still remains!';
  END IF;
END $$;
