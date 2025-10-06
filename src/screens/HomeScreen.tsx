import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../theme/colors';
import SearchBar from '../components/SearchBar';
import Chip from '../components/Chip';
import RestaurantCard from '../components/RestaurantCard';
import BottomNav from '../components/BottomNav';

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
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Top App Bar */}
        <View style={styles.appBar}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>
              <Text style={styles.greetingLight}>Good evening, </Text>
              <Text style={styles.greetingBold}>Ahmed</Text>
              <Text> 👋</Text>
            </Text>
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

        {/* Search */}
        <SearchBar style={{ marginHorizontal: 20 }} />

        {/* Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
          {chips.map((c, i) => (
            <Chip key={c} label={c} active={i === 0} />
          ))}
        </ScrollView>

        {/* AI Picks */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>✨ For You</Text>
          <Text style={styles.sectionSub}>Curated by your taste</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}>
          {aiPicks.map(item => (
            <View key={item.id} style={styles.aiCard}>
              <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.aiImage} />
                <View style={styles.tealOverlay} />
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
          ))}
        </ScrollView>

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
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Popular Near You</Text>
          <Text style={styles.link}>See All ▶</Text>
        </View>

        <View style={styles.gridWrap}>
          {nearby.map(item => (
            <RestaurantCard key={item.id} image={item.image} name={item.name} tags={item.tags} style={styles.gridItem} />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Nav */}
      <BottomNav active="Home" />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FAFAFA' },
  scroll: { paddingBottom: 120 },
  appBar: {
    paddingTop: 42,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  greeting: { fontSize: 18, fontWeight: '600', color: '#2D2D2D' },
  greetingLight: { color: '#5A5A5A', fontWeight: '500' },
  greetingBold: { color: '#1F1F1F', fontWeight: '700' },
  locationChip: { alignSelf: 'flex-start', marginTop: 6, backgroundColor: '#E6F3F1', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, shadowColor: colors.primary, shadowOpacity: 0.15, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 2, borderWidth: 0.5, borderColor: 'rgba(20, 119, 111, 0.2)', flexDirection: 'row', alignItems: 'center' },
  locationText: { fontSize: 13, color: colors.primary, fontWeight: '500' },
  avatar: { width: 38, height: 38, borderRadius: 19, marginLeft: 8, marginRight: 8, borderColor: colors.primary, borderWidth: 2 },
  headerGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 120, zIndex: 1 },

  sectionHeader: { paddingHorizontal: 20, marginTop: 16 },
  sectionHeaderRow: { paddingHorizontal: 20, marginTop: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: colors.textPrimary },
  sectionSub: { fontSize: 14, color: '#555555', marginTop: 4 },

  aiCard: { width: 200, height: 260, borderRadius: 16, backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, marginVertical: 12, overflow: 'hidden', elevation: 3 },
  imageContainer: { position: 'relative', width: 200, height: 140 },
  aiImage: { width: 200, height: 140, borderTopLeftRadius: 16, borderTopRightRadius: 16, resizeMode: 'cover' },
  tealOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(20, 119, 111, 0.25)', borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  aiCardBody: { padding: 12 },
  aiName: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  aiMatch: { fontSize: 12, color: '#3BC8A4', marginTop: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  metaText: { fontSize: 11, color: '#555555' },
  metaDot: { marginHorizontal: 4, color: '#555555', fontSize: 11 },

  moodBanner: { marginTop: 16, marginHorizontal: 20, borderRadius: 16, paddingVertical: 24, paddingHorizontal: 20, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  moodIcon: { fontSize: 20, color: '#FFFFFF', marginBottom: 6 },
  moodTitle: { fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
  moodButton: { borderRadius: 24, paddingHorizontal: 20, paddingVertical: 14, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  moodButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },

  gridWrap: { paddingHorizontal: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 12 },
  gridItem: { },
  link: { color: colors.primary, fontWeight: '600', fontSize: 14 },
});

export default HomeScreen;
