import React, { useState, useEffect } from 'react';
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
import { Feather as Icon } from '@expo/vector-icons';
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
import { useLanguage } from '../../../contexts/LanguageContext';

type SignupScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Signup'
>;

interface SignupScreenProps {
  navigation: SignupScreenNavigationProp;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const { t } = useLanguage();
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

  // Password validation checks
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);

  useEffect(() => {
    // Validate password
    setHasMinLength(password.length >= 8);
    setHasNumber(/\d/.test(password));
    setHasSpecialChar(/[!@#$%^&*(),.?":{}|<>]/.test(password));
  }, [password]);

  // Check if form is valid
  const isFormValid: boolean = Boolean(
    fullName && email && password && confirmPassword && agreeToTerms
  );

  const handleSignUp = async (): Promise<void> => {
    // Validate inputs
    if (!fullName.trim()) {
      setError(t('auth.pleaseEnterFullName'));
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
        t('auth.accountCreated'),
        t('auth.welcomeMessage'),
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
          <Text style={styles.welcomeText}>{t('auth.createAccount')}</Text>
          <Text style={styles.subtitleText}>
            {t('auth.joinMessage')}
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Full Name Input */}
          <Input
            label={t('auth.fullName')}
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
            label={t('auth.phoneNumberOptional')}
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

          {/* Password Requirements */}
          {password !== '' && (
            <View style={styles.validationContainer}>
              <View style={styles.validationItem}>
                <Icon
                  name={hasMinLength ? 'check-circle' : 'circle'}
                  size={16}
                  color={hasMinLength ? colors.success : '#CBD5E1'}
                />
                <Text style={[styles.validationText, hasMinLength && styles.validationTextValid]}>
                  8+ characters
                </Text>
              </View>
              <View style={styles.validationItem}>
                <Icon
                  name={hasNumber ? 'check-circle' : 'circle'}
                  size={16}
                  color={hasNumber ? colors.success : '#CBD5E1'}
                />
                <Text style={[styles.validationText, hasNumber && styles.validationTextValid]}>
                  1 number
                </Text>
              </View>
              <View style={styles.validationItem}>
                <Icon
                  name={hasSpecialChar ? 'check-circle' : 'circle'}
                  size={16}
                  color={hasSpecialChar ? colors.success : '#CBD5E1'}
                />
                <Text style={[styles.validationText, hasSpecialChar && styles.validationTextValid]}>
                  1 special character
                </Text>
              </View>
            </View>
          )}

          {/* Confirm Password Input */}
          <Input
            label={t('auth.confirmPassword')}
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
            <View style={styles.checkboxWrapper}>
              <Checkbox
                status={agreeToTerms ? 'checked' : 'unchecked'}
                onPress={() => setAgreeToTerms(!agreeToTerms)}
                color={colors.primary}
                uncheckedColor="#6B7280"
              />
            </View>
            <Text style={styles.checkboxText}>
              {t('auth.agreeToThe')}{' '}
              <Text style={styles.linkText}>{t('auth.termsConditions')}</Text> {t('auth.and')}{' '}
              <Text style={styles.linkText}>{t('auth.privacyPolicy')}</Text>
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
            title={loading ? t('auth.creatingAccount') : t('auth.createAccount')}
            onPress={handleSignUp}
            disabled={!isFormValid || loading}
            loading={loading}
            accessibilityLabel="Create your Wajba account"
          />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>{t('auth.orSignUpWith')}</Text>
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
              accessibilityLabel="Sign in to Wajba"
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
  checkboxWrapper: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  checkboxText: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
    marginHorizontal: 8,
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
  validationContainer: {
    marginTop: -SPACING.md,
    marginBottom: SPACING.md,
    paddingLeft: SPACING.xs,
  },
  validationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    gap: SPACING.sm,
  },
  validationText: {
    fontSize: FONT_SIZE.sm,
    color: '#94A3B8',
  },
  validationTextValid: {
    color: colors.success,
    fontWeight: '500',
  },
});

export default SignupScreen;
