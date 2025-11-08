-- Migration 003: Create Users and Authentication Tables

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) UNIQUE,
  profile_image TEXT,
  role user_role DEFAULT 'customer' NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE NOT NULL,
  phone_verified BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- User addresses
CREATE TABLE user_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label VARCHAR(50),
  building VARCHAR(100),
  road VARCHAR(100),
  block VARCHAR(100),
  area VARCHAR(100) NOT NULL,
  city VARCHAR(100) DEFAULT 'Manama' NOT NULL,
  postal_code VARCHAR(20),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  contact_number VARCHAR(20),
  notes TEXT,
  is_default BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- User favorites
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL, -- FK added later
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, restaurant_id)
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX idx_user_addresses_is_default ON user_addresses(is_default);

CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_restaurant_id ON user_favorites(restaurant_id);

-- Comments
COMMENT ON TABLE users IS 'User accounts (customer, partner, admin)';
COMMENT ON TABLE user_addresses IS 'Saved delivery addresses for users';
COMMENT ON TABLE user_favorites IS 'User favorite restaurants';

COMMENT ON COLUMN users.role IS 'User type: customer, partner, or admin';
COMMENT ON COLUMN user_addresses.is_default IS 'Default delivery address flag';
COMMENT ON COLUMN user_addresses.latitude IS 'GPS latitude for delivery tracking';
COMMENT ON COLUMN user_addresses.longitude IS 'GPS longitude for delivery tracking';
