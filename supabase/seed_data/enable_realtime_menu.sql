-- Enable real-time for menu management tables

-- Add dishes table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE dishes;

-- Add menu_categories table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE menu_categories;

-- Verify the tables are added
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
