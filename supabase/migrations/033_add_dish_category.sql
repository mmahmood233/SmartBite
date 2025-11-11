-- Migration 033: Add category column to dishes table

-- Add category column
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS category VARCHAR(100);

-- Add comment
COMMENT ON COLUMN dishes.category IS 'Dish category (e.g., Main Course, Side, Dessert, Beverage, Appetizer, Salad, Breakfast)';

-- Create index for faster category filtering
CREATE INDEX IF NOT EXISTS idx_dishes_category ON dishes(category);
