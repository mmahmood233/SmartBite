-- Fix: Change notification type from 'user' to 'system' in admin trigger
-- Run this BEFORE seeding restaurants

CREATE OR REPLACE FUNCTION notify_admin_new_user()
RETURNS TRIGGER AS $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get admin user ID
  SELECT id INTO admin_user_id
  FROM users
  WHERE role = 'admin'
  LIMIT 1;

  -- Only send if admin exists and new user is not admin
  IF admin_user_id IS NOT NULL AND NEW.role != 'admin' THEN
    INSERT INTO notifications (user_id, type, title, message, metadata, read, created_at)
    VALUES (
      admin_user_id,
      'system',  -- FIXED: Changed from 'user' to 'system'
      'New User Registered! 👤',
      'A new ' || NEW.role || ' has joined the platform: ' || COALESCE(NEW.full_name, NEW.email),
      jsonb_build_object(
        'userId', NEW.id,
        'userRole', NEW.role,
        'userName', NEW.full_name,
        'userEmail', NEW.email
      ),
      FALSE,
      NOW()
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Notification trigger fixed! Type changed from "user" to "system"';
END $$;
