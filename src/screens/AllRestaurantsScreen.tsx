/**
 * All Restaurants Screen
 * Expanded restaurant list with filtering, sorting, and AI matching
 */

import React, { useState } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../constants';
import RestaurantCard from '../components/RestaurantCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Perfect grid: (100% - 16px*2 margins - 12px gap) / 2 columns
const PAGE_PADDING = 16;
const COLUMN_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - PAGE_PADDING * 2 - COLUMN_GAP) / 2;

type SortOption = 'recommended' | 'rating' | 'name' | 'ai_match';

const SORT_OPTIONS = [
  { id: 'recommended' as SortOption, label: 'Recommended', icon: 'thumbs-up', description: 'Our top picks for you' },
  { id: 'rating' as SortOption, label: 'Rating: High to Low', icon: 'star', description: 'Best rated first' },
  { id: 'name' as SortOption, label: 'Name: A-Z', icon: 'type', description: 'Alphabetical order' },
  { id: 'ai_match' as SortOption, label: 'AI Match', icon: 'zap', description: 'Personalized ranking based on your chat and order history' },
];

const CUISINES = [
  { id: 'all', label: 'All', icon: 'grid' },
  { id: 'arabic', label: 'Arabic', icon: 'coffee' },
  { id: 'italian', label: 'Italian', icon: 'award' },
  { id: 'asian', label: 'Asian', icon: 'sun' },
  { id: 'indian', label: 'Indian', icon: 'star' },
  { id: 'healthy', label: 'Healthy', icon: 'heart' },
  { id: 'desserts', label: 'Desserts', icon: 'gift' },
];

const MOCK_RESTAURANTS = [
  { id: '1', name: 'Al Qariah', cuisine: 'Saudi • Traditional', rating: 4.9, eta: '12 min', price: '$$', image: require('../../assets/food.png') },
  { id: '2', name: "Mama's Kitchen", cuisine: 'Saudi • Home-Style', rating: 4.8, eta: '15 min', price: '$$', image: require('../../assets/food.png') },
  { id: '3', name: 'Shawarma House', cuisine: 'Lebanese • Grill', rating: 4.7, eta: '18 min', price: '$', image: require('../../assets/food.png') },
  { id: '4', name: 'Al Tazaj', cuisine: 'Lebanese • Grill', rating: 4.6, eta: '20 min', price: '$$', image: require('../../assets/food.png') },
  { id: '5', name: 'Falafel Corner', cuisine: 'Vegetarian • Quick', rating: 4.5, eta: '10 min', price: '$', image: require('../../assets/wajba_logo.png') },
  { id: '6', name: 'Zaatar & Oil', cuisine: 'Breakfast • Bakery', rating: 4.8, eta: '22 min', price: '$$', image: require('../../assets/wajba_logo.png') },
  { id: '7', name: 'Manousheh Spot', cuisine: 'Lebanese • Bakery', rating: 4.7, eta: '16 min', price: '$', image: require('../../assets/wajba_logo.png') },
  { id: '8', name: 'Spice Garden', cuisine: 'Indian • Curry', rating: 4.6, eta: '25 min', price: '$$', image: require('../../assets/food.png') },
];

const AllRestaurantsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');

  const handleSortSelect = (option: SortOption) => {
    setSortBy(option);
    setShowSortModal(false);
  };

  const getSortedRestaurants = () => {
    let sorted = [...MOCK_RESTAURANTS];
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

  const filteredRestaurants = getSortedRestaurants();

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

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a restaurant or cuisine..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
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
        {filteredRestaurants.map((restaurant) => (
          <View key={restaurant.id} style={styles.cardWrapper}>
            <RestaurantCard
              image={restaurant.image}
              name={restaurant.name}
              tags={restaurant.cuisine}
              rating={restaurant.rating}
              eta={restaurant.eta}
              price={restaurant.price}
              restaurantId={restaurant.id}
              style={styles.restaurantCard}
            />
          </View>
        ))}
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
