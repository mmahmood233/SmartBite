-- Migration 004: Create Restaurants and Menu Tables

-- Restaurant categories (platform-wide, admin managed)
CREATE TABLE restaurant_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(10),
  restaurant_count INTEGER DEFAULT 0 NOT NULL,
  display_order INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Restaurants
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  logo TEXT,
  banner_image TEXT,
  address VARCHAR(255) NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  rating DECIMAL(3,2) DEFAULT 0.0 NOT NULL CHECK (rating >= 0 AND rating <= 5),
  total_reviews INTEGER DEFAULT 0 NOT NULL,
  total_orders INTEGER DEFAULT 0 NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0.0 NOT NULL CHECK (delivery_fee >= 0),
  min_order DECIMAL(10,2) DEFAULT 0.0 NOT NULL CHECK (min_order >= 0),
  avg_prep_time VARCHAR(50),
  is_open BOOLEAN DEFAULT TRUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Menu categories (within a restaurant)
CREATE TABLE menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Dishes (menu items)
CREATE TABLE dishes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  image TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  calories INTEGER,
  preparation_time INTEGER,
  is_vegetarian BOOLEAN DEFAULT FALSE NOT NULL,
  is_vegan BOOLEAN DEFAULT FALSE NOT NULL,
  is_spicy BOOLEAN DEFAULT FALSE NOT NULL,
  is_popular BOOLEAN DEFAULT FALSE NOT NULL,
  is_available BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Dish add-ons
CREATE TABLE dish_addons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dish_id UUID NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  is_available BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_restaurant_categories_name ON restaurant_categories(name);
CREATE INDEX idx_restaurant_categories_display_order ON restaurant_categories(display_order);
CREATE INDEX idx_restaurant_categories_is_active ON restaurant_categories(is_active);

CREATE INDEX idx_restaurants_partner_id ON restaurants(partner_id);
CREATE INDEX idx_restaurants_category ON restaurants(category);
CREATE INDEX idx_restaurants_rating ON restaurants(rating DESC);
CREATE INDEX idx_restaurants_is_open ON restaurants(is_open);
CREATE INDEX idx_restaurants_is_active ON restaurants(is_active);
CREATE INDEX idx_restaurants_created_at ON restaurants(created_at);

CREATE INDEX idx_menu_categories_restaurant_id ON menu_categories(restaurant_id);
CREATE INDEX idx_menu_categories_display_order ON menu_categories(display_order);

CREATE INDEX idx_dishes_restaurant_id ON dishes(restaurant_id);
CREATE INDEX idx_dishes_category_id ON dishes(category_id);
CREATE INDEX idx_dishes_is_available ON dishes(is_available);
CREATE INDEX idx_dishes_is_popular ON dishes(is_popular);
CREATE INDEX idx_dishes_price ON dishes(price);
CREATE INDEX idx_dishes_restaurant_category ON dishes(restaurant_id, category_id);

CREATE INDEX idx_dish_addons_dish_id ON dish_addons(dish_id);
CREATE INDEX idx_dish_addons_is_available ON dish_addons(is_available);

-- Add foreign key to user_favorites (now that restaurants table exists)
ALTER TABLE user_favorites 
  ADD CONSTRAINT fk_user_favorites_restaurant 
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE;

-- Comments
COMMENT ON TABLE restaurant_categories IS 'Platform-wide restaurant categories (admin managed)';
COMMENT ON TABLE restaurants IS 'Restaurant information and metadata';
COMMENT ON TABLE menu_categories IS 'Menu sections within a restaurant';
COMMENT ON TABLE dishes IS 'Menu items/dishes';
COMMENT ON TABLE dish_addons IS 'Optional add-ons for dishes';

COMMENT ON COLUMN restaurants.partner_id IS 'Restaurant owner/partner user ID';
COMMENT ON COLUMN restaurants.rating IS 'Average rating from reviews (0-5)';
COMMENT ON COLUMN restaurants.delivery_fee IS 'Delivery charge in BD';
COMMENT ON COLUMN restaurants.min_order IS 'Minimum order amount in BD';
COMMENT ON COLUMN restaurants.avg_prep_time IS 'Average preparation time (e.g., "25-30 min")';
COMMENT ON COLUMN dishes.is_popular IS 'Marked as popular item';
