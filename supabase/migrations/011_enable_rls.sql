-- Migration 011: Enable Row Level Security (RLS)

-- ============================================
-- Enable RLS on all tables
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dish_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_item_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Users Table Policies
-- ============================================

-- Allow users to insert their own profile during signup
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- User Addresses Policies
-- ============================================

-- Users can manage their own addresses
CREATE POLICY "Users can manage own addresses" ON user_addresses
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- User Favorites Policies
-- ============================================

-- Users can manage their own favorites
CREATE POLICY "Users can manage own favorites" ON user_favorites
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- Restaurant Categories Policies
-- ============================================

-- Anyone can view active categories
CREATE POLICY "Anyone can view active categories" ON restaurant_categories
  FOR SELECT USING (is_active = TRUE);

-- Admins can manage categories
CREATE POLICY "Admins can manage categories" ON restaurant_categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- Restaurants Policies
-- ============================================

-- Anyone can view active restaurants
CREATE POLICY "Anyone can view active restaurants" ON restaurants
  FOR SELECT USING (is_active = TRUE);

-- Partners can manage their own restaurants
CREATE POLICY "Partners can manage own restaurants" ON restaurants
  FOR ALL USING (auth.uid() = partner_id);

-- Admins can manage all restaurants
CREATE POLICY "Admins can manage all restaurants" ON restaurants
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- Menu Categories Policies
-- ============================================

-- Anyone can view active menu categories
CREATE POLICY "Anyone can view menu categories" ON menu_categories
  FOR SELECT USING (
    is_active = TRUE AND 
    EXISTS (SELECT 1 FROM restaurants WHERE id = menu_categories.restaurant_id AND is_active = TRUE)
  );

-- Partners can manage their restaurant's menu categories
CREATE POLICY "Partners can manage own menu categories" ON menu_categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM restaurants WHERE id = menu_categories.restaurant_id AND partner_id = auth.uid())
  );

-- ============================================
-- Dishes Policies
-- ============================================

-- Anyone can view available dishes
CREATE POLICY "Anyone can view available dishes" ON dishes
  FOR SELECT USING (
    is_available = TRUE AND 
    EXISTS (SELECT 1 FROM restaurants WHERE id = dishes.restaurant_id AND is_active = TRUE)
  );

-- Partners can manage their restaurant's dishes
CREATE POLICY "Partners can manage own dishes" ON dishes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM restaurants WHERE id = dishes.restaurant_id AND partner_id = auth.uid())
  );

-- ============================================
-- Dish Add-ons Policies
-- ============================================

-- Anyone can view available add-ons
CREATE POLICY "Anyone can view available addons" ON dish_addons
  FOR SELECT USING (
    is_available = TRUE AND 
    EXISTS (
      SELECT 1 FROM dishes d 
      JOIN restaurants r ON d.restaurant_id = r.id 
      WHERE d.id = dish_addons.dish_id AND r.is_active = TRUE
    )
  );

-- Partners can manage their restaurant's add-ons
CREATE POLICY "Partners can manage own addons" ON dish_addons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM dishes d 
      JOIN restaurants r ON d.restaurant_id = r.id 
      WHERE d.id = dish_addons.dish_id AND r.partner_id = auth.uid()
    )
  );

-- ============================================
-- Orders Policies
-- ============================================

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create orders
CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Partners can view orders for their restaurants
CREATE POLICY "Partners can view restaurant orders" ON orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM restaurants WHERE id = orders.restaurant_id AND partner_id = auth.uid())
  );

-- Partners can update orders for their restaurants
CREATE POLICY "Partners can update restaurant orders" ON orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM restaurants WHERE id = orders.restaurant_id AND partner_id = auth.uid())
  );

-- Riders can view their assigned orders
CREATE POLICY "Riders can view assigned orders" ON orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM riders WHERE id = orders.rider_id AND user_id = auth.uid())
  );

-- Riders can update their assigned orders
CREATE POLICY "Riders can update assigned orders" ON orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM riders WHERE id = orders.rider_id AND user_id = auth.uid())
  );

-- Admins can view all orders
CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- Order Items Policies
-- ============================================

-- Users can view their own order items
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_items.order_id AND user_id = auth.uid())
  );

-- Partners can view order items for their restaurants
CREATE POLICY "Partners can view restaurant order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o 
      JOIN restaurants r ON o.restaurant_id = r.id 
      WHERE o.id = order_items.order_id AND r.partner_id = auth.uid()
    )
  );

-- ============================================
-- Cart Items Policies
-- ============================================

-- Users can manage their own cart
CREATE POLICY "Users can manage own cart" ON cart_items
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own cart addons" ON cart_item_addons
  FOR ALL USING (
    EXISTS (SELECT 1 FROM cart_items WHERE id = cart_item_addons.cart_item_id AND user_id = auth.uid())
  );

-- ============================================
-- Reviews Policies
-- ============================================

-- Anyone can view visible reviews
CREATE POLICY "Anyone can view visible reviews" ON reviews
  FOR SELECT USING (is_visible = TRUE);

-- Users can create reviews for their own orders
CREATE POLICY "Users can create own reviews" ON reviews
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (SELECT 1 FROM orders WHERE id = reviews.order_id AND user_id = auth.uid())
  );

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- Payment Methods Policies
-- ============================================

-- Users can manage their own payment methods
CREATE POLICY "Users can manage own payment methods" ON payment_methods
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- Transactions Policies
-- ============================================

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all transactions
CREATE POLICY "Admins can view all transactions" ON transactions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- Promo Codes Policies
-- ============================================

-- Anyone can view active promo codes
CREATE POLICY "Anyone can view active promo codes" ON promo_codes
  FOR SELECT USING (is_active = TRUE);

-- Admins can manage promo codes
CREATE POLICY "Admins can manage promo codes" ON promo_codes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- Admin Settings Policies
-- ============================================

-- Admins can manage settings
CREATE POLICY "Admins can manage settings" ON admin_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Comments
COMMENT ON POLICY "Users can view own profile" ON users IS 'Users can only view their own profile data';
COMMENT ON POLICY "Partners can manage own restaurants" ON restaurants IS 'Partners can only manage restaurants they own';
COMMENT ON POLICY "Admins can view all orders" ON orders IS 'Admins have full visibility of all orders';
