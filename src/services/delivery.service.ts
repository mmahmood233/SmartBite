import { supabase } from '../lib/supabase';

export interface Delivery {
  id: string;
  order_id: string;
  rider_id: string;
  status: 'assigned' | 'heading_to_restaurant' | 'arrived_at_restaurant' | 'picked_up' | 'heading_to_customer' | 'arrived_at_customer' | 'delivered' | 'cancelled';
  assigned_at: string;
  pickup_time?: string;
  delivery_time?: string;
  distance?: number;
  earnings: number;
  customer_rating?: number;
  customer_feedback?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface AvailableOrder {
  order_id: string;
  restaurant_name: string;
  restaurant_address: string;
  delivery_address: string;
  distance: number;
  estimated_earnings: number;
  items_count: number;
  created_at: string;
}

/**
 * Get available orders for riders (orders without assigned rider)
 */
export const getAvailableOrders = async (): Promise<AvailableOrder[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_available_orders_for_riders');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching available orders:', error);
    return [];
  }
};

/**
 * Accept an order (assign rider to order)
 */
export const acceptOrder = async (
  orderId: string,
  riderId: string,
  earnings: number
): Promise<boolean> => {
  try {
    // Start a transaction
    // 1. Update order with rider_id
    const { error: orderError } = await supabase
      .from('orders')
      .update({
        rider_id: riderId,
        rider_assigned_at: new Date().toISOString(),
        rider_earnings: earnings,
        delivery_status: 'rider_assigned',
      })
      .eq('id', orderId);

    if (orderError) throw orderError;

    // 2. Create delivery record
    const { error: deliveryError } = await supabase
      .from('deliveries')
      .insert([{
        order_id: orderId,
        rider_id: riderId,
        status: 'assigned',
        earnings,
      }]);

    if (deliveryError) throw deliveryError;

    // 3. Update rider status to busy
    const { error: riderError } = await supabase
      .from('riders')
      .update({ status: 'busy' })
      .eq('id', riderId);

    if (riderError) throw riderError;

    return true;
  } catch (error) {
    console.error('Error accepting order:', error);
    return false;
  }
};

/**
 * Update delivery status
 */
export const updateDeliveryStatus = async (
  deliveryId: string,
  status: Delivery['status']
): Promise<boolean> => {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    // Set timestamps based on status
    if (status === 'picked_up') {
      updateData.pickup_time = new Date().toISOString();
    } else if (status === 'delivered') {
      updateData.delivery_time = new Date().toISOString();
    }

    const { error } = await supabase
      .from('deliveries')
      .update(updateData)
      .eq('id', deliveryId);

    if (error) throw error;

    // If delivered, update rider status back to online
    if (status === 'delivered') {
      const { data: delivery } = await supabase
        .from('deliveries')
        .select('rider_id')
        .eq('id', deliveryId)
        .single();

      if (delivery) {
        await supabase
          .from('riders')
          .update({ status: 'online' })
          .eq('id', delivery.rider_id);
      }
    }

    return true;
  } catch (error) {
    console.error('Error updating delivery status:', error);
    return false;
  }
};

/**
 * Get active delivery for a rider
 */
export const getActiveDelivery = async (riderId: string): Promise<any | null> => {
  try {
    const { data, error } = await supabase
      .from('deliveries')
      .select(`
        *,
        orders (
          id,
          order_number,
          delivery_address,
          total,
          items,
          restaurants (
            name,
            address,
            phone
          )
        )
      `)
      .eq('rider_id', riderId)
      .in('status', ['assigned', 'heading_to_restaurant', 'arrived_at_restaurant', 'picked_up', 'heading_to_customer', 'arrived_at_customer'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data;
  } catch (error) {
    console.error('Error fetching active delivery:', error);
    return null;
  }
};

/**
 * Get delivery history for a rider
 */
export const getDeliveryHistory = async (
  riderId: string,
  limit: number = 50
): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('deliveries')
      .select(`
        *,
        orders (
          id,
          order_number,
          delivery_address,
          total,
          restaurants (
            name,
            address
          ),
          users (
            full_name
          )
        )
      `)
      .eq('rider_id', riderId)
      .eq('status', 'delivered')
      .order('delivery_time', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching delivery history:', error);
    return [];
  }
};

/**
 * Cancel delivery
 */
export const cancelDelivery = async (
  deliveryId: string,
  reason: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('deliveries')
      .update({
        status: 'cancelled',
        cancellation_reason: reason,
        updated_at: new Date().toISOString(),
      })
      .eq('id', deliveryId);

    if (error) throw error;

    // Update rider status back to online
    const { data: delivery } = await supabase
      .from('deliveries')
      .select('rider_id, order_id')
      .eq('id', deliveryId)
      .single();

    if (delivery) {
      await supabase
        .from('riders')
        .update({ status: 'online' })
        .eq('id', delivery.rider_id);

      // Clear rider from order
      await supabase
        .from('orders')
        .update({
          rider_id: null,
          delivery_status: 'pending_rider',
        })
        .eq('id', delivery.order_id);
    }

    return true;
  } catch (error) {
    console.error('Error cancelling delivery:', error);
    return false;
  }
};

/**
 * Add customer rating to delivery
 */
export const addDeliveryRating = async (
  deliveryId: string,
  rating: number,
  feedback?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('deliveries')
      .update({
        customer_rating: rating,
        customer_feedback: feedback,
        updated_at: new Date().toISOString(),
      })
      .eq('id', deliveryId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding delivery rating:', error);
    return false;
  }
};
