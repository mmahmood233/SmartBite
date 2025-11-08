/**
 * Orders Service
 * 
 * All order-related API calls.
 * Easy for AI to read and understand.
 */

import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderInsert = Database['public']['Tables']['orders']['Insert'];

/**
 * Create a new order
 * 
 * @param orderData - Order details
 * @returns Created order
 */
export const createOrder = async (orderData: OrderInsert): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  if (error) {
    console.error('Error creating order:', error);
    throw error;
  }

  return data;
};

/**
 * Fetch user's orders
 * 
 * @param userId - User ID
 * @param status - Optional status filter ('active' or 'past')
 * @returns List of orders
 */
export const fetchUserOrders = async (
  userId: string,
  status?: 'active' | 'past'
): Promise<Order[]> => {
  let query = supabase
    .from('orders')
    .select(`
      *,
      restaurants (
        id,
        name,
        logo
      ),
      user_addresses (
        area,
        building
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (status === 'active') {
    query = query.in('status', ['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery']);
  } else if (status === 'past') {
    query = query.in('status', ['delivered', 'cancelled']);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }

  return data || [];
};

/**
 * Fetch single order by ID
 * 
 * @param orderId - Order ID
 * @returns Order details with items
 */
export const fetchOrderById = async (orderId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      restaurants (
        id,
        name,
        logo,
        phone
      ),
      user_addresses (
        building,
        road,
        area,
        contact_number
      ),
      order_items (
        id,
        dish_name,
        quantity,
        unit_price,
        subtotal,
        special_request,
        order_item_addons (
          addon_name,
          addon_price
        )
      ),
      riders (
        id,
        full_name,
        phone,
        vehicle_type
      )
    `)
    .eq('id', orderId)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    throw error;
  }

  return data;
};

/**
 * Update order status
 * 
 * @param orderId - Order ID
 * @param status - New status
 * @returns Updated order
 */
export const updateOrderStatus = async (
  orderId: string,
  status: Order['status']
): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    console.error('Error updating order status:', error);
    throw error;
  }

  return data;
};

/**
 * Subscribe to order updates (real-time)
 * 
 * @param orderId - Order ID
 * @param callback - Callback function when order updates
 * @returns Subscription object (call .unsubscribe() to stop)
 */
export const subscribeToOrderUpdates = (
  orderId: string,
  callback: (order: Order) => void
) => {
  return supabase
    .channel(`order-${orderId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`,
      },
      (payload) => {
        callback(payload.new as Order);
      }
    )
    .subscribe();
};

/**
 * Fetch order tracking history
 * 
 * @param orderId - Order ID
 * @returns List of tracking events
 */
export const fetchOrderTracking = async (orderId: string) => {
  const { data, error } = await supabase
    .from('order_tracking')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching order tracking:', error);
    throw error;
  }

  return data || [];
};

/**
 * Fetch restaurant orders (for partner portal)
 * 
 * @param restaurantId - Restaurant ID
 * @param status - Optional status filter
 * @returns List of orders
 */
export const fetchRestaurantOrders = async (
  restaurantId: string,
  status?: Order['status']
): Promise<Order[]> => {
  let query = supabase
    .from('orders')
    .select(`
      *,
      users (
        full_name,
        phone
      ),
      user_addresses (
        building,
        area
      ),
      order_items (
        dish_name,
        quantity
      )
    `)
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching restaurant orders:', error);
    throw error;
  }

  return data || [];
};
