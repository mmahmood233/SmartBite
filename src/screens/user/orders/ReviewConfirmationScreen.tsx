import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../../../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../../constants';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ReviewConfirmationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const scaleAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Heart animation
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleBackToHome = () => {
    navigation.navigate('MainTabs');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Animated Heart Icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['#00897B', '#26A69A']}
            style={styles.iconGradient}
          >
            <Icon name="heart" size={64} color="#FFFFFF" />
          </LinearGradient>
        </Animated.View>

        {/* Thank You Message */}
        <Animated.View style={[styles.messageContainer, { opacity: fadeAnim }]}>
          <Text style={styles.title}>Thank You!</Text>
          <Text style={styles.subtitle}>
            Your feedback helps Al Qariah serve you even better. 💚
          </Text>
          <Text style={styles.description}>
            We've shared your review with the restaurant. Your voice matters and helps us improve the experience for everyone.
          </Text>
        </Animated.View>

        {/* Reward Badge (Optional) */}
        <Animated.View style={[styles.rewardBadge, { opacity: fadeAnim }]}>
          <View style={styles.badgeIcon}>
            <Icon name="award" size={24} color={colors.primary} />
          </View>
          <View style={styles.badgeContent}>
            <Text style={styles.badgeTitle}>Review Submitted!</Text>
            <Text style={styles.badgeText}>You're helping build a better food community</Text>
          </View>
        </Animated.View>
      </View>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={handleBackToHome}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#00897B', '#26A69A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.homeButtonGradient}
          >
            <Icon name="home" size={18} color="#FFFFFF" />
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconGradient: {
    width: 128,
    height: 128,
    borderRadius: 64,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 20,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A4D47',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6D6D6D',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 15,
    color: '#9E9E9E',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 30,
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginTop: 20,
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F7F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  badgeContent: {
    flex: 1,
  },
  badgeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 13,
    color: '#6D6D6D',
    lineHeight: 18,
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
  homeButton: {
    marginBottom: 12,
  },
  homeButtonGradient: {
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
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});

export default ReviewConfirmationScreen;
