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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../constants';
import RestaurantCard from '../components/RestaurantCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - SPACING.xl * 3) / 2;

interface FilterChip {
  id: string;
  label: string;
  category: 'cuisine' | 'time' | 'price' | 'rating';
}

const FILTER_CHIPS: FilterChip[] = [
  { id: 'all', label: 'All', category: 'cuisine' },
  { id: 'arabic', label: 'Arabic', category: 'cuisine' },
  { id: 'italian', label: 'Italian', category: 'cuisine' },
  { id: 'asian', label: 'Asian', category: 'cuisine' },
  { id: 'fast', label: '≤15 min', category: 'time' },
  { id: 'medium', label: '≤25 min', category: 'time' },
  { id: 'slow', label: '≤40 min', category: 'time' },
  { id: 'cheap', label: '$', category: 'price' },
  { id: 'moderate', label: '$$', category: 'price' },
  { id: 'expensive', label: '$$$', category: 'price' },
  { id: 'rating4', label: '4.0+', category: 'rating' },
  { id: 'rating45', label: '4.5+', category: 'rating' },
];

const MOCK_RESTAURANTS = [
  { id: '1', name: 'Al Qariah', cuisine: 'Saudi • Traditional', rating: 4.9, eta: '12 min', price: '$$', match: 92, image: require('../../assets/food.png') },
  { id: '2', name: "Mama's Kitchen", cuisine: 'Saudi • Home-Style', rating: 4.8, eta: '15 min', price: '$$', match: 88, image: require('../../assets/food.png') },
  { id: '3', name: 'Shawarma House', cuisine: 'Lebanese • Grill', rating: 4.7, eta: '18 min', price: '$', match: 85, image: require('../../assets/food.png') },
  { id: '4', name: 'Al Tazaj', cuisine: 'Lebanese • Grill', rating: 4.6, eta: '20 min', price: '$$', match: 82, image: require('../../assets/food.png') },
  { id: '5', name: 'Falafel Corner', cuisine: 'Vegetarian • Quick', rating: 4.5, eta: '10 min', price: '$', match: 80, image: require('../../assets/wajba_logo.png') },
  { id: '6', name: 'Zaatar & Oil', cuisine: 'Breakfast • Bakery', rating: 4.8, eta: '22 min', price: '$$', match: 78, image: require('../../assets/wajba_logo.png') },
  { id: '7', name: 'Manousheh Spot', cuisine: 'Lebanese • Bakery', rating: 4.7, eta: '16 min', price: '$', match: 75, image: require('../../assets/wajba_logo.png') },
  { id: '8', name: 'Spice Garden', cuisine: 'Indian • Curry', rating: 4.6, eta: '25 min', price: '$$', match: 72, image: require('../../assets/food.png') },
];

const AllRestaurantsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['all']);
  const [sortByMatch, setSortByMatch] = useState(false);

  const handleFilterToggle = (filterId: string) => {
    if (filterId === 'all') {
      setSelectedFilters(['all']);
    } else {
      const newFilters = selectedFilters.includes(filterId)
        ? selectedFilters.filter(id => id !== filterId && id !== 'all')
        : [...selectedFilters.filter(id => id !== 'all'), filterId];
      
      setSelectedFilters(newFilters.length === 0 ? ['all'] : newFilters);
    }
  };

  const handleSortByMatch = () => {
    setSortByMatch(!sortByMatch);
  };

  const filteredRestaurants = sortByMatch
    ? [...MOCK_RESTAURANTS].sort((a, b) => b.match - a.match)
    : MOCK_RESTAURANTS;

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
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="sliders" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
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

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterChipsContainer}
        contentContainerStyle={styles.filterChipsContent}
      >
        {FILTER_CHIPS.map((chip) => {
          const isSelected = selectedFilters.includes(chip.id);
          return (
            <TouchableOpacity
              key={chip.id}
              style={[styles.filterChip, isSelected && styles.filterChipActive]}
              onPress={() => handleFilterToggle(chip.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                {chip.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Restaurant Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredRestaurants.map((restaurant) => (
          <View key={restaurant.id} style={styles.cardWrapper}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                // TODO: Navigate to restaurant details
                console.log('Navigate to restaurant:', restaurant.id);
              }}
            >
              <RestaurantCard
                image={restaurant.image}
                name={restaurant.name}
                tags={restaurant.cuisine}
                style={styles.restaurantCard}
              />
              <View style={styles.cardFooter}>
                <View style={styles.metaRow}>
                  <Icon name="star" size={14} color="#FFB800" />
                  <Text style={styles.metaText}>{restaurant.rating}</Text>
                  <Text style={styles.metaDot}>•</Text>
                  <Text style={styles.metaText}>{restaurant.eta}</Text>
                  <Text style={styles.metaDot}>•</Text>
                  <Text style={styles.metaText}>{restaurant.price}</Text>
                </View>
                <View style={styles.matchBadge}>
                  <Text style={styles.matchText}>Match: {restaurant.match}%</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Floating Sort Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleSortByMatch}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={sortByMatch ? [colors.gradientStart, colors.gradientEnd] : ['#E2E8F0', '#CBD5E1']}
          style={styles.floatingButtonGradient}
        >
          <Icon name="zap" size={20} color={sortByMatch ? '#FFFFFF' : colors.textSecondary} />
          <Text style={[styles.floatingButtonText, sortByMatch && styles.floatingButtonTextActive]}>
            Sort by AI Match
          </Text>
        </LinearGradient>
      </TouchableOpacity>
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
  filterChipsContainer: {
    maxHeight: 50,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterChipsContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  filterChip: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: 100,
    gap: SPACING.md,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginBottom: SPACING.md,
  },
  restaurantCard: {
    width: CARD_WIDTH,
  },
  cardFooter: {
    paddingTop: SPACING.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  metaText: {
    fontSize: FONT_SIZE.xs,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  metaDot: {
    fontSize: FONT_SIZE.xs,
    color: colors.textSecondary,
    marginHorizontal: 4,
  },
  matchBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  matchText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: '#00C48C',
  },
  floatingButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80,
    right: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  floatingButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.sm,
  },
  floatingButtonText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  floatingButtonTextActive: {
    color: '#FFFFFF',
  },
});

export default AllRestaurantsScreen;
