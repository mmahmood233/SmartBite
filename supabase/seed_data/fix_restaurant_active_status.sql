-- Fix all restaurants to be active by default
-- Run this if restaurants are showing as inactive

UPDATE restaurants
SET is_active = true
WHERE is_active IS NULL OR is_active = false;

-- Verify the update
SELECT 
  name,
  is_active,
  status,
  created_at
FROM restaurants
ORDER BY created_at DESC;
