-- NUCLEAR OPTION: Completely disable all notification functionality
-- This will allow riders to accept orders immediately

-- 1. Drop only user-defined triggers on orders table (not system constraint triggers)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT tgname 
        FROM pg_trigger 
        WHERE tgrelid = 'orders'::regclass 
        AND NOT tgisinternal 
        AND tgname NOT LIKE 'RI_ConstraintTrigger%'
    ) LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(r.tgname) || ' ON orders';
        RAISE NOTICE 'Dropped trigger: %', r.tgname;
    END LOOP;
END $$;

-- 2. Drop only user-defined triggers on users table (not system constraint triggers)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT tgname 
        FROM pg_trigger 
        WHERE tgrelid = 'users'::regclass 
        AND NOT tgisinternal 
        AND tgname NOT LIKE 'RI_ConstraintTrigger%'
    ) LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(r.tgname) || ' ON users';
        RAISE NOTICE 'Dropped trigger: %', r.tgname;
    END LOOP;
END $$;

-- 3. Remove the foreign key constraint on notifications
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;

-- 4. Fix orphaned orders
UPDATE orders
SET user_id = NULL
WHERE user_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM users u WHERE u.id = orders.user_id);

-- 5. Show what triggers remain
SELECT 
    schemaname,
    tablename,
    tgname as trigger_name
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE schemaname = 'public'
AND tablename IN ('orders', 'users', 'notifications')
AND NOT tgisinternal;
