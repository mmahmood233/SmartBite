/**
 * Promotions Management Screen
 * Create and manage platform-wide promotions and banners
 */

import React, { useState } from 'react';
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

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  isActive: boolean;
  type: 'percentage' | 'fixed' | 'free_delivery';
}

const MOCK_PROMOTIONS: Promotion[] = [
  {
    id: '1',
    title: 'Weekend Special',
    description: 'Get 20% off on all orders',
    discount: '20%',
    validUntil: 'Dec 31, 2024',
    isActive: true,
    type: 'percentage',
  },
  {
    id: '2',
    title: 'Free Delivery',
    description: 'Free delivery on orders above BD 10',
    discount: 'Free',
    validUntil: 'Jan 15, 2025',
    isActive: true,
    type: 'free_delivery',
  },
  {
    id: '3',
    title: 'New User Offer',
    description: 'BD 5 off on first order',
    discount: 'BD 5',
    validUntil: 'Dec 25, 2024',
    isActive: false,
    type: 'fixed',
  },
];

const PromotionsManagementScreen: React.FC = () => {
  const navigation = useNavigation();
  const [promotions, setPromotions] = useState<Promotion[]>(MOCK_PROMOTIONS);
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

  const handleEdit = (promotion: Promotion) => {
    // Navigate to edit screen with promotion data
    navigation.navigate('AddPromotion' as never, {
      promotion: {
        id: promotion.id,
        title: promotion.title,
        description: promotion.description,
        type: promotion.type,
        discountValue: promotion.discount.replace(/[^\d.]/g, ''), // Extract number
        minOrderAmount: '',
        validFrom: '',
        validUntil: promotion.validUntil,
        maxUsage: '',
        isActive: promotion.isActive,
      },
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
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setPromotions(prev => prev.filter(p => p.id !== id));
            setIsLoading(false);
            showSnackbar('Promotion deleted', 'warning');
          },
        },
      ]
    );
  };

  const handleToggleActive = (id: string) => {
    setPromotions(prev =>
      prev.map(promo =>
        promo.id === id ? { ...promo, isActive: !promo.isActive } : promo
      )
    );
    const promotion = promotions.find(p => p.id === id);
    if (promotion) {
      showSnackbar(
        `${promotion.title} ${promotion.isActive ? 'deactivated' : 'activated'}`,
        'info'
      );
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
          <Text style={styles.headerSubtitle}>{promotions.length} active promotions</Text>
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
              <Text style={styles.promotionDescription}>{promotion.description}</Text>

              <View style={styles.promotionDetails}>
                <View style={styles.detailItem}>
                  <Icon name="gift" size={14} color={PartnerColors.light.text.tertiary} />
                  <Text style={styles.detailText}>{promotion.discount}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Icon name="calendar" size={14} color={PartnerColors.light.text.tertiary} />
                  <Text style={styles.detailText}>{promotion.validUntil}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.statusButton,
                  promotion.isActive ? styles.activeButton : styles.inactiveButton,
                ]}
                onPress={() => handleToggleActive(promotion.id)}
                activeOpacity={0.7}
              >
                <Icon
                  name={promotion.isActive ? 'check-circle' : 'x-circle'}
                  size={16}
                  color={promotion.isActive ? '#10B981' : '#EF4444'}
                />
                <Text
                  style={[
                    styles.statusButtonText,
                    promotion.isActive ? styles.activeButtonText : styles.inactiveButtonText,
                  ]}
                >
                  {promotion.isActive ? 'Active' : 'Inactive'}
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
});

export default PromotionsManagementScreen;
