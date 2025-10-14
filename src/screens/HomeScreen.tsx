import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Platform, StatusBar } from 'react-native';
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

const categories = [
  { id: 'burgers', label: 'Burgers', icon: '🍔' },
  { id: 'pizza', label: 'Pizza', icon: '🍕' },
  { id: 'coffee', label: 'Coffee', icon: '☕' },
  { id: 'healthy', label: 'Healthy', icon: '🥗' },
  { id: 'desserts', label: 'Desserts', icon: '🍰' },
];

const smartSuggestions = [
  '🍴 Feeling like something spicy?',
  '🥗 Want something light under 3 BD?',
  '🍛 Craving comfort food tonight?',
];

const aiPicks = [
  { id: '1', name: 'Al Qariah', match: 'Match: 92%', rating: 4.9, eta: '12 min', price: '$$', image: require('../../assets/food.png') },
  { id: '2', name: 'Shawarma House', match: 'Match: 88%', rating: 4.7, eta: '18 min', price: '$', image: require('../../assets/food.png') },
  { id: '3', name: 'Manousheh Spot', match: 'Match: 86%', rating: 4.8, eta: '15 min', price: '$$', image: require('../../assets/wajba_logo.png') },
];

const nearby = [
  { id: 'n1', name: 'Al Tazaj', tags: 'Lebanese • Grill', image: require('../../assets/food.png') },
  { id: 'n2', name: "Mama's Kitchen", tags: 'Saudi • Home-Style', image: require('../../assets/food.png') },
  { id: 'n3', name: 'Falafel Corner', tags: 'Vegetarian • Quick', image: require('../../assets/wajba_logo.png') },
  { id: 'n4', name: 'Zaatar & Oil', tags: 'Breakfast • Bakery', image: require('../../assets/wajba_logo.png') },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [suggestionIndex] = React.useState(0);

  const handleAIChatPress = () => {
    navigation.navigate('AIChat');
  };

  const handleBrowseAllPress = () => {
    navigation.navigate('AllRestaurants');
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
          onPress={handleAIChatPress}
          activeOpacity={0.8}
        >
          <Text style={styles.smartSuggestionText}>{smartSuggestions[suggestionIndex]}</Text>
        </TouchableOpacity>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0)']}
          style={styles.headerGradient}
          pointerEvents="none"
        />

        {/* Search with AI Integration */}
        <SearchBar 
          style={{ marginHorizontal: 20 }} 
          placeholder="Search restaurants or ask Wajba AI..."
          onAIPress={handleAIChatPress}
        />

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
            onPress={handleAIChatPress}
            activeOpacity={0.8}
          >
            <Icon name="zap" size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Talk to Wajba AI</Text>
          </TouchableOpacity>
        </View>

        {/* Category Icons */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((cat) => (
            <TouchableOpacity 
              key={cat.id}
              style={styles.categoryItem}
              onPress={handleBrowseAllPress}
              activeOpacity={0.7}
            >
              <View style={styles.categoryIcon}>
                <Text style={styles.categoryEmoji}>{cat.icon}</Text>
              </View>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* AI Picks */}
        <LinearGradient
          colors={['#FFFFFF', '#FAFAFA']}
          style={styles.sectionContainer}
        >
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>✨ For You</Text>
              <Text style={styles.sectionSub}>Curated by Wajba AI</Text>
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
                  <Text style={styles.aiMatch}>{item.match}</Text>
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

        {/* Dynamic Tip Banner */}
        <TouchableOpacity 
          style={styles.tipBanner}
          onPress={handleAIChatPress}
          activeOpacity={0.9}
        >
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipText}>Try asking: "What's trending in Manama?"</Text>
          <Icon name="arrow-right" size={18} color={colors.primary} />
        </TouchableOpacity>

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
            <RestaurantCard key={item.id} image={item.image} name={item.name} tags={item.tags} style={styles.gridItem} />
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
  scroll: { paddingBottom: 120 },
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
  
  // Smart Suggestion
  smartSuggestion: {
    marginHorizontal: SCREEN_WIDTH * 0.05,
    marginTop: 8,
    marginBottom: 20, // Breathing space before search
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#F8FAF9',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  smartSuggestionText: {
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

  // Category Icons
  categoryScroll: {
    marginTop: 24, // Consistent vertical rhythm
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0', // Light divider
  },
  categoryContent: {
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    gap: 16,
  },
  categoryItem: {
    alignItems: 'center',
    gap: 8,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  categoryEmoji: {
    fontSize: 30, // Slightly smaller for balance
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D2D2D',
  },

  sectionContainer: { paddingVertical: 20, marginTop: 24 }, // Consistent rhythm
  sectionHeader: { paddingHorizontal: SCREEN_WIDTH * 0.05, marginBottom: 16 },
  sectionHeaderRow: { paddingHorizontal: SCREEN_WIDTH * 0.05, marginBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  seeAllContainer: { flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: colors.textPrimary },
  sectionSub: { fontSize: 14, color: '#555555', marginTop: 4 },

  aiCard: { width: AI_CARD_WIDTH, height: AI_CARD_WIDTH * 1.3, borderRadius: 16, backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, marginVertical: 12, overflow: 'hidden', elevation: 3 },
  imageContainer: { position: 'relative', width: AI_CARD_WIDTH, height: AI_CARD_WIDTH * 0.7 },
  aiImage: { width: AI_CARD_WIDTH, height: AI_CARD_WIDTH * 0.7, borderTopLeftRadius: 16, borderTopRightRadius: 16, resizeMode: 'cover' },
  tealOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(20, 119, 111, 0.25)', borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  logoBackground: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#E6F3F1', borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  logoImage: { opacity: 0.9 },
  aiCardBody: { padding: 12 },
  aiName: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 },
  aiMatch: { fontSize: 12, fontWeight: '600', color: '#00C48C', marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  metaText: { fontSize: 11, color: '#555555' },
  metaDot: { marginHorizontal: 4, color: '#555555', fontSize: 11 },
  
  // Tip Banner (Compact Pill Style)
  tipBanner: {
    marginTop: 24, // Consistent rhythm
    marginHorizontal: SCREEN_WIDTH * 0.05,
    borderRadius: 24, // More pill-like
    paddingVertical: 12, // Reduced height
    paddingHorizontal: 16,
    backgroundColor: '#F8FAF9',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E0F4F1',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tipIcon: {
    fontSize: 20, // Smaller for compact look
  },
  tipText: {
    flex: 1,
    fontSize: 13, // Slightly smaller
    fontWeight: '500',
    color: '#2D2D2D',
  },

  gridWrap: { paddingHorizontal: SCREEN_WIDTH * 0.05, flexDirection: 'row', flexWrap: 'wrap', gap: SCREEN_WIDTH * 0.04, marginTop: 12 },
  gridItem: { },
  link: { color: colors.primary, fontWeight: '600', fontSize: 14, letterSpacing: 0.3 },
  
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
