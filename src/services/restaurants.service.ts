/**
 * Restaurant Service
 * 
 * All restaurant-related API calls.
 * Easy for AI to read and understand.
 */

import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];
type Dish = Database['public']['Tables']['dishes']['Row'];

/**
 * Fetch all active restaurants
 * 
 * @param category - Optional category filter
 * @param searchQuery - Optional search term
 * @returns List of restaurants
 */
export const fetchRestaurants = async (
  category?: string,
  searchQuery?: string
): Promise<Restaurant[]> => {
  let query = supabase
    .from('restaurants')
    .select('*')
    .eq('is_active', true)
    .eq('is_open', true)
    .order('rating', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }

  return data || [];
};

/**
 * Fetch single restaurant by ID
 * 
 * @param restaurantId - Restaurant ID
 * @returns Restaurant details
 */
export const fetchRestaurantById = async (
  restaurantId: string
): Promise<Restaurant | null> => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', restaurantId)
    .single();

  if (error) {
    console.error('Error fetching restaurant:', error);
    throw error;
  }

  return data;
};

/**
 * Fetch restaurant menu (dishes)
 * 
 * @param restaurantId - Restaurant ID
 * @returns List of dishes with add-ons
 */
export const fetchRestaurantMenu = async (
  restaurantId: string
): Promise<Dish[]> => {
  const { data, error } = await supabase
    .from('dishes')
    .select(`
      *,
      menu_categories (
        id,
        name
      ),
      dish_addons (
        id,
        name,
        price,
        is_available
      )
    `)
    .eq('restaurant_id', restaurantId)
    .eq('is_available', true)
    .order('is_popular', { ascending: false });

  if (error) {
    console.error('Error fetching menu:', error);
    throw error;
  }

  return data || [];
};

/**
 * Fetch featured/popular restaurants
 * 
 * @param limit - Number of restaurants to fetch
 * @returns List of top-rated restaurants
 */
export const fetchFeaturedRestaurants = async (
  limit: number = 10
): Promise<Restaurant[]> => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('is_active', true)
    .eq('is_open', true)
    .gte('rating', 4.0)
    .order('rating', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured restaurants:', error);
    throw error;
  }

  return data || [];
};

/**
 * Search restaurants by name or category
 * 
 * @param searchTerm - Search query
 * @returns Matching restaurants
 */
export const searchRestaurants = async (
  searchTerm: string
): Promise<Restaurant[]> => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('is_active', true)
    .or(`name.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error searching restaurants:', error);
    throw error;
  }

  return data || [];
};

/**
 * Fetch restaurant categories
 * 
 * @returns List of active categories
 */
export const fetchCategories = async () => {
  const { data, error } = await supabase
    .from('restaurant_categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  return data || [];
};

/**
 * Fetch add-ons for a specific dish
 * 
 * @param dishId - Dish ID
 * @returns List of add-ons
 */
export const fetchDishAddons = async (dishId: string) => {
  const { data, error } = await supabase
    .from('dish_addons')
    .select('*')
    .eq('dish_id', dishId)
    .eq('is_available', true);

  if (error) {
    console.error('Error fetching dish add-ons:', error);
    throw error;
  }

  return data || [];
};
