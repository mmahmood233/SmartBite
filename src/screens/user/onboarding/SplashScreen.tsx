// @ts-nocheck

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnimatedLogo } from '../../../components';
import { colors } from '../../../theme/colors';
import { useLanguage } from '../../../contexts/LanguageContext';
import { tokens } from '../../../theme/theme';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../../constants';
import { RootStackParamList } from '../../../types';
import { supabase } from '../../../lib/supabase';

type SplashScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Splash'
>;

interface SplashScreenProps {
  navigation: SplashScreenNavigationProp;
}

const ONBOARDING_KEY = '@wajba_has_seen_onboarding';

/**
 * Wajba Splash Screen
 * Shows logo with pulsing animation and brand tagline
 * Checks auth state and onboarding status before navigation
 */
const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const { t } = useLanguage();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in tagline
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      delay: 400,
      useNativeDriver: true,
    }).start();

    // Check auth and onboarding status
    const checkAuthAndNavigate = async () => {
      try {
        // Check if user has seen onboarding
        const hasSeenOnboarding = await AsyncStorage.getItem(ONBOARDING_KEY);
        
        // Check if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        
        // Wait for minimum splash duration (2.5s)
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        if (session) {
          // User is logged in - check their role and navigate to appropriate portal
          const { data: user } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          if (user?.role === 'partner') {
            navigation.replace('PartnerPortal');
          } else if (user?.role === 'rider') {
            navigation.replace('RiderTabs');
          } else if (user?.role === 'admin') {
            navigation.replace('AdminPortal');
          } else {
            // Default to customer portal
            navigation.replace('MainTabs');
          }
        } else if (hasSeenOnboarding === 'true') {
          // User has seen onboarding but not logged in - go to auth
          navigation.replace('Auth');
        } else {
          // New user - show onboarding
          navigation.replace('Onboarding');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // On error, default to onboarding
        navigation.replace('Onboarding');
      }
    };

    checkAuthAndNavigate();
  }, [navigation, fadeAnim]);

  return (
    <View style={styles.container}>
      {/* Logo with pulse animation */}
      <AnimatedLogo size={100} />

      {/* Brand tagline */}
      <Animated.View style={[styles.taglineContainer]}>
        <Text style={styles.brandName}>Wajba</Text>
        <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
          {t('auth.tagline')}
        </Animated.Text>
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
  brandName: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
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
