-- Migration 027: Create addresses table

-- Create addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label VARCHAR(50) NOT NULL, -- e.g., "Home", "Work", "Other"
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city VARCHAR(100) NOT NULL,
  area VARCHAR(100),
  building VARCHAR(50),
  floor VARCHAR(20),
  apartment VARCHAR(20),
  additional_directions TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  is_default BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_is_default ON addresses(user_id, is_default);

-- Enable RLS
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own addresses
CREATE POLICY "Users can view own addresses"
ON addresses
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can add addresses
CREATE POLICY "Users can add addresses"
ON addresses
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can update their own addresses
CREATE POLICY "Users can update own addresses"
ON addresses
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Users can delete their own addresses
CREATE POLICY "Users can delete own addresses"
ON addresses
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Function to ensure only one default address per user
CREATE OR REPLACE FUNCTION ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
  -- If setting this address as default
  IF NEW.is_default = true THEN
    -- Unset all other addresses for this user
    UPDATE addresses
    SET is_default = false
    WHERE user_id = NEW.user_id
    AND id != NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce single default address
CREATE TRIGGER ensure_single_default_address_trigger
BEFORE INSERT OR UPDATE ON addresses
FOR EACH ROW
EXECUTE FUNCTION ensure_single_default_address();

-- Add comments
COMMENT ON TABLE addresses IS 'User saved addresses';
COMMENT ON COLUMN addresses.label IS 'Address label (Home, Work, Other)';
COMMENT ON COLUMN addresses.is_default IS 'Whether this is the default delivery address';
