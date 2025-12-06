import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  getRiderEarnings,
  getTodayEarnings,
  getWeekEarnings,
  getMonthEarnings,
  getPendingEarnings,
} from '../services/earnings.service';

export interface EarningsStats {
  today: number;
  week: number;
  month: number;
  pending: number;
  total: number;
}

export interface PaymentHistory {
  id: string;
  amount: number;
  date: string;
  payment_status: string;
  payout_date?: string;
  payout_method?: string;
}

/**
 * Custom hook for rider earnings with real-time updates
 */
export const useRiderEarnings = (riderId: string) => {
  const [stats, setStats] = useState<EarningsStats>({
    today: 0,
    week: 0,
    month: 0,
    pending: 0,
    total: 0,
  });
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEarnings = useCallback(async () => {
    if (!riderId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch all earnings data in parallel
      const [today, week, month, pending, allEarnings] = await Promise.all([
        getTodayEarnings(riderId),
        getWeekEarnings(riderId),
        getMonthEarnings(riderId),
        getPendingEarnings(riderId),
        getRiderEarnings(riderId, 20),
      ]);

      // Calculate total from all earnings
      const total = allEarnings.reduce((sum, e) => sum + e.amount, 0);

      setStats({
        today,
        week,
        month,
        pending,
        total,
      });

      // Format payment history
      const history: PaymentHistory[] = allEarnings
        .filter(e => e.payment_status === 'paid')
        .map(e => ({
          id: e.id,
          amount: e.amount,
          date: e.date,
          payment_status: e.payment_status,
          payout_date: e.payout_date,
          payout_method: e.payout_method,
        }));

      setPaymentHistory(history);
    } catch (err: any) {
      console.error('Error fetching earnings:', err);
      setError(err.message || 'Failed to fetch earnings');
    } finally {
      setLoading(false);
    }
  }, [riderId]);

  // Initial fetch
  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  // Real-time subscription
  useEffect(() => {
    if (!riderId) return;

    console.log('Setting up real-time subscription for earnings');

    const earningsSubscription = supabase
      .channel('rider-earnings-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rider_earnings',
          filter: `rider_id=eq.${riderId}`,
        },
        (payload) => {
          console.log('Earnings update detected:', payload.eventType);
          
          // Refresh earnings data
          fetchEarnings();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(earningsSubscription);
    };
  }, [riderId, fetchEarnings]);

  return {
    stats,
    paymentHistory,
    loading,
    error,
    refetch: fetchEarnings,
  };
};
