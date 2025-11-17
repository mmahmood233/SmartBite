-- Migration 035: Add restaurant status field and operating hours

-- Create enum for restaurant status (if not exists)
DO $$ BEGIN
  CREATE TYPE restaurant_status AS ENUM ('open', 'closed', 'busy');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add status column to restaurants table (if not exists)
DO $$ BEGIN
  ALTER TABLE restaurants 
  ADD COLUMN status restaurant_status DEFAULT 'closed' NOT NULL;
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

-- Add operating hours columns (if not exist)
DO $$ BEGIN
  ALTER TABLE restaurants
  ADD COLUMN opening_time TIME DEFAULT '09:00:00';
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE restaurants
  ADD COLUMN closing_time TIME DEFAULT '22:00:00';
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE restaurants
  ADD COLUMN auto_status_update BOOLEAN DEFAULT true NOT NULL;
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

-- Migrate existing data: set status based on is_open (if is_open column exists)
DO $$ BEGIN
  UPDATE restaurants 
  SET status = CASE 
    WHEN is_open = true THEN 'open'::restaurant_status
    ELSE 'closed'::restaurant_status
  END
  WHERE status IS NOT NULL;
EXCEPTION
  WHEN undefined_column THEN null;
END $$;

-- Drop the old is_open column (if exists)
DO $$ BEGIN
  ALTER TABLE restaurants DROP COLUMN IF EXISTS is_open;
EXCEPTION
  WHEN undefined_column THEN null;
END $$;

-- Add index for status (if not exists)
CREATE INDEX IF NOT EXISTS idx_restaurants_status ON restaurants(status);

-- Add constraint: opening and closing times must be different
ALTER TABLE restaurants 
DROP CONSTRAINT IF EXISTS check_different_times;

ALTER TABLE restaurants 
ADD CONSTRAINT check_different_times 
CHECK (opening_time != closing_time);

-- Function to check if restaurant should be open based on operating hours
CREATE OR REPLACE FUNCTION should_restaurant_be_open(
  p_opening_time TIME,
  p_closing_time TIME
) RETURNS BOOLEAN AS $$
DECLARE
  v_current_time TIME;
BEGIN
  -- Get current time in Bahrain timezone (UTC+3)
  v_current_time := (NOW() AT TIME ZONE 'Asia/Bahrain')::TIME;
  
  -- Handle cases where closing time is after midnight
  IF p_closing_time < p_opening_time THEN
    -- Restaurant is open past midnight (e.g., 10 PM to 2 AM)
    RETURN v_current_time >= p_opening_time OR v_current_time < p_closing_time;
  ELSE
    -- Normal hours (e.g., 9 AM to 10 PM)
    RETURN v_current_time >= p_opening_time AND v_current_time < p_closing_time;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-update restaurant status based on operating hours
CREATE OR REPLACE FUNCTION auto_update_restaurant_status()
RETURNS void AS $$
BEGIN
  UPDATE restaurants
  SET status = CASE
    WHEN should_restaurant_be_open(opening_time, closing_time) THEN 'open'::restaurant_status
    ELSE 'closed'::restaurant_status
  END
  WHERE auto_status_update = true
    AND status != 'busy'; -- Don't change if manually set to busy
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run every 5 minutes (requires pg_cron extension)
-- Note: This requires pg_cron to be enabled in Supabase
-- SELECT cron.schedule(
--   'auto-update-restaurant-status',
--   '*/5 * * * *', -- Every 5 minutes
--   $$ SELECT auto_update_restaurant_status(); $$
-- );

-- Add comments
COMMENT ON COLUMN restaurants.status IS 'Restaurant operational status: open, closed, or busy';
COMMENT ON COLUMN restaurants.opening_time IS 'Daily opening time (24-hour format)';
COMMENT ON COLUMN restaurants.closing_time IS 'Daily closing time (24-hour format)';
COMMENT ON COLUMN restaurants.auto_status_update IS 'Enable automatic status updates based on operating hours';
COMMENT ON FUNCTION should_restaurant_be_open IS 'Check if restaurant should be open based on current time and operating hours';
COMMENT ON FUNCTION auto_update_restaurant_status IS 'Automatically update restaurant status based on operating hours';
