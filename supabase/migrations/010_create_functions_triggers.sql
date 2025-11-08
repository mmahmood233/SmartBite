-- Migration 010: Create Functions and Triggers

-- ============================================
-- Function: Auto-update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at column
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_addresses_updated_at 
  BEFORE UPDATE ON user_addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurant_categories_updated_at 
  BEFORE UPDATE ON restaurant_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurants_updated_at 
  BEFORE UPDATE ON restaurants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_categories_updated_at 
  BEFORE UPDATE ON menu_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dishes_updated_at 
  BEFORE UPDATE ON dishes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at 
  BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_riders_updated_at 
  BEFORE UPDATE ON riders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at 
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at 
  BEFORE UPDATE ON payment_methods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promo_codes_updated_at 
  BEFORE UPDATE ON promo_codes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at 
  BEFORE UPDATE ON admin_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Function: Update restaurant rating
-- ============================================
CREATE OR REPLACE FUNCTION update_restaurant_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE restaurants
  SET 
    rating = COALESCE((
      SELECT AVG(rating)::DECIMAL(3,2) 
      FROM reviews 
      WHERE restaurant_id = NEW.restaurant_id AND is_visible = TRUE
    ), 0.0),
    total_reviews = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE restaurant_id = NEW.restaurant_id AND is_visible = TRUE
    )
  WHERE id = NEW.restaurant_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_restaurant_rating_trigger
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_restaurant_rating();

-- ============================================
-- Function: Increment promo code usage
-- ============================================
CREATE OR REPLACE FUNCTION increment_promo_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.promo_code_id IS NOT NULL THEN
    UPDATE promo_codes
    SET used_count = used_count + 1
    WHERE id = NEW.promo_code_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_promo_usage_trigger
  AFTER INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION increment_promo_usage();

-- ============================================
-- Function: Increment restaurant total orders
-- ============================================
CREATE OR REPLACE FUNCTION increment_restaurant_orders()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'delivered' AND (OLD.status IS NULL OR OLD.status != 'delivered') THEN
    UPDATE restaurants
    SET total_orders = total_orders + 1
    WHERE id = NEW.restaurant_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_restaurant_orders_trigger
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION increment_restaurant_orders();

-- ============================================
-- Function: Increment rider total deliveries
-- ============================================
CREATE OR REPLACE FUNCTION increment_rider_deliveries()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'delivered' AND (OLD.status IS NULL OR OLD.status != 'delivered') AND NEW.rider_id IS NOT NULL THEN
    UPDATE riders
    SET total_deliveries = total_deliveries + 1
    WHERE id = NEW.rider_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_rider_deliveries_trigger
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION increment_rider_deliveries();

-- ============================================
-- Function: Create order tracking entry
-- ============================================
CREATE OR REPLACE FUNCTION create_order_tracking()
RETURNS TRIGGER AS $$
BEGIN
  -- Create tracking entry when order status changes
  IF (TG_OP = 'INSERT') OR (OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO order_tracking (order_id, status, notes)
    VALUES (NEW.id, NEW.status, 'Status changed to ' || NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_order_tracking_trigger
  AFTER INSERT OR UPDATE OF status ON orders
  FOR EACH ROW EXECUTE FUNCTION create_order_tracking();

-- ============================================
-- Function: Generate order number
-- ============================================
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  new_order_number VARCHAR(20);
  counter INTEGER;
BEGIN
  -- Generate order number: WAJ + 4 digits
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 4) AS INTEGER)), 0) + 1
  INTO counter
  FROM orders
  WHERE order_number LIKE 'WAJ%';
  
  new_order_number := 'WAJ' || LPAD(counter::TEXT, 4, '0');
  NEW.order_number := new_order_number;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW 
  WHEN (NEW.order_number IS NULL)
  EXECUTE FUNCTION generate_order_number();

-- Comments
COMMENT ON FUNCTION update_updated_at_column() IS 'Auto-update updated_at timestamp on row modification';
COMMENT ON FUNCTION update_restaurant_rating() IS 'Recalculate restaurant rating when review is added/updated';
COMMENT ON FUNCTION increment_promo_usage() IS 'Increment promo code usage count when applied to order';
COMMENT ON FUNCTION increment_restaurant_orders() IS 'Increment restaurant total orders when order is delivered';
COMMENT ON FUNCTION increment_rider_deliveries() IS 'Increment rider total deliveries when order is delivered';
COMMENT ON FUNCTION create_order_tracking() IS 'Create tracking entry when order status changes';
COMMENT ON FUNCTION generate_order_number() IS 'Auto-generate unique order number (WAJ####)';
