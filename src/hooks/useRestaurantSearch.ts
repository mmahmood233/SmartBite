/**
 * useRestaurantSearch Hook
 * Shared search logic for HomeScreen and AllRestaurantsScreen
 */

import { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';

// Mock data - will be replaced with API calls
const MOCK_SUGGESTIONS = [
  { id: '1', name: 'Shawarma House', cuisine: 'Middle Eastern', rating: 4.8, image: require('../../assets/food.png') },
  { id: '2', name: 'Burger Palace', cuisine: 'American', rating: 4.5, image: require('../../assets/food.png') },
  { id: '3', name: 'Sushi Express', cuisine: 'Japanese', rating: 4.9, image: require('../../assets/wajba_logo.png') },
];

const MOCK_RECENT_SEARCHES = ['Pizza', 'Burger', 'Sushi'];

export const useRestaurantSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(MOCK_RECENT_SEARCHES);
  const suggestionFadeAnim = useRef(new Animated.Value(0)).current;

  // Simulate search API call
  const performSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchSuggestions([]);
      return;
    }

    setIsSearching(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Filter mock data based on query
    const results = MOCK_SUGGESTIONS.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.cuisine.toLowerCase().includes(query.toLowerCase())
    );

    setSearchSuggestions(results);
    setIsSearching(false);
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
