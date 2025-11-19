-- Create platform_settings table
CREATE TABLE IF NOT EXISTS platform_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage platform settings" ON platform_settings;
DROP POLICY IF EXISTS "Anyone can view platform settings" ON platform_settings;

-- RLS Policies
-- Admins can manage settings
CREATE POLICY "Admins can manage platform settings"
  ON platform_settings
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Everyone can view settings
CREATE POLICY "Anyone can view platform settings"
  ON platform_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_platform_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS platform_settings_updated_at ON platform_settings;

CREATE TRIGGER platform_settings_updated_at
  BEFORE UPDATE ON platform_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_platform_settings_updated_at();

-- Insert default settings
INSERT INTO platform_settings (setting_key, setting_value, description)
VALUES
  ('default_delivery_fee', '0.5', 'Default delivery fee applied to new restaurants (in BD)'),
  ('min_order_amount', '2', 'Minimum order amount (in BD)')
ON CONFLICT (setting_key) DO NOTHING;
