// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather as Icon } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../../constants';
import { formatCurrency, formatRating } from '../../../utils';
import { supabase } from '../../../lib/supabase';
import { useLanguage } from '../../../contexts/LanguageContext';
import EmptyState from '../../../components/EmptyState';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface FavoriteRestaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryFee: number;
  deliveryTime: string;
  image?: any;
  logo: string;
}

const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useLanguage();
  const [favorites, setFavorites] = useState<FavoriteRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Fetch favorites with restaurant details
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          restaurant_id,
          restaurants (
            id,
            name,
            category,
            rating,
            delivery_fee,
            avg_prep_time
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data
      const transformedFavorites = data?.map(fav => ({
        id: fav.restaurant_id,
        favoriteId: fav.id,
        name: fav.restaurants?.name || 'Restaurant',
        cuisine: fav.restaurants?.category || 'Food',
        rating: fav.restaurants?.rating || 0,
        deliveryFee: fav.restaurants?.delivery_fee || 0,
        deliveryTime: fav.restaurants?.avg_prep_time || '30 min',
        logo: '🍽️',
      })) || [];

      setFavorites(transformedFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
      Alert.alert(t('common.error'), t('favorites.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleRemoveFavorite = (favoriteId: string, name: string) => {
    Alert.alert(
      t('favorites.removeFavorite'),
      `${t('favorites.removeConfirm')} ${name}?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.remove'),
          style: 'destructive',
          onPress: async () => {
            try {
              // Remove from database
              const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('id', favoriteId);

              if (error) throw error;

              // Update local state
              setFavorites(favorites.filter(fav => fav.favoriteId !== favoriteId));
              Alert.alert(t('common.success'), `${name} ${t('favorites.removed')}`);
            } catch (error) {
              console.error('Error removing favorite:', error);
              Alert.alert(t('common.error'), t('favorites.removeError'));
            }
          },
        },
      ]
    );
  };

  const handleRestaurantPress = (restaurantId: string) => {
    // Navigate to restaurant detail
    console.log('Navigate to restaurant:', restaurantId);
    // navigation.navigate('RestaurantDetail', { restaurantId });
  };


  const handleBrowseRestaurants = () => {
    navigation.navigate('MainTabs');
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyIcon}>❤️</Text>
      </View>
      <Text style={styles.emptyTitle}>{t('favorites.noFavorites')}</Text>
      <Text style={styles.emptySubtitle}>
        {t('favorites.noFavoritesMessage')}
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={handleBrowseRestaurants}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.browseButtonGradient}
        >
          <Text style={styles.browseButtonText}>{t('home.browseAllRestaurants')}</Text>
          <Icon name="arrow-right" size={18} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderFavoriteCard = (restaurant: FavoriteRestaurant) => (
    <TouchableOpacity
      key={restaurant.id}
      style={styles.favoriteCard}
      onPress={() => handleRestaurantPress(restaurant.id)}
      activeOpacity={0.7}
    >
      {/* Restaurant Thumbnail */}
      <View style={styles.thumbnailContainer}>
        <View style={styles.thumbnail}>
          <Text style={styles.thumbnailEmoji}>{restaurant.logo}</Text>
        </View>
      </View>

      {/* Restaurant Info */}
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName} numberOfLines={1}>
          {restaurant.name}
        </Text>
        <Text style={styles.restaurantCuisine} numberOfLines={1}>
          {restaurant.cuisine}
        </Text>

        {/* Meta Info */}
        <View style={styles.metaRow}>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={14} color="#FACC15" />
            <Text style={styles.ratingText}>{formatRating(restaurant.rating)}</Text>
          </View>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>
            {formatCurrency(restaurant.deliveryFee)} Delivery
          </Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>{restaurant.deliveryTime}</Text>
        </View>
      </View>

      {/* Heart Button */}
      <TouchableOpacity
        style={styles.heartButton}
        onPress={() => handleRemoveFavorite(restaurant.favoriteId, restaurant.name)}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="heart" size={22} color={colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('profile.favorites')}</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>{t('favorites.loading')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorites</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {favorites.length === 0 ? (
          <EmptyState
            emoji="💔"
            title={t('favorites.noFavorites')}
            message={t('favorites.noFavoritesMessage')}
            actionText={t('home.browseAllRestaurants')}
            onAction={() => navigation.navigate('MainTabs')}
          />
        ) : (
          <View style={styles.favoritesContainer}>
            {favorites.map(renderFavoriteCard)}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
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
  favoritesContainer: {
    padding: SPACING.lg,
  },
  favoriteCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xxl,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  thumbnailContainer: {
    marginRight: SPACING.md,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  thumbnailEmoji: {
    fontSize: 32,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  restaurantCuisine: {
    fontSize: FONT_SIZE.md,
    color: '#64748B',
    marginTop: 2,
    marginBottom: SPACING.sm + 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  metaDot: {
    fontSize: 13.5,
    color: '#94A3B8',
    marginHorizontal: 4,
  },
  metaText: {
    fontSize: 13.5,
    color: '#475569',
  },
  heartButton: {
    width: 40,
    height: 40,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginLeft: SPACING.sm,
    paddingTop: 6,
    paddingRight: 6,
  },
  // Empty State
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxxl,
    paddingVertical: SPACING.huge,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  emptyIcon: {
    fontSize: 56,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FONT_SIZE.base,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xxxl,
  },
  browseButton: {
    alignSelf: 'stretch',
  },
  browseButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxxl,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  browseButtonText: {
    fontSize: FONT_SIZE.base,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default FavoritesScreen;
