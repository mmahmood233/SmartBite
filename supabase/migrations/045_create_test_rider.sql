-- =====================================================
-- CREATE TEST RIDER ACCOUNT
-- This creates everything in one transaction
-- =====================================================

DO $$
DECLARE
  new_user_id UUID;
  new_auth_id UUID;
BEGIN
  -- Generate a new UUID for the user
  new_user_id := gen_random_uuid();
  
  -- 1. Create auth user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    'rider@test.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  );

  -- 2. Create public.users record
  INSERT INTO public.users (id, email, full_name, phone, role)
  VALUES (
    new_user_id,
    'rider@test.com',
    'Test Rider',
    '+973 1234 5678',
    'rider'
  );

  -- 3. Create rider profile
  INSERT INTO public.riders (user_id, full_name, phone, vehicle_type)
  VALUES (
    new_user_id,
    'Test Rider',
    '+973 1234 5678',
    'motorcycle'
  );

  -- Show success message
  RAISE NOTICE 'Test rider created successfully!';
  RAISE NOTICE 'Email: rider@test.com';
  RAISE NOTICE 'Password: password123';
  RAISE NOTICE 'User ID: %', new_user_id;
  
END $$;

-- Verify the rider was created
SELECT 
  u.id,
  u.email,
  u.full_name,
  u.role,
  r.vehicle_type,
  r.status
FROM public.users u
JOIN public.riders r ON r.user_id = u.id
WHERE u.email = 'rider@test.com';
