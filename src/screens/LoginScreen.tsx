import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { tokens } from '../theme/theme';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../constants';
import { validateEmail } from '../utils';
import { 
  GradientButton, 
  Input, 
  Link, 
  AnimatedLogo, 
  SocialButton 
} from '../components';
import { AuthStackParamList, RootStackParamList } from '../types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp as RootNav } from '@react-navigation/native-stack';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Login'
>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const rootNav = useNavigation<RootNav<RootStackParamList>>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSignIn = (): void => {
    // TODO: Replace with real auth; for now, go to MainTabs
    console.log('Sign in with:', email, password);
    rootNav.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  };

  const handleForgotPassword = (): void => {
    // TODO: Implement forgot password logic
    console.log('Forgot password');
  };

  const handleAppleSignIn = (): void => {
    // TODO: Implement Apple sign in
    console.log('Apple sign in');
  };

  const handleGoogleSignIn = (): void => {
    // TODO: Implement Google sign in
    console.log('Google sign in');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo/Brand Section */}
        <View style={styles.headerSection}>
          <AnimatedLogo size={80} />
          <Text style={styles.brandName}>Wajba</Text>
          <Text style={styles.tagline}>Middle Eastern warmth meets intelligent personalization</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.subtitleText}>Sign in to continue</Text>

          {/* Email Input */}
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Password Input */}
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />

          {/* Forgot Password */}
          <Link 
            onPress={handleForgotPassword}
            style={styles.forgotPassword}
            accessibilityLabel="Forgot Password"
          >
            Forgot Password?
          </Link>

          {/* Login Button */}
          <GradientButton
            title="Sign In"
            onPress={handleSignIn}
            accessibilityLabel="Sign in to SmartBite"
          />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.divider} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialButtonsContainer}>
            <SocialButton
              icon="🍎"
              label="Apple"
              onPress={handleAppleSignIn}
              accessibilityLabel="Sign in with Apple"
            />
            <SocialButton
              icon="🔍"
              label="Google"
              onPress={handleGoogleSignIn}
              accessibilityLabel="Sign in with Google"
            />
          </View>

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <Link 
              onPress={() => navigation.navigate('Signup')}
              accessibilityLabel="Sign up for SmartBite"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: tokens.spacing.huge,
    marginBottom: tokens.spacing.xxxl,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '600', // Poppins 600
    color: colors.textPrimary,
    marginTop: tokens.spacing.lg,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6E7480',
    lineHeight: 20,
    marginTop: 6,
  },
  formSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '500', // Poppins 500
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    fontWeight: '400', // Inter 400
    color: colors.textSecondary,
    marginBottom: 24,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: tokens.spacing.xl,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.divider,
    opacity: 0.3, // Lighter divider lines
  },
  dividerText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginHorizontal: 12,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.xl,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  },
  signupText: {
    fontSize: 16,
    fontWeight: '400', // Inter 400
    color: colors.textSecondary,
  },
});

export default LoginScreen;
