-- Migration 006: Create Delivery and Tracking Tables

-- Riders (delivery personnel)
CREATE TABLE riders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  profile_image TEXT,
  vehicle_type VARCHAR(50),
  vehicle_number VARCHAR(50),
  rating DECIMAL(3,2) DEFAULT 0.0 NOT NULL CHECK (rating >= 0 AND rating <= 5),
  total_deliveries INTEGER DEFAULT 0 NOT NULL,
  is_available BOOLEAN DEFAULT TRUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Order tracking (status history)
CREATE TABLE order_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_riders_user_id ON riders(user_id);
CREATE INDEX idx_riders_phone ON riders(phone);
CREATE INDEX idx_riders_is_available ON riders(is_available);
CREATE INDEX idx_riders_rating ON riders(rating DESC);

CREATE INDEX idx_order_tracking_order_id ON order_tracking(order_id);
CREATE INDEX idx_order_tracking_created_at ON order_tracking(created_at DESC);

-- Add foreign key to orders (now that riders table exists)
ALTER TABLE orders 
  ADD CONSTRAINT fk_orders_rider 
  FOREIGN KEY (rider_id) REFERENCES riders(id) ON DELETE SET NULL;

-- Active orders for riders
CREATE INDEX idx_orders_rider_status ON orders(rider_id, status) 
WHERE status = 'out_for_delivery';

-- Comments
COMMENT ON TABLE riders IS 'Delivery personnel information';
COMMENT ON TABLE order_tracking IS 'Real-time order status updates and location tracking';

COMMENT ON COLUMN riders.vehicle_type IS 'Vehicle type: bike, car, motorcycle, etc.';
COMMENT ON COLUMN riders.rating IS 'Average rating from customers (0-5)';
COMMENT ON COLUMN riders.is_available IS 'Currently available for deliveries';
COMMENT ON COLUMN order_tracking.latitude IS 'Current GPS latitude (for rider location)';
COMMENT ON COLUMN order_tracking.longitude IS 'Current GPS longitude (for rider location)';
