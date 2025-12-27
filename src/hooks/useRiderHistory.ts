import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getDeliveryHistory } from '../services/delivery.service';

export interface DeliveryHistoryItem {
  id: string;
  order_id: string;
  restaurant_name: string;
  delivery_address: string;
  earnings: number;
  completed_at: string;
  rating?: number;
  status: string;
}

/**
 * Custom hook for rider delivery history with real-time updates
 */
export const useRiderHistory = (riderId: string, filter: 'all' | 'today' | 'week' | 'month' = 'all') => {
  const [history, setHistory] = useState<DeliveryHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!riderId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getDeliveryHistory(riderId, 50);
      
      // Filter by date range
      const now = new Date();
      const filtered = data.filter((item: any) => {
        const completedDate = new Date(item.completed_at);
        
        switch (filter) {
          case 'today':
            return completedDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return completedDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return completedDate >= monthAgo;
          default:
            return true;
        }
      });

      // Transform data
      const formattedHistory: DeliveryHistoryItem[] = filtered.map((item: any) => {
        const completedDate = new Date(item.completed_at || item.delivery_time);
        
        return {
          id: item.id,
          order_id: item.order_id,
          restaurant_name: item.orders?.restaurants?.name || 'Unknown',
          delivery_address: item.orders?.delivery_address || 'Unknown',
          earnings: item.earnings || 0,
          total_amount: item.orders?.total_amount || 0,
          completed_at: item.completed_at,
          date: completedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
          time: completedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          rating: item.customer_rating || 0,
          status: item.status,
        };
      });

      setHistory(formattedHistory);
    } catch (err: any) {
      console.error('Error fetching history:', err);
      setError(err.message || 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  }, [riderId, filter]);

  // Initial fetch
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Real-time subscription
  useEffect(() => {
    if (!riderId) return;

    console.log('Setting up real-time subscription for delivery history');

    const historySubscription = supabase
      .channel('rider-delivery-history')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'deliveries',
          filter: `rider_id=eq.${riderId}`,
        },
        (payload) => {
          console.log('New delivery completed:', payload.eventType);
          
          // Refresh history when new delivery is completed
          if (payload.new && (payload.new as any).status === 'delivered') {
            fetchHistory();
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(historySubscription);
    };
  }, [riderId, fetchHistory]);

  return {
    history,
    loading,
    error,
    refetch: fetchHistory,
  };
};
