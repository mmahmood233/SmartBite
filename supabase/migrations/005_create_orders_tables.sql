-- Migration 005: Create Orders and Cart Tables

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE RESTRICT,
  delivery_address_id UUID NOT NULL REFERENCES user_addresses(id) ON DELETE RESTRICT,
  status order_status NOT NULL DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee DECIMAL(10,2) DEFAULT 0.0 NOT NULL CHECK (delivery_fee >= 0),
  discount_amount DECIMAL(10,2) DEFAULT 0.0 NOT NULL CHECK (discount_amount >= 0),
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  payment_method payment_method NOT NULL,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  promo_code_id UUID, -- FK added later
  delivery_notes TEXT,
  estimated_delivery_time TIMESTAMPTZ,
  actual_delivery_time TIMESTAMPTZ,
  rider_id UUID, -- FK added later
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Order items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  dish_id UUID NOT NULL REFERENCES dishes(id) ON DELETE RESTRICT,
  dish_name VARCHAR(200) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  special_request TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Order item add-ons
CREATE TABLE order_item_addons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  addon_id UUID NOT NULL REFERENCES dish_addons(id) ON DELETE RESTRICT,
  addon_name VARCHAR(100) NOT NULL,
  addon_price DECIMAL(10,2) NOT NULL CHECK (addon_price >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Cart items
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  dish_id UUID NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  special_request TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Cart item add-ons
CREATE TABLE cart_item_addons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_item_id UUID NOT NULL REFERENCES cart_items(id) ON DELETE CASCADE,
  addon_id UUID NOT NULL REFERENCES dish_addons(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_restaurant_id ON orders(restaurant_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);

-- Active orders for partners
CREATE INDEX idx_orders_restaurant_status ON orders(restaurant_id, status) 
WHERE status IN ('pending', 'confirmed', 'preparing', 'ready_for_pickup');

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_dish_id ON order_items(dish_id);

CREATE INDEX idx_order_item_addons_order_item_id ON order_item_addons(order_item_id);

CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_restaurant_id ON cart_items(restaurant_id);
CREATE INDEX idx_cart_items_dish_id ON cart_items(dish_id);
CREATE INDEX idx_cart_items_updated_at ON cart_items(updated_at);

-- Cart cleanup index (items older than 7 days)
-- Note: This index helps with cart cleanup queries
-- The WHERE clause is removed because NOW() is not immutable
CREATE INDEX idx_cart_old_items ON cart_items(updated_at);

CREATE INDEX idx_cart_item_addons_cart_item_id ON cart_item_addons(cart_item_id);

-- Comments
COMMENT ON TABLE orders IS 'Complete order records';
COMMENT ON TABLE order_items IS 'Items within an order';
COMMENT ON TABLE order_item_addons IS 'Add-ons for order items (snapshot)';
COMMENT ON TABLE cart_items IS 'Temporary cart storage';
COMMENT ON TABLE cart_item_addons IS 'Add-ons for cart items';

COMMENT ON COLUMN orders.order_number IS 'Human-readable order number (e.g., WAJ1234)';
COMMENT ON COLUMN orders.subtotal IS 'Sum of all items before fees and discounts';
COMMENT ON COLUMN orders.total_amount IS 'Final amount: subtotal + delivery_fee - discount_amount';
COMMENT ON COLUMN order_items.dish_name IS 'Dish name snapshot at time of order';
COMMENT ON COLUMN order_item_addons.addon_name IS 'Add-on name snapshot at time of order';
COMMENT ON COLUMN order_item_addons.addon_price IS 'Add-on price snapshot at time of order';
