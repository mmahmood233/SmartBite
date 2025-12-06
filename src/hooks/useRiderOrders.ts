import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getAvailableOrders } from '../services/delivery.service';

export interface AvailableOrder {
  id: string;
  restaurant_id: string;
  restaurant_name: string;
  restaurant_address: string;
  delivery_address: string;
  total: number;
  items: any[];
  distance: number;
  estimated_earnings: number;
  estimated_time: string;
  created_at: string;
}

/**
 * Custom hook for rider available orders with real-time updates
 */
export const useRiderOrders = () => {
  const [orders, setOrders] = useState<AvailableOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAvailableOrders();
      
      // Transform data to match UI format
      const formattedOrders: AvailableOrder[] = data.map((order: any) => ({
        id: order.id,
        restaurant_id: order.restaurant_id,
        restaurant_name: order.restaurants?.name || 'Unknown Restaurant',
        restaurant_address: order.restaurants?.address || 'Unknown Address',
        delivery_address: order.delivery_address || 'Unknown Address',
        total: order.total || 0,
        items: order.items || [],
        distance: 0, // TODO: Calculate based on rider location
        estimated_earnings: order.total * 0.15, // 15% of order total
        estimated_time: '15-20 min',
        created_at: order.created_at,
      }));

      setOrders(formattedOrders);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Real-time subscription
  useEffect(() => {
    console.log('Setting up real-time subscription for available orders');

    const ordersSubscription = supabase
      .channel('rider-available-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: 'rider_id=is.null',
        },
        (payload) => {
          console.log('Order change detected:', payload.eventType);
          
          // Refresh orders on any change
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(ordersSubscription);
    };
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
  };
};
