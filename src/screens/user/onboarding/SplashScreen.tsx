import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AnimatedLogo } from '../../../components';
import { colors } from '../../../theme/colors';
import { tokens } from '../../../theme/theme';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../../constants';
import { RootStackParamList } from '../../../types';

type SplashScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Splash'
>;

interface SplashScreenProps {
  navigation: SplashScreenNavigationProp;
}

/**
 * Wajba Splash Screen
 * Shows logo with pulsing animation and brand tagline
 * Duration: 2.5s before transitioning to onboarding
 */
const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in tagline
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      delay: 400,
      useNativeDriver: true,
    }).start();

    // Navigate to onboarding after 2.5s
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim]);

  return (
    <View style={styles.container}>
      {/* Logo with pulse animation */}
      <AnimatedLogo size={100} />

      {/* Brand tagline */}
      <Animated.View style={[styles.taglineContainer, { opacity: fadeAnim }]}>
        <Text style={styles.tagline}>
          Middle Eastern warmth meets{'\n'}intelligent personalization
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.xl,
  },
  taglineContainer: {
    marginTop: tokens.spacing.xxxl,
    alignItems: 'center',
  },
  tagline: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default SplashScreen;
