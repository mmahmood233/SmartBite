-- Migration 009: Create Admin Feature Tables

-- Promo codes
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  type discount_type NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL CHECK (discount_value >= 0),
  min_order_amount DECIMAL(10,2) DEFAULT 0.0 NOT NULL CHECK (min_order_amount >= 0),
  max_usage INTEGER,
  used_count INTEGER DEFAULT 0 NOT NULL,
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CHECK (valid_until > valid_from)
);

-- Admin settings
CREATE TABLE admin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_is_active ON promo_codes(is_active);
CREATE INDEX idx_promo_codes_valid_from ON promo_codes(valid_from);
CREATE INDEX idx_promo_codes_valid_until ON promo_codes(valid_until);

-- Active promo codes
CREATE INDEX idx_promo_active_dates ON promo_codes(is_active, valid_from, valid_until)
WHERE is_active = TRUE;

CREATE INDEX idx_admin_settings_key ON admin_settings(key);

-- Add foreign key to orders (now that promo_codes table exists)
ALTER TABLE orders 
  ADD CONSTRAINT fk_orders_promo_code 
  FOREIGN KEY (promo_code_id) REFERENCES promo_codes(id) ON DELETE SET NULL;

-- Comments
COMMENT ON TABLE promo_codes IS 'Discount and promotional codes';
COMMENT ON TABLE admin_settings IS 'Platform-wide settings';

COMMENT ON COLUMN promo_codes.code IS 'Promo code string (e.g., SAVE20)';
COMMENT ON COLUMN promo_codes.type IS 'Discount type: percentage, fixed, or free_delivery';
COMMENT ON COLUMN promo_codes.discount_value IS 'Discount amount or percentage';
COMMENT ON COLUMN promo_codes.min_order_amount IS 'Minimum order value to apply promo';
COMMENT ON COLUMN promo_codes.max_usage IS 'Maximum number of times code can be used (NULL = unlimited)';
COMMENT ON COLUMN promo_codes.used_count IS 'Current number of times code has been used';
COMMENT ON COLUMN admin_settings.key IS 'Setting key (e.g., default_delivery_fee, platform_commission)';
COMMENT ON COLUMN admin_settings.value IS 'Setting value (stored as text)';
