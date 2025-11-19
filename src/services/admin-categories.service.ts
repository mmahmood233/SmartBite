/**
 * Admin Categories Service
 * Handles CRUD operations for restaurant categories
 */

import { supabase } from '../lib/supabase';

export interface AdminCategory {
  id: string;
  name: string;
  icon: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  restaurant_count?: number;
}

/**
 * Fetch all categories with restaurant counts
 */
export const getAllCategories = async (): Promise<AdminCategory[]> => {
  try {
    // Fetch categories
    const { data: categories, error: categoriesError } = await supabase
      .from('restaurant_categories')
      .select('*')
      .order('name', { ascending: true });

    if (categoriesError) throw categoriesError;

    // Get restaurant counts for each category
    const categoriesWithCounts = await Promise.all(
      (categories || []).map(async (category) => {
        const { count, error: countError } = await supabase
          .from('restaurants')
          .select('*', { count: 'exact', head: true })
          .eq('category', category.name);

        if (countError) {
          console.error('Error counting restaurants:', countError);
        }

        return {
          ...category,
          restaurant_count: count || 0,
        };
      })
    );

    return categoriesWithCounts;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Create a new category
 */
export const createCategory = async (
  name: string,
  icon: string | null = null
): Promise<AdminCategory> => {
  try {
    const { data, error } = await supabase
      .from('restaurant_categories')
      .insert([
        {
          name,
          icon,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

/**
 * Update an existing category
 */
export const updateCategory = async (
  id: string,
  name: string,
  icon: string | null = null
): Promise<AdminCategory> => {
  try {
    const { data, error } = await supabase
      .from('restaurant_categories')
      .update({
        name,
        icon,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

/**
 * Toggle category active status
 */
export const toggleCategoryStatus = async (
  id: string,
  isActive: boolean
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('restaurant_categories')
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error toggling category status:', error);
    throw error;
  }
};

/**
 * Delete a category
 */
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('restaurant_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};
