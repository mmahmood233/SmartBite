-- Migration 017: Make order_id nullable in reviews table
-- This allows users to leave reviews without having an order

ALTER TABLE reviews 
  ALTER COLUMN order_id DROP NOT NULL;
