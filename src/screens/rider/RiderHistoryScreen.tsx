import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants';
import { useLanguage } from '../../contexts/LanguageContext';
import { useRiderHistory } from '../../hooks/useRiderHistory';
import { getRiderProfile } from '../../services/rider.service';
import { supabase } from '../../lib/supabase';

const RiderHistoryScreen: React.FC = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [riderId, setRiderId] = useState<string | null>(null);
  const { history, loading, error, refetch } = useRiderHistory(riderId || '', filter);

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

  const renderDeliveryCard = (delivery: any) => {
    // Calculate earnings: use stored earnings or 15% of order total
    const earnings = delivery.earnings > 0 ? delivery.earnings : (delivery.total_amount || 0) * 0.15;
    
    return (
      <View key={delivery.id} style={styles.deliveryCard}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.orderNumber}>Order #{delivery.order_id.slice(0, 8)}</Text>
            <Text style={styles.restaurantName}>{delivery.restaurant_name}</Text>
          </View>
          <View style={styles.earningsBadge}>
            <Text style={styles.earningsText}>BD {earnings.toFixed(3)}</Text>
          </View>
        </View>

      <View style={styles.addressRow}>
        <Icon name="map-pin" size={14} color={colors.textSecondary} />
        <Text style={styles.addressText} numberOfLines={2}>
          {delivery.delivery_address}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Icon name="calendar" size={12} color={colors.textDisabled} />
            <Text style={styles.metaText}>{delivery.date}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="clock" size={12} color={colors.textDisabled} />
            <Text style={styles.metaText}>{delivery.time}</Text>
          </View>
        </View>

        <View style={styles.ratingRow}>
          {[...Array(5)].map((_, i) => (
            <Icon
              key={i}
              name="star"
              size={14}
              color={i < delivery.rating ? '#FFB020' : colors.border}
              fill={i < delivery.rating ? '#FFB020' : 'none'}
            />
          ))}
        </View>
      </View>
    </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('rider.deliveryHistory')}</Text>
        <Text style={styles.headerSubtitle}>{history.length} {t('rider.deliveries')}</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              {t('common.all')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'today' && styles.filterTabActive]}
            onPress={() => setFilter('today')}
          >
            <Text style={[styles.filterText, filter === 'today' && styles.filterTextActive]}>
              {t('common.today')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'week' && styles.filterTabActive]}
            onPress={() => setFilter('week')}
          >
            <Text style={[styles.filterText, filter === 'week' && styles.filterTextActive]}>
              {t('common.thisWeek')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'month' && styles.filterTabActive]}
            onPress={() => setFilter('month')}
          >
            <Text style={[styles.filterText, filter === 'month' && styles.filterTextActive]}>
              {t('common.thisMonth')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>{t('common.loading')}...</Text>
        </View>
      ) : history.length === 0 ? (
        <View style={styles.centerContent}>
          <Icon name="inbox" size={64} color={colors.textDisabled} />
          <Text style={styles.emptyTitle}>{t('rider.noDeliveries')}</Text>
          <Text style={styles.emptyText}>{t('rider.noDeliveriesMessage')}</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.deliveriesContainer}>
            {history.map(renderDeliveryCard)}
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
  filterContainer: {
    backgroundColor: colors.surface,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterTab: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    backgroundColor: colors.surfaceLight,
    borderRadius: BORDER_RADIUS.lg,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  deliveriesContainer: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  deliveryCard: {
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  orderNumber: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  earningsBadge: {
    backgroundColor: '#E8F7F4',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  earningsText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: colors.primary,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  addressText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    flexWrap: 'wrap',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  metaRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: FONT_SIZE.xs,
    color: colors.textDisabled,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 2,
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
  emptyTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default RiderHistoryScreen;
