import { supabase } from '../lib/supabase';

export interface Rider {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  vehicle_type: 'motorcycle' | 'car';
  vehicle_number?: string;
  license_number?: string;
  status: 'online' | 'offline' | 'busy';
  current_location_lat?: number;
  current_location_lng?: number;
  rating: number;
  total_deliveries: number;
  total_earnings: number;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Get rider profile by user ID
 */
export const getRiderProfile = async (userId: string): Promise<Rider | null> => {
  try {
    const { data, error } = await supabase
      .from('riders')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching rider profile:', error);
    return null;
  }
};

/**
 * Create a new rider profile
 */
export const createRiderProfile = async (riderData: {
  user_id: string;
  full_name: string;
  phone: string;
  vehicle_type: 'motorcycle' | 'car';
  vehicle_number?: string;
  license_number?: string;
}): Promise<Rider | null> => {
  try {
    const { data, error } = await supabase
      .from('riders')
      .insert([riderData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating rider profile:', error);
    return null;
  }
};

/**
 * Update rider status (online/offline/busy)
 */
export const updateRiderStatus = async (
  riderId: string,
  status: 'online' | 'offline' | 'busy'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('riders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', riderId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating rider status:', error);
    return false;
  }
};

/**
 * Update rider location
 */
export const updateRiderLocation = async (
  riderId: string,
  latitude: number,
  longitude: number
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('riders')
      .update({
        current_location_lat: latitude,
        current_location_lng: longitude,
        updated_at: new Date().toISOString(),
      })
      .eq('id', riderId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating rider location:', error);
    return false;
  }
};

/**
 * Insert rider location tracking point
 */
export const insertRiderLocationPoint = async (
  riderId: string,
  orderId: string | null,
  latitude: number,
  longitude: number
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('rider_locations')
      .insert([{
        rider_id: riderId,
        order_id: orderId,
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      }]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error inserting rider location point:', error);
    return false;
  }
};

/**
 * Get rider statistics
 */
export const getRiderStatistics = async (riderId: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .rpc('get_rider_statistics', { p_rider_id: riderId });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching rider statistics:', error);
    return {
      today_earnings: 0,
      week_earnings: 0,
      month_earnings: 0,
      today_deliveries: 0,
      week_deliveries: 0,
      month_deliveries: 0,
      avg_rating: 5.0,
    };
  }
};

/**
 * Update rider profile
 */
export const updateRiderProfile = async (
  riderId: string,
  updates: Partial<Rider>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('riders')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', riderId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating rider profile:', error);
    return false;
  }
};
