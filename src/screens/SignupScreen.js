import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { TextInput, Checkbox } from 'react-native-paper';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const SignupScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.welcomeText}>Create Account</Text>
          <Text style={styles.subtitleText}>
            Sign up to get started with SmartBite
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Full Name Input */}
          <TextInput
            mode="outlined"
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            style={styles.input}
            outlineColor={colors.divider}
            activeOutlineColor={colors.primary}
            theme={{
              colors: {
                text: colors.textPrimary,
                placeholder: colors.textSecondary,
              },
              roundness: 12,
            }}
          />

          {/* Email Input */}
          <TextInput
            mode="outlined"
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            outlineColor={colors.divider}
            activeOutlineColor={colors.primary}
            theme={{
              colors: {
                text: colors.textPrimary,
                placeholder: colors.textSecondary,
              },
              roundness: 12,
            }}
          />

          {/* Phone Input */}
          <TextInput
            mode="outlined"
            label="Phone Number (Optional)"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
            outlineColor={colors.divider}
            activeOutlineColor={colors.primary}
            theme={{
              colors: {
                text: colors.textPrimary,
                placeholder: colors.textSecondary,
              },
              roundness: 12,
            }}
          />

          {/* Password Input */}
          <TextInput
            mode="outlined"
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
            outlineColor={colors.divider}
            activeOutlineColor={colors.primary}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            theme={{
              colors: {
                text: colors.textPrimary,
                placeholder: colors.textSecondary,
              },
              roundness: 12,
            }}
          />

          {/* Confirm Password Input */}
          <TextInput
            mode="outlined"
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            style={styles.input}
            outlineColor={colors.divider}
            activeOutlineColor={colors.primary}
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
            theme={{
              colors: {
                text: colors.textPrimary,
                placeholder: colors.textSecondary,
              },
              roundness: 12,
            }}
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

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[
              styles.signupButton,
              !agreeToTerms && styles.signupButtonDisabled,
            ]}
            disabled={!agreeToTerms}
          >
            <Text style={styles.signupButtonText}>Create Account</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or sign up with</Text>
            <View style={styles.divider} />
          </View>

          {/* Social Sign Up Buttons */}
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>🍎 Apple</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>🔍 Google</Text>
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
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
    marginTop: 60,
    marginBottom: 32,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    ...typography.body,
    color: colors.primary,
    fontSize: 16,
  },
  welcomeText: {
    ...typography.headline,
    fontSize: 28,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitleText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 4,
  },
  formSection: {
    flex: 1,
    paddingBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: colors.surfaceLight,
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
  signupButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  signupButtonDisabled: {
    backgroundColor: colors.textMuted,
    shadowOpacity: 0,
    elevation: 0,
  },
  signupButtonText: {
    ...typography.button,
    color: '#FFFFFF',
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
  },
  dividerText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginHorizontal: 12,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
  },
  socialButtonText: {
    ...typography.body,
    fontSize: 14,
    color: colors.textPrimary,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  loginText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  loginLink: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default SignupScreen;
