-- Fix Krispy Kreme dishes to have proper categories
-- First, create categories for Krispy Kreme

-- Get the restaurant ID for Krispy Kreme
DO $$
DECLARE
  krispy_kreme_id UUID;
  donuts_category_id UUID;
  beverages_category_id UUID;
BEGIN
  -- Get Krispy Kreme restaurant ID
  SELECT id INTO krispy_kreme_id 
  FROM restaurants 
  WHERE name = 'Krispy Kreme Bahrain';

  -- Create Donuts category
  INSERT INTO menu_categories (restaurant_id, name, display_order, is_active)
  VALUES (krispy_kreme_id, 'Donuts', 1, true)
  RETURNING id INTO donuts_category_id;

  -- Create Beverages category
  INSERT INTO menu_categories (restaurant_id, name, display_order, is_active)
  VALUES (krispy_kreme_id, 'Beverages', 2, true)
  RETURNING id INTO beverages_category_id;

  -- Update all donut dishes to have the Donuts category
  UPDATE dishes
  SET category_id = donuts_category_id
  WHERE restaurant_id = krispy_kreme_id
    AND name IN ('Chocolate Iced', 'Strawberry Sprinkles', 'Filled Ring', 'Original Glazed');

  -- Update Coffee to have Beverages category
  UPDATE dishes
  SET category_id = beverages_category_id
  WHERE restaurant_id = krispy_kreme_id
    AND name = 'Coffee';

  RAISE NOTICE 'Categories created and dishes updated successfully!';
END $$;
