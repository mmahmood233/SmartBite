-- Migration 024: Add date_of_birth and avatar_url columns to users table

-- Add date_of_birth column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- Add avatar_url column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add comments
COMMENT ON COLUMN users.date_of_birth IS 'User date of birth (optional)';
COMMENT ON COLUMN users.avatar_url IS 'URL to user profile picture (optional)';
