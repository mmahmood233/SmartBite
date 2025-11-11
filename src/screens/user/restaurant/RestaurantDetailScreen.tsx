// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';
import { fetchRestaurantById, fetchRestaurantMenu } from '../../../services/restaurants.service';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather as Icon } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../../constants';
import { formatCurrency, formatRating } from '../../../utils';
import DishDetailModal from './DishDetailModal';
import ReviewModal from '../../../components/ReviewModal';
import { createReview, fetchRestaurantReviews } from '../../../services/reviews.service';
import { supabase } from '../../../lib/supabase';
import { useCart } from '../../../contexts/CartContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = 320;

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: any;
  category: string;
  isPopular?: boolean;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  restaurant_id?: string;
  restaurants?: {
    id: string;
    name: string;
  };
}

// Mock data removed - now using real Supabase data

type RestaurantDetailRouteProp = RouteProp<RootStackParamList, 'RestaurantDetail'>;

// Helper function to format time ago
const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`;
  return `${Math.floor(seconds / 2592000)} months ago`;
};

const RestaurantDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RestaurantDetailRouteProp>();
  const { restaurantId } = route.params;
  const { cart, itemCount, addToCart } = useCart();
  
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'menu' | 'about' | 'reviews'>('menu');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const scrollY = new Animated.Value(0);
  
  // Dish Detail Modal State
  const [dishModalVisible, setDishModalVisible] = useState(false);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  
  // Review Modal State
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  
  // Refs for category sections
  const categoryRefs = useRef<{ [key: string]: View | null }>({});
  const scrollViewRef = useRef<ScrollView>(null);

  // Fetch restaurant and menu data
  useEffect(() => {
    loadRestaurantData();
    checkFavoriteStatus();
  }, [restaurantId]);

  const checkFavoriteStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('restaurant_id', restaurantId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setIsFavorite(true);
        setFavoriteId(data.id);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'Please login to add favorites');
        return;
      }

      if (isFavorite && favoriteId) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('id', favoriteId);

        if (error) throw error;

        setIsFavorite(false);
        setFavoriteId(null);
        Alert.alert('Success', 'Removed from favorites');
      } else {
        // Add to favorites
        const { data, error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            restaurant_id: restaurantId,
          })
          .select()
          .single();

        if (error) throw error;

        setIsFavorite(true);
        setFavoriteId(data.id);
        Alert.alert('Success', 'Added to favorites');
      }
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', error.message || 'Failed to update favorites');
    }
  };

  const loadRestaurantData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch restaurant details
      const restaurantData = await fetchRestaurantById(restaurantId);
      setRestaurant(restaurantData);

      // Fetch menu items
      const menu = await fetchRestaurantMenu(restaurantId);
      setMenuItems(menu);

      // Fetch reviews
      const reviewsData = await fetchRestaurantReviews(restaurantId);
      setReviews(reviewsData);

      // Set first category as active if available
      if (menu.length > 0) {
        const categories = [...new Set(menu.map((item: any) => item.category || 'Other'))];
        if (categories.length > 0) {
          setActiveCategory(categories[0] as string);
        }
      }
    } catch (err: any) {
      console.error('Error loading restaurant:', err);
      setError('Failed to load restaurant details');
    } finally {
      setLoading(false);
    }
  };

  const handleDishPress = (item: MenuItem) => {
    setSelectedDish({
      ...item,
      restaurant_id: restaurantId,
      restaurants: { id: restaurantId, name: restaurant?.name || 'Restaurant' },
    });
    setDishModalVisible(true);
  };

  const handleQuickAdd = async (item: any, event: any) => {
    event.stopPropagation(); // Prevent card click
    
    try {
      // Add item directly to cart with quantity 1 and no add-ons
      await addToCart(
        item.id,
        restaurantId,
        restaurant?.name || 'Restaurant',
        item.name,
        item.price,
        1, // quantity
        [], // no add-ons
        undefined, // no special request
        item.image
      );
      
      Alert.alert('Success', 'Item added to cart!');
    } catch (error: any) {
      // Error already handled by CartContext (different restaurant alert)
      console.log('Quick add cancelled or failed');
    }
  };

  const groupedMenu = menuItems.reduce((acc: Record<string, any[]>, item: any) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  const renderMenuItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={() => handleDishPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemImageContainer}>
        <Image 
          source={item.image ? { uri: item.image } : require('../../../../assets/food.png')} 
          style={styles.menuItemImage} 
        />
        {item.is_popular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>🔥 Popular</Text>
          </View>
        )}
      </View>
      <View style={styles.menuItemInfo}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        {item.description && (
          <Text style={styles.menuItemDescription} numberOfLines={2}>{item.description}</Text>
        )}
        <Text style={styles.menuItemPrice}>BD {item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={(e) => handleQuickAdd(item, e)}
        activeOpacity={0.7}
      >
        <Icon name="plus" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const handleCategoryPress = (category: string) => {
    setActiveCategory(category);
    
    // Scroll to the category section
    const categoryView = categoryRefs.current[category];
    if (categoryView && scrollViewRef.current) {
      categoryView.measureLayout(
        scrollViewRef.current as any,
        (x, y) => {
          scrollViewRef.current?.scrollTo({ y: y - 60, animated: true });
        },
        () => console.log('Failed to measure layout')
      );
    }
  };

  const renderCategoryBar = () => {
    const categories = Object.keys(groupedMenu);
    
    // Sort categories to ensure "Main Course" is always first
    const sortedCategories = categories.sort((a, b) => {
      if (a === 'Main Course') return -1;
      if (b === 'Main Course') return 1;
      return 0;
    });
    
    return (
      <View style={styles.categoryBarContainer}>
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryBar}
        >
          {sortedCategories.map((category) => (
            <TouchableOpacity
              key={category}
              style={styles.categoryButton}
              onPress={() => handleCategoryPress(category)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  activeCategory === category && styles.categoryButtonTextActive,
                ]}
              >
                {category}
              </Text>
              {activeCategory === category && (
                <View style={styles.categoryIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </Animated.ScrollView>
      </View>
    );
  };

  const renderMenuSection = () => {
    // Show all categories, not filtered
    // Sort categories to ensure "Main Course" is always first
    const sortedEntries = Object.entries(groupedMenu).sort(([catA], [catB]) => {
      if (catA === 'Main Course') return -1;
      if (catB === 'Main Course') return 1;
      return 0;
    });
    
    return (
      <View style={styles.menuSection}>
        {renderCategoryBar()}
        {sortedEntries.map(([category, items]) => (
          <View 
            key={category} 
            style={styles.menuCategory}
            ref={(ref) => (categoryRefs.current[category] = ref)}
          >
            <Text style={styles.categoryHeader}>{category}</Text>
            {items.map(renderMenuItem)}
          </View>
        ))}
      </View>
    );
  };

  const renderAboutSection = () => {
    if (!restaurant) return null;
    
    return (
      <View style={styles.aboutSection}>
        <View style={styles.aboutItem}>
          <Icon name="book-open" size={22} color={colors.primary} style={{ opacity: 1 }} />
          <View style={styles.aboutItemText}>
            <Text style={styles.aboutLabel}>Overview</Text>
            <Text style={styles.aboutValue}>
              {restaurant.description || 'Delicious food prepared with care and quality ingredients.'}
            </Text>
          </View>
        </View>

        <View style={styles.aboutItem}>
          <Icon name="clock" size={22} color={colors.primary} style={{ opacity: 1 }} />
          <View style={styles.aboutItemText}>
            <Text style={styles.aboutLabel}>Preparation Time</Text>
            <Text style={styles.aboutValue}>{restaurant.avg_prep_time || '20-30 mins'}</Text>
          </View>
        </View>

        <View style={styles.aboutItem}>
          <Icon name="truck" size={22} color={colors.primary} style={{ opacity: 1 }} />
          <View style={styles.aboutItemText}>
            <Text style={styles.aboutLabel}>Delivery</Text>
            <Text style={styles.aboutValue}>
              BD {restaurant.delivery_fee.toFixed(2)} • Min order BD {restaurant.min_order.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.aboutItem}>
          <Icon name="phone" size={22} color={colors.primary} style={{ opacity: 1 }} />
          <View style={styles.aboutItemText}>
            <Text style={styles.aboutLabel}>Contact</Text>
            <Text style={styles.aboutValue}>{restaurant.phone}</Text>
          </View>
        </View>

        <View style={styles.aboutItem}>
          <Icon name="map-pin" size={22} color={colors.primary} style={{ opacity: 1 }} />
          <View style={styles.aboutItemText}>
            <Text style={styles.aboutLabel}>Address</Text>
            <Text style={styles.aboutValue}>{restaurant.address}</Text>
          </View>
        </View>

        <View style={styles.aboutItem}>
          <Icon name="star" size={22} color={colors.primary} style={{ opacity: 1 }} />
          <View style={styles.aboutItemText}>
            <Text style={styles.aboutLabel}>Rating</Text>
            <Text style={styles.aboutValue}>
              {restaurant.rating.toFixed(1)} ⭐ ({restaurant.total_reviews} reviews)
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const handleAddReview = () => {
    setReviewModalVisible(true);
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('Error', 'You must be logged in to leave a review');
        return;
      }

      // Create review (order_id can be null for general reviews)
      await createReview({
        user_id: user.id,
        restaurant_id: restaurantId,
        order_id: null as any,
        rating,
        comment,
      });

      Alert.alert('Success', 'Thank you for your review!');
      
      // Reload restaurant data to get updated rating
      loadRestaurantData();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
      throw error;
    }
  };

  const renderReviewsSection = () => {
    if (!restaurant) return null;
    
    return (
      <View style={styles.reviewsSection}>
        <View style={styles.ratingHeader}>
          <Text style={styles.ratingScore}>{restaurant.rating.toFixed(1)}</Text>
          <Text style={styles.ratingOutOf}>/ 5</Text>
        </View>
        <Text style={styles.ratingSubtext}>Based on {restaurant.total_reviews} reviews</Text>

      {/* Filter Chips */}
      <View style={styles.reviewFilters}>
        <View style={[styles.filterChip, styles.filterChipActive]}>
          <Text style={styles.filterChipTextActive}>All</Text>
        </View>
        <View style={styles.filterChip}>
          <Text style={styles.filterChipText}>5⭐</Text>
        </View>
        <View style={styles.filterChip}>
          <Text style={styles.filterChipText}>4⭐</Text>
        </View>
        <View style={styles.filterChip}>
          <Text style={styles.filterChipText}>3⭐</Text>
        </View>
        <View style={styles.filterChip}>
          <Text style={styles.filterChipText}>📷 Photos</Text>
        </View>
      </View>

      {/* Real Reviews */}
      {reviews.length > 0 ? (
        reviews.map((review) => {
          const userName = review.users?.full_name || 'Anonymous';
          const initials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
          const timeAgo = getTimeAgo(review.created_at);
          
          return (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewAvatar}>
                  <Text style={styles.reviewAvatarText}>{initials}</Text>
                </View>
                <View style={styles.reviewHeaderInfo}>
                  <Text style={styles.reviewerName}>{userName}</Text>
                  <Text style={styles.reviewDate}>{timeAgo}</Text>
                </View>
                <View style={styles.reviewStars}>
                  <Text style={styles.reviewRating}>⭐ {review.rating.toFixed(1)}</Text>
                </View>
              </View>
              {review.comment && (
                <Text style={styles.reviewText}>{review.comment}</Text>
              )}
            </View>
          );
        })
      ) : (
        <View style={{ padding: 40, alignItems: 'center' }}>
          <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>
            No reviews yet. Be the first to review!
          </Text>
        </View>
      )}

      {/* Add Review CTA */}
      <View style={styles.addReviewContainer}>
        <TouchableOpacity 
          style={styles.addReviewButton}
          onPress={handleAddReview}
          activeOpacity={0.97}
        >
          <Icon name="edit-3" size={18} color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={styles.addReviewText}>Write a Review</Text>
          <Icon name="arrow-right" size={16} color={colors.primary} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
        <Text style={styles.addReviewSubtext}>Help others discover great meals!</Text>
      </View>
    </View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Header */}
        <View style={styles.heroContainer}>
          <Image
            source={require('../../../../assets/food.png')}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)']}
            style={styles.heroGradient}
          />
          <LinearGradient
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
            style={styles.heroBottomFade}
          />

          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton} 
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={20} color={colors.primary} />
          </TouchableOpacity>

          {/* Favorite Button */}
          <TouchableOpacity
            style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
            onPress={toggleFavorite}
            activeOpacity={0.8}
          >
            <Icon
              name="heart"
              size={20}
              color={isFavorite ? '#E74C3C' : '#555555'}
            />
          </TouchableOpacity>

          {/* Rating Badge */}
          {restaurant && (
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingBadgeText}>
                ⭐ {restaurant.rating.toFixed(1)} • {restaurant.avg_prep_time || '20-30 mins'}
              </Text>
            </View>
          )}
        </View>

        {/* Restaurant Info Card */}
        {loading ? (
          <View style={[styles.infoCard, { alignItems: 'center', justifyContent: 'center', padding: 40 }]}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : restaurant ? (
          <View style={styles.infoCard}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <Text style={styles.cuisineType}>{restaurant.category} • {restaurant.description?.substring(0, 50) || 'Delicious food'}</Text>
            
            {/* Key Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Icon name="star" size={14} color={colors.primary} style={{ marginRight: 4 }} />
                <Text style={styles.statTextBold}>{restaurant.rating.toFixed(1)}</Text>
                <Text style={styles.statText}> ({restaurant.total_reviews})</Text>
              </View>
              <Text style={styles.statDivider}>•</Text>
              <View style={styles.statItem}>
                <Icon name="clock" size={14} color={colors.primary} style={{ marginRight: 4 }} />
                <Text style={styles.statText}>{restaurant.avg_prep_time || '20-30 mins'}</Text>
              </View>
              <Text style={styles.statDivider}>•</Text>
              <View style={styles.statItem}>
                <Icon name="truck" size={14} color={colors.primary} style={{ marginRight: 4 }} />
                <Text style={styles.statText}>BD {restaurant.delivery_fee.toFixed(2)} Delivery</Text>
              </View>
            </View>

            <View style={styles.locationRow}>
              <Icon name="map-pin" size={14} color="#9E9E9E" />
              <Text style={styles.locationText}>{restaurant.address}</Text>
            </View>
          </View>
        ) : null}

        {/* Tabs Navigation */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'menu' && styles.tabActive]}
            onPress={() => setActiveTab('menu')}
          >
            <Text style={[styles.tabText, activeTab === 'menu' && styles.tabTextActive]}>
              Menu
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'about' && styles.tabActive]}
            onPress={() => setActiveTab('about')}
          >
            <Text style={[styles.tabText, activeTab === 'about' && styles.tabTextActive]}>
              About
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reviews' && styles.tabActive]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabText, activeTab === 'reviews' && styles.tabTextActive]}>
              Reviews
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'menu' && renderMenuSection()}
        {activeTab === 'about' && renderAboutSection()}
        {activeTab === 'reviews' && renderReviewsSection()}

        <View style={{ height: 120 }} />
      </Animated.ScrollView>

      {/* Sticky Bottom Order Bar */}
      {itemCount > 0 && cart.restaurantId === restaurantId && (
        <View style={styles.stickyBar}>
          <View style={styles.stickyBarLeft}>
            <Text style={styles.stickyBarItems}>{itemCount} {itemCount === 1 ? 'item' : 'items'}</Text>
            <Text style={styles.stickyBarTotal}>BD {cart.total.toFixed(2)}</Text>
          </View>
          <TouchableOpacity 
            style={styles.stickyBarButton} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Cart')}
          >
            <LinearGradient
              colors={['#007E73', '#00BFA6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.stickyBarGradient}
            >
              <Text style={styles.stickyBarButtonText}>View Cart</Text>
              <Icon name="arrow-right" size={18} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Dish Detail Modal */}
      {selectedDish && (
        <DishDetailModal
          visible={dishModalVisible}
          onClose={() => setDishModalVisible(false)}
          dish={selectedDish}
        />
      )}

      {/* Review Modal */}
      <ReviewModal
        visible={reviewModalVisible}
        onClose={() => setReviewModalVisible(false)}
        onSubmit={handleSubmitReview}
        restaurantName={restaurant?.name || ''}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    height: HERO_HEIGHT,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  heroBottomFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: SPACING.lg,
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  favoriteButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: SPACING.lg,
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  favoriteButtonActive: {
    backgroundColor: '#FFE5E5',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  ratingBadgeText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginTop: -36,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 5,
  },
  restaurantName: {
    fontSize: 26,
    fontWeight: '600',
    color: '#1A4D47',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  cuisineType: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6D6D6D',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statTextBold: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555555',
  },
  statText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#555555',
  },
  statDivider: {
    fontSize: 14,
    color: '#9E9E9E',
    marginHorizontal: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 13,
    color: '#9E9E9E',
    marginLeft: 4,
  },
  moodMatchTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  moodMatchText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#6D6D6D',
    lineHeight: 20,
    opacity: 0.8,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingHorizontal: SCREEN_WIDTH * 0.05,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#757575',
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  menuSection: {
    paddingBottom: SCREEN_WIDTH * 0.05,
  },
  categoryBarContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingVertical: 12,
  },
  categoryBar: {
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    gap: 20,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  categoryButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6D6D6D',
  },
  categoryButtonTextActive: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  categoryIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  menuCategory: {
    marginBottom: 24,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
  },
  categoryHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A4D47',
    marginBottom: 16,
    marginTop: 16,
    letterSpacing: -0.2,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  menuItemImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF7E6B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  menuItemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 13,
    color: '#9E9E9E',
    marginBottom: 6,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  aboutSection: {
    padding: SCREEN_WIDTH * 0.05,
  },
  aboutDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginHorizontal: SCREEN_WIDTH * 0.05,
    marginVertical: 4,
  },
  aboutItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  aboutItemText: {
    flex: 1,
    marginLeft: 12,
  },
  aboutLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  aboutValue: {
    fontSize: 14,
    color: '#6D6D6D',
    lineHeight: 20,
  },
  reviewsSection: {
    padding: SCREEN_WIDTH * 0.05,
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 8,
  },
  ratingScore: {
    fontSize: 52,
    fontWeight: '800',
    color: colors.primary,
  },
  ratingOutOf: {
    fontSize: 24,
    fontWeight: '400',
    color: '#9E9E9E',
    marginLeft: 4,
  },
  ratingSubtext: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6D6D6D',
    marginBottom: 24,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
  },
  reviewDate: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 2,
  },
  reviewStars: {
    marginLeft: 8,
  },
  reviewRating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
  },
  reviewText: {
    fontSize: 14,
    color: '#6D6D6D',
    lineHeight: 20,
  },
  reviewFilters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6D6D6D',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  addReviewContainer: {
    marginTop: 20,
  },
  addReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F7F5',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 126, 115, 0.15)',
  },
  addReviewText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  addReviewSubtext: {
    fontSize: 13,
    color: '#9E9E9E',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '400',
  },
  stickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    elevation: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
  },
  stickyBarLeft: {
    flex: 1,
  },
  stickyBarItems: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 4,
  },
  stickyBarTotal: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    lineHeight: 26,
  },
  stickyBarButton: {
    flex: 1,
    marginLeft: 16,
  },
  stickyBarGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#00796B',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  stickyBarButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});

export default RestaurantDetailScreen;
