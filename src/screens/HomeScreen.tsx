import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Platform, StatusBar, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../constants';
import SearchBar from '../components/SearchBar';
import RestaurantCard from '../components/RestaurantCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AI_CARD_WIDTH = SCREEN_WIDTH * 0.55; // 55% of screen width for AI cards
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

// Removed: Category icons row - redundant with All Restaurants filters

const smartSuggestions = [
  { emoji: '🍴', text: 'Feeling like something spicy?', query: 'I want something spicy' },
  { emoji: '🥗', text: 'Maybe something light and healthy?', query: 'I want something light and healthy' },
  { emoji: '🍔', text: 'In the mood for a burger tonight?', query: 'I want a burger' },
  { emoji: '🍣', text: 'Craving sushi or something fresh?', query: 'I want sushi or something fresh' },
  { emoji: '☕', text: 'Just a quick coffee break?', query: 'I want coffee' },
  { emoji: '🍛', text: 'Craving comfort food tonight?', query: 'I want comfort food' },
];

const aiPicks = [
  { id: '1', name: 'Al Qariah', cuisine: 'Saudi • Traditional', rating: 4.9, eta: '12 min', price: '$$', image: require('../../assets/food.png'), tags: ['saudi', 'traditional', 'arabic'] },
  { id: '2', name: 'Shawarma House', cuisine: 'Lebanese • Grill', rating: 4.7, eta: '18 min', price: '$', image: require('../../assets/food.png'), tags: ['lebanese', 'shawarma', 'grill'] },
  { id: '3', name: 'Manousheh Spot', cuisine: 'Lebanese • Bakery', rating: 4.8, eta: '15 min', price: '$$', image: require('../../assets/wajba_logo.png'), tags: ['lebanese', 'bakery', 'manakish'] },
];

const nearby = [
  { id: 'n1', name: 'Al Tazaj', cuisine: 'Lebanese • Grill', image: require('../../assets/food.png'), tags: ['lebanese', 'grill', 'chicken'] },
  { id: 'n2', name: "Mama's Kitchen", cuisine: 'Saudi • Home-Style', image: require('../../assets/food.png'), tags: ['saudi', 'homestyle', 'comfort'] },
  { id: 'n3', name: 'Falafel Corner', cuisine: 'Vegetarian • Quick', image: require('../../assets/wajba_logo.png'), tags: ['vegetarian', 'falafel', 'healthy'] },
  { id: 'n4', name: 'Zaatar & Oil', cuisine: 'Breakfast • Bakery', image: require('../../assets/wajba_logo.png'), tags: ['breakfast', 'bakery', 'zaatar'] },
  { id: 'n5', name: 'Pizza Hut', cuisine: 'Italian • Pizza', image: require('../../assets/food.png'), tags: ['pizza', 'italian', 'cheese'] },
  { id: 'n6', name: "Papa Johns", cuisine: 'Italian • Pizza', image: require('../../assets/food.png'), tags: ['pizza', 'italian', 'delivery'] },
];

