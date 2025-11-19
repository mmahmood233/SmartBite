/**
 * Categories Service (Shared)
 * Fetches restaurant categories for use across all portals
 */

import { supabase } from '../lib/supabase';

export interface Category {
  id: string;
  name: string;
  icon: string | null;
  is_active: boolean;
}

/**
 * Fetch all active categories
 */
export const getActiveCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('restaurant_categories')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

/**
 * Fetch all categories (including inactive)
 */
export const getAllCategoriesSimple = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('restaurant_categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};
