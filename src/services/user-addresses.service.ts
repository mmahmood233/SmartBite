/**
 * User Addresses Service
 * 
 * Manages saved delivery addresses for users
 */

import { supabase } from '../lib/supabase';
import { geocodeAddress, Coordinates } from './location.service';

export interface UserAddress {
  id: string;
  user_id: string;
  label: string;
  address_line1: string;
  address_line2?: string;
  building?: string;
  floor?: string;
  apartment?: string;
  area?: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAddressInput {
  label: string;
  address_line1: string;
  address_line2?: string;
  building?: string;
  floor?: string;
  apartment?: string;
  area?: string;
  city?: string;
  country?: string;
  phone?: string;
  is_default?: boolean;
}

/**
 * Get all addresses for the current user
 */
export const getUserAddresses = async (): Promise<UserAddress[]> => {
  const { data, error } = await supabase
    .from('user_addresses')
    .select('*')
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user addresses:', error);
    throw error;
  }

  return data || [];
};

/**
 * Get default address for the current user
 */
export const getDefaultAddress = async (): Promise<UserAddress | null> => {
  const { data, error } = await supabase
    .from('user_addresses')
    .select('*')
    .eq('is_default', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No default address found
      return null;
    }
    console.error('Error fetching default address:', error);
    throw error;
  }

  return data;
};

/**
 * Create a new address
 */
export const createAddress = async (
  addressData: CreateAddressInput
): Promise<UserAddress> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Geocode the address to get coordinates
  const fullAddress = `${addressData.address_line1}, ${addressData.area || ''}, ${addressData.city || 'Manama'}, ${addressData.country || 'Bahrain'}`;
  const coords = await geocodeAddress(fullAddress);

  const { data, error } = await supabase
    .from('user_addresses')
    .insert({
      user_id: user.id,
      ...addressData,
      latitude: coords?.latitude,
      longitude: coords?.longitude,
      city: addressData.city || 'Manama',
      country: addressData.country || 'Bahrain',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating address:', error);
    throw error;
  }

  return data;
};

/**
 * Update an existing address
 */
export const updateAddress = async (
  addressId: string,
  addressData: Partial<CreateAddressInput>
): Promise<UserAddress> => {
  // If address fields changed, re-geocode
  let coords: Coordinates | null = null;
  if (addressData.address_line1 || addressData.area || addressData.city) {
    const { data: existingAddress } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('id', addressId)
      .single();

    if (existingAddress) {
      const fullAddress = `${addressData.address_line1 || existingAddress.address_line1}, ${addressData.area || existingAddress.area || ''}, ${addressData.city || existingAddress.city}, ${addressData.country || existingAddress.country}`;
      coords = await geocodeAddress(fullAddress);
    }
  }

  const updateData: any = { ...addressData };
  if (coords) {
    updateData.latitude = coords.latitude;
    updateData.longitude = coords.longitude;
  }

  const { data, error } = await supabase
    .from('user_addresses')
    .update(updateData)
    .eq('id', addressId)
    .select()
    .single();

  if (error) {
    console.error('Error updating address:', error);
    throw error;
  }

  return data;
};

/**
 * Delete an address
 */
export const deleteAddress = async (addressId: string): Promise<void> => {
  const { error } = await supabase
    .from('user_addresses')
    .delete()
    .eq('id', addressId);

  if (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};

/**
 * Set an address as default
 */
export const setDefaultAddress = async (addressId: string): Promise<void> => {
  const { error } = await supabase
    .from('user_addresses')
    .update({ is_default: true })
    .eq('id', addressId);

  if (error) {
    console.error('Error setting default address:', error);
    throw error;
  }
};

/**
 * Format address for display
 */
export const formatAddress = (address: UserAddress): string => {
  const parts = [];
  
  if (address.building) parts.push(`Building ${address.building}`);
  if (address.floor) parts.push(`Floor ${address.floor}`);
  if (address.apartment) parts.push(`Apt ${address.apartment}`);
  if (address.address_line1) parts.push(address.address_line1);
  if (address.area) parts.push(address.area);
  if (address.city) parts.push(address.city);
  
  return parts.join(', ');
};
