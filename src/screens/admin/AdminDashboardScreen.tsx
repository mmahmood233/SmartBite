/**
 * Admin Dashboard Screen
 * Platform overview with key metrics and quick actions
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import { PartnerColors, PartnerSpacing, PartnerBorderRadius, PartnerTypography } from '../../constants/partnerTheme';
import { getDashboardStats, getRevenueData, getRecentActivity, DashboardStats } from '../../services/admin-analytics.service';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';

const screenWidth = Dimensions.get('window').width;

const AdminDashboardScreen: React.FC = () => {
  const { t } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<{ labels: string[]; datasets: { data: number[] }[] } | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch revenue data when period changes
  useEffect(() => {
    fetchRevenueData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, activityData] = await Promise.all([
        getDashboardStats(),
        getRecentActivity(3),
      ]);
      setStats(statsData);
      setRecentActivity(activityData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenueData = async () => {
    try {
      const data = await getRevenueData(selectedPeriod);
      setRevenueData({
        labels: data.labels,
        datasets: [{ data: data.data }],
      });
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatRevenue = (amount: number) => {
    if (amount >= 1000) {
      return `BD ${(amount / 1000).toFixed(1)}K`;
    }
    return `BD ${amount.toFixed(0)}`;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={PartnerColors.primary} />
        <Text style={{ marginTop: 16, color: PartnerColors.light.text.secondary }}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Platform Overview</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Icon name="bell" size={24} color={PartnerColors.light.text.primary} />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Date Range Filter */}
        <View style={styles.filterSection}>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'week' && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod('week')}
            activeOpacity={0.7}
          >
            <Text style={[styles.periodButtonText, selectedPeriod === 'week' && styles.periodButtonTextActive]}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'month' && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod('month')}
            activeOpacity={0.7}
          >
            <Text style={[styles.periodButtonText, selectedPeriod === 'month' && styles.periodButtonTextActive]}>
              Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'year' && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod('year')}
            activeOpacity={0.7}
          >
            <Text style={[styles.periodButtonText, selectedPeriod === 'year' && styles.periodButtonTextActive]}>
              Year
            </Text>
          </TouchableOpacity>
        </View>

        {/* Revenue Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Revenue Trends</Text>
          {revenueData && (
            <LineChart
              data={revenueData}
            width={screenWidth - 48}
            height={220}
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 168, 150, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: PartnerColors.primary,
              },
            }}
              bezier
              style={styles.chart}
            />
          )}
        </View>
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#00A896', '#00C7B1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statGradient}
            >
              <Icon name="shopping-bag" size={24} color="#FFFFFF" />
              <Text style={styles.statValue}>{stats?.totalRestaurants || 0}</Text>
              <Text style={styles.statLabel}>Restaurants</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={['#007AFF', '#0051D5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statGradient}
            >
              <Icon name="users" size={24} color="#FFFFFF" />
              <Text style={styles.statValue}>{formatNumber(stats?.totalUsers || 0)}</Text>
              <Text style={styles.statLabel}>Users</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={['#FF9500', '#FF6B00']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statGradient}
            >
              <Icon name="file-text" size={24} color="#FFFFFF" />
              <Text style={styles.statValue}>{formatNumber(stats?.todayOrders || 0)}</Text>
              <Text style={styles.statLabel}>Orders Today</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statGradient}
            >
              <Icon name="dollar-sign" size={24} color="#FFFFFF" />
              <Text style={styles.statValue}>{formatRevenue(stats?.totalRevenue || 0)}</Text>
              <Text style={styles.statLabel}>Total Revenue</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
              <View style={[styles.actionIcon, { backgroundColor: '#E6F7F4' }]}>
                <Icon name="plus-circle" size={24} color={PartnerColors.primary} />
              </View>
              <Text style={styles.actionText}>Add Restaurant</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
              <View style={[styles.actionIcon, { backgroundColor: '#FFF4E6' }]}>
                <Icon name="grid" size={24} color="#FF9500" />
              </View>
              <Text style={styles.actionText}>Manage Categories</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
              <View style={[styles.actionIcon, { backgroundColor: '#F0F4FF' }]}>
                <Icon name="tag" size={24} color="#007AFF" />
              </View>
              <Text style={styles.actionText}>Create Promotion</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
              <View style={[styles.actionIcon, { backgroundColor: '#ECFDF5' }]}>
                <Icon name="bar-chart-2" size={24} color="#10B981" />
              </View>
              <Text style={styles.actionText}>View Analytics</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <React.Fragment key={index}>
                  <View style={styles.activityItem}>
                    <View style={[
                      styles.activityIcon,
                      {
                        backgroundColor:
                          activity.type === 'restaurant' ? '#E6F7F4' :
                          activity.type === 'user' ? '#F0F4FF' : '#ECFDF5'
                      }
                    ]}>
                      <Icon
                        name={
                          activity.type === 'restaurant' ? 'shopping-bag' :
                          activity.type === 'user' ? 'user-plus' : 'check-circle'
                        }
                        size={16}
                        color={
                          activity.type === 'restaurant' ? PartnerColors.primary :
                          activity.type === 'user' ? '#007AFF' : '#10B981'
                        }
                      />
                    </View>
                    <View style={styles.activityContent}>
                      <Text style={styles.activityTitle}>{activity.title}</Text>
                      <Text style={styles.activityTime}>{activity.subtitle} • {getTimeAgo(activity.time)}</Text>
                    </View>
                  </View>
                  {index < recentActivity.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
              ))
            ) : (
              <Text style={{ textAlign: 'center', color: PartnerColors.light.text.tertiary, padding: 20 }}>
                No recent activity
              </Text>
            )}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PartnerColors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PartnerSpacing.xl,
    paddingTop: Platform.OS === 'ios' ? 50 : PartnerSpacing.lg,
    paddingBottom: PartnerSpacing.lg,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: PartnerColors.light.borderLight,
  },
  greeting: {
    fontSize: 24,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: PartnerColors.light.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: PartnerColors.light.text.secondary,
    marginTop: 4,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: PartnerTypography.fontWeight.bold,
  },
  scrollView: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: PartnerSpacing.lg,
    paddingTop: PartnerSpacing.lg,
    gap: 12,
  },
  statCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  statGradient: {
    padding: PartnerSpacing.lg,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: PartnerSpacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: PartnerColors.light.text.primary,
    marginBottom: PartnerSpacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: PartnerSpacing.md,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 13,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: PartnerColors.light.text.primary,
    marginTop: 8,
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: PartnerSpacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: PartnerColors.light.text.primary,
  },
  activityTime: {
    fontSize: 12,
    color: PartnerColors.light.text.tertiary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: PartnerColors.light.borderLight,
  },
  filterSection: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: PartnerSpacing.xl,
    paddingTop: PartnerSpacing.lg,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: PartnerColors.light.borderLight,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: `${PartnerColors.primary}15`,
    borderColor: PartnerColors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: PartnerColors.light.text.secondary,
  },
  periodButtonTextActive: {
    color: PartnerColors.primary,
  },
  chartSection: {
    paddingHorizontal: PartnerSpacing.xl,
    paddingTop: PartnerSpacing.lg,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: PartnerColors.light.text.primary,
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
});

export default AdminDashboardScreen;
