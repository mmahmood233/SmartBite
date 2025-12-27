// @ts-nocheck

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { tokens } from '../theme/theme';
import { AnimatedLogoProps } from '../types';

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ 
  emoji, 
  size = 80 
}) => {
  // Use Wajba logo by default
  const useImage = !emoji;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entry animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: tokens.animation.timing.verySlow,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        ...tokens.animation.spring.default,
        useNativeDriver: true,
      }),
    ]).start();

    // Wajba spec: Logo glow pulse (2.5s loop)
    const startPulse = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.06,
            duration: 1250, // 2.5s / 2 = 1.25s
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1250,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    // Start pulse after entry animation
    setTimeout(startPulse, 800);
  }, [fadeAnim, scaleAnim, pulseAnim]);

  const wrapperSize = size + 10;
  const gradientSize = size + 10;

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          width: wrapperSize,
          height: wrapperSize,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* Pulsing gradient ring */}
      <Animated.View
        style={{
          position: 'absolute',
          transform: [{ scale: pulseAnim }],
        }}
      >
        <LinearGradient
          colors={[colors.primary, colors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.logoGradient,
            {
              width: gradientSize,
              height: gradientSize,
              borderRadius: gradientSize / 2,
            },
          ]}
        />
      </Animated.View>

      {/* Logo container */}
      <View
        style={[
          styles.logoContainer,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          tokens.shadows.logo,
        ]}
      >
        {useImage ? (
          <Image
            source={require('../../assets/wajba_logo.png')}
            style={[styles.logoImage, { width: size * 0.7, height: size * 0.7 }]}
            resizeMode="contain"
          />
        ) : (
          <Text style={[styles.logoText, { fontSize: size / 2 }]}>{emoji}</Text>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoGradient: {
    position: 'absolute',
    opacity: 0.25,
  },
  logoContainer: {
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    // fontSize set dynamically
  },
  logoImage: {
    // width and height set dynamically
  },
});

export default AnimatedLogo;
