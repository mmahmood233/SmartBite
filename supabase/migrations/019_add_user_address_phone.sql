-- Migration 019: Add address and phone columns to users table

-- Add address column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS address TEXT;

-- Add phone column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- Add comments
COMMENT ON COLUMN users.address IS 'User delivery address';
COMMENT ON COLUMN users.phone IS 'User phone number for delivery';
