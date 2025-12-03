-- Force logout all sessions and refresh auth
-- This will invalidate all existing sessions

-- Delete all refresh tokens (forces re-login)
DELETE FROM auth.refresh_tokens;

-- Verify all partner accounts exist and passwords are correct
SELECT 
  email,
  encrypted_password = crypt('12345678', encrypted_password) as password_correct,
  created_at,
  updated_at
FROM auth.users
WHERE email LIKE '%@wajba.bh'
ORDER BY email;
