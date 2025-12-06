import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { tokens } from '../../../theme/theme';
import { 
  GradientButton, 
  Input, 
  Link, 
  AnimatedLogo, 
  SocialButton 
} from '../../../components';
import { AuthStackParamList, RootStackParamList } from '../../../types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp as RootNav } from '@react-navigation/native-stack';
import { signIn, signInWithApple, signInWithGoogle } from '../../../services/auth.service';
import { useLanguage } from '../../../contexts/LanguageContext';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Login'
>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const rootNav = useNavigation<RootNav<RootStackParamList>>();
  const { t } = useLanguage();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSignIn = async (): Promise<void> => {
    // Validate inputs
    if (!email.trim() || !password.trim()) {
      setError(t('validation.required'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Sign in with Supabase
      const { session, user } = await signIn(email.trim(), password);

      if (!session || !user) {
        setError('Login failed. Please try again.');
        setLoading(false);
        return;
      }

      // Route based on user role
      const userRole = user.role || 'customer';

      if (userRole === 'admin') {
        rootNav.reset({ index: 0, routes: [{ name: 'AdminPortal' }] });
      } else if (userRole === 'partner') {
        rootNav.reset({ index: 0, routes: [{ name: 'PartnerPortal' }] });
      } else if (userRole === 'rider') {
        rootNav.reset({ index: 0, routes: [{ name: 'RiderTabs' }] });
      } else {
        rootNav.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
      }
    } catch (err: any) {
      // Show user-friendly error message
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (): void => {
    Alert.alert(
      'Reset Password',
      'Password reset functionality will be available soon.',
      [{ text: 'OK' }]
    );
  };

  const handleAppleSignIn = async (): Promise<void> => {
    // TODO: Configure Apple OAuth in Supabase Dashboard
    Alert.alert(
      'Coming Soon',
      'Apple Sign In will be available soon. Please use email/password for now.',
      [{ text: 'OK' }]
    );
    
    // Uncomment when Apple OAuth is configured:
    // setLoading(true);
    // try {
    //   await signInWithApple();
    // } catch (err: any) {
    //   console.error('Apple sign in error:', err);
    //   Alert.alert('Error', 'Apple sign in failed. Please try again.');
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleGoogleSignIn = async (): Promise<void> => {
    setLoading(true);
    try {
      await signInWithGoogle();
      // Supabase will handle the redirect
    } catch (err: any) {
      console.error('Google sign in error:', err);
      Alert.alert('Error', 'Google sign in failed. Please try again.');
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
      >
        {/* Logo/Brand Section */}
        <View style={styles.headerSection}>
          <AnimatedLogo size={80} />
          <Text style={styles.brandName}>Wajba</Text>
          <Text style={styles.tagline}>{t('auth.tagline')}</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.welcomeText}>{t('auth.welcomeBack')}</Text>
          <Text style={styles.subtitleText}>{t('auth.signInToContinue')}</Text>

          {/* Email Input */}
          <Input
            label={t('auth.email')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Password Input */}
          <Input
            label={t('auth.password')}
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

          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Forgot Password */}
          <Link 
            onPress={handleForgotPassword}
            style={styles.forgotPassword}
            accessibilityLabel="Forgot Password"
          >
            {t('auth.forgotPassword')}
          </Link>

          {/* Login Button */}
          <GradientButton
            title={loading ? t('auth.signingIn') : t('auth.signIn')}
            onPress={handleSignIn}
            disabled={loading}
            loading={loading}
            accessibilityLabel="Sign in to Wajba"
          />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>{t('auth.orContinueWith')}</Text>
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
            <Text style={styles.signupText}>{t('auth.noAccount')} </Text>
            <Link 
              onPress={() => navigation.navigate('Signup')}
              accessibilityLabel="Sign up for Wajba"
            >
              {t('auth.signUp')}
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
