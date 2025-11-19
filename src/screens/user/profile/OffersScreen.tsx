import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather as Icon } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../../constants';
import { supabase } from '../../../lib/supabase';
import { getActivePromotions, Promotion } from '../../../services/promotions.service';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  restaurant?: string;
  isActive: boolean;
  code?: string;
}

const OffersScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [activeOffers, setActiveOffers] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch active promotions
  useEffect(() => {
    fetchPromotions();
  }, []);

  // Real-time subscription for promotions
  useEffect(() => {
    const promotionSubscription = supabase
      .channel('user-promotions-changes')
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
      const data = await getActivePromotions();
      setActiveOffers(data);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const [savedCodes] = useState<Offer[]>([]);
  const [pastOffers] = useState<Offer[]>([]);

  const handleBack = () => {
    navigation.goBack();
  };


  const renderOfferCard = (offer: Offer, isPast: boolean = false) => (
    <View key={offer.id} style={[styles.offerCard, isPast && styles.offerCardPast]}>
      {/* Accent Stripe */}
      {!isPast && (
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.offerStripe}
        />
      )}

      {/* Offer Content */}
      <View style={styles.offerContent}>
        <View style={styles.offerHeader}>
          <View style={styles.offerIconContainer}>
            <Text style={styles.offerEmoji}>{isPast ? '⏰' : '🎉'}</Text>
          </View>
          <View style={styles.offerInfo}>
            <Text style={styles.offerTitle}>{offer.title}</Text>
            <Text style={styles.offerDescription}>
              {offer.description || 'Special offer'}
            </Text>
          </View>
        </View>

        <View style={styles.offerInfo}>
          <Text style={[styles.offerTitle, isPast && styles.offerTitlePast]}>
            {offer.title}
          </Text>
          <Text style={[styles.offerDescription, isPast && styles.offerDescriptionPast]}>
            {offer.description}
          </Text>
          <View style={styles.offerMeta}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={14}
              color={isPast ? '#94A3B8' : '#64748B'}
            />
            <Text style={styles.offerValidText}>
              Valid until {new Date(offer.valid_until).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Discount Badge */}
        {!isPast && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {offer.type === 'percentage'
                ? `${offer.discount_value}%`
                : offer.type === 'fixed'
                ? `BD ${offer.discount_value}`
                : 'Free Delivery'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Offers & Promotions</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Offers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Offers</Text>
          {loading ? (
            <Text style={styles.emptyText}>Loading promotions...</Text>
          ) : activeOffers.length === 0 ? (
            <Text style={styles.emptyText}>No active promotions available</Text>
          ) : (
            activeOffers.map((offer) => renderOfferCard(offer, false))
          )}
        </View>

        {/* Saved Promo Codes */}
        {savedCodes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Saved Promo Codes</Text>
            {savedCodes.map((offer) => renderOfferCard(offer, false))}
            {savedCodes.map(offer => renderOfferCard(offer, false))}
          </View>
        )}

        {/* Past Offers */}
        {pastOffers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Past Offers</Text>
            {pastOffers.map(offer => renderOfferCard(offer, true))}
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: '#0F172A',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  promoSection: {
    padding: SPACING.lg,
    backgroundColor: colors.surface,
    marginBottom: SPACING.sm,
  },
  section: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: SPACING.md,
  },
  promoInputContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  promoInput: {
    flex: 1,
    height: 48,
    backgroundColor: colors.background,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    fontSize: FONT_SIZE.base,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: colors.border,
  },
  promoApplyButton: {
    minWidth: 80,
  },
  promoApplyGradient: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
  },
  promoApplyText: {
    fontSize: FONT_SIZE.base,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  offerCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  offerCardPast: {
    opacity: 0.6,
  },
  offerStripe: {
    width: 4,
  },
  offerContent: {
    flex: 1,
    padding: SPACING.lg,
  },
  offerHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  offerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: '#E6F7F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  offerEmoji: {
    fontSize: 24,
  },
  offerInfo: {
    flex: 1,
  },
  offerTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  offerTitlePast: {
    color: '#64748B',
  },
  offerDescription: {
    fontSize: FONT_SIZE.md,
    color: '#64748B',
    marginBottom: SPACING.xs,
    lineHeight: 20,
  },
  offerDescriptionPast: {
    color: '#94A3B8',
  },
  offerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  offerValidText: {
    fontSize: FONT_SIZE.sm,
    color: '#64748B',
  },
  offerValidTextPast: {
    color: '#94A3B8',
  },
  applyButton: {
    alignSelf: 'flex-start',
  },
  applyButtonGradient: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  applyButtonText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
  offerDiscount: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  discountBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  discountText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default OffersScreen;
