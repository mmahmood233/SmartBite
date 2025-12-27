-- Create missing rider profiles for users with role='rider' but no rider profile

INSERT INTO riders (
  user_id,
  full_name,
  phone,
  vehicle_type,
  status,
  created_at,
  updated_at
)
SELECT 
  u.id as user_id,
  u.full_name,
  COALESCE(NULLIF(u.phone, ''), u.id::text) as phone, -- Use user_id as phone if empty to avoid unique constraint
  'motorcycle' as vehicle_type,
  'offline' as status,
  NOW() as created_at,
  NOW() as updated_at
FROM users u
WHERE u.role = 'rider'
AND NOT EXISTS (
  SELECT 1 FROM riders r WHERE r.user_id = u.id
)
ON CONFLICT (user_id) DO NOTHING;

-- Show the riders that were created
SELECT 
  r.id as rider_id,
  r.user_id,
  r.full_name,
  r.phone,
  r.vehicle_type,
  r.status,
  u.email
FROM riders r
JOIN users u ON u.id = r.user_id
WHERE u.role = 'rider'
ORDER BY r.created_at DESC;
