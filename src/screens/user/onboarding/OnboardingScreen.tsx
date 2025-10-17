import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ViewToken,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GradientButton } from '../../../components';
import { colors } from '../../../theme/colors';
import { tokens } from '../../../theme/theme';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../../constants';
import { RootStackParamList } from '../../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type OnboardingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Onboarding'
>;

interface OnboardingScreenProps {
  navigation: OnboardingScreenNavigationProp;
}

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  emoji?: string;
  image?: ImageSourcePropType;
  backgroundColor: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Discover local flavors with AI-powered recommendations',
    subtitle: 'Skip the endless scrolling — Wajba finds what fits your craving',
    image: require('../../../../assets/SC_Search_logo.png'),
    backgroundColor: '#F8F9FB',
  },
  {
    id: '2',
    title: 'Personalize your meals based on your mood and taste',
    subtitle: 'Our AI learns what you love — whether it\'s spicy, sweet, or healthy',
    image: require('../../../../assets/SC_Thinking.png'),
    backgroundColor: '#F8F9FB',
  },
  {
    id: '3',
    title: 'Enjoy Middle Eastern warmth, delivered to your door',
    subtitle: 'Fast delivery, real flavor — Wajba brings your favorite dishes home',
    image: require('../../../../assets/wajba_logo.png'),
    backgroundColor: '#F8F9FB',
  },
];

/**
 * Wajba Onboarding Screen
 * Three-step introduction to app features
 * Swipeable with progress indicators
 */
const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList>(null);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index || 0);
      }
    }
  ).current;

  const handleNext = (): void => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      // Last slide - navigate to signup
      navigation.replace('Auth');
    }
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <View style={styles.illustrationCircle}>
          {item.image ? (
            <Image source={item.image} style={styles.illustrationImage} resizeMode="contain" />
          ) : (
            <Text style={styles.emoji}>{item.emoji}</Text>
          )}
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentIndex ? styles.dotActive : styles.dotInactive,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
      />

      {/* Bottom section */}
      <View style={styles.bottomContainer}>
        {/* Pagination dots */}
        {renderPagination()}

        {/* Action button */}
        <GradientButton
          title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  slide: {
    flex: 1,
    paddingHorizontal: tokens.spacing.xl,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: tokens.spacing.huge,
  },
  illustrationCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    ...tokens.shadows.card,
  },
  illustrationImage: {
    width: 140,
    height: 140,
  },
  emoji: {
    fontSize: 80,
  },
  contentContainer: {
    paddingBottom: tokens.spacing.xxxl,
  },
  title: {
    fontSize: 24,
    fontWeight: '600', // Poppins SemiBold
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: tokens.spacing.lg,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400', // Inter Regular
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomContainer: {
    paddingHorizontal: tokens.spacing.xl,
    paddingBottom: tokens.spacing.xxxl,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  dotInactive: {
    backgroundColor: colors.divider,
  },
  button: {
    marginTop: tokens.spacing.md,
  },
});

export default OnboardingScreen;
