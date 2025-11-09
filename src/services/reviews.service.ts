/**
 * Reviews Service
 * 
 * All review-related API calls.
 */

import { supabase } from '../lib/supabase';

// Temporary types until database.ts is regenerated
type Review = {
  id: string;
  user_id: string;
  restaurant_id: string;
  order_id: string | null;
  rating: number;
  comment: string | null;
  photo_url: string | null;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};

type ReviewInsert = {
  user_id: string;
  restaurant_id: string;
  order_id: string | null;
  rating: number;
  comment?: string | null;
  photo_url?: string | null;
  is_visible?: boolean;
};

/**
 * Create a new review
 * 
 * @param reviewData - Review details
 * @returns Created review
 */
export const createReview = async (reviewData: ReviewInsert): Promise<Review> => {
  const { data, error } = await supabase
    .from('reviews')
    .insert(reviewData as any)
    .select()
    .single();

  if (error) {
    console.error('Error creating review:', error);
    throw error;
  }

  return data;
};

/**
 * Fetch reviews for a restaurant
 * 
 * @param restaurantId - Restaurant ID
 * @returns List of reviews
 */
export const fetchRestaurantReviews = async (restaurantId: string): Promise<Review[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      users (
        full_name,
        profile_image
      )
    `)
    .eq('restaurant_id', restaurantId)
    .eq('is_visible', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }

  return data || [];
};

/**
 * Check if user has reviewed a restaurant
 * 
 * @param userId - User ID
 * @param restaurantId - Restaurant ID
 * @returns True if user has already reviewed
 */
export const hasUserReviewed = async (
  userId: string,
  restaurantId: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('id')
    .eq('user_id', userId)
    .eq('restaurant_id', restaurantId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error checking review:', error);
  }

  return !!data;
};
