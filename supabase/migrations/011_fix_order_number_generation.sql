-- Migration 011: Fix Order Number Generation (Race Condition)

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS generate_order_number_trigger ON orders;
DROP FUNCTION IF EXISTS generate_order_number();

-- Create a sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 1;

-- Create improved function using sequence (atomic, no race condition)
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  new_order_number VARCHAR(20);
  counter INTEGER;
BEGIN
  -- Use sequence to get next number atomically
  counter := nextval('order_number_seq');
  
  -- Generate order number: WAJ + 5 digits (supports up to 99,999 orders)
  new_order_number := 'WAJ' || LPAD(counter::TEXT, 5, '0');
  NEW.order_number := new_order_number;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger
CREATE TRIGGER generate_order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW 
  WHEN (NEW.order_number IS NULL)
  EXECUTE FUNCTION generate_order_number();

-- Set sequence to current max + 1 to avoid conflicts with existing orders
DO $$
DECLARE
  max_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 4) AS INTEGER)), 0)
  INTO max_num
  FROM orders
  WHERE order_number LIKE 'WAJ%';
  
  PERFORM setval('order_number_seq', max_num + 1, false);
END $$;

COMMENT ON FUNCTION generate_order_number() IS 'Auto-generate unique order number using sequence (WAJ#####) - race condition safe';
