/**
 * Supabase Client Configuration
 * 
 * This file sets up the Supabase client for the entire app.
 * It handles authentication, storage, and real-time subscriptions.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// Get environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase URL or Anon Key is missing. Check your .env file.');
}

/**
 * Supabase Client
 * 
 * Features:
 * - Auto-refresh tokens
 * - Persistent sessions (stored in AsyncStorage)
 * - Type-safe database queries
 * - Real-time subscriptions
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * Helper function to check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

/**
 * Helper function to get current user
 */
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

/**
 * Helper function to sign out
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

// Export types for convenience
export type { Database } from '../types/database';
