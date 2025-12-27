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
      .in('status', ['confirmed', 'preparing', 'ready_for_pickup'])  // Show all orders ready for rider assignment
      .not('delivery_address', 'is', null)  // Check text field instead
      .order('created_at', { ascending: true });

    if (error) throw error;
    
    console.log('=== DEBUG: Filtered orders ===');
    console.log('Orders after filters:', data?.length || 0);

    // Get addresses separately for each order (if using address_id)
    const ordersWithAddresses = await Promise.all(
      (data || []).map(async (order: any) => {
        let address = 'Unknown Address';
        
        console.log(`Processing order ${order.id}:`, {
          has_delivery_address: !!order.delivery_address,
          delivery_address: order.delivery_address,
          has_delivery_address_id: !!order.delivery_address_id,
          delivery_address_id: order.delivery_address_id,
        });
        
        // Priority 1: Use the delivery_address text field if it exists
        if (order.delivery_address && order.delivery_address.trim() !== '') {
          address = order.delivery_address;
          console.log(`Using delivery_address text field: ${address}`);
        }
        // Priority 2: If there's an address_id, fetch from user_addresses table
        else if (order.delivery_address_id) {
          try {
            const { data: addressData, error: addressError } = await supabase
              .from('user_addresses')
              .select('full_address, area, building, road, block, city')
              .eq('id', order.delivery_address_id)
              .single();
            
            console.log(`Address lookup for ${order.delivery_address_id}:`, { addressData, addressError });
            
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
              console.log(`Built address from parts: ${address}`);
            }
          } catch (err) {
            console.warn('Failed to fetch address for order:', order.id, err);
          }
        }
        
        return { ...order, delivery_address: address };
      })
    );

    // Transform data to match AvailableOrder interface
    const availableOrders: AvailableOrder[] = ordersWithAddresses.map(order => {
      const itemsCount = order.order_items?.length || 0;
      console.log(`Order ${order.id} has ${itemsCount} items`);
      
      return {
        order_id: order.id,
        restaurant_name: order.restaurants?.name || 'Unknown Restaurant',
        restaurant_address: order.restaurants?.address || 'Unknown Address',
        delivery_address: order.delivery_address,
        distance: 0, // Calculate if you have coordinates
        estimated_earnings: order.total_amount * 0.15, // 15% of order total
        items_count: itemsCount,
        created_at: order.created_at,
      };
    });
    
    console.log('Final available orders:', availableOrders.length);
    availableOrders.forEach(order => {
      console.log(`- ${order.restaurant_name}: ${order.items_count} items, delivery to: ${order.delivery_address}`);
    });

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
  riderId: string
): Promise<boolean> => {
  try {
    console.log('🚀 ACCEPT ORDER START:', { orderId, riderId });

    // SIMPLIFIED APPROACH: Just update/insert, let database handle conflicts
    
    // Step 1: Update order - assign rider
    const { error: orderError } = await supabase
      .from('orders')
      .update({
        rider_id: riderId,
        rider_assigned_at: new Date().toISOString(),
        delivery_status: 'assigned',
      })
      .eq('id', orderId);

    if (orderError) {
      console.error('❌ Order update failed:', orderError);
      throw new Error(`Failed to assign rider: ${orderError.message}`);
    }
    console.log('✅ Order updated with rider');

    // Step 2: Upsert delivery record (insert or update if exists)
    const { error: deliveryError } = await supabase
      .from('deliveries')
      .upsert({
        order_id: orderId,
        rider_id: riderId,
        status: 'assigned',
        earnings: 0,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'order_id',
      });

    if (deliveryError) {
      console.error('❌ Delivery upsert failed:', deliveryError);
      throw new Error(`Failed to create delivery: ${deliveryError.message}`);
    }
    console.log('✅ Delivery record created');

    // Step 3: Update rider status (non-critical, don't fail if this errors)
    await supabase
      .from('riders')
      .update({ status: 'busy' })
      .eq('id', riderId);
    
    console.log('✅ ACCEPT ORDER SUCCESS');
    return true;
  } catch (error: any) {
    console.error('❌ ACCEPT ORDER FAILED:', error);
    throw error; // Re-throw so UI can show the error
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
    console.log('🔄 UPDATE DELIVERY STATUS:', { deliveryId, status });

    // SIMPLIFIED: Get order_id and rider_id from delivery
    const { data: delivery, error: fetchError } = await supabase
      .from('deliveries')
      .select('order_id, rider_id')
      .eq('id', deliveryId)
      .single();

    if (fetchError || !delivery) {
      throw new Error('Delivery not found');
    }

    // Step 1: Update delivery table
    const deliveryUpdate: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === 'picked_up') {
      deliveryUpdate.pickup_time = new Date().toISOString();
    } else if (status === 'delivered') {
      deliveryUpdate.delivery_time = new Date().toISOString();
    }

    const { error: deliveryError } = await supabase
      .from('deliveries')
      .update(deliveryUpdate)
      .eq('id', deliveryId);

    if (deliveryError) {
      throw new Error(`Failed to update delivery: ${deliveryError.message}`);
    }
    console.log('✅ Delivery updated');

    // Step 2: Update order table - sync status
    const orderUpdate: any = {
      delivery_status: status,
      updated_at: new Date().toISOString(),
    };

    // SIMPLIFIED: Map delivery status to order status
    if (status === 'assigned') {
      orderUpdate.status = 'ready_for_pickup';
    } else if (status === 'picked_up') {
      orderUpdate.status = 'out_for_delivery';
    } else if (status === 'delivered') {
      orderUpdate.status = 'delivered';
      orderUpdate.actual_delivery_time = new Date().toISOString();
    }

    console.log('📝 Updating order:', {
      orderId: delivery.order_id,
      updates: orderUpdate,
    });

    const { error: orderError } = await supabase
      .from('orders')
      .update(orderUpdate)
      .eq('id', delivery.order_id);

    if (orderError) {
      console.error('❌ Order update error:', orderError);
      throw new Error(`Failed to update order: ${orderError.message}`);
    }
    console.log('✅ Order update command executed successfully');
    
    // Small delay to ensure DB commits the transaction
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Verify the update worked
    const { data: verifyOrder, error: verifyError } = await supabase
      .from('orders')
      .select('id, status, delivery_status')
      .eq('id', delivery.order_id)
      .single();
    
    if (verifyError) {
      console.error('❌ Verification error:', verifyError);
    }
    console.log('✅ Order status after update:', verifyOrder);

    // Step 3: Update rider status if delivered
    if (status === 'delivered') {
      await supabase
        .from('riders')
        .update({ status: 'online' })
        .eq('id', delivery.rider_id);
      console.log('✅ Rider back online');
    }

    return true;
  } catch (error: any) {
    console.error('❌ UPDATE FAILED:', error);
    throw error;
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
          user_id,
          order_number,
          total_amount,
          delivery_address_id,
          delivery_address,
          delivery_phone,
          restaurants (
            name,
            address,
            phone
          ),
          order_items (
            dish_name,
            quantity,
            unit_price
          )
        )
      `)
      .eq('rider_id', riderId)
      .in('status', ['assigned', 'heading_to_restaurant', 'arrived_at_restaurant', 'picked_up', 'heading_to_customer', 'arrived_at_customer'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    console.log('Delivery query result:', {
      hasData: !!data,
      hasOrders: !!data?.orders,
      userId: data?.orders?.user_id,
      orderItemsCount: data?.orders?.order_items?.length,
    });
    
    // Fetch user data separately
    if (data && data.orders && data.orders.user_id) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', data.orders.user_id)
        .single();
      
      console.log('User fetch result:', { userData, userError });
      
      if (userData) {
        data.orders.customer_name = userData.full_name;
        console.log('Set customer_name to:', userData.full_name);
      }
    } // PGRST116 = no rows returned
    
    // Get delivery address if data exists
    if (data && data.orders) {
      console.log('Order data:', {
        user_id: data.orders.user_id,
        delivery_address_id: data.orders.delivery_address_id,
        delivery_phone: data.orders.delivery_phone,
        delivery_address: data.orders.delivery_address,
      });
      
      let addressFound = false;
      
      // Try to get address by delivery_address_id first
      if (data.orders.delivery_address_id) {
        const { data: addressData, error: addressError } = await supabase
          .from('user_addresses')
          .select('address_line1, building, area, city, phone')
          .eq('id', data.orders.delivery_address_id)
          .single();
        
        console.log('Address lookup by ID:', { addressData, addressError });
        
        if (addressData) {
          const addressParts = [];
          if (addressData.building) addressParts.push(addressData.building);
          if (addressData.address_line1) addressParts.push(addressData.address_line1);
          if (addressData.area) addressParts.push(addressData.area);
          if (addressData.city) addressParts.push(addressData.city);
          
          data.orders.delivery_address = addressParts.join(', ') || 'Address not available';
          addressFound = true;
          console.log('Built address from ID:', data.orders.delivery_address);
        }
      }
      
      // If no address found and we have user_id, try to get their default address
      if (!addressFound && data.orders.user_id) {
        const { data: addressData, error: addressError } = await supabase
          .from('user_addresses')
          .select('address_line1, building, area, city, phone')
          .eq('user_id', data.orders.user_id)
          .eq('is_default', true)
          .single();
        
        console.log('Address lookup by user_id:', { addressData, addressError });
        
        if (addressData) {
          const addressParts = [];
          if (addressData.building) addressParts.push(addressData.building);
          if (addressData.address_line1) addressParts.push(addressData.address_line1);
          if (addressData.area) addressParts.push(addressData.area);
          if (addressData.city) addressParts.push(addressData.city);
          
          data.orders.delivery_address = addressParts.join(', ') || 'Address not available';
          addressFound = true;
          console.log('Built address from user default:', data.orders.delivery_address);
        }
      }
      
      // Fallback to text field if still no address
      if (!addressFound && !data.orders.delivery_address) {
        console.log('No address found, using phone as fallback');
        data.orders.delivery_address = data.orders.delivery_phone || 'Address not available';
      }
    }
    
    // Add total field for compatibility
    if (data && data.orders) {
      data.orders.total = data.orders.total_amount;
      data.orders.items = data.orders.order_items;
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
