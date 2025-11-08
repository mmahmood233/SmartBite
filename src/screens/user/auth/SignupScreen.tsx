import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { TextInput, Checkbox } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { tokens } from '../../../theme/theme';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../../constants';
import { validateEmail, validatePassword, validatePasswordMatch, validatePhone } from '../../../utils';
import { 
  GradientButton, 
  Input, 
  Link, 
  SocialButton 
} from '../../../components';
import { AuthStackParamList, RootStackParamList } from '../../../types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp as RootNav } from '@react-navigation/native-stack';
import { signUp, signInWithApple, signInWithGoogle } from '../../../services/auth.service';

type SignupScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Signup'
>;

interface SignupScreenProps {
  navigation: SignupScreenNavigationProp;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const rootNav = useNavigation<RootNav<RootStackParamList>>();
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Check if form is valid
  const isFormValid: boolean = Boolean(
    fullName && email && password && confirmPassword && agreeToTerms
  );

  const handleSignUp = async (): Promise<void> => {
    // Validate inputs
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!validatePasswordMatch(password, confirmPassword)) {
      setError('Passwords do not match');
      return;
    }
    if (!agreeToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Sign up with Supabase
      const { auth, user } = await signUp(email.trim(), password, fullName.trim());

      if (!auth.user || !user) {
        setError('Sign up failed. Please try again.');
        setLoading(false);
        return;
      }

      // Show success message
      Alert.alert(
        'Account Created!',
        'Welcome to Wajba! Your account has been created successfully.',
        [
          {
            text: 'Continue',
            onPress: () => {
              // Navigate to main app
              rootNav.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
            },
          },
        ]
      );
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignUp = async (): Promise<void> => {
    // TODO: Configure Apple OAuth in Supabase Dashboard
    Alert.alert(
      'Coming Soon',
      'Apple Sign Up will be available soon. Please use email/password for now.',
      [{ text: 'OK' }]
    );
  };

  const handleGoogleSignUp = async (): Promise<void> => {
    setLoading(true);
    try {
      await signInWithGoogle();
      // Supabase will handle the redirect
    } catch (err: any) {
      console.error('Google sign up error:', err);
      Alert.alert('Error', 'Google sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Link
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityLabel="Go back to login"
          >
            ← Back
          </Link>
          <Text style={styles.welcomeText}>Create Account</Text>
          <Text style={styles.subtitleText}>
            Join SmartBite and let AI personalize your food journey
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Full Name Input */}
          <Input
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />

          {/* Email Input */}
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Phone Input */}
          <Input
            label="Phone Number (Optional)"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
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

          {/* Confirm Password Input */}
          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
          />

          {/* Terms and Conditions */}
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={agreeToTerms ? 'checked' : 'unchecked'}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
              color={colors.primary}
            />
            <Text style={styles.checkboxText}>
              I agree to the{' '}
              <Text style={styles.linkText}>Terms & Conditions</Text> and{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>
          </View>

          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Sign Up Button */}
          <GradientButton
            title={loading ? "Creating Account..." : "Create Account"}
            onPress={handleSignUp}
            disabled={!isFormValid || loading}
            loading={loading}
            accessibilityLabel="Create your SmartBite account"
          />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or sign up with</Text>
            <View style={styles.divider} />
          </View>

          {/* Social Sign Up Buttons */}
          <View style={styles.socialButtonsContainer}>
            <SocialButton
              icon="🍎"
              label="Apple"
              onPress={handleAppleSignUp}
              accessibilityLabel="Sign up with Apple"
            />
            <SocialButton
              icon="🔍"
              label="Google"
              onPress={handleGoogleSignUp}
              accessibilityLabel="Sign up with Google"
            />
          </View>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Link 
              onPress={() => navigation.navigate('Login')}
              accessibilityLabel="Sign in to SmartBite"
            >
              Sign In
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
    marginTop: tokens.spacing.huge,
    marginBottom: tokens.spacing.xxl,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '600', // Poppins 600
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    fontWeight: '400', // Inter 400
    color: colors.textSecondary,
    marginTop: 4,
  },
  formSection: {
    flex: 1,
    paddingBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  checkboxText: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
    marginLeft: 8,
  },
  linkText: {
    color: colors.primary,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  },
  loginText: {
    fontSize: 16,
    fontWeight: '400', // Inter 400
    color: colors.textSecondary,
  },
});

export default SignupScreen;
