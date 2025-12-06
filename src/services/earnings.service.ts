import { supabase } from '../lib/supabase';

export interface RiderEarning {
  id: string;
  rider_id: string;
  delivery_id: string;
  amount: number;
  date: string;
  payment_status: 'pending' | 'processing' | 'paid' | 'failed';
  payout_date?: string;
  payout_method?: string;
  payout_reference?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Get earnings for a rider
 */
export const getRiderEarnings = async (
  riderId: string,
  limit: number = 50
): Promise<RiderEarning[]> => {
  try {
    const { data, error } = await supabase
      .from('rider_earnings')
      .select('*')
      .eq('rider_id', riderId)
      .order('date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching rider earnings:', error);
    return [];
  }
};

/**
 * Get payment history for a rider
 */
export const getPaymentHistory = async (
  riderId: string,
  limit: number = 20
): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('rider_earnings')
      .select('*')
      .eq('rider_id', riderId)
      .eq('payment_status', 'paid')
      .order('payout_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return [];
  }
};

/**
 * Get pending earnings (not yet paid out)
 */
export const getPendingEarnings = async (riderId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('rider_earnings')
      .select('amount')
      .eq('rider_id', riderId)
      .eq('payment_status', 'pending');

    if (error) throw error;

    const total = data?.reduce((sum, earning) => sum + earning.amount, 0) || 0;
    return total;
  } catch (error) {
    console.error('Error fetching pending earnings:', error);
    return 0;
  }
};

/**
 * Request payout
 */
export const requestPayout = async (
  riderId: string,
  amount: number,
  payoutMethod: string = 'Benefit Pay'
): Promise<boolean> => {
  try {
    // Get all pending earnings
    const { data: pendingEarnings, error: fetchError } = await supabase
      .from('rider_earnings')
      .select('id')
      .eq('rider_id', riderId)
      .eq('payment_status', 'pending');

    if (fetchError) throw fetchError;

    if (!pendingEarnings || pendingEarnings.length === 0) {
      throw new Error('No pending earnings found');
    }

    // Update all pending earnings to processing
    const earningIds = pendingEarnings.map(e => e.id);
    const { error: updateError } = await supabase
      .from('rider_earnings')
      .update({
        payment_status: 'processing',
        payout_method: payoutMethod,
        updated_at: new Date().toISOString(),
      })
      .in('id', earningIds);

    if (updateError) throw updateError;

    return true;
  } catch (error) {
    console.error('Error requesting payout:', error);
    return false;
  }
};

/**
 * Get earnings summary by date range
 */
export const getEarningsSummary = async (
  riderId: string,
  startDate: string,
  endDate: string
): Promise<{
  total: number;
  count: number;
  average: number;
}> => {
  try {
    const { data, error } = await supabase
      .from('rider_earnings')
      .select('amount')
      .eq('rider_id', riderId)
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) throw error;

    const total = data?.reduce((sum, earning) => sum + earning.amount, 0) || 0;
    const count = data?.length || 0;
    const average = count > 0 ? total / count : 0;

    return { total, count, average };
  } catch (error) {
    console.error('Error fetching earnings summary:', error);
    return { total: 0, count: 0, average: 0 };
  }
};

/**
 * Get today's earnings
 */
export const getTodayEarnings = async (riderId: string): Promise<number> => {
  const today = new Date().toISOString().split('T')[0];
  const summary = await getEarningsSummary(riderId, today, today);
  return summary.total;
};

/**
 * Get this week's earnings
 */
export const getWeekEarnings = async (riderId: string): Promise<number> => {
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startDate = weekAgo.toISOString().split('T')[0];
  const endDate = today.toISOString().split('T')[0];
  
  const summary = await getEarningsSummary(riderId, startDate, endDate);
  return summary.total;
};

/**
 * Get this month's earnings
 */
export const getMonthEarnings = async (riderId: string): Promise<number> => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const startDate = firstDay.toISOString().split('T')[0];
  const endDate = today.toISOString().split('T')[0];
  
  const summary = await getEarningsSummary(riderId, startDate, endDate);
  return summary.total;
};
