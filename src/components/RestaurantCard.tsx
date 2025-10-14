import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle, ImageSourcePropType, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { colors } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH * 0.9 - 16) / 2; // 90% width minus gap, divided by 2

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface RestaurantCardProps {
  image: ImageSourcePropType;
  name: string;
  tags?: string;
  rating?: number;
  eta?: string;
  price?: string;
  match?: number; // AI Match percentage
  style?: ViewStyle;
  restaurantId?: string;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ image, name, tags, rating = 4.8, eta = '15 min', price = '$$', match, style, restaurantId = '1' }) => {
  const navigation = useNavigation<NavigationProp>();
  const isFoodImage = image === require('../../assets/food.png');
  const isLogoImage = !isFoodImage;
  
  const handlePress = () => {
    navigation.navigate('RestaurantDetail', {
      restaurantId,
      restaurantName: name,
    });
  };
  
  return (
    <TouchableOpacity style={[styles.card, style]} onPress={handlePress} activeOpacity={0.95}>
      <View style={styles.imageContainer}>
        {isLogoImage && <View style={styles.logoBackground} />}
        <Image source={image} style={[styles.image, isLogoImage && styles.logoImage]} />
        {isFoodImage && <View style={styles.tealOverlay} />}
      </View>
      <View style={styles.contentBlock}>
        <Text style={styles.name}>{name}</Text>
        {tags ? <Text style={styles.tags}>{tags}</Text> : null}
        <View style={styles.metaRow}>
          <Text style={styles.meta}>⭐ {rating.toFixed(1)}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.meta}>{eta}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.meta}>{price}</Text>
        </View>
        {match && (
          <View style={styles.matchBadge}>
            <Text style={styles.matchIcon}>⚡</Text>
            <Text style={styles.matchText}>Match: {match}%</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    padding: 12, // Better breathing room
    shadowColor: '#000',
    shadowOpacity: 0.04, // Subtle separation
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EAEAEA', // Premium crisp border
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: CARD_WIDTH * 0.67, // 67% ratio for better balance
    marginBottom: 10, // Breathing room below image
  },
  image: {
    width: '100%',
    height: CARD_WIDTH * 0.67, // 67% ratio
    borderRadius: 12,
    resizeMode: 'cover',
  },
  tealOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20, 119, 111, 0.25)',
    borderRadius: 12,
  },
  logoBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#E6F3F1',
    borderRadius: 12,
  },
  logoImage: {
    opacity: 0.9,
  },
  name: {
    fontSize: 16,
    fontWeight: '600', // SemiBold for hierarchy
    color: '#111827', // Darker for pop
    marginBottom: 6, // Consistent vertical rhythm
  },
  tags: {
    fontSize: 13,
    fontWeight: '400', // Regular
    color: '#6B7280', // Balanced gray
    marginBottom: 6, // Consistent spacing
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0, // Tight rhythm
  },
  meta: {
    fontSize: 12,
    color: '#6B7280', // Consistent with hierarchy
    fontWeight: '500', // Medium
  },
  dot: {
    marginHorizontal: 6,
    color: '#6B7280',
    fontSize: 12,
  },
  contentBlock: {
    // Ensures all text aligns with card padding
    paddingHorizontal: 0, // Already handled by card padding
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#E0F4F1', // Brand teal
    paddingHorizontal: 8,
    paddingVertical: 2, // Compact pill
    borderRadius: 6, // Subtle pill shape
    marginTop: 8, // Breathing room from meta row
    marginBottom: 2, // Space before card edge
    gap: 4, // Space between icon and text
  },
  matchIcon: {
    fontSize: 14, // Small AI icon
    color: '#008C7A', // Brand teal
  },
  matchText: {
    fontSize: 12,
    fontWeight: '500', // Medium
    color: '#008C7A', // Brand teal
  },
});

export default RestaurantCard;
