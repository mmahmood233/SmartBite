-- =====================================================
-- ADD RIDER ROLE TO USER_ROLE ENUM
-- =====================================================

-- Add 'rider' to the user_role enum type
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'rider';

-- Update comment to reflect new role
COMMENT ON COLUMN users.role IS 'User type: customer, partner, admin, or rider';
