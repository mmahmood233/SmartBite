/**
 * Admin Analytics Service
 * Provides platform-wide statistics and metrics for admin dashboard
 */

import { supabase } from '../lib/supabase';

export interface DashboardStats {
  totalRestaurants: number;
  activeRestaurants: number;
  totalUsers: number;
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  todayRevenue: number;
}

export interface RevenueData {
  labels: string[];
  data: number[];
}

/**
 * Get platform-wide dashboard statistics
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get total restaurants
    const { count: totalRestaurants } = await supabase
      .from('restaurants')
      .select('*', { count: 'exact', head: true });

    // Get active restaurants
    const { count: activeRestaurants } = await supabase
      .from('restaurants')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Get total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'customer');

    // Get total orders
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    // Get today's orders
    const { count: todayOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    // Get total revenue
    const { data: allOrders } = await supabase
      .from('orders')
      .select('total_amount')
      .in('status', ['delivered', 'confirmed', 'preparing', 'ready_for_pickup']);

    const totalRevenue = allOrders?.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0;

    // Get today's revenue
    const { data: todayOrdersData } = await supabase
      .from('orders')
      .select('total_amount')
      .in('status', ['delivered', 'confirmed', 'preparing', 'ready_for_pickup'])
      .gte('created_at', today.toISOString());

    const todayRevenue = todayOrdersData?.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0;

    return {
      totalRestaurants: totalRestaurants || 0,
      activeRestaurants: activeRestaurants || 0,
      totalUsers: totalUsers || 0,
      totalOrders: totalOrders || 0,
      todayOrders: todayOrders || 0,
      totalRevenue,
      todayRevenue,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

/**
 * Get revenue data for charts
 */
export const getRevenueData = async (period: 'week' | 'month' | 'year'): Promise<RevenueData> => {
  try {
    const now = new Date();
    let startDate = new Date();
    let labels: string[] = [];
    let groupBy: 'day' | 'week' | 'month' = 'day';

    if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      groupBy = 'day';
    } else if (period === 'month') {
      startDate.setDate(now.getDate() - 30);
      labels = ['W1', 'W2', 'W3', 'W4'];
      groupBy = 'week';
    } else {
      startDate.setMonth(now.getMonth() - 12);
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      groupBy = 'month';
    }

    const { data: orders } = await supabase
      .from('orders')
      .select('total_amount, created_at')
      .in('status', ['delivered', 'confirmed', 'preparing', 'ready_for_pickup'])
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    // Group revenue by period
    const revenueMap: { [key: string]: number } = {};
    
    orders?.forEach(order => {
      const date = new Date(order.created_at);
      let key: string;

      if (groupBy === 'day') {
        key = date.toLocaleDateString('en-US', { weekday: 'short' });
      } else if (groupBy === 'week') {
        const weekNum = Math.floor((date.getDate() - 1) / 7) + 1;
        key = `W${weekNum}`;
      } else {
        key = date.toLocaleDateString('en-US', { month: 'short' });
      }

      revenueMap[key] = (revenueMap[key] || 0) + parseFloat(order.total_amount);
    });

    // Fill in data for all labels
    const data = labels.map(label => revenueMap[label] || 0);

    return { labels, data };
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    throw error;
  }
};

/**
 * Get recent platform activity
 */
export const getRecentActivity = async (limit: number = 10) => {
  try {
    // Get recent restaurants
    const { data: recentRestaurants } = await supabase
      .from('restaurants')
      .select('name, created_at')
      .order('created_at', { ascending: false })
      .limit(3);

    // Get recent users
    const { data: recentUsers } = await supabase
      .from('users')
      .select('full_name, created_at')
      .eq('role', 'customer')
      .order('created_at', { ascending: false })
      .limit(3);

    // Get recent orders
    const { data: recentOrders } = await supabase
      .from('orders')
      .select('order_number, created_at, status')
      .order('created_at', { ascending: false })
      .limit(3);

    // Combine and sort by date
    const activities = [
      ...(recentRestaurants?.map(r => ({
        type: 'restaurant' as const,
        title: 'New Restaurant Registered',
        subtitle: r.name,
        time: r.created_at,
      })) || []),
      ...(recentUsers?.map(u => ({
        type: 'user' as const,
        title: 'New User Signup',
        subtitle: u.full_name,
        time: u.created_at,
      })) || []),
      ...(recentOrders?.map(o => ({
        type: 'order' as const,
        title: o.status === 'delivered' ? 'Order Completed' : 'New Order',
        subtitle: `Order #${o.order_number}`,
        time: o.created_at,
      })) || []),
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, limit);

    return activities;
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error;
  }
};
