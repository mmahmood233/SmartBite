-- Link existing restaurants to partner users
-- NOTE: You must create the partner auth users manually first via Supabase Dashboard or sign them up through the app
-- This script only links existing auth users to restaurants

-- Step 1: Update existing users to be partners and link to restaurants
DO $$
DECLARE
  v_user_id uuid;
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT *
    FROM (VALUES
      ('mcdonaldsbahrain@wajba.bh','McDonald''s Bahrain Owner','+973 1700 1013','McDonald''s Bahrain'),
      ('kfcbahrain@wajba.bh','KFC Bahrain Owner','+973 1700 1014','KFC Bahrain'),
      ('burgerkingbahrain@wajba.bh','Burger King Bahrain Owner','+973 1700 1015','Burger King Bahrain'),
      ('pizzahutbahrain@wajba.bh','Pizza Hut Bahrain Owner','+973 1700 1016','Pizza Hut Bahrain'),
      ('dominospizzabahrain@wajba.bh','Domino''s Bahrain Owner','+973 1700 1017','Domino''s Pizza Bahrain'),
      ('papajohnsbahrain@wajba.bh','Papa John''s Bahrain Owner','+973 1700 1019','Papa John''s Bahrain'),
      ('nandosbahrain@wajba.bh','Nando''s Bahrain Owner','+973 1700 1020','Nando''s Bahrain'),
      ('shakeshackbahrain@wajba.bh','Shake Shack Bahrain Owner','+973 1700 1021','Shake Shack Bahrain'),
      ('texaschickenbahrain@wajba.bh','Texas Chicken Bahrain Owner','+973 1700 1018','Texas Chicken Bahrain'),
      ('subwaybahrain@wajba.bh','Subway Bahrain Owner','+973 1700 1022','Subway Bahrain'),
      ('starbucksbahrain@wajba.bh','Starbucks Bahrain Owner','+973 1700 1023','Starbucks Bahrain'),
      ('krispykremebahrain@wajba.bh','Krispy Kreme Bahrain Owner','+973 1700 1024','Krispy Kreme Bahrain'),
      ('dunkinbahrain@wajba.bh','Dunkin'' Bahrain Owner','+973 1700 1025','Dunkin'' Bahrain'),
      ('baskinrobbinsbahrain@wajba.bh','Baskin Robbins Bahrain Owner','+973 1700 1026','Baskin Robbins Bahrain'),
      ('tgifridaysbahrain@wajba.bh','TGI Fridays Bahrain Owner','+973 1700 1027','TGI Fridays Bahrain'),
      ('chilisbahrain@wajba.bh','Chili''s Bahrain Owner','+973 1700 1028','Chili''s Bahrain'),
      ('pfchangsbahrain@wajba.bh','P.F. Chang''s Bahrain Owner','+973 1700 1029','P.F. Chang''s Bahrain'),
      ('hardeesbahrain@wajba.bh','Hardee''s Bahrain Owner','+973 1700 1030','Hardee''s Bahrain'),
      ('costacoffeebahrain@wajba.bh','Costa Coffee Bahrain Owner','+973 1700 1031','Costa Coffee Bahrain'),
      ('pizzaexpressbahrain@wajba.bh','PizzaExpress Bahrain Owner','+973 1700 1032','PizzaExpress Bahrain')
    ) AS t(email, full_name, phone, rname)
  LOOP
    -- Check if user exists in public.users
    SELECT id INTO v_user_id FROM public.users WHERE email = rec.email;

    IF v_user_id IS NOT NULL THEN
      -- Update existing user to be a partner
      UPDATE public.users
      SET role = 'partner',
          phone = rec.phone,
          updated_at = NOW()
      WHERE id = v_user_id;

      -- Link restaurant to this partner
      UPDATE restaurants
      SET partner_id = v_user_id
      WHERE name = rec.rname
        AND (partner_id IS NULL OR partner_id <> v_user_id);
      
      RAISE NOTICE 'Linked % to %', rec.email, rec.rname;
    ELSE
      RAISE NOTICE 'User % not found - please create via signup first', rec.email;
    END IF;
  END LOOP;
END $$;

-- Verify links
SELECT 
  r.name AS restaurant_name,
  u.email AS partner_email,
  u.full_name AS partner_name,
  u.role
FROM restaurants r 
LEFT JOIN public.users u ON r.partner_id = u.id 
ORDER BY r.name;
