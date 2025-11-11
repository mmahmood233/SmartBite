import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather as Icon } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { SPACING, FONT_SIZE } from '../../constants';
import LoadingSpinner from '../../components/LoadingSpinner';
import Snackbar from '../../components/Snackbar';
import { supabase } from '../../lib/supabase';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ChangePasswordScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'warning' | 'info' }>({ visible: false, message: '', type: 'success' });

  const showSnackbar = (message: string, type: 'success' | 'error' = 'success') => {
    setSnackbar({ visible: true, message, type });
  };

  // Password validation checks
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  useEffect(() => {
    // Validate new password
    setHasMinLength(newPassword.length >= 8);
    setHasNumber(/\d/.test(newPassword));
    setHasSpecialChar(/[!@#$%^&*(),.?":{}|<>]/.test(newPassword));
    
    // Check if passwords match
    setPasswordsMatch(newPassword === confirmPassword && confirmPassword !== '');

    // Check if form is valid
    const allFieldsFilled = currentPassword !== '' && newPassword !== '' && confirmPassword !== '';
    const newPasswordValid = hasMinLength && hasNumber && hasSpecialChar;
    const passwordsDifferent = currentPassword !== newPassword;
    const passwordsMatchValid = newPassword === confirmPassword && confirmPassword !== '';

    setIsValid(
      allFieldsFilled &&
      newPasswordValid &&
      passwordsDifferent &&
      passwordsMatchValid
    );
  }, [currentPassword, newPassword, confirmPassword, hasMinLength, hasNumber, hasSpecialChar]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleUpdatePassword = async () => {
    if (!isValid) return;

    setIsLoading(true);
    try {
      // Supabase doesn't require current password verification for updateUser
      // It uses the current session token for authentication
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      showSnackbar('Password updated successfully', 'success');
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Navigate back after a short delay
      setTimeout(() => navigation.goBack(), 1500);
    } catch (error: any) {
      console.error('Password update error:', error);
      showSnackbar(error.message || 'Failed to update password', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPasswordInput = (
    icon: keyof typeof Icon.glyphMap,
    label: string,
    placeholder: string,
    value: string,
    onChangeText: (text: string) => void,
    showPassword: boolean,
    toggleShowPassword: () => void
  ) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputIconContainer}>
          <Icon name={icon} size={18} color={colors.primary} />
        </View>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={toggleShowPassword}
          activeOpacity={0.7}
        >
          <Icon
            name={showPassword ? 'eye' : 'eye-off'}
            size={18}
            color="#94A3B8"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderValidationCheck = (label: string, isValid: boolean) => (
    <View style={styles.validationItem}>
      <Icon
        name={isValid ? 'check-circle' : 'circle'}
        size={16}
        color={isValid ? colors.success : '#CBD5E1'}
      />
      <Text style={[styles.validationText, isValid && styles.validationTextValid]}>
        {label}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          {/* Current Password */}
          {renderPasswordInput(
            'lock',
            'Current Password *',
            'Enter your current password',
            currentPassword,
            setCurrentPassword,
            showCurrentPassword,
            () => setShowCurrentPassword(!showCurrentPassword)
          )}

          {/* New Password */}
          {renderPasswordInput(
            'key',
            'New Password *',
            'Enter new password',
            newPassword,
            setNewPassword,
            showNewPassword,
            () => setShowNewPassword(!showNewPassword)
          )}

          {/* Password Requirements */}
          {newPassword !== '' && (
            <View style={styles.validationContainer}>
              {renderValidationCheck('8+ characters', hasMinLength)}
              {renderValidationCheck('1 number', hasNumber)}
              {renderValidationCheck('1 special character', hasSpecialChar)}
            </View>
          )}

          {/* Confirm New Password */}
          {renderPasswordInput(
            'check-circle',
            'Confirm New Password *',
            'Re-enter new password',
            confirmPassword,
            setConfirmPassword,
            showConfirmPassword,
            () => setShowConfirmPassword(!showConfirmPassword)
          )}

          {/* Password Match Indicator */}
          {confirmPassword !== '' && (
            <View style={styles.matchIndicator}>
              {passwordsMatch ? (
                <View style={styles.matchSuccess}>
                  <Icon name="check-circle" size={16} color={colors.success} />
                  <Text style={styles.matchSuccessText}>Passwords match</Text>
                </View>
              ) : (
                <View style={styles.matchError}>
                  <Icon name="x-circle" size={16} color={colors.error} />
                  <Text style={styles.matchErrorText}>Passwords do not match</Text>
                </View>
              )}
            </View>
          )}

          {/* Security Note */}
          <View style={styles.securityNote}>
            <Icon name="shield" size={16} color="#64748B" />
            <Text style={styles.securityText}>
              Choose a strong password to keep your account secure
            </Text>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>

      <LoadingSpinner visible={isLoading} message="Updating password..." overlay />
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
      />

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.updateButton, !isValid && styles.updateButtonDisabled]}
          onPress={handleUpdatePassword}
          activeOpacity={0.8}
          disabled={!isValid}
        >
          <LinearGradient
            colors={
              isValid
                ? [colors.gradientStart, colors.gradientMid, colors.gradientEnd]
                : [colors.disabledBg, colors.disabledBg, colors.disabledBg]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.updateButtonGradient}
          >
            <Text style={[styles.updateButtonText, !isValid && styles.updateButtonTextDisabled]}>
              Update Password
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: '#0F172A',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    padding: SPACING.lg,
  },
  fieldGroup: {
    marginBottom: SPACING.xl,
  },
  fieldLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: SPACING.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E6E9EE',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  inputIconContainer: {
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.base,
    color: '#0F172A',
    padding: 0,
  },
  eyeButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.sm,
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
  matchIndicator: {
    marginTop: -SPACING.md,
    marginBottom: SPACING.md,
  },
  matchSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  matchSuccessText: {
    fontSize: FONT_SIZE.sm,
    color: colors.success,
    fontWeight: '500',
  },
  matchError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  matchErrorText: {
    fontSize: FONT_SIZE.sm,
    color: colors.error,
    fontWeight: '500',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: SPACING.md,
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  securityText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: '#64748B',
    lineHeight: 18,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: SPACING.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: SPACING.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: SPACING.lg,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FONT_SIZE.base,
    fontWeight: '600',
    color: '#64748B',
  },
  updateButton: {
    flex: 2,
  },
  updateButtonDisabled: {
    opacity: 0.6,
  },
  updateButtonGradient: {
    paddingVertical: SPACING.lg,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButtonText: {
    fontSize: FONT_SIZE.base,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  updateButtonTextDisabled: {
    color: colors.disabledText,
  },
});

export default ChangePasswordScreen;
