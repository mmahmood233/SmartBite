import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants';
import { useLanguage } from '../../contexts/LanguageContext';
import { useRiderEarnings } from '../../hooks/useRiderEarnings';
import { getRiderProfile } from '../../services/rider.service';
import { supabase } from '../../lib/supabase';

const RiderEarningsScreen: React.FC = () => {
  const { t } = useLanguage();
  const [riderId, setRiderId] = useState<string | null>(null);
  const { stats, paymentHistory, loading, error, refetch } = useRiderEarnings(riderId || '');

  // Load rider profile
  useEffect(() => {
    loadRiderProfile();
  }, []);

  const loadRiderProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const rider = await getRiderProfile(user.id);
      if (rider) {
        setRiderId(rider.id);
      }
    } catch (err) {
      console.error('Error loading rider profile:', err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('rider.earnings')}</Text>
        <Text style={styles.headerSubtitle}>{t('rider.trackIncome')}</Text>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>{t('common.loading')}...</Text>
        </View>
      ) : (

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Total Earnings Card */}
        <View style={styles.totalCard}>
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.totalCardGradient}
          >
            <View style={styles.totalCardHeader}>
              <Text style={styles.totalLabel}>{t('rider.totalEarnings')}</Text>
              <Icon name="trending-up" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.totalAmount}>BD {stats.total.toFixed(2)}</Text>
            <Text style={styles.totalSubtext}>
              {t('rider.thisMonth')}
            </Text>
          </LinearGradient>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Icon name="calendar" size={20} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>BD {stats.today.toFixed(2)}</Text>
            <Text style={styles.statLabel}>{t('common.today')}</Text>
            <Text style={styles.statMeta}>{t('rider.deliveries')}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Icon name="bar-chart-2" size={20} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>BD {stats.week.toFixed(2)}</Text>
            <Text style={styles.statLabel}>{t('common.thisWeek')}</Text>
            <Text style={styles.statMeta}>{t('rider.deliveries')}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Icon name="pie-chart" size={20} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>BD {stats.month.toFixed(2)}</Text>
            <Text style={styles.statLabel}>{t('common.thisMonth')}</Text>
            <Text style={styles.statMeta}>{t('rider.deliveries')}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Icon name="star" size={20} color="#FFB020" />
            </View>
            <Text style={styles.statValue}>-</Text>
            <Text style={styles.statLabel}>{t('common.rating')}</Text>
            <Text style={styles.statMeta}>{t('rider.avgScore')}</Text>
          </View>
        </View>

        {/* Payment History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('rider.paymentHistory')}</Text>
          </View>

          {paymentHistory.length === 0 ? (
            <View style={styles.emptyPayments}>
              <Icon name="inbox" size={48} color={colors.textDisabled} />
              <Text style={styles.emptyPaymentsText}>{t('rider.noPayments')}</Text>
            </View>
          ) : (
            paymentHistory.map((payment) => (
              <View key={payment.id} style={styles.paymentCard}>
                <View style={styles.paymentIcon}>
                  <Icon name="check-circle" size={24} color={colors.success} />
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentAmount}>BD {payment.amount.toFixed(2)}</Text>
                  <Text style={styles.paymentMethod}>{payment.payout_method || 'Benefit Pay'}</Text>
                </View>
                <View style={styles.paymentRight}>
                  <Text style={styles.paymentDate}>{new Date(payment.date).toLocaleDateString()}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{t('common.paid')}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  totalCard: {
    margin: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  totalCardGradient: {
    padding: SPACING.xxl,
  },
  totalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  totalLabel: {
    fontSize: FONT_SIZE.md,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: SPACING.sm,
  },
  totalSubtext: {
    fontSize: FONT_SIZE.md,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F7F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  statValue: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statMeta: {
    fontSize: FONT_SIZE.xs,
    color: colors.textDisabled,
  },
  section: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  seeAllText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: colors.primary,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  paymentIcon: {
    marginRight: SPACING.md,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentAmount: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  paymentMethod: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
  },
  paymentRight: {
    alignItems: 'flex-end',
  },
  paymentDate: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginBottom: SPACING.sm,
  },
  statusBadge: {
    backgroundColor: '#E9F9F1',
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: colors.success,
  },
  payoutSection: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  payoutButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  payoutButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
  },
  payoutButtonText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  payoutNote: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxxl,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
  },
  emptyPayments: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
  },
  emptyPaymentsText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
  },
});

export default RiderEarningsScreen;
