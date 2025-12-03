-- Find all restaurants and their partner status
-- This will show which restaurants need partner accounts

SELECT 
  r.id as restaurant_id,
  r.name as restaurant_name,
  r.partner_id,
  u.email as partner_email,
  u.full_name as partner_name,
  CASE 
    WHEN r.partner_id IS NULL THEN '❌ NO PARTNER'
    WHEN u.id IS NULL THEN '⚠️ INVALID PARTNER_ID'
    ELSE '✅ HAS PARTNER'
  END as status
FROM restaurants r
LEFT JOIN users u ON r.partner_id = u.id AND u.role = 'partner'
ORDER BY r.name;

-- Count summary
SELECT 
  COUNT(*) as total_restaurants,
  COUNT(r.partner_id) as restaurants_with_partner_id,
  COUNT(u.id) as restaurants_with_valid_partner
FROM restaurants r
LEFT JOIN users u ON r.partner_id = u.id AND u.role = 'partner';
