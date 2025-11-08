/**
 * Authentication Service
 * 
 * All authentication-related API calls.
 * Easy for AI to read and understand.
 */

import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type User = Database['public']['Tables']['users']['Row'];

/**
 * Sign up with email and password
 * 
 * @param email - User email
 * @param password - User password
 * @param fullName - User's full name
 * @returns User data
 */
export const signUp = async (
  email: string,
  password: string,
  fullName: string
) => {
  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    console.error('Sign up error:', authError);
    throw authError;
  }

  if (!authData.user) {
    throw new Error('User creation failed');
  }

  // 2. Create user profile
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert({
      id: authData.user.id,
      email,
      full_name: fullName,
      role: 'customer',
    })
    .select()
    .single();

  if (userError) {
    console.error('User profile creation error:', userError);
    throw userError;
  }

  return { auth: authData, user: userData };
};

/**
 * Sign in with email and password
 * 
 * @param email - User email
 * @param password - User password
 * @returns Session and user data
 */
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Sign in error:', error);
    throw error;
  }

  // Fetch user profile
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (userError) {
    console.error('Error fetching user profile:', userError);
  }

  return { session: data.session, user: userData };
};

/**
 * Sign out current user
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

/**
 * Get current user session
 * 
 * @returns Current session or null
 */
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Get session error:', error);
    throw error;
  }

  return session;
};

/**
 * Get current user profile
 * 
 * @returns User profile or null
 */
export const getCurrentUserProfile = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
};

/**
 * Update user profile
 * 
 * @param userId - User ID
 * @param updates - Profile updates
 * @returns Updated user profile
 */
export const updateUserProfile = async (
  userId: string,
  updates: Partial<User>
): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }

  return data;
};

/**
 * Change password
 * 
 * @param newPassword - New password
 */
export const changePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error('Change password error:', error);
    throw error;
  }
};

/**
 * Reset password (send email)
 * 
 * @param email - User email
 */
export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

/**
 * Sign in with Apple
 */
export const signInWithApple = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
  });

  if (error) {
    console.error('Apple sign in error:', error);
    throw error;
  }

  return data;
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });

  if (error) {
    console.error('Google sign in error:', error);
    throw error;
  }

  return data;
};
