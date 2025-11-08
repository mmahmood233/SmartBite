-- Migration 012: Seed Data (Optional - for testing)
-- This file contains sample data for development and testing

-- ============================================
-- Restaurant Categories
-- ============================================
INSERT INTO restaurant_categories (id, name, icon, restaurant_count, display_order, is_active) VALUES
  (uuid_generate_v4(), 'Burgers', NULL, 0, 1, TRUE),
  (uuid_generate_v4(), 'Pizza', NULL, 0, 2, TRUE),
  (uuid_generate_v4(), 'Sushi', NULL, 0, 3, TRUE),
  (uuid_generate_v4(), 'Desserts', NULL, 0, 4, TRUE),
  (uuid_generate_v4(), 'Coffee', NULL, 0, 5, TRUE),
  (uuid_generate_v4(), 'Healthy', NULL, 0, 6, TRUE),
  (uuid_generate_v4(), 'Arabic', NULL, 0, 7, TRUE),
  (uuid_generate_v4(), 'Indian', NULL, 0, 8, TRUE);

-- ============================================
-- Admin Settings
-- ============================================
INSERT INTO admin_settings (id, key, value, description) VALUES
  (uuid_generate_v4(), 'default_delivery_fee', '1.5', 'Default delivery fee in BD'),
  (uuid_generate_v4(), 'platform_commission', '15', 'Platform commission percentage'),
  (uuid_generate_v4(), 'app_version', '2.0.0', 'Current app version'),
  (uuid_generate_v4(), 'maintenance_mode', 'false', 'Maintenance mode flag'),
  (uuid_generate_v4(), 'min_order_amount', '3.0', 'Minimum order amount in BD');

-- ============================================
-- Sample Promo Codes
-- ============================================
INSERT INTO promo_codes (id, code, title, description, type, discount_value, min_order_amount, max_usage, valid_from, valid_until, is_active) VALUES
  (
    uuid_generate_v4(),
    'WELCOME20',
    'Welcome Offer',
    'Get 20% off on your first order',
    'percentage',
    20.00,
    5.00,
    1000,
    NOW(),
    NOW() + INTERVAL '30 days',
    TRUE
  ),
  (
    uuid_generate_v4(),
    'FREEDEL',
    'Free Delivery',
    'Free delivery on orders above BD 10',
    'free_delivery',
    0.00,
    10.00,
    NULL,
    NOW(),
    NOW() + INTERVAL '60 days',
    TRUE
  ),
  (
    uuid_generate_v4(),
    'SAVE5',
    'Save BD 5',
    'Get BD 5 off on orders above BD 15',
    'fixed',
    5.00,
    15.00,
    500,
    NOW(),
    NOW() + INTERVAL '45 days',
    TRUE
  );

-- ============================================
-- Notes
-- ============================================
-- To add test users, restaurants, and orders:
-- 1. Create users through Supabase Auth
-- 2. Insert corresponding records in the users table
-- 3. Add restaurants with partner_id
-- 4. Add menu items and orders

-- Example: Create a test user (run in Supabase Dashboard or via API)
-- This should be done through Supabase Auth, not directly in SQL

-- Example: Create a test restaurant (after creating partner user)
/*
INSERT INTO restaurants (
  id, partner_id, name, category, description, address, phone, 
  delivery_fee, min_order, avg_prep_time, is_open, is_active
) VALUES (
  uuid_generate_v4(),
  '<partner_user_id>',
  'Burger Palace',
  'Burgers',
  'Best burgers in town',
  'Building 123, Road 456, Manama',
  '+973 3999 8888',
  1.5,
  5.0,
  '25-30 min',
  TRUE,
  TRUE
);
*/

-- Comments
COMMENT ON TABLE restaurant_categories IS 'Seeded with common restaurant categories';
COMMENT ON TABLE admin_settings IS 'Seeded with default platform settings';
COMMENT ON TABLE promo_codes IS 'Seeded with sample promotional codes';
