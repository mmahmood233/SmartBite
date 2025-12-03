-- Fix KFC user profile with correct ID from auth

-- Delete old profile if exists
DELETE FROM users WHERE email = 'kfcjuffair@wajba.bh';

-- Create profile with correct ID from auth
INSERT INTO users (
  id,
  email,
  full_name,
  phone,
  role,
  is_active,
  email_verified,
  phone_verified
) VALUES (
  '129032cf-6f25-4666-8153-b55e8ca7a97d',
  'kfcjuffair@wajba.bh',
  'KFC Juffair Manager',
  '+973 1700 5000',
  'partner',
  TRUE,
  TRUE,
  TRUE
);

-- Link to restaurant
UPDATE restaurants 
SET partner_id = '129032cf-6f25-4666-8153-b55e8ca7a97d'
WHERE name LIKE '%KFC%';

-- Verify
SELECT 
  u.email,
  u.full_name,
  u.role,
  r.name as restaurant
FROM users u
LEFT JOIN restaurants r ON r.partner_id = u.id
WHERE u.email = 'kfcjuffair@wajba.bh';
