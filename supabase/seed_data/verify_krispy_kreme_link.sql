-- Verify Krispy Kreme partner linkage

-- 1. Check if Krispy Kreme restaurant exists and has a partner
SELECT 
  r.id as restaurant_id,
  r.name,
  r.partner_id,
  u.email as partner_email,
  u.full_name as partner_name,
  u.role
FROM restaurants r
LEFT JOIN users u ON r.partner_id = u.id
WHERE r.name = 'Krispy Kreme Bahrain';

-- 2. Check orders for Krispy Kreme
SELECT 
  COUNT(*) as total_orders,
  restaurant_id
FROM orders
WHERE restaurant_id = (SELECT id FROM restaurants WHERE name = 'Krispy Kreme Bahrain')
GROUP BY restaurant_id;

-- 3. Check if partner user exists
SELECT 
  id,
  email,
  full_name,
  role
FROM users
WHERE email = 'krispykremebahrain@wajba.bh';

-- 4. If partner exists but not linked, link them
DO $$
DECLARE
  v_partner_id uuid;
  v_restaurant_id uuid;
BEGIN
  -- Get partner user ID
  SELECT id INTO v_partner_id FROM users WHERE email = 'krispykremebahrain@wajba.bh';
  
  -- Get restaurant ID
  SELECT id INTO v_restaurant_id FROM restaurants WHERE name = 'Krispy Kreme Bahrain';
  
  IF v_partner_id IS NOT NULL AND v_restaurant_id IS NOT NULL THEN
    -- Link them
    UPDATE restaurants
    SET partner_id = v_partner_id
    WHERE id = v_restaurant_id;
    
    RAISE NOTICE 'Linked Krispy Kreme to partner %', v_partner_id;
  ELSE
    RAISE NOTICE 'Partner ID: %, Restaurant ID: %', v_partner_id, v_restaurant_id;
  END IF;
END $$;

-- 5. Verify the link was successful
SELECT 
  r.name,
  u.email,
  u.full_name,
  (SELECT COUNT(*) FROM orders WHERE restaurant_id = r.id) as order_count
FROM restaurants r
JOIN users u ON r.partner_id = u.id
WHERE r.name = 'Krispy Kreme Bahrain';
