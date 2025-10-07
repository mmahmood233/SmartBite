import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../theme/colors';
import DishDetailModal from './DishDetailModal';

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
}

const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Kabsa Rice with Chicken',
    description: 'Traditional Saudi rice dish with aromatic spices',
    price: 8.5,
    image: require('../../assets/food.png'),
    category: 'Mains',
    isPopular: true,
  },
  {
    id: '2',
    name: 'Lamb Mandi',
    description: 'Slow-cooked lamb with fragrant basmati rice',
    price: 12.0,
    image: require('../../assets/food.png'),
    category: 'Mains',
    isPopular: true,
  },
  {
    id: '3',
    name: 'Hummus & Pita',
    description: 'Creamy chickpea dip with warm pita bread',
    price: 4.5,
    image: require('../../assets/food.png'),
    category: 'Sides',
  },
  {
    id: '4',
    name: 'Baklava',
    description: 'Sweet pastry with honey and pistachios',
    price: 3.5,
    image: require('../../assets/food.png'),
    category: 'Desserts',
  },
];

const RestaurantDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState<'menu' | 'about' | 'reviews'>('menu');
  const [activeCategory, setActiveCategory] = useState<string>('Mains');
  const [isFavorite, setIsFavorite] = useState(false);
  const [cartItems, setCartItems] = useState<number>(0);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const scrollY = new Animated.Value(0);
  
  // Dish Detail Modal State
  const [dishModalVisible, setDishModalVisible] = useState(false);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  const handleDishPress = (item: MenuItem) => {
    setSelectedDish({
      ...item,
      rating: 4.8,
      reviewCount: 127,
      tags: item.isPopular ? ['🔥 Popular', '🌶️ Spicy'] : ['🥗 Healthy'],
    });
    setDishModalVisible(true);
  };

  const handleQuickAdd = (item: MenuItem, event: any) => {
    event.stopPropagation(); // Prevent card click
    setCartItems(prev => prev + 1);
    setCartTotal(prev => prev + item.price);
    // TODO: Add success toast animation
  };

  const handleAddToCart = (quantity: number, addOns: any[], totalPrice: number) => {
    setCartItems(prev => prev + quantity);
    setCartTotal(prev => prev + totalPrice);
    // TODO: Add success toast animation
  };

  const groupedMenu = mockMenuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={() => handleDishPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemImageContainer}>
        <Image source={item.image} style={styles.menuItemImage} />
        {item.isPopular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>🔥 Popular</Text>
          </View>
        )}
      </View>
      <View style={styles.menuItemInfo}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        {item.description && (
          <Text style={styles.menuItemDescription}>{item.description}</Text>
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
    // Smooth scroll to category section would be implemented here
    // For now, just update active state
  };

  const renderCategoryBar = () => {
    const categories = Object.keys(groupedMenu);
    
    return (
      <View style={styles.categoryBarContainer}>
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryBar}
        >
          {categories.map((category) => (
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

  const renderMenuSection = () => (
    <View style={styles.menuSection}>
      {renderCategoryBar()}
      {Object.entries(groupedMenu).map(([category, items]) => (
        <View key={category} style={styles.menuCategory}>
          <Text style={styles.categoryHeader}>{category}</Text>
          {items.map(renderMenuItem)}
        </View>
      ))}
    </View>
  );

  const renderAboutSection = () => (
    <View style={styles.aboutSection}>
      <View style={styles.aboutItem}>
        <Icon name="book-open" size={22} color={colors.primary} style={{ opacity: 1 }} />
        <View style={styles.aboutItemText}>
          <Text style={styles.aboutLabel}>Overview</Text>
          <Text style={styles.aboutValue}>
            Wajba brings you the true flavor of Saudi home cooking, known for its rich rice and meat dishes.
          </Text>
        </View>
      </View>

      <View style={styles.aboutItem}>
        <Icon name="clock" size={22} color={colors.primary} style={{ opacity: 1 }} />
        <View style={styles.aboutItemText}>
          <Text style={styles.aboutLabel}>Opening Hours</Text>
          <Text style={styles.aboutValue}>10:00 AM – 11:00 PM</Text>
        </View>
      </View>

      <View style={styles.aboutItem}>
        <Icon name="truck" size={22} color={colors.primary} style={{ opacity: 1 }} />
        <View style={styles.aboutItemText}>
          <Text style={styles.aboutLabel}>Delivery</Text>
          <Text style={styles.aboutValue}>BD 0.5 • Free over BD 5</Text>
        </View>
      </View>

      <View style={styles.aboutItem}>
        <Icon name="phone" size={22} color={colors.primary} style={{ opacity: 1 }} />
        <View style={styles.aboutItemText}>
          <Text style={styles.aboutLabel}>Contact</Text>
          <Text style={styles.aboutValue}>+973 XXXX XXXX</Text>
        </View>
      </View>

      <View style={styles.aboutItem}>
        <Icon name="map-pin" size={22} color={colors.primary} style={{ opacity: 1 }} />
        <View style={styles.aboutItemText}>
          <Text style={styles.aboutLabel}>Address</Text>
          <Text style={styles.aboutValue}>Manama, Bahrain</Text>
        </View>
      </View>
    </View>
  );

  const handleAddReview = () => {
    // TODO: Navigate to review submission screen or open modal
    console.log('Add review tapped');
  };

  const renderReviewsSection = () => (
    <View style={styles.reviewsSection}>
      <View style={styles.ratingHeader}>
        <Text style={styles.ratingScore}>4.8</Text>
        <Text style={styles.ratingOutOf}>/ 5</Text>
      </View>
      <Text style={styles.ratingSubtext}>Based on 127 reviews</Text>

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

      {/* Sample Review */}
      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <View style={styles.reviewAvatar}>
            <Text style={styles.reviewAvatarText}>AH</Text>
          </View>
          <View style={styles.reviewHeaderInfo}>
            <Text style={styles.reviewerName}>Ahmed Hassan</Text>
            <Text style={styles.reviewDate}>2 days ago</Text>
          </View>
          <View style={styles.reviewStars}>
            <Text style={styles.reviewRating}>⭐ 5.0</Text>
          </View>
        </View>
        <Text style={styles.reviewText}>
          Amazing food! The Kabsa was perfectly seasoned and the portions were generous. Highly recommend!
        </Text>
      </View>

      {/* Another Sample Review */}
      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <View style={styles.reviewAvatar}>
            <Text style={styles.reviewAvatarText}>SK</Text>
          </View>
          <View style={styles.reviewHeaderInfo}>
            <Text style={styles.reviewerName}>Sara Khalid</Text>
            <Text style={styles.reviewDate}>1 week ago</Text>
          </View>
          <View style={styles.reviewStars}>
            <Text style={styles.reviewRating}>⭐ 4.5</Text>
          </View>
        </View>
        <Text style={styles.reviewText}>
          Great authentic flavors. Delivery was quick and food arrived hot. Will order again!
        </Text>
      </View>

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

  return (
    <View style={styles.container}>
      <Animated.ScrollView
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
            source={require('../../assets/food.png')}
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
            onPress={() => setIsFavorite(!isFavorite)}
            activeOpacity={0.8}
          >
            <Icon
              name="heart"
              size={20}
              color={isFavorite ? '#E74C3C' : '#555555'}
            />
          </TouchableOpacity>

          {/* Rating Badge */}
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingBadgeText}>⭐ 4.8 • 15 min • $$</Text>
          </View>
        </View>

        {/* Restaurant Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.restaurantName}>Al Qariah</Text>
          <Text style={styles.cuisineType}>Saudi • Home-Style • Grill</Text>
          
          {/* Key Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Icon name="star" size={14} color={colors.primary} style={{ marginRight: 4 }} />
              <Text style={styles.statTextBold}>4.8</Text>
              <Text style={styles.statText}> (127)</Text>
            </View>
            <Text style={styles.statDivider}>•</Text>
            <View style={styles.statItem}>
              <Icon name="clock" size={14} color={colors.primary} style={{ marginRight: 4 }} />
              <Text style={styles.statText}>25 min</Text>
            </View>
            <Text style={styles.statDivider}>•</Text>
            <View style={styles.statItem}>
              <Icon name="truck" size={14} color={colors.primary} style={{ marginRight: 4 }} />
              <Text style={styles.statText}>BD 0.5 Delivery</Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <Icon name="map-pin" size={14} color="#9E9E9E" />
            <Text style={styles.locationText}>1.2 km away • Manama</Text>
          </View>
          <View style={styles.moodMatchTag}>
            <Text style={styles.moodMatchText}>🧠 Matched for your mood</Text>
          </View>
          <Text style={styles.description}>
            Authentic Gulf cuisine served with warmth and tradition.
          </Text>
        </View>

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
      {cartItems > 0 && (
        <View style={styles.stickyBar}>
          <View style={styles.stickyBarLeft}>
            <Text style={styles.stickyBarItems}>{cartItems} items</Text>
            <Text style={styles.stickyBarTotal}>BD {cartTotal.toFixed(2)}</Text>
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
          onAddToCart={handleAddToCart}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
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
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
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
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
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
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ratingBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
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
