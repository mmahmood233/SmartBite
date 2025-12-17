// @ts-nocheck
/**
 * Partner Orders Service
 * 
 * All order management API calls for restaurant partners
 */

import { supabase } from '../lib/supabase';

export interface PartnerOrder {
  id: string;
  order_number: string;
  user_id: string;
  restaurant_id: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered' | 'cancelled';
  subtotal: number;
  delivery_fee: number;
  discount_amount: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  delivery_notes: string | null;
  estimated_delivery_time: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  users?: {
    full_name: string;
    phone: string;
  };
  user_addresses?: {
    building: string | null;
    road: string | null;
    block: string | null;
    area: string;
    city: string;
  };
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  dish_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  special_request: string | null;
}

/**
 * Get all orders for a partner's restaurant
 */
export const getPartnerOrders = async (restaurantId: string, status?: string) => {
  let query = supabase
    .from('orders')
    .select(`
      *,
      users(full_name, phone),
      user_addresses(building, road, block, area, city),
      order_items(
        id,
        dish_name,
        quantity,
        unit_price,
        subtotal,
        special_request
      )
    `)
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false });

  if (status && status !== 'all') {
    // Handle 'active' filter (preparing + ready_for_pickup + confirmed)
    if (status === 'active') {
      query = query.in('status', ['confirmed', 'preparing', 'ready_for_pickup']);
    } else {
      query = query.eq('status', status);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching partner orders:', error);
    throw error;
  }

  return data as PartnerOrder[];
};

/**
 * Get new/pending orders that need partner action
 */
export const getNewOrders = async (restaurantId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      users(full_name, phone),
      user_addresses(building, road, block, area, city),
      order_items(
        id,
        dish_name,
        quantity,
        unit_price,
        subtotal,
        special_request
      )
    `)
    .eq('restaurant_id', restaurantId)
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching new orders:', error);
    throw error;
  }

  return data as PartnerOrder[];
};

/**
 * Get active orders (confirmed, preparing, ready)
 */
export const getActiveOrders = async (restaurantId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      users(full_name, phone),
      user_addresses(building, road, block, area, city),
      order_items(
        id,
        dish_name,
        quantity,
        unit_price,
        subtotal,
        special_request
      )
    `)
    .eq('restaurant_id', restaurantId)
    .in('status', ['confirmed', 'preparing', 'ready_for_pickup'])
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching active orders:', error);
    throw error;
  }

  return data as PartnerOrder[];
};

/**
 * Accept/Confirm an order
 */
export const acceptOrder = async (orderId: string, estimatedTime?: number) => {
  const updates: any = {
    status: 'confirmed',
    updated_at: new Date().toISOString(),
  };

  if (estimatedTime) {
    const estimatedDeliveryTime = new Date();
    estimatedDeliveryTime.setMinutes(estimatedDeliveryTime.getMinutes() + estimatedTime);
    updates.estimated_delivery_time = estimatedDeliveryTime.toISOString();
  }

  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    console.error('Error accepting order:', error);
    throw error;
  }

  return data;
};

/**
 * Reject/Cancel an order
 */
export const rejectOrder = async (orderId: string, reason?: string) => {
  const { data, error } = await supabase
    .from('orders')
    .update({
      status: 'cancelled',
      delivery_notes: reason || 'Order cancelled by restaurant',
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    console.error('Error rejecting order:', error);
    throw error;
  }

  return data;
};

/**
 * Update order status
 * Restaurant can only update to: preparing, ready_for_pickup
 * NOT delivered - only rider can mark as delivered
 */
export const updateOrderStatus = async (
  orderId: string,
  status: 'preparing' | 'ready_for_pickup'
) => {
  const updates: any = {
    status,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('orders')
    .update(updates)
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
 * Get order details by ID
 */
export const getOrderDetails = async (orderId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      users!user_id(full_name, phone, email),
      user_addresses!delivery_address_id(building, road, block, area, city, label, contact_number),
      order_items(
        id,
        dish_name,
        quantity,
        unit_price,
        subtotal,
        special_request
      )
    `)
    .eq('id', orderId)
    .single();

  if (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }

  return data as PartnerOrder;
};

/**
 * Get order statistics for partner dashboard
 */
export const getOrderStats = async (restaurantId: string, days: number = 7) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('orders')
    .select('status, total_amount, created_at')
    .eq('restaurant_id', restaurantId)
    .gte('created_at', startDate.toISOString());

  if (error) {
    console.error('Error fetching order stats:', error);
    throw error;
  }

  // Calculate statistics
  const stats = {
    totalOrders: data.length,
    totalRevenue: data.reduce((sum, order) => sum + parseFloat(order.total_amount), 0),
    pendingOrders: data.filter(o => o.status === 'pending').length,
    activeOrders: data.filter(o => ['confirmed', 'preparing', 'ready_for_pickup'].includes(o.status)).length,
    completedOrders: data.filter(o => o.status === 'delivered').length,
    cancelledOrders: data.filter(o => o.status === 'cancelled').length,
  };

  return stats;
};
