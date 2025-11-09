/**
 * All Restaurants Screen
 * Expanded restaurant list with filtering, sorting, and AI matching
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions,
  Modal,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';
import { Feather as Icon } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../../constants';
import RestaurantCard from '../../../components/RestaurantCard';
import { LinearGradient } from 'expo-linear-gradient';
import { useRestaurantSearch } from '../../../hooks/useRestaurantSearch';
import { fetchRestaurants } from '../../../services/restaurants.service';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type FeatherIconName = keyof typeof Icon.glyphMap;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Perfect grid: (100% - 16px*2 margins - 12px gap) / 2 columns
const PAGE_PADDING = 16;
const COLUMN_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - PAGE_PADDING * 2 - COLUMN_GAP) / 2;

type SortOption = 'recommended' | 'rating' | 'name' | 'ai_match';

const SORT_OPTIONS: Array<{ id: SortOption; label: string; icon: FeatherIconName; description: string }> = [
  { id: 'recommended', label: 'Recommended', icon: 'thumbs-up', description: 'Our top picks for you' },
  { id: 'rating', label: 'Rating: High to Low', icon: 'star', description: 'Best rated first' },
  { id: 'name', label: 'Name: A-Z', icon: 'type', description: 'Alphabetical order' },
  { id: 'ai_match', label: 'AI Match', icon: 'zap', description: 'Personalized ranking based on your chat and order history' },
];

const CUISINES: Array<{ id: string; label: string; icon: FeatherIconName }> = [
  { id: 'all', label: 'All', icon: 'grid' },
  { id: 'arabic', label: 'Arabic', icon: 'coffee' },
  { id: 'italian', label: 'Italian', icon: 'award' },
  { id: 'asian', label: 'Asian', icon: 'sun' },
  { id: 'indian', label: 'Indian', icon: 'star' },
  { id: 'healthy', label: 'Healthy', icon: 'heart' },
  { id: 'desserts', label: 'Desserts', icon: 'gift' },
];

// Mock data removed - now using real Supabase data

const AllRestaurantsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Use shared search hook
  const {
    searchQuery,
    showSuggestions,
    searchSuggestions,
    searchResults,
    isSearching,
    recentSearches,
    suggestionFadeAnim,
    handleSearchChange,
    handleSearchFocus,
    handleSearchBlur,
    handleSuggestionPress,
    handleRecentSearchPress,
    clearRecentSearches,
  } = useRestaurantSearch();
  
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');

  // Fetch restaurants from Supabase
  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchRestaurants();
      setRestaurants(data);
    } catch (err: any) {
      console.error('Error loading restaurants:', err);
      setError('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleAIChatPress = (_query?: string) => {
    // TODO: Pass contextual _query to AI Chat
    navigation.navigate('AIChat');
  };

  const handleSortSelect = (option: SortOption) => {
    setSortBy(option);
    setShowSortModal(false);
  };

  const handleSearchSuggestionPress = (suggestion: any) => {
    const result = handleSuggestionPress(suggestion);
    // Additional logic specific to AllRestaurantsScreen
    if (suggestion.type === 'cuisine') {
      setSelectedCuisine(suggestion.id);
    }
  };

  const getSortedRestaurants = () => {
    let sorted = [...restaurants];
    switch (sortBy) {
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'ai_match':
        // AI match sorting would use backend data in production
        return sorted;
      default:
        return sorted;
    }
  };

  const getFilteredRestaurants = () => {
    // If there's a search query with results, use search results
    if (searchQuery.trim() && searchResults.length > 0) {
      return searchResults;
    }
    
    // If searching but no results, return empty
    if (searchQuery.trim() && searchResults.length === 0 && !isSearching) {
      return [];
    }
    
    const sorted = getSortedRestaurants();
    
    // Filter by cuisine
    if (selectedCuisine !== 'all') {
      return sorted.filter(r => 
        r.category?.toLowerCase().includes(selectedCuisine.toLowerCase())
      );
    }
    
    return sorted;
  };

  const filteredRestaurants = getFilteredRestaurants();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Restaurants</Text>
        <View style={styles.filterButton} />
      </View>

      {/* Search Bar with AI Integration */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants or ask Wajba AI..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
          />
          <TouchableOpacity
            onPress={() => handleAIChatPress()}
            activeOpacity={0.7}
            style={styles.aiIconButton}
          >
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.aiIconGradient}
            >
              <Icon name="zap" size={16} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && (
          <Animated.View style={[styles.suggestionsContainer, { opacity: suggestionFadeAnim }]}>
            {/* Recent Searches */}
            {searchQuery.length === 0 && recentSearches.length > 0 && (
              <>
                <View style={styles.recentHeader}>
                  <Icon name="clock" size={14} color="#64748B" />
                  <Text style={styles.recentHeaderText}>Recent Searches</Text>
                </View>
                {recentSearches.map((search, index) => (
                  <TouchableOpacity
                    key={`recent-${index}`}
                    style={[
                      styles.suggestionItem,
                      index === recentSearches.length - 1 && styles.suggestionItemLast,
                    ]}
                    onPress={() => handleRecentSearchPress(search)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.suggestionIcon}>
                      <Icon name="clock" size={16} color={colors.primary} />
                    </View>
                    <View style={styles.suggestionContent}>
                      <Text style={styles.suggestionName}>{search}</Text>
                      <Text style={styles.suggestionSubtitle}>Recent</Text>
                    </View>
                    <Icon name="arrow-up-left" size={16} color="#94A3B8" />
                  </TouchableOpacity>
                ))}
              </>
            )}
            
            {/* Loading Shimmer */}
            {isSearching && searchQuery.length >= 2 && (
              <View style={styles.shimmerContainer}>
                <View style={styles.shimmerItem}>
                  <View style={styles.shimmerCircle} />
                  <View style={styles.shimmerContent}>
                    <View style={styles.shimmerLine} />
                    <View style={styles.shimmerLineShort} />
                  </View>
                </View>
                <View style={styles.shimmerItem}>
                  <View style={styles.shimmerCircle} />
                  <View style={styles.shimmerContent}>
                    <View style={styles.shimmerLine} />
                    <View style={styles.shimmerLineShort} />
                  </View>
                </View>
              </View>
            )}
            
            {/* Search Results */}
            {!isSearching && searchQuery.length >= 2 && searchSuggestions.length > 0 && searchSuggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={suggestion.id}
                style={[
                  styles.suggestionItem,
                  suggestion.type === 'ai' && styles.suggestionItemAI,
                  index === searchSuggestions.length - 1 && styles.suggestionItemLast,
                ]}
                onPress={() => handleSuggestionPress(suggestion)}
                activeOpacity={0.7}
              >
                {suggestion.type === 'ai' ? (
                  <LinearGradient
                    colors={[colors.gradientStart, colors.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.suggestionIconGradient}
                  >
                    <Icon name={suggestion.icon} size={16} color="#FFFFFF" />
                  </LinearGradient>
                ) : (
                  <View style={styles.suggestionIcon}>
                    <Icon name={suggestion.icon} size={16} color={colors.primary} />
                  </View>
                )}
                <View style={styles.suggestionContent}>
                  <Text style={[
                    styles.suggestionName,
                    suggestion.type === 'ai' && styles.suggestionNameAI,
                  ]}>
                    {suggestion.name}
                  </Text>
                  <Text style={styles.suggestionSubtitle}>{suggestion.subtitle}</Text>
                </View>
                {suggestion.type !== 'ai' && (
                  <Icon name="arrow-up-right" size={16} color="#94A3B8" />
                )}
              </TouchableOpacity>
            ))}
            
            {/* Empty State */}
            {!isSearching && searchQuery.length >= 2 && searchSuggestions.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateEmoji}>🥲</Text>
                <Text style={styles.emptyStateText}>No results for "{searchQuery}"</Text>
                <TouchableOpacity
                  style={styles.emptyStateButton}
                  onPress={() => handleAIChatPress(searchQuery)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={[colors.gradientStart, colors.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.emptyStateButtonGradient}
                  >
                    <Icon name="zap" size={16} color="#FFFFFF" />
                    <Text style={styles.emptyStateButtonText}>Ask Wajba AI</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        )}
      </View>

      {/* Cuisine Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.cuisineChipsContainer}
        contentContainerStyle={styles.cuisineChipsContent}
      >
        {CUISINES.map((cuisine) => {
          const isSelected = selectedCuisine === cuisine.id;
          return (
            <TouchableOpacity
              key={cuisine.id}
              style={[styles.cuisineChip, isSelected && styles.cuisineChipActive]}
              onPress={() => setSelectedCuisine(cuisine.id)}
              activeOpacity={0.7}
            >
              <Icon
                name={cuisine.icon}
                size={16}
                color={isSelected ? '#FFFFFF' : colors.primary}
                style={styles.cuisineChipIcon}
              />
              <Text style={[styles.cuisineChipText, isSelected && styles.cuisineChipTextActive]}>
                {cuisine.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Sort Button */}
      <View style={styles.sortContainer}>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortModal(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.sortLabel}>Sort by:</Text>
          <Text style={styles.sortValue}>
            {SORT_OPTIONS.find(opt => opt.id === sortBy)?.label}
          </Text>
          <Icon name="chevron-down" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Restaurant Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={{ padding: 40, width: '100%', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <View key={restaurant.id} style={styles.cardWrapper}>
              <RestaurantCard
                image={restaurant.logo ? { uri: restaurant.logo } : require('../../../../assets/wajba_logo.png')}
                name={restaurant.name}
                tags={`${restaurant.category} • ${restaurant.avg_prep_time || '20-30 mins'}`}
                rating={restaurant.rating}
                eta={restaurant.avg_prep_time || '20-30 mins'}
                restaurantId={restaurant.id}
                style={styles.restaurantCard}
              />
            </View>
          ))
        ) : (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ color: colors.textSecondary }}>No restaurants found</Text>
          </View>
        )}
      </ScrollView>

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort By</Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <Icon name="x" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            {SORT_OPTIONS.map((option) => {
              const isSelected = sortBy === option.id;
              const isAIMatch = option.id === 'ai_match';
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.sortOption, isSelected && styles.sortOptionActive]}
                  onPress={() => handleSortSelect(option.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.sortOptionLeft}>
                    <View style={[styles.sortIconContainer, isAIMatch && styles.sortIconAI]}>
                      <Icon
                        name={option.icon}
                        size={20}
                        color={isAIMatch ? colors.primary : colors.textSecondary}
                      />
                    </View>
                    <View style={styles.sortOptionText}>
                      <Text style={[styles.sortOptionLabel, isSelected && styles.sortOptionLabelActive]}>
                        {option.label}
                      </Text>
                      <Text style={styles.sortOptionDescription}>{option.description}</Text>
                    </View>
                  </View>
                  {isSelected && (
                    <Icon name="check" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
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
    fontWeight: '700',
    color: colors.textPrimary,
  },
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: colors.surface,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    height: 48,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE.base,
    color: colors.textPrimary,
  },
  // AI Icon in Search Bar
  aiIconButton: {
    marginLeft: 8,
  },
  aiIconGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Search Suggestions
  suggestionsContainer: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    maxHeight: 320,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  suggestionItemAI: {
    backgroundColor: 'rgba(240, 255, 250, 0.4)',
  },
  suggestionItemLast: {
    borderBottomWidth: 0,
  },
  suggestionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E6F3F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionIconGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  suggestionNameAI: {
    color: colors.primary,
  },
  suggestionSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  
  // Recent Searches
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 6,
  },
  recentHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // Shimmer Loading
  shimmerContainer: {
    padding: 16,
  },
  shimmerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  shimmerCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E6F3F1',
  },
  shimmerContent: {
    flex: 1,
  },
  shimmerLine: {
    height: 12,
    backgroundColor: '#E6F3F1',
    borderRadius: 6,
    marginBottom: 6,
    width: '70%',
  },
  shimmerLineShort: {
    height: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 5,
    width: '40%',
  },
  
  // Empty State
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyStateButton: {
    marginTop: 8,
  },
  emptyStateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  emptyStateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  cuisineChipsContainer: {
    maxHeight: 60,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cuisineChipsContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  cuisineChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md + 2,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: SPACING.xs,
  },
  cuisineChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  cuisineChipIcon: {
    marginRight: 2,
  },
  cuisineChipText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  cuisineChipTextActive: {
    color: '#FFFFFF',
  },
  sortContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  sortLabel: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
  },
  sortValue: {
    flex: 1,
    fontSize: FONT_SIZE.base,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: PAGE_PADDING, // Perfect 16px margins
    paddingTop: SPACING.lg,
    paddingBottom: 100,
    gap: COLUMN_GAP, // Perfect 12px gutter
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginBottom: SPACING.md,
    // Add subtle shadow for depth
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  restaurantCard: {
    width: CARD_WIDTH,
  },
  // Sort Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xl : SPACING.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sortOptionActive: {
    backgroundColor: '#F0F9F8',
  },
  sortOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.md,
  },
  sortIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortIconAI: {
    backgroundColor: '#E8F5F2',
  },
  sortOptionText: {
    flex: 1,
  },
  sortOptionLabel: {
    fontSize: FONT_SIZE.base,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  sortOptionLabelActive: {
    color: colors.primary,
  },
  sortOptionDescription: {
    fontSize: FONT_SIZE.xs,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});

export default AllRestaurantsScreen;
