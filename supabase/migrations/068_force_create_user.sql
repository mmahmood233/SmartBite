-- Force create the missing user directly
-- This user has orders but doesn't exist in users table

INSERT INTO users (id, email, full_name, phone, role, created_at, updated_at)
VALUES (
  '3acc0831-64f1-4342-93bf-3994912695c9',
  'customer@example.com',
  'Mohammed',
  '11223344',
  'customer'::user_role,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  updated_at = NOW();
