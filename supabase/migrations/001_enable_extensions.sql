-- Migration 001: Enable PostgreSQL Extensions
-- Run this first before creating any tables

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for location features (optional, for future use)
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable pg_trgm for fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Comments
COMMENT ON EXTENSION "uuid-ossp" IS 'UUID generation functions';
COMMENT ON EXTENSION pg_trgm IS 'Text similarity measurement and index searching based on trigrams';
