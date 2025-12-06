import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getActiveDelivery } from '../services/delivery.service';

export interface ActiveDelivery {
  id: string;
  order_id: string;
  rider_id: string;
  status: string;
  pickup_location: {
    name: string;
    address: string;
    phone: string;
  };
  delivery_location: {
    address: string;
    phone: string;
  };
  order_items: any[];
  total: number;
  earnings: number;
  assigned_at: string;
  pickup_time?: string;
  delivery_time?: string;
}

/**
 * Custom hook for rider's active delivery with real-time updates
 */
export const useActiveDelivery = (riderId: string) => {
  const [delivery, setDelivery] = useState<ActiveDelivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDelivery = useCallback(async () => {
    if (!riderId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getActiveDelivery(riderId);
      
      if (data) {
        // Transform data to match UI format
        const formattedDelivery: ActiveDelivery = {
          id: data.id,
          order_id: data.order_id,
          rider_id: data.rider_id,
          status: data.status,
          pickup_location: {
            name: data.orders?.restaurants?.name || 'Restaurant',
            address: data.orders?.restaurants?.address || 'Unknown',
            phone: data.orders?.restaurants?.phone || '',
          },
          delivery_location: {
            address: data.orders?.delivery_address || 'Unknown',
            phone: data.orders?.users?.phone || '',
          },
          order_items: data.orders?.items || [],
          total: data.orders?.total || 0,
          earnings: data.earnings || 0,
          assigned_at: data.assigned_at,
          pickup_time: data.pickup_time,
          delivery_time: data.delivery_time,
        };

        setDelivery(formattedDelivery);
      } else {
        setDelivery(null);
      }
    } catch (err: any) {
      console.error('Error fetching active delivery:', err);
      setError(err.message || 'Failed to fetch delivery');
    } finally {
      setLoading(false);
    }
  }, [riderId]);

  // Initial fetch
  useEffect(() => {
    fetchDelivery();
  }, [fetchDelivery]);

  // Real-time subscription
  useEffect(() => {
    if (!riderId) return;

    console.log('Setting up real-time subscription for active delivery');

    const deliverySubscription = supabase
      .channel('rider-active-delivery')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'deliveries',
          filter: `rider_id=eq.${riderId}`,
        },
        (payload) => {
          console.log('Delivery update detected:', payload.eventType);
          
          // Refresh delivery data
          fetchDelivery();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(deliverySubscription);
    };
  }, [riderId, fetchDelivery]);

  return {
    delivery,
    loading,
    error,
    refetch: fetchDelivery,
  };
};
