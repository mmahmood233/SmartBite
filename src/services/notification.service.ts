/**
 * Notification Service
 * Handles creating and managing notifications for users
 */
// @ts-nocheck

import { supabase } from '../lib/supabase';

export interface Notification {
  id?: string;
  user_id: string;
  type: 'order' | 'promotion' | 'system' | 'delivery';
  title: string;
  message: string;
  read: boolean;
  created_at?: string;
  metadata?: any;
}

/**
 * Create a notification for a user
 */
export const createNotification = async (notification: Omit<Notification, 'id' | 'created_at' | 'read'>) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([
        {
          ...notification,
          read: false,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Get all notifications for a user
 */
export const getUserNotifications = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

/**
 * Mark all notifications as read for a user
 */
export const markAllNotificationsAsRead = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
  }
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (userId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};

// ============= Notification Creators for Specific Events =============

/**
 * Send notification when order is confirmed
 */
export const notifyOrderConfirmed = async (userId: string, orderId: string, restaurantName: string) => {
  return createNotification({
    user_id: userId,
    type: 'order',
    title: 'Order Confirmed! 🎉',
    message: `Your order from ${restaurantName} has been confirmed and is being prepared.`,
    metadata: { orderId, restaurantName },
  });
};

/**
 * Send notification when order is ready for pickup
 */
export const notifyOrderReady = async (userId: string, orderId: string, restaurantName: string) => {
  return createNotification({
    user_id: userId,
    type: 'order',
    title: 'Order Ready! 🍽️',
    message: `Your order from ${restaurantName} is ready for pickup!`,
    metadata: { orderId, restaurantName },
  });
};

/**
 * Send notification when order is out for delivery
 */
export const notifyOrderOutForDelivery = async (userId: string, orderId: string, riderName: string) => {
  return createNotification({
    user_id: userId,
    type: 'delivery',
    title: 'On the Way! 🚴',
    message: `${riderName} is on the way with your order. Track your delivery in real-time!`,
    metadata: { orderId, riderName },
  });
};

/**
 * Send notification when order is delivered
 */
export const notifyOrderDelivered = async (userId: string, orderId: string) => {
  return createNotification({
    user_id: userId,
    type: 'order',
    title: 'Order Delivered! ✅',
    message: 'Your order has been delivered successfully. Enjoy your meal!',
    metadata: { orderId },
  });
};

/**
 * Send notification for promotional offers
 */
export const notifyPromotion = async (userId: string, title: string, message: string, promoCode?: string) => {
  return createNotification({
    user_id: userId,
    type: 'promotion',
    title,
    message,
    metadata: { promoCode },
  });
};

/**
 * Send notification when order is cancelled
 */
export const notifyOrderCancelled = async (userId: string, orderId: string, reason: string) => {
  return createNotification({
    user_id: userId,
    type: 'system',
    title: 'Order Cancelled',
    message: `Your order has been cancelled. Reason: ${reason}`,
    metadata: { orderId, reason },
  });
};
