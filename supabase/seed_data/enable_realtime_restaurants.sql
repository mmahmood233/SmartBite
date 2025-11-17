-- Enable real-time for restaurants table
-- This allows clients to subscribe to changes in restaurant status

-- Enable real-time on restaurants table
ALTER PUBLICATION supabase_realtime ADD TABLE restaurants;

-- Verify the publication
-- You can run this to check if it worked:
-- SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
