/**
 * Order Timeout Service
 * Handles automatic cancellation of orders that haven't been accepted within 5 minutes
 */

import { supabase } from '../lib/supabase';

const ORDER_TIMEOUT_MINUTES = 5;

/**
 * Check and cancel expired pending orders
 */
export const checkAndCancelExpiredOrders = async (): Promise<number> => {
  try {
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - ORDER_TIMEOUT_MINUTES);

    // Find all pending orders older than 5 minutes
    const { data: expiredOrders, error: fetchError } = await supabase
      .from('orders')
      .select('id, order_number, user_id, created_at')
      .eq('status', 'pending')
      .lt('created_at', fiveMinutesAgo.toISOString());

    if (fetchError) {
      console.error('Error fetching expired orders:', fetchError);
      return 0;
    }

    if (!expiredOrders || expiredOrders.length === 0) {
      return 0;
    }

    console.log(`Found ${expiredOrders.length} expired orders to cancel`);

    // Cancel each expired order
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        delivery_notes: 'Order automatically cancelled - Restaurant did not respond within 5 minutes',
        updated_at: new Date().toISOString(),
      })
      .in('id', expiredOrders.map(o => o.id));

    if (updateError) {
      console.error('Error cancelling expired orders:', updateError);
      return 0;
    }

    console.log(`Successfully cancelled ${expiredOrders.length} expired orders`);
    return expiredOrders.length;
  } catch (error) {
    console.error('Error in checkAndCancelExpiredOrders:', error);
    return 0;
  }
};

/**
 * Start monitoring for expired orders
 * Checks every minute for orders that need to be cancelled
 */
export const startOrderTimeoutMonitoring = (): NodeJS.Timeout => {
  console.log('Starting order timeout monitoring...');
  
  // Check immediately on start
  checkAndCancelExpiredOrders();
  
  // Then check every minute
  const intervalId = setInterval(() => {
    checkAndCancelExpiredOrders();
  }, 60000); // Check every 60 seconds

  return intervalId;
};

/**
 * Stop monitoring for expired orders
 */
export const stopOrderTimeoutMonitoring = (intervalId: NodeJS.Timeout): void => {
  clearInterval(intervalId);
  console.log('Stopped order timeout monitoring');
};

/**
 * Get time remaining for an order before auto-cancellation
 */
export const getOrderTimeRemaining = (createdAt: string): number => {
  const created = new Date(createdAt);
  const now = new Date();
  const elapsed = (now.getTime() - created.getTime()) / 1000 / 60; // minutes
  const remaining = ORDER_TIMEOUT_MINUTES - elapsed;
  return Math.max(0, Math.floor(remaining));
};

/**
 * Check if an order has expired
 */
export const isOrderExpired = (createdAt: string): boolean => {
  return getOrderTimeRemaining(createdAt) === 0;
};
