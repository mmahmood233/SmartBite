import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../../../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../../constants';
import { formatOrderNumber } from '../../../utils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DeliveryCompleteScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const orderData = {
    restaurant: {
      name: 'Al Qariah',
      logo: '🍽️',
    },
    orderNumber: 'WAJ1234',
  };

  const quickTags = [
    'Delicious',
    'Fast Delivery',
    'Hot & Fresh',
    'Great Packaging',
    'Good Portions',
    'Value for Money',
  ];

  const handleStarPress = (star: number) => {
    setRating(star);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmitReview = () => {
    // TODO: Submit review to backend
    console.log('Review submitted:', { rating, comment, tags: selectedTags });
    navigation.navigate('ReviewConfirmation');
  };

  const handleReorder = () => {
    // TODO: Navigate to restaurant with previous order
    navigation.navigate('MainTabs');
  };

  const handleExplore = () => {
    navigation.navigate('MainTabs');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Success Header */}
        <View style={styles.successHeader}>
          <View style={styles.checkmarkContainer}>
            <LinearGradient
              colors={['#00897B', '#26A69A']}
              style={styles.checkmarkGradient}
            >
              <Icon name="check" size={56} color="#FFFFFF" />
            </LinearGradient>
          </View>
          <Text style={styles.successTitle}>Delivered!</Text>
          <Text style={styles.successSubtext}>
            Enjoy your meal from {orderData.restaurant.name}! 🍽️
          </Text>
        </View>

        {/* Rating Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How was your experience?</Text>
          <View style={styles.ratingCard}>
            <View style={styles.restaurantHeader}>
              <View style={styles.restaurantLogo}>
                <Text style={styles.restaurantLogoText}>{orderData.restaurant.logo}</Text>
              </View>
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{orderData.restaurant.name}</Text>
                <Text style={styles.orderNumber}>Order #{orderData.orderNumber}</Text>
              </View>
            </View>

            {/* Star Rating */}
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleStarPress(star)}
                  activeOpacity={0.7}
                  style={styles.starButton}
                >
                  <Icon
                    name="star"
                    size={40}
                    color={star <= rating ? '#FFB800' : '#E0E0E0'}
                    style={star <= rating && styles.starFilled}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {rating > 0 && (
              <Text style={styles.ratingText}>
                {rating === 5 && 'Excellent! 🌟'}
                {rating === 4 && 'Great! 👍'}
                {rating === 3 && 'Good 😊'}
                {rating === 2 && 'Could be better 😐'}
                {rating === 1 && 'Not satisfied 😞'}
              </Text>
            )}
          </View>
        </View>

        {/* Quick Tags */}
        {rating > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What did you like?</Text>
            <View style={styles.tagsContainer}>
              {quickTags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tag,
                    selectedTags.includes(tag) && styles.tagSelected,
                  ]}
                  onPress={() => toggleTag(tag)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.tagText,
                      selectedTags.includes(tag) && styles.tagTextSelected,
                    ]}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Comment Section */}
        {rating > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add a comment (Optional)</Text>
            <View style={styles.commentCard}>
              <View style={styles.commentInputContainer}>
                <Icon name="edit-3" size={16} color="#9E9E9E" style={styles.commentIcon} />
                <TextInput
                  style={styles.commentInput}
                  placeholder="Share more details about your experience..."
                  placeholderTextColor="#9E9E9E"
                  value={comment}
                  onChangeText={setComment}
                  multiline
                  numberOfLines={4}
                  maxLength={300}
                  textAlignVertical="top"
                />
              </View>
              <Text style={styles.characterCount}>{comment.length}/300</Text>
            </View>
          </View>
        )}

        {/* Photo Upload (Future Feature) */}
        {rating > 0 && (
          <View style={styles.section}>
            <TouchableOpacity style={styles.photoButton} activeOpacity={0.7}>
              <Icon name="camera" size={20} color={colors.primary} />
              <Text style={styles.photoButtonText}>Add a photo</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Spacing for buttons */}
        <View style={{ height: rating > 0 ? 180 : 140 }} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        {rating > 0 ? (
          <>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitReview}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#00897B', '#26A69A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitButtonGradient}
              >
                <Text style={styles.submitButtonText}>Submit Review</Text>
                <Icon name="check" size={18} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleExplore}
              activeOpacity={0.7}
            >
              <Text style={styles.skipButtonText}>Skip for now</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.reorderButton}
              onPress={handleReorder}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#00897B', '#26A69A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.reorderButtonGradient}
              >
                <Icon name="refresh-cw" size={18} color="#FFFFFF" />
                <Text style={styles.reorderButtonText}>Reorder</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={handleExplore}
              activeOpacity={0.7}
            >
              <Text style={styles.exploreButtonText}>Explore More Nearby</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  successHeader: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  checkmarkContainer: {
    marginBottom: SPACING.xxl,
  },
  checkmarkGradient: {
    width: 112,
    height: 112,
    borderRadius: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 15,
  },
  successTitle: {
    fontSize: FONT_SIZE.huge,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  successSubtext: {
    fontSize: FONT_SIZE.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SPACING.xl,
  },
  section: {
    marginTop: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: SPACING.md,
  },
  ratingCard: {
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  restaurantLogo: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  restaurantLogoText: {
    fontSize: 24,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: FONT_SIZE.lg + 1,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: SPACING.xs,
  },
  orderNumber: {
    fontSize: FONT_SIZE.sm + 1,
    color: colors.textSecondary,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  starButton: {
    padding: 4,
  },
  starFilled: {
    transform: [{ scale: 1.1 }],
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tagSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6D6D6D',
  },
  tagTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  commentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9F9F9',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 12,
  },
  commentIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    color: '#212121',
    minHeight: 80,
    maxHeight: 120,
  },
  characterCount: {
    fontSize: 12,
    color: '#9E9E9E',
    textAlign: 'right',
    marginTop: 6,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  photoButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -6 },
    elevation: 25,
  },
  submitButton: {
    marginBottom: 12,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#00897B',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  skipButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6D6D6D',
  },
  reorderButton: {
    marginBottom: 12,
  },
  reorderButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#00897B',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  reorderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  exploreButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: 0.2,
  },
});

export default DeliveryCompleteScreen;
