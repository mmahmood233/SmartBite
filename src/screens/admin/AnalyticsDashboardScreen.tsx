/**
 * Analytics Dashboard Screen
 * Comprehensive business insights and statistics
 */
// @ts-nocheck

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Dimensions,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { PartnerColors, PartnerSpacing, PartnerTypography } from '../../constants/partnerTheme';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigation } from '@react-navigation/native'; // Add this line

const screenWidth = Dimensions.get('window').width;

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalRestaurants: number;
  activeRiders: number;
  revenueGrowth: number;
  ordersGrowth: number;
}

const AnalyticsDashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRestaurants: 0,
    activeRiders: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
  });
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch total orders
      const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Fetch total revenue
      const { data: ordersData } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'delivered');

      const totalRevenue = ordersData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

      // Fetch total users
      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Fetch total restaurants
      const { count: restaurantsCount } = await supabase
        .from('restaurants')
        .select('*', { count: 'exact', head: true });

      // Fetch active riders
      const { count: ridersCount } = await supabase
        .from('riders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'online');

      setAnalytics({
        totalRevenue,
        totalOrders: ordersCount || 0,
        totalUsers: usersCount || 0,
        totalRestaurants: restaurantsCount || 0,
        activeRiders: ridersCount || 0,
        revenueGrowth: 12.5, // Mock data - calculate from historical data
        ordersGrowth: 8.3, // Mock data
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, growth }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
          <Icon name={icon} size={20} color={color} />
        </View>
        {growth !== undefined && (
          <View style={[styles.growthBadge, { backgroundColor: growth >= 0 ? '#D1FAE5' : '#FEE2E2' }]}>
            <Icon 
              name={growth >= 0 ? 'trending-up' : 'trending-down'} 
              size={12} 
              color={growth >= 0 ? '#10B981' : '#EF4444'} 
            />
            <Text style={[styles.growthText, { color: growth >= 0 ? '#10B981' : '#EF4444' }]}>
              {Math.abs(growth)}%
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  // Mock chart data
  const revenueChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [120, 150, 180, 160, 200, 250, 220],
    }],
  };

  const ordersChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [25, 32, 40, 35, 45, 52, 48],
    }],
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PartnerColors.primary} />
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={PartnerColors.light.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t('admin.analytics')}</Text>
          <Text style={styles.headerSubtitle}>{t('admin.platformOverview')}</Text>
        </View>
        <TouchableOpacity onPress={fetchAnalytics} style={styles.refreshButton}>
          <Icon name="refresh-cw" size={20} color={PartnerColors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(['week', 'month', 'year'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive,
                ]}
              >
                {period === 'week' ? t('admin.week') : period === 'month' ? t('admin.month') : t('admin.year')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            title={t('admin.totalRevenue')}
            value={`BD ${analytics.totalRevenue.toFixed(2)}`}
            icon="dollar-sign"
            color="#10B981"
            growth={analytics.revenueGrowth}
          />
          <StatCard
            title={t('admin.ordersToday')}
            value={analytics.totalOrders}
            icon="shopping-bag"
            color="#6366F1"
            growth={analytics.ordersGrowth}
          />
          <StatCard
            title={t('admin.users')}
            value={analytics.totalUsers}
            icon="users"
            color="#F59E0B"
          />
          <StatCard
            title={t('admin.restaurants')}
            value={analytics.totalRestaurants}
            icon="home"
            color="#EF4444"
          />
          <StatCard
            title={t('admin.riders')}
            value={analytics.activeRiders}
            icon="truck"
            color="#3B82F6"
          />
          <StatCard
            title={t('admin.avgOrderValue')}
            value={`BD ${(analytics.totalRevenue / (analytics.totalOrders || 1)).toFixed(2)}`}
            icon="trending-up"
            color="#8B5CF6"
          />
        </View>

        {/* Revenue Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>{t('admin.revenue')} Trend</Text>
          <LineChart
            data={revenueChartData}
            width={screenWidth - 72}
            height={220}
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#10B981',
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Orders Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>{t('admin.ordersToday')} Overview</Text>
          <BarChart
            data={ordersChartData}
            width={screenWidth - 72}
            height={220}
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={styles.chart}
            yAxisLabel=""
            yAxisSuffix=""
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: PartnerColors.light.text.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: PartnerSpacing.xl,
    paddingTop: Platform.OS === 'ios' ? 50 : PartnerSpacing.lg,
    paddingBottom: PartnerSpacing.lg,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: PartnerColors.light.borderLight,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: PartnerColors.light.text.primary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: PartnerColors.light.text.secondary,
    marginTop: 2,
  },
  refreshButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  periodSelector: {
    flexDirection: 'row',
    padding: PartnerSpacing.xl,
    gap: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: PartnerColors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: PartnerColors.light.text.secondary,
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: PartnerSpacing.xl,
    gap: 12,
  },
  statCard: {
    width: (screenWidth - 64) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  growthText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: PartnerColors.light.text.primary,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 13,
    color: PartnerColors.light.text.secondary,
  },
  chartSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: PartnerSpacing.xl,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: PartnerColors.light.text.primary,
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
});

export default AnalyticsDashboardScreen;
