/**
 * Admin Restaurants Service
 * Manage restaurants from admin panel
 */
// @ts-nocheck

import { supabase } from '../lib/supabase';

export interface AdminRestaurant {
  id: string;
  name: string;
  category: string;
  description: string | null;
  address: string;
  phone: string;
  email: string | null;
  logo: string | null;
  is_active: boolean;
  delivery_fee: number;
  minimum_order: number;
  avg_prep_time: string | null;
  rating: number;
  status: 'open' | 'closed' | 'busy';
  opening_time: string | null;
  closing_time: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  partner_id: string;
  users?: {
    full_name: string;
    email: string;
    phone: string;
  };
  _count?: {
    orders: number;
  };
}

/**
 * Get all restaurants with partner info
 */
export const getAllRestaurants = async () => {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        users!partner_id(full_name, email, phone)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get order counts for each restaurant
    const restaurantsWithCounts = await Promise.all(
      (data || []).map(async (restaurant) => {
        const { count } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('restaurant_id', restaurant.id);

        return {
          ...restaurant,
          _count: { orders: count || 0 },
        };
      })
    );

    return restaurantsWithCounts as AdminRestaurant[];
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }
};

/**
 * Get restaurant by ID
 */
export const getRestaurantById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        users!partner_id(full_name, email, phone)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    // Get order count
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('restaurant_id', id);

    return {
      ...data,
      _count: { orders: count || 0 },
    } as AdminRestaurant;
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    throw error;
  }
};

/**
 * Update restaurant status (active/inactive)
 */
export const toggleRestaurantStatus = async (id: string, isActive: boolean) => {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating restaurant status:', error);
    throw error;
  }
};

/**
 * Update restaurant details
 */
export const updateRestaurant = async (
  id: string,
  updates: Partial<{
    name: string;
    category: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    delivery_fee: number;
    minimum_order: number;
    avg_prep_time: string;
    logo: string;
    status: 'open' | 'closed' | 'busy';
    opening_time: string;
    closing_time: string;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating restaurant:', error);
    throw error;
  }
};

/**
 * Delete restaurant
 */
export const deleteRestaurant = async (id: string) => {
  try {
    const { error } = await supabase
      .from('restaurants')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    throw error;
  }
};

/**
 * Search restaurants
 */
export const searchRestaurants = async (query: string) => {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        users!partner_id(full_name, email, phone)
      `)
      .or(`name.ilike.%${query}%,category.ilike.%${query}%,address.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get order counts
    const restaurantsWithCounts = await Promise.all(
      (data || []).map(async (restaurant) => {
        const { count } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('restaurant_id', restaurant.id);

        return {
          ...restaurant,
          _count: { orders: count || 0 },
        };
      })
    );

    return restaurantsWithCounts as AdminRestaurant[];
  } catch (error) {
    console.error('Error searching restaurants:', error);
    throw error;
  }
};
