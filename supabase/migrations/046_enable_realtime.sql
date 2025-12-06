-- =====================================================
-- ENABLE REALTIME FOR RIDER DASHBOARD TABLES
-- =====================================================

-- Enable replication for orders table (for available orders)
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- Enable replication for deliveries table (for active delivery updates)
ALTER PUBLICATION supabase_realtime ADD TABLE deliveries;

-- Enable replication for rider_earnings table (for earnings updates)
ALTER PUBLICATION supabase_realtime ADD TABLE rider_earnings;

-- Enable replication for rider_locations table (for location tracking)
ALTER PUBLICATION supabase_realtime ADD TABLE rider_locations;

-- Enable replication for riders table (for rider status updates)
ALTER PUBLICATION supabase_realtime ADD TABLE riders;

-- Verify publications
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
ORDER BY tablename;
