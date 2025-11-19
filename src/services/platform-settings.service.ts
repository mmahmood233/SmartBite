/**
 * Platform Settings Service
 * Manage platform-wide configuration settings
 */

import { supabase } from '../lib/supabase';

export interface PlatformSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  description: string | null;
  updated_at: string;
  updated_by: string | null;
}

/**
 * Get a specific platform setting by key
 */
export const getPlatformSetting = async (key: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('platform_settings')
    .select('setting_value')
    .eq('setting_key', key)
    .single();

  if (error) {
    console.error(`Error fetching setting ${key}:`, error);
    return null;
  }

  return data?.setting_value || null;
};

/**
 * Get all platform settings
 */
export const getAllPlatformSettings = async (): Promise<PlatformSetting[]> => {
  const { data, error } = await supabase
    .from('platform_settings')
    .select('*')
    .order('setting_key');

  if (error) {
    console.error('Error fetching platform settings:', error);
    throw error;
  }

  return data || [];
};

/**
 * Update a platform setting
 */
export const updatePlatformSetting = async (
  key: string,
  value: string
): Promise<void> => {
  const { error } = await supabase
    .from('platform_settings')
    .update({ setting_value: value })
    .eq('setting_key', key);

  if (error) {
    console.error(`Error updating setting ${key}:`, error);
    throw error;
  }
};

/**
 * Get default delivery fee
 */
export const getDefaultDeliveryFee = async (): Promise<number> => {
  const value = await getPlatformSetting('default_delivery_fee');
  return value ? parseFloat(value) : 0.5;
};

/**
 * Update default delivery fee
 */
export const updateDefaultDeliveryFee = async (fee: number): Promise<void> => {
  await updatePlatformSetting('default_delivery_fee', fee.toString());
};

/**
 * Get minimum order amount
 */
export const getMinOrderAmount = async (): Promise<number> => {
  const value = await getPlatformSetting('min_order_amount');
  return value ? parseFloat(value) : 2.0;
};

/**
 * Update minimum order amount
 */
export const updateMinOrderAmount = async (amount: number): Promise<void> => {
  await updatePlatformSetting('min_order_amount', amount.toString());
};
