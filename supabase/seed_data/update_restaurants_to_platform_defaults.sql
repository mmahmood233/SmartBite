-- Update all existing restaurants to use platform default delivery fee and min order
-- This syncs existing restaurants with the new platform settings

UPDATE restaurants
SET 
  delivery_fee = (
    SELECT CAST(setting_value AS DECIMAL) 
    FROM platform_settings 
    WHERE setting_key = 'default_delivery_fee'
  ),
  min_order = (
    SELECT CAST(setting_value AS DECIMAL) 
    FROM platform_settings 
    WHERE setting_key = 'min_order_amount'
  );

-- Verify the update
SELECT 
  name,
  delivery_fee,
  min_order
FROM restaurants
ORDER BY name;
