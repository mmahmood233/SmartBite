/**
 * Services Index
 * 
 * Central export for all API services.
 * Makes imports cleaner and easier for AI to understand.
 */

// Authentication
export * from './auth.service';

// Restaurants
export * from './restaurants.service';

// Orders
export * from './orders.service';

// Re-export supabase client for direct queries if needed
export { supabase } from '../lib/supabase';
