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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GradientButton } from '../../../components';
import { colors } from '../../../theme/colors';
import { useLanguage } from '../../../contexts/LanguageContext';
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

const slidesData: OnboardingSlide[] = [
  {
    id: '1',
    title: 'onboarding.slide1Title',
    subtitle: 'onboarding.slide1Description',
    image: require('../../../../assets/SC_Search_logo.png'),
    backgroundColor: '#F8F9FB',
  },
  {
    id: '2',
    title: 'onboarding.slide2Title',
    subtitle: 'onboarding.slide2Description',
    image: require('../../../../assets/SC_Thinking.png'),
    backgroundColor: '#F8F9FB',
  },
  {
    id: '3',
    title: 'onboarding.slide3Title',
    subtitle: 'onboarding.slide3Description',
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
  const { t } = useLanguage();
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

  const handleNext = async (): Promise<void> => {
    if (currentIndex < slidesData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      // Last slide - mark onboarding as seen and navigate to auth
      try {
        await AsyncStorage.setItem('@wajba_has_seen_onboarding', 'true');
      } catch (error) {
        console.error('Error saving onboarding status:', error);
      }
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
        <Text style={styles.title}>{t(item.title)}</Text>
        <Text style={styles.subtitle}>{t(item.subtitle)}</Text>
      </View>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      {slidesData.map((_, index) => (
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
        data={slidesData}
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
          title={currentIndex === slidesData.length - 1 ? t('onboarding.getStarted') : t('onboarding.next')}
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