const ALL_RESTAURANTS = [...aiPicks, ...nearby];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Rotate suggestions every 4 seconds with fade-slide animation
  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out and slide up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Change text
        setSuggestionIndex((prev) => (prev + 1) % smartSuggestions.length);
        
        // Reset position and fade in
        slideAnim.setValue(20);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [fadeAnim, slideAnim]);

  const handleAIChatPress = (_prefillQuery?: string) => {
    // TODO: Pass _prefillQuery to AI Chat screen
    navigation.navigate('AIChat');
  };

  const handleBrowseAllPress = () => {
    navigation.navigate('AllRestaurants');
  };

  const handleSuggestionPress = () => {
    const currentSuggestion = smartSuggestions[suggestionIndex];
    handleAIChatPress(currentSuggestion.query);
  };

  // Fuzzy search function
  const fuzzySearch = (query: string) => {
    if (!query || query.length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const suggestions: any[] = [];

    // Search restaurants
    ALL_RESTAURANTS.forEach(restaurant => {
      const nameMatch = restaurant.name.toLowerCase().includes(lowerQuery);
      const cuisineMatch = restaurant.cuisine?.toLowerCase().includes(lowerQuery);
      const tagMatch = restaurant.tags?.some((tag: string) => tag.includes(lowerQuery));

      if (nameMatch || cuisineMatch || tagMatch) {
        suggestions.push({
          type: 'restaurant',
          id: restaurant.id,
          name: restaurant.name,
          subtitle: restaurant.cuisine,
          icon: 'map-pin',
          data: restaurant,
        });
      }
    });

    // Add AI fallback
    if (suggestions.length === 0) {
      suggestions.push({
        type: 'ai',
        id: 'ai-fallback',
        name: `Can't find "${query}"? Ask Wajba AI`,
        subtitle: 'Get personalized recommendations',
        icon: 'zap',
        query: query,
      });
    } else if (suggestions.length <= 3) {
      suggestions.push({
        type: 'ai',
        id: 'ai-suggestion',
        name: `Ask Wajba AI about "${query}"`,
        subtitle: 'Get more suggestions',
        icon: 'zap',
        query: query,
      });
    }

    setSearchSuggestions(suggestions.slice(0, 6));
    setShowSuggestions(true);
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    fuzzySearch(text);
  };

  const handleSearchSuggestionPress = (suggestion: any) => {
    if (suggestion.type === 'ai') {
      handleAIChatPress(suggestion.query);
      setShowSuggestions(false);
    } else if (suggestion.type === 'restaurant') {
      setSearchQuery(suggestion.name);
      setShowSuggestions(false);
      // Could navigate to restaurant detail here
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Top App Bar */}
        <View style={styles.appBar}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.greeting}>
                <Text style={styles.greetingLight}>Good evening, </Text>
                <Text style={styles.greetingBold}>Ahmed</Text>
              </Text>
              <Text style={styles.waveEmoji}> 👋</Text>
            </View>
            <TouchableOpacity style={styles.locationChip} activeOpacity={0.7}>
              <Icon name="map-pin" size={12} color={colors.primary} style={{ marginRight: 4 }} />
              <Text style={styles.locationText}>Manama</Text>
            </TouchableOpacity>
          </View>
          <Image source={require('../../assets/wajba_logo.png')} style={styles.avatar} />
        </View>
        
        {/* Smart Suggestion */}
        <TouchableOpacity 
          style={styles.smartSuggestion}
          onPress={handleSuggestionPress}
          activeOpacity={0.8}
        >
          <Animated.View 
            style={[
              styles.smartSuggestionContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.smartSuggestionEmoji}>{smartSuggestions[suggestionIndex].emoji}</Text>
            <Text style={styles.smartSuggestionText}>{smartSuggestions[suggestionIndex].text}</Text>
          </Animated.View>
        </TouchableOpacity>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0)']}
          style={styles.headerGradient}
          pointerEvents="none"
        />

        {/* Search with AI Integration */}
        <View style={{ marginHorizontal: 20, position: 'relative', zIndex: 100 }}>
          <SearchBar 
            value={searchQuery}
            onChangeText={handleSearchChange}
            onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onAIPress={() => handleAIChatPress()}
            placeholder="Search restaurants or ask Wajba AI..."
          />
          
          {/* Search Suggestions Dropdown */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {searchSuggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={suggestion.id}
                  style={[
                    styles.suggestionItem,
                    suggestion.type === 'ai' && styles.suggestionItemAI,
                    index === searchSuggestions.length - 1 && styles.suggestionItemLast,
                  ]}
                  onPress={() => handleSearchSuggestionPress(suggestion)}
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
            </View>
          )}
        </View>

        {/* Quick Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleBrowseAllPress}
            activeOpacity={0.8}
          >
            <Icon name="grid" size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Browse All Restaurants</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleAIChatPress()}
            activeOpacity={0.8}
          >
            <Icon name="zap" size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Talk to Wajba AI</Text>
          </TouchableOpacity>
        </View>

        {/* AI Picks */}
        <LinearGradient
          colors={['#FFFFFF', '#FAFAFA']}
          style={styles.sectionContainer}
        >
          <View style={styles.sectionHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>✨ For You</Text>
              <Text style={styles.sectionSub}>Curated by Wajba AI</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.inlineTip}
                onPress={() => handleAIChatPress()}
                activeOpacity={0.7}
              >
                <Text style={styles.inlineTipIcon}>💡</Text>
                <Text style={styles.inlineTipText}>Try asking</Text>
                <Icon name="chevron-right" size={14} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={handleBrowseAllPress}
              >
                <View style={styles.seeAllContainer}>
                  <Text style={styles.link}>See All</Text>
                  <Icon name="arrow-right" size={16} color={colors.primary} style={{ marginLeft: 4 }} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 18 }}>
          {aiPicks.map(item => {
            const isFoodImage = item.image === require('../../assets/food.png');
            const isLogoImage = !isFoodImage;
            
            return (
              <View key={item.id} style={styles.aiCard}>
                <View style={styles.imageContainer}>
                  {isLogoImage && <View style={styles.logoBackground} />}
                  <Image source={item.image} style={[styles.aiImage, isLogoImage && styles.logoImage]} />
                  {isFoodImage && <View style={styles.tealOverlay} />}
                </View>
                <View style={styles.aiCardBody}>
                  <Text style={styles.aiName}>{item.name}</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaText}>⭐ {item.rating}</Text>
                    <Text style={styles.metaDot}>•</Text>
                    <Text style={styles.metaText}>{item.eta}</Text>
                    <Text style={styles.metaDot}>•</Text>
                    <Text style={styles.metaText}>{item.price}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
        </LinearGradient>

        {/* Removed: Tip banner - now integrated into 'For You' header */}

        {/* Nearby */}
        <LinearGradient
          colors={['#FFFFFF', '#FAFAFA']}
          style={styles.sectionContainer}
        >
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>🔥 Popular Near You</Text>
              <Text style={styles.sectionSub}>Discover trending restaurants nearby</Text>
            </View>
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={handleBrowseAllPress}
            >
              <View style={styles.seeAllContainer}>
                <Text style={styles.link}>See All</Text>
                <Icon name="arrow-right" size={16} color={colors.primary} style={{ marginLeft: 4 }} />
              </View>
            </TouchableOpacity>
          </View>

        <View style={styles.gridWrap}>
          {nearby.map(item => (
            <RestaurantCard key={item.id} image={item.image} name={item.name} tags={item.cuisine} style={styles.gridItem} />
          ))}
        </View>

        </LinearGradient>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FAFAFA' },
  scroll: { paddingBottom: 24 }, // Tight to nav bar
  appBar: {
    paddingTop: STATUS_BAR_HEIGHT + 12,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  greeting: { fontSize: 18, fontWeight: '600', color: '#2D2D2D', lineHeight: 22 },
  waveEmoji: { fontSize: 18, marginLeft: 2, marginTop: -2 },
  greetingLight: { color: '#5A5A5A', fontWeight: '500' },
  greetingBold: { color: '#1F1F1F', fontWeight: '700' },
  locationChip: { alignSelf: 'flex-start', marginTop: 6, backgroundColor: '#E6F3F1', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, shadowColor: colors.primary, shadowOpacity: 0.15, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 2, borderWidth: 0.5, borderColor: 'rgba(20, 119, 111, 0.2)', flexDirection: 'row', alignItems: 'center' },
  locationText: { fontSize: 13, color: colors.primary, fontWeight: '500' },
  avatar: { width: 38, height: 38, borderRadius: 19, marginLeft: 8, marginRight: 8, borderColor: colors.primary, borderWidth: 2 },
  
  // Smart Suggestion (Refined with gradient accent)
  smartSuggestion: {
    marginHorizontal: SCREEN_WIDTH * 0.05,
    marginTop: 8,
    marginBottom: 20, // Breathing space before search
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(240, 255, 250, 0.6)', // Soft glassy tint
    borderRadius: 12,
    borderLeftWidth: 2, // Thinner accent
    borderLeftColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  smartSuggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  smartSuggestionEmoji: {
    fontSize: 18,
  },
  smartSuggestionText: {
    flex: 1,
    fontSize: 14,
    color: '#2D2D2D',
    fontWeight: '500',
  },
  
  headerGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 120, zIndex: 1 },

  // Action Buttons
  actionRow: {
    flexDirection: 'row',
    marginHorizontal: SCREEN_WIDTH * 0.05,
    marginTop: 24, // Consistent vertical rhythm
    gap: 14, // More breathing space
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52, // Increased from 44px
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },

  sectionContainer: { paddingVertical: 16, marginTop: 12 }, // Tighter spacing
  sectionHeader: { paddingHorizontal: SCREEN_WIDTH * 0.05, marginBottom: 16 },
  sectionHeaderRow: { 
    paddingHorizontal: SCREEN_WIDTH * 0.05, 
    marginBottom: 12, // Tighter to cards
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    justifyContent: 'space-between',
  },
  headerActions: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8,
  },
  inlineTip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(240, 255, 250, 0.4)',
    borderRadius: 12,
  },
  inlineTipIcon: {
    fontSize: 14,
  },
  inlineTipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  seeAllContainer: { flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: colors.textPrimary },
  sectionSub: { fontSize: 14, color: '#555555', marginTop: 4 },

  aiCard: { 
    width: AI_CARD_WIDTH, 
    height: AI_CARD_WIDTH * 1.2, // Reduced height without Match label
    borderRadius: 12, // Less rounded, more professional
    backgroundColor: '#FFFFFF', 
    shadowColor: '#000', 
    shadowOpacity: 0.05, // Subtle shadow
    shadowRadius: 8, 
    shadowOffset: { width: 0, height: 2 }, 
    marginVertical: 8, // Tighter vertical spacing
    overflow: 'hidden', 
    elevation: 2,
  },
  imageContainer: { position: 'relative', width: AI_CARD_WIDTH, height: AI_CARD_WIDTH * 0.7 },
  aiImage: { width: AI_CARD_WIDTH, height: AI_CARD_WIDTH * 0.7, borderTopLeftRadius: 12, borderTopRightRadius: 12, resizeMode: 'cover' },
  tealOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(20, 119, 111, 0.25)', borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  logoBackground: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#E6F3F1', borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  logoImage: { opacity: 0.9 },
  aiCardBody: { padding: 12 },
  aiName: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 0 }, // Tight to name
  metaText: { fontSize: 11, color: '#555555' },
  metaDot: { marginHorizontal: 4, color: '#555555', fontSize: 11 },

  gridWrap: { paddingHorizontal: SCREEN_WIDTH * 0.05, flexDirection: 'row', flexWrap: 'wrap', gap: SCREEN_WIDTH * 0.04, marginTop: 12 },
  gridItem: { },
  link: { color: colors.primary, fontWeight: '600', fontSize: 14, letterSpacing: 0.3 },
  
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
  
  // AI Callout styles
  aiCallout: {
    marginHorizontal: SCREEN_WIDTH * 0.05,
    marginTop: 12,
    marginBottom: 16,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: '#F8FAF9',
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  aiCalloutText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 2,
    lineHeight: 20,
  },
  aiCalloutSub: {
    fontSize: 11.5,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  
  // AI CTA Card styles
  aiCTAContainer: {
    marginHorizontal: SCREEN_WIDTH * 0.05,
    marginTop: 20,
    marginBottom: 24,
  },
  aiCTACard: {
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.lg + 4,
    paddingHorizontal: SPACING.xl,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  aiCTAContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md + 2,
  },
  aiCTAIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  aiCTAEmoji: {
    fontSize: 30,
  },
  aiCTAText: {
    flex: 1,
  },
  aiCTATitle: {
    fontSize: FONT_SIZE.xl + 1,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  aiCTASubtitle: {
    fontSize: FONT_SIZE.sm,
    color: 'rgba(255, 255, 255, 0.95)',
    fontStyle: 'italic',
    lineHeight: 18,
  },
});

export default HomeScreen;
