/**
 * Promotions Service
 * Handles all promotion-related database operations
 */
// @ts-nocheck

import { supabase } from '../lib/supabase';

export interface Promotion {
  id: string;
  title: string;
  description: string | null;
  type: 'percentage' | 'fixed' | 'free_delivery';
  discount_value: number | null;
  min_order_amount: number;
  valid_from: string;
  valid_until: string;
  max_usage: number | null;
  current_usage: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

/**
 * Get all promotions (admin only)
 */
export const getAllPromotions = async (): Promise<Promotion[]> => {
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching promotions:', error);
    throw error;
  }

  return data || [];
};

/**
 * Get active promotions
 */
export const getActivePromotions = async (): Promise<Promotion[]> => {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('is_active', true)
    .lte('valid_from', now)
    .gte('valid_until', now)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching active promotions:', error);
    throw error;
  }

  return data || [];
};

/**
 * Get promotion by ID
 */
export const getPromotionById = async (id: string): Promise<Promotion | null> => {
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching promotion:', error);
    throw error;
  }

  return data;
};

/**
 * Create a new promotion
 */
export const createPromotion = async (promotion: Omit<Promotion, 'id' | 'created_at' | 'updated_at' | 'current_usage' | 'created_by'>): Promise<Promotion> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('promotions')
    .insert([{
      ...promotion,
      created_by: user?.id,
      current_usage: 0,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating promotion:', error);
    throw error;
  }

  return data;
};

/**
 * Update a promotion
 */
export const updatePromotion = async (id: string, updates: Partial<Promotion>): Promise<Promotion> => {
  const { data, error } = await supabase
    .from('promotions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating promotion:', error);
    throw error;
  }

  return data;
};

/**
 * Delete a promotion
 */
export const deletePromotion = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('promotions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting promotion:', error);
    throw error;
  }
};

/**
 * Toggle promotion active status
 */
export const togglePromotionStatus = async (id: string, isActive: boolean): Promise<Promotion> => {
  return updatePromotion(id, { is_active: isActive });
};

/**
 * Increment promotion usage
 */
export const incrementPromotionUsage = async (id: string): Promise<void> => {
  const { error } = await supabase.rpc('increment_promotion_usage', { promotion_id: id });

  if (error) {
    console.error('Error incrementing promotion usage:', error);
    throw error;
  }
};
