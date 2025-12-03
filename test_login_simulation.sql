-- Simulate what Supabase Auth does when logging in

-- Test if password verification works
SELECT 
  email,
  id,
  encrypted_password = crypt('12345678', encrypted_password) as login_would_succeed,
  email_confirmed_at IS NOT NULL as email_is_confirmed,
  banned_until IS NULL as not_banned,
  deleted_at IS NULL as not_deleted,
  CASE 
    WHEN encrypted_password = crypt('12345678', encrypted_password) 
         AND email_confirmed_at IS NOT NULL 
         AND banned_until IS NULL 
         AND deleted_at IS NULL 
    THEN '✅ LOGIN SHOULD WORK'
    ELSE '❌ LOGIN WILL FAIL'
  END as status
FROM auth.users
WHERE email = 'kfcjuffair@wajba.bh';

-- Also check if there are any auth policies blocking this
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'users' AND schemaname = 'auth';
