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
  style?: ViewStyle;
  restaurantId?: string;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ image, name, tags, rating = 4.8, eta = '15 min', price = '$$', style, restaurantId = '1' }) => {
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
    <TouchableOpacity style={[styles.card, style]} onPress={handlePress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        {isLogoImage && <View style={styles.logoBackground} />}
        <Image source={image} style={[styles.image, isLogoImage && styles.logoImage]} />
        {isFoodImage && <View style={styles.tealOverlay} />}
      </View>
      <Text style={styles.name}>{name}</Text>
      {tags ? <Text style={styles.tags}>{tags}</Text> : null}
      <View style={styles.metaRow}>
        <Text style={styles.meta}>⭐ {rating.toFixed(1)}</Text>
        <Text style={styles.dot}>•</Text>
        <Text style={styles.meta}>{eta}</Text>
        <Text style={styles.dot}>•</Text>
        <Text style={styles.meta}>{price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: CARD_WIDTH * 0.75,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: CARD_WIDTH * 0.75,
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
    fontWeight: '600',
    color: colors.textPrimary,
  },
  tags: {
    fontSize: 12,
    color: '#555555',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  meta: {
    fontSize: 12,
    color: '#555555',
  },
  dot: {
    marginHorizontal: 6,
    color: '#555555',
  },
});

export default RestaurantCard;
