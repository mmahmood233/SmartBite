import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../../constants';
import { formatCurrency, formatRating } from '../../../utils';

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

  // Mock data - will be replaced with actual favorites from state/API
  const [favorites, setFavorites] = useState<FavoriteRestaurant[]>([
    {
      id: '1',
      name: 'Al Qariah',
      cuisine: 'Saudi • Grill',
      rating: 4.8,
      deliveryFee: 0.5,
      deliveryTime: '25–30 min',
      logo: '🍽️',
    },
    {
      id: '2',
      name: 'Shawarma House',
      cuisine: 'Lebanese • Fast Food',
      rating: 4.7,
      deliveryFee: 0.3,
      deliveryTime: '18–22 min',
      logo: '🌯',
    },
    {
      id: '3',
      name: 'Manousheh Spot',
      cuisine: 'Lebanese • Bakery',
      rating: 4.9,
      deliveryFee: 0.4,
      deliveryTime: '20–25 min',
      logo: '🥖',
    },
  ]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleRemoveFavorite = (id: string, name: string) => {
    Alert.alert(
      'Remove Favorite',
      `Remove ${name} from your favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setFavorites(favorites.filter(fav => fav.id !== id));
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
      <Text style={styles.emptyTitle}>No favorites yet</Text>
      <Text style={styles.emptySubtitle}>
        Start adding your favorite restaurants to order again anytime!
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
          <Text style={styles.browseButtonText}>Browse Restaurants</Text>
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
        onPress={() => handleRemoveFavorite(restaurant.id, restaurant.name)}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="heart" size={22} color={colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

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
      >
        {favorites.length === 0 ? (
          renderEmptyState()
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
