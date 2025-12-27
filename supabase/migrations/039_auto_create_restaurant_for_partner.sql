-- Migration 039: Auto-create restaurant when partner user is created

-- Function to auto-create restaurant for new partner users
CREATE OR REPLACE FUNCTION auto_create_restaurant_for_partner()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create restaurant if user role is 'partner'
  IF NEW.role = 'partner' THEN
    INSERT INTO restaurants (
      partner_id,
      name,
      category,
      description,
      address,
      phone,
      email,
      delivery_fee,
      min_order,
      avg_prep_time,
      status,
      is_active
    ) VALUES (
      NEW.id,
      COALESCE(NEW.full_name, 'New Restaurant'), -- Use partner's name or default
      'Fast Food', -- Default category
      'Welcome to our restaurant!', -- Default description
      'Address not set', -- Placeholder address
      COALESCE(NEW.phone, '+973 0000 0000'), -- Use partner's phone or placeholder
      NEW.email, -- Use partner's email
      1.5, -- Default delivery fee
      5.0, -- Default minimum order
      '20-25 min', -- Default prep time
      'closed'::restaurant_status, -- Start as closed
      true -- Active by default
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to run after partner user is inserted
DROP TRIGGER IF EXISTS trigger_auto_create_restaurant ON users;

CREATE TRIGGER trigger_auto_create_restaurant
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_restaurant_for_partner();

-- Add comment
COMMENT ON FUNCTION auto_create_restaurant_for_partner IS 'Automatically creates a restaurant record when a partner user is created';
