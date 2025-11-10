-- Migration 026: Create favorites table

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, restaurant_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_restaurant_id ON favorites(restaurant_id);

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own favorites
CREATE POLICY "Users can view own favorites"
ON favorites
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can add favorites
CREATE POLICY "Users can add favorites"
ON favorites
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can remove their own favorites
CREATE POLICY "Users can remove own favorites"
ON favorites
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Add comments
COMMENT ON TABLE favorites IS 'User favorite restaurants';
COMMENT ON COLUMN favorites.user_id IS 'User who favorited the restaurant';
COMMENT ON COLUMN favorites.restaurant_id IS 'Favorited restaurant';
