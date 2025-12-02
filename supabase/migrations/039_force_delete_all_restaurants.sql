-- Migration 039: Force delete ALL restaurants and related data
-- This handles the foreign key constraints from orders

DO $$
BEGIN
  -- ============================================================================
  -- STEP 1: DELETE ALL ORDER-RELATED DATA
  -- ============================================================================

  -- Delete order items first (they reference dishes)
  DELETE FROM order_items;
  RAISE NOTICE '✅ Deleted all order items';

  -- Delete all orders
  DELETE FROM orders;
  RAISE NOTICE '✅ Deleted all orders';

  -- Delete all reviews (they reference restaurants and orders)
  DELETE FROM reviews;
  RAISE NOTICE '✅ Deleted all reviews';

  -- Delete review tags (if any remain)
  DELETE FROM review_tags;
  RAISE NOTICE '✅ Deleted all review tags';

  -- ============================================================================
  -- STEP 2: DELETE ALL RESTAURANT-RELATED DATA
  -- ============================================================================

  -- Delete all dish addons
  DELETE FROM dish_addons;
  RAISE NOTICE '✅ Deleted all dish addons';

  -- Delete all dishes
  DELETE FROM dishes;
  RAISE NOTICE '✅ Deleted all dishes';

  -- Delete all menu categories
  DELETE FROM menu_categories;
  RAISE NOTICE '✅ Deleted all menu categories';

  -- Delete all restaurants
  DELETE FROM restaurants;
  RAISE NOTICE '✅ Deleted all restaurants';
END $$;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$
DECLARE
  order_items_count INTEGER;
  orders_count INTEGER;
  reviews_count INTEGER;
  dishes_count INTEGER;
  restaurants_count INTEGER;
  menu_categories_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO order_items_count FROM order_items;
  SELECT COUNT(*) INTO orders_count FROM orders;
  SELECT COUNT(*) INTO reviews_count FROM reviews;
  SELECT COUNT(*) INTO dishes_count FROM dishes;
  SELECT COUNT(*) INTO restaurants_count FROM restaurants;
  SELECT COUNT(*) INTO menu_categories_count FROM menu_categories;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'CLEANUP VERIFICATION';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Order items remaining: %', order_items_count;
  RAISE NOTICE 'Orders remaining: %', orders_count;
  RAISE NOTICE 'Reviews remaining: %', reviews_count;
  RAISE NOTICE 'Dishes remaining: %', dishes_count;
  RAISE NOTICE 'Menu categories remaining: %', menu_categories_count;
  RAISE NOTICE 'Restaurants remaining: %', restaurants_count;
  RAISE NOTICE '========================================';
  
  IF order_items_count = 0 AND orders_count = 0 AND reviews_count = 0 
     AND dishes_count = 0 AND restaurants_count = 0 AND menu_categories_count = 0 THEN
    RAISE NOTICE '✅ ALL DATA CLEARED SUCCESSFULLY!';
    RAISE NOTICE '📝 Ready to insert fresh restaurant data';
  ELSE
    RAISE WARNING '⚠️ Some data still remains - check foreign key constraints';
  END IF;
  
  RAISE NOTICE '========================================';
END $$;
