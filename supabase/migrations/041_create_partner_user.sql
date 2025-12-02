-- Migration 041: Create Partner User for Restaurant
-- This creates a partner user that can be linked to restaurants

DO $$
DECLARE
  partner_user_id UUID;
BEGIN
  -- Generate a UUID for the partner user
  partner_user_id := '99999999-9999-9999-9999-999999999999'::uuid;

  -- Insert into auth.users (Supabase authentication)
  -- Note: In production, users should sign up through the app
  -- This is for seeding/testing purposes only
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    role,
    aud
  ) VALUES (
    partner_user_id,
    '00000000-0000-0000-0000-000000000000',
    'partner@mcdonalds.bh',
    crypt('Partner@123', gen_salt('bf')), -- Password: Partner@123
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"McDonald''s Manager"}'::jsonb,
    NOW(),
    NOW(),
    'authenticated',
    'authenticated'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Insert into users table (application users)
  INSERT INTO users (
    id,
    email,
    full_name,
    phone,
    profile_image,
    role,
    is_active,
    email_verified,
    phone_verified,
    created_at,
    updated_at
  ) VALUES (
    partner_user_id,
    'partner@mcdonalds.bh',
    'McDonald''s Manager',
    '+973 1758 8888',
    NULL,
    'partner',
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ Partner User Created Successfully!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Email: partner@mcdonalds.bh';
  RAISE NOTICE 'Password: Partner@123';
  RAISE NOTICE 'Role: partner';
  RAISE NOTICE 'User ID: %', partner_user_id;
  RAISE NOTICE '========================================';
  RAISE NOTICE '⚠️  IMPORTANT: Change password after first login!';
  RAISE NOTICE '========================================';

END $$;
