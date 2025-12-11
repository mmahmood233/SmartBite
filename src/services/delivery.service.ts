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
    // Check current user
    const { data: { user } } = await supabase.auth.getUser();
    console.log('=== DEBUG: Current user ===');
    console.log('User ID:', user?.id);
    console.log('User email:', user?.email);
    console.log('User role:', user?.user_metadata?.role);
    
    // First, let's see ALL orders without filters
    const { data: allOrders, error: allOrdersError } = await supabase
      .from('orders')
      .select('id, status, rider_id, delivery_address, delivery_address_id');
    
    console.log('=== DEBUG: All orders in DB ===');
    console.log('Total orders:', allOrders?.length || 0);
    console.log('Orders error:', allOrdersError);
    console.log('Orders without rider:', allOrders?.filter(o => !o.rider_id).length || 0);
    console.log('Orders with delivery_address:', allOrders?.filter(o => o.delivery_address).length || 0);
    console.log('Sample order:', allOrders?.[0]);
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        total_amount,
        created_at,
        delivery_address_id,
        delivery_address,
        restaurants (
          name,
          address
        ),
        order_items (
          id
        )
      `)
      .is('rider_id', null)
      .in('status', ['confirmed', 'preparing'])  // Only show after restaurant accepts
      .not('delivery_address', 'is', null)  // Check text field instead
      .order('created_at', { ascending: true });

    if (error) throw error;
    
    console.log('=== DEBUG: Filtered orders ===');
    console.log('Orders after filters:', data?.length || 0);

    // Get addresses separately for each order (if using address_id)
    const ordersWithAddresses = await Promise.all(
      (data || []).map(async (order: any) => {
        let address = 'Unknown Address';
        
        // If there's an address_id, fetch from user_addresses table
        if (order.delivery_address_id) {
          try {
            const { data: addressData, error: addressError } = await supabase
              .from('user_addresses')
              .select('full_address, area, building, road, block, city')
              .eq('id', order.delivery_address_id)
              .single();
            
            if (!addressError && addressData) {
              // Build a proper address string
              const parts = [
                addressData.building && `Building ${addressData.building}`,
                addressData.road && `Road ${addressData.road}`,
                addressData.block && `Block ${addressData.block}`,
                addressData.area,
                addressData.city,
              ].filter(Boolean);
              
              address = parts.length > 0 ? parts.join(', ') : (addressData.full_address || 'Unknown Address');
            }
          } catch (err) {
            console.warn('Failed to fetch address for order:', order.id);
          }
        } else if (order.delivery_address) {
          // Fallback to text field if no address_id
          address = order.delivery_address;
        }
        
        return { ...order, delivery_address: address };
      })
    );

    // Transform data to match AvailableOrder interface
    const availableOrders: AvailableOrder[] = ordersWithAddresses.map(order => ({
      order_id: order.id,
      restaurant_name: order.restaurants?.name || 'Unknown Restaurant',
      restaurant_address: order.restaurants?.address || 'Unknown Address',
      delivery_address: order.delivery_address,
      distance: 0, // Calculate if you have coordinates
      estimated_earnings: order.total_amount * 0.15, // 15% of order total
      items_count: order.order_items?.length || 0,
      created_at: order.created_at,
    }));

    return availableOrders;
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
    // 1. Check if delivery already exists for this order
    const { data: existingDelivery } = await supabase
      .from('deliveries')
      .select('id')
      .eq('order_id', orderId)
      .single();

    // 2. Update order with rider_id
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

    // 3. Create or update delivery record
    if (existingDelivery) {
      // Update existing delivery
      const { error: deliveryError } = await supabase
        .from('deliveries')
        .update({
          rider_id: riderId,
          status: 'assigned',
          earnings,
        })
        .eq('order_id', orderId);

      if (deliveryError) throw deliveryError;
    } else {
      // Create new delivery record
      const { error: deliveryError } = await supabase
        .from('deliveries')
        .insert([{
          order_id: orderId,
          rider_id: riderId,
          status: 'assigned',
          earnings,
        }]);

      if (deliveryError) throw deliveryError;
    }

    // 4. Update rider status to busy
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
          total_amount,
          delivery_address_id,
          restaurants (
            name,
            address,
            phone
          ),
          order_items (
            dish_name,
            quantity
          )
        )
      `)
      .eq('rider_id', riderId)
      .in('status', ['assigned', 'heading_to_restaurant', 'arrived_at_restaurant', 'picked_up', 'heading_to_customer', 'arrived_at_customer'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    
    // Get delivery address if data exists
    if (data && data.orders && data.orders.delivery_address_id) {
      const { data: addressData } = await supabase
        .from('user_addresses')
        .select('full_address')
        .eq('id', data.orders.delivery_address_id)
        .single();
      
      if (addressData) {
        data.orders.delivery_address = addressData.full_address;
      }
    }
    
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
          total_amount,
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
