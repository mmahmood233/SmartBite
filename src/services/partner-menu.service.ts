/**
 * Partner Menu Management Service
 * Handles all menu-related operations for partner dashboard
 */

import { supabase } from '../lib/supabase';

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  name: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Dish {
  id: string;
  restaurant_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  is_popular: boolean;
  preparation_time: number | null;
  calories: number | null;
  allergens: string[] | null;
  created_at: string;
  updated_at: string;
  menu_categories?: MenuCategory;
}

/**
 * Get all categories for a restaurant
 */
export const getMenuCategories = async (restaurantId: string): Promise<MenuCategory[]> => {
  const { data, error } = await supabase
    .from('menu_categories')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching menu categories:', error);
    throw error;
  }

  return data || [];
};

/**
 * Get all dishes for a restaurant
 */
export const getDishes = async (restaurantId: string, categoryId?: string): Promise<Dish[]> => {
  let query = supabase
    .from('dishes')
    .select(`
      *,
      menu_categories!category_id(id, name)
    `)
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false });

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching dishes:', error);
    throw error;
  }

  console.log('Dishes with categories:', data);

  return data || [];
};

/**
 * Create a new dish
 */
export const createDish = async (dishData: {
  restaurant_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url?: string | null;
  is_available?: boolean;
  preparation_time?: number | null;
}): Promise<Dish> => {
  const { data, error } = await supabase
    .from('dishes')
    .insert([{
      ...dishData,
      is_available: dishData.is_available ?? true,
      is_popular: false,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating dish:', error);
    throw error;
  }

  return data;
};

/**
 * Update a dish
 */
export const updateDish = async (dishId: string, updates: Partial<Dish>): Promise<Dish> => {
  const { data, error } = await supabase
    .from('dishes')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', dishId)
    .select()
    .single();

  if (error) {
    console.error('Error updating dish:', error);
    throw error;
  }

  return data;
};

/**
 * Delete a dish
 */
export const deleteDish = async (dishId: string): Promise<void> => {
  const { error } = await supabase
    .from('dishes')
    .delete()
    .eq('id', dishId);

  if (error) {
    console.error('Error deleting dish:', error);
    throw error;
  }
};

/**
 * Toggle dish availability
 */
export const toggleDishAvailability = async (dishId: string, isAvailable: boolean): Promise<Dish> => {
  return updateDish(dishId, { is_available: isAvailable });
};

/**
 * Toggle dish popular status
 */
export const toggleDishPopular = async (dishId: string, isPopular: boolean): Promise<Dish> => {
  return updateDish(dishId, { is_popular: isPopular });
};

/**
 * Create a new category
 */
export const createCategory = async (categoryData: {
  restaurant_id: string;
  name: string;
  display_order?: number;
}): Promise<MenuCategory> => {
  const { data, error} = await supabase
    .from('menu_categories')
    .insert([{
      ...categoryData,
      is_active: true,
      display_order: categoryData.display_order ?? 999,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating category:', error);
    throw error;
  }

  return data;
};

/**
 * Delete a category
 */
export const deleteCategory = async (categoryId: string): Promise<void> => {
  const { error } = await supabase
    .from('menu_categories')
    .delete()
    .eq('id', categoryId);

  if (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};
