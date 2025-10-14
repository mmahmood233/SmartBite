import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Platform, StatusBar, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../constants';
import SearchBar from '../components/SearchBar';
import Chip from '../components/Chip';
import RestaurantCard from '../components/RestaurantCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AI_CARD_WIDTH = SCREEN_WIDTH * 0.55; // 55% of screen width for AI cards
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

const chips = ['🥙 Nearby', '🔥 Offers', '⏱️ Fast', '🌿 Vegetarian', '⭐ Top Rated', '🍰 Desserts'];

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
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulsing animation for AI CTA
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleAIChatPress = () => {
    navigation.navigate('AIChat');
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
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0)']}
          style={styles.headerGradient}
          pointerEvents="none"
        />

        {/* AI Callout */}
        <View style={styles.aiCallout}>
          <Text style={styles.aiCalloutText}>💭 Hungry? Ask Wajba AI what to eat 🤖</Text>
          <Text style={styles.aiCalloutSub}>Try saying: "I want something spicy under 3 BD!"</Text>
        </View>

        {/* Search */}
        <SearchBar style={{ marginHorizontal: 20 }} />

        {/* Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
          {chips.map((c, i) => (
            <Chip key={c} label={c} active={i === 0} />
          ))}
        </ScrollView>

        {/* AI Chat CTA Card */}
        <Animated.View style={[styles.aiCTAContainer, { transform: [{ scale: pulseAnim }] }]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleAIChatPress}
          >
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.aiCTACard}
            >
              <View style={styles.aiCTAContent}>
                <View style={styles.aiCTAIcon}>
                  <Text style={styles.aiCTAEmoji}>🤖</Text>
                </View>
                <View style={styles.aiCTAText}>
                  <Text style={styles.aiCTATitle}>Ask Wajba AI</Text>
                  <Text style={styles.aiCTASubtitle}>"Tell me what you're craving today..."</Text>
                </View>
                <Icon name="arrow-right" size={24} color="#FFFFFF" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* AI Picks */}
        <LinearGradient
          colors={['#FFFFFF', '#FAFAFA']}
          style={styles.sectionContainer}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>✨ For You</Text>
            <Text style={styles.sectionSub}>Curated by your taste</Text>
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

        {/* Mood Banner */}
        <View style={styles.moodBanner}>
          <View>
            <Text style={styles.moodIcon}>🧠</Text>
            <Text style={styles.moodTitle}>Tell us your craving</Text>
          </View>
          <LinearGradient
            colors={[colors.primary, '#3BC8A4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.moodButton}
          >
            <Text style={styles.moodButtonText}>Pick My Mood</Text>
          </LinearGradient>
        </View>

        {/* Nearby */}
        <LinearGradient
          colors={['#FFFFFF', '#FAFAFA']}
          style={styles.sectionContainer}
        >
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Popular Near You</Text>
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => navigation.navigate('AllRestaurants')}
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
  headerGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 120, zIndex: 1 },

  sectionContainer: { paddingVertical: 20, marginTop: 8 },
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
  
  moodBanner: { marginTop: 16, marginHorizontal: SCREEN_WIDTH * 0.05, borderRadius: 16, paddingVertical: 24, paddingHorizontal: 20, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  moodIcon: { fontSize: 20, color: '#FFFFFF', marginBottom: 6 },
  moodTitle: { fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
  moodButton: { borderRadius: 24, paddingHorizontal: 20, paddingVertical: 14, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  moodButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },

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
