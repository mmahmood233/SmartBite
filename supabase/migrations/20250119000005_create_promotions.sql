-- Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed', 'free_delivery')),
  discount_value DECIMAL(10, 2),
  min_order_amount DECIMAL(10, 2) DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  max_usage INTEGER,
  current_usage INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create index for active promotions
CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(is_active);
CREATE INDEX IF NOT EXISTS idx_promotions_valid_dates ON promotions(valid_from, valid_until);

-- Enable RLS
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Admin can do everything (check if user is admin via auth.jwt)
CREATE POLICY "Admins can manage promotions"
  ON promotions
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Everyone can view active promotions
CREATE POLICY "Anyone can view active promotions"
  ON promotions
  FOR SELECT
  TO authenticated
  USING (is_active = true AND valid_from <= NOW() AND valid_until >= NOW());

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_promotions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER promotions_updated_at
  BEFORE UPDATE ON promotions
  FOR EACH ROW
  EXECUTE FUNCTION update_promotions_updated_at();

-- Insert sample promotions
INSERT INTO promotions (title, description, type, discount_value, min_order_amount, valid_from, valid_until, max_usage, is_active)
VALUES
  ('Weekend Special', 'Get 20% off on all orders this weekend', 'percentage', 20, 0, NOW(), NOW() + INTERVAL '30 days', 1000, true),
  ('Free Delivery', 'Free delivery on orders above BD 10', 'free_delivery', 0, 10, NOW(), NOW() + INTERVAL '60 days', NULL, true),
  ('New User Offer', 'BD 5 off on your first order', 'fixed', 5, 0, NOW(), NOW() + INTERVAL '90 days', 500, true),
  ('Holiday Feast', '25% off on orders above BD 20', 'percentage', 25, 20, NOW(), NOW() + INTERVAL '15 days', 200, true);
