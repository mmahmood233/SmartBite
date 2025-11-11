-- Migration 034: Add image_url column to dishes table

-- Add image_url column
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add comment
COMMENT ON COLUMN dishes.image_url IS 'URL to the dish image';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_dishes_image_url ON dishes(image_url) WHERE image_url IS NOT NULL;
