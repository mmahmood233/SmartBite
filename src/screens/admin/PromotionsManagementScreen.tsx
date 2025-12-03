/**
 * Promotions Management Screen
 * Create and manage platform-wide promotions and banners
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
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import { PartnerColors, PartnerSpacing, PartnerBorderRadius, PartnerTypography } from '../../constants/partnerTheme';
import Snackbar, { SnackbarType } from '../../components/Snackbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  getAllPromotions,
  deletePromotion,
  togglePromotionStatus,
  Promotion,
} from '../../services/promotions.service';

// Promotion interface now imported from service

const PromotionsManagementScreen: React.FC = () => {
  const { t } = useLanguage();
  const navigation = useNavigation();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<SnackbarType>('success');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const showSnackbar = (message: string, type: SnackbarType = 'success') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  // Fetch promotions
  useEffect(() => {
    fetchPromotions();
  }, []);

  // Real-time subscription
  useEffect(() => {
    const promotionSubscription = supabase
      .channel('admin-promotions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'promotions',
        },
        (payload) => {
          console.log('Promotion change detected:', payload);
          fetchPromotions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(promotionSubscription);
    };
  }, []);

  const fetchPromotions = async () => {
    try {
      const data = await getAllPromotions();
      setPromotions(data);
    } catch (error) {
      console.error('Error fetching promotions:', error);
      showSnackbar('Failed to load promotions', 'error');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleEdit = (promotion: Promotion) => {
    // Navigate to edit screen with promotion data
    navigation.navigate('AddPromotion' as never, {
      promotion,
    } as never);
  };

  const handleDelete = (id: string) => {
    const promotion = promotions.find(p => p.id === id);
    if (!promotion) return;

    Alert.alert(
      'Delete Promotion',
      `Are you sure you want to delete "${promotion.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            setLoadingMessage('Deleting promotion...');
            
            try {
              await deletePromotion(id);
              await fetchPromotions();
              showSnackbar('Promotion deleted successfully', 'warning');
            } catch (error) {
              console.error('Error deleting promotion:', error);
              showSnackbar('Failed to delete promotion', 'error');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleToggleActive = async (id: string) => {
    const promotion = promotions.find(p => p.id === id);
    if (!promotion) return;

    try {
      await togglePromotionStatus(id, !promotion.is_active);
      await fetchPromotions();
      showSnackbar(
        `${promotion.title} ${promotion.is_active ? 'deactivated' : 'activated'}`,
        'info'
      );
    } catch (error) {
      console.error('Error toggling promotion status:', error);
      showSnackbar('Failed to update promotion status', 'error');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return 'percent';
      case 'fixed':
        return 'dollar-sign';
      case 'free_delivery':
        return 'truck';
      default:
        return 'tag';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'percentage':
        return '#FF9500';
      case 'fixed':
        return '#10B981';
      case 'free_delivery':
        return '#007AFF';
      default:
        return PartnerColors.primary;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Promotions</Text>
          <Text style={styles.headerSubtitle}>
            {promotions.filter(p => p.is_active).length} active promotions
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddPromotion' as never)}
          activeOpacity={0.8}
        >
          <Icon name="plus" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.promotionsList}>
          {promotions.map((promotion) => (
            <View key={promotion.id} style={styles.promotionCard}>
              <View style={styles.promotionHeader}>
                <View
                  style={[
                    styles.typeIcon,
                    { backgroundColor: `${getTypeColor(promotion.type)}15` },
                  ]}
                >
                  <Icon
                    name={getTypeIcon(promotion.type)}
                    size={20}
                    color={getTypeColor(promotion.type)}
                  />
                </View>
                <View style={styles.promotionActions}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => handleEdit(promotion)}
                    activeOpacity={0.7}
                  >
                    <Icon name="edit-2" size={18} color={PartnerColors.light.text.secondary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => handleDelete(promotion.id)}
                    activeOpacity={0.7}
                  >
                    <Icon name="trash-2" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.promotionTitle}>{promotion.title}</Text>
              <Text style={styles.promotionDescription}>
                {promotion.description || 'No description'}
              </Text>

              <View style={styles.promotionDetails}>
                <View style={styles.detailItem}>
                  <Icon name="gift" size={14} color={PartnerColors.light.text.tertiary} />
                  <Text style={styles.detailText}>
                    {promotion.type === 'percentage'
                      ? `${promotion.discount_value}%`
                      : promotion.type === 'fixed'
                      ? `BD ${promotion.discount_value}`
                      : 'Free Delivery'}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Icon name="calendar" size={14} color={PartnerColors.light.text.tertiary} />
                  <Text style={styles.detailText}>
                    {new Date(promotion.valid_until).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              {/* Expired Badge */}
              {new Date(promotion.valid_until) < new Date() && (
                <View style={styles.expiredBadge}>
                  <Icon name="alert-circle" size={14} color="#EF4444" />
                  <Text style={styles.expiredText}>Expired</Text>
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.statusButton,
                  promotion.is_active ? styles.activeButton : styles.inactiveButton,
                ]}
                onPress={() => handleToggleActive(promotion.id)}
                activeOpacity={0.7}
              >
                <Icon
                  name={promotion.is_active ? 'check-circle' : 'x-circle'}
                  size={16}
                  color={promotion.is_active ? '#10B981' : '#EF4444'}
                />
                <Text
                  style={[
                    styles.statusButtonText,
                    promotion.is_active ? styles.activeButtonText : styles.inactiveButtonText,
                  ]}
                >
                  {promotion.is_active ? 'Active' : 'Inactive'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        type={snackbarType}
        onDismiss={() => setSnackbarVisible(false)}
      />

      <LoadingSpinner
        visible={isLoading}
        message={loadingMessage}
        overlay
      />
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
  headerTitle: {
    fontSize: 24,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: PartnerColors.light.text.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: PartnerColors.light.text.secondary,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: PartnerColors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  promotionsList: {
    paddingHorizontal: PartnerSpacing.xl,
    paddingTop: PartnerSpacing.lg,
    gap: 16,
  },
  promotionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: PartnerSpacing.lg,
    marginBottom: 16,
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
  promotionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promotionActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  promotionTitle: {
    fontSize: 18,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: PartnerColors.light.text.primary,
    marginBottom: 6,
  },
  promotionDescription: {
    fontSize: 14,
    color: PartnerColors.light.text.secondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  promotionDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: PartnerColors.light.text.tertiary,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  activeButton: {
    backgroundColor: '#ECFDF5',
  },
  inactiveButton: {
    backgroundColor: '#FEE2E2',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: PartnerTypography.fontWeight.semibold,
  },
  activeButtonText: {
    color: '#10B981',
  },
  inactiveButtonText: {
    color: '#EF4444',
  },
  expiredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  expiredText: {
    fontSize: 13,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: '#EF4444',
  },
});

export default PromotionsManagementScreen;
