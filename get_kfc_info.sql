-- Get KFC restaurant info and dishes

-- Restaurant info
SELECT 
  id,
  name,
  partner_id,
  cuisine_types,
  rating
FROM restaurants 
WHERE name LIKE '%KFC%';

-- KFC dishes
SELECT 
  id,
  name,
  description,
  price,
  category,
  is_available
FROM dishes
WHERE restaurant_id = (SELECT id FROM restaurants WHERE name LIKE '%KFC%' LIMIT 1)
ORDER BY category, name;

-- Count dishes by category
SELECT 
  category,
  COUNT(*) as dish_count
FROM dishes
WHERE restaurant_id = (SELECT id FROM restaurants WHERE name LIKE '%KFC%' LIMIT 1)
GROUP BY category;
