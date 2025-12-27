/**
 * useRestaurantSearch Hook
 * Shared search logic for HomeScreen and AllRestaurantsScreen
 */

import { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { searchRestaurants } from '../services/restaurants.service';

export const useRestaurantSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const suggestionFadeAnim = useRef(new Animated.Value(0)).current;

  // Search restaurants from database
  const performSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchSuggestions([]);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      // Search restaurants from Supabase
      const results = await searchRestaurants(query);
      // Transform results to include type property
      const transformedResults = results.map(restaurant => ({
        ...restaurant,
        type: 'restaurant',
        subtitle: restaurant.category || 'Restaurant'
      }));
      setSearchSuggestions(transformedResults.slice(0, 5)); // Show top 5 as suggestions
      setSearchResults(transformedResults); // Store all results
    } catch (error) {
      console.error('Error searching restaurants:', error);
      setSearchSuggestions([]);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    
    if (text.length >= 2) {
      setShowSuggestions(true);
      performSearch(text);
    } else if (text.length === 0) {
      setSearchSuggestions([]);
      if (recentSearches.length > 0) {
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
      setSearchSuggestions([]);
    }
  };

  const handleSearchFocus = () => {
    if (searchQuery.length >= 2) {
      setShowSuggestions(true);
    } else if (searchQuery.length === 0 && recentSearches.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay to allow suggestion click
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleSuggestionPress = (suggestion: any) => {
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
    
    // Add to recent searches
    if (!recentSearches.includes(suggestion.name)) {
      setRecentSearches([suggestion.name, ...recentSearches.slice(0, 4)]);
    }
    
    return suggestion;
  };

  const handleRecentSearchPress = (search: string) => {
    setSearchQuery(search);
    performSearch(search);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchSuggestions([]);
    setShowSuggestions(false);
  };

  // Animate suggestions
  useEffect(() => {
    if (showSuggestions) {
      Animated.timing(suggestionFadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(suggestionFadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [showSuggestions]);

  return {
    searchQuery,
    setSearchQuery,
    showSuggestions,
    setShowSuggestions,
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
    clearSearch,
  };
};
