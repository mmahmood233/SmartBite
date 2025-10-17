import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE, ICON_SIZE, AVATAR_SIZE } from '../../../constants';
import { getInitials, validateRequired, validateEmail, validatePhone } from '../../../utils';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Snackbar from '../../../components/Snackbar';
import { GradientButton, Input } from '../../../components';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // Form state
  const [fullName, setFullName] = useState('Ahmed Faisal');
  const [email, setEmail] = useState('ahmed.faisal@example.com');
  const [phone, setPhone] = useState('+973 3356 0803');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'warning' | 'info' }>({ visible: false, message: '', type: 'success' });

  const showSnackbar = (message: string, type: 'success' | 'error' = 'success') => {
    setSnackbar({ visible: true, message, type });
  };

  const handleChangePhoto = () => {
    // TODO: Open camera/gallery picker
    Alert.alert('Change Photo', 'Camera/Gallery picker will open here');
  };

  const handleSaveChanges = async () => {
    // Validate all fields
    if (!validateRequired(fullName)) {
      showSnackbar('Please enter your full name', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showSnackbar('Please enter a valid email address', 'error');
      return;
    }

    if (!validatePhone(phone)) {
      showSnackbar('Please enter a valid phone number', 'error');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Save to backend
      // await updateProfile({ fullName, email, phone });
      showSnackbar('Profile updated successfully', 'success');
      setTimeout(() => navigation.goBack(), 1500);
    } catch (error) {
      showSnackbar('Failed to update profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarInitials}>{getInitials(fullName)}</Text>
            </LinearGradient>
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={handleChangePhoto}
              activeOpacity={0.8}
            >
              <Icon name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleChangePhoto} activeOpacity={0.7}>
            <Text style={styles.changePhotoText}>Edit Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <Input
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            left={<TextInput.Icon icon="account" />}
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            left={<TextInput.Icon icon="email" />}
          />

          <Input
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            left={<TextInput.Icon icon="phone" />}
          />

          <Input
            label="Date of Birth (Optional)"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            placeholder="DD/MM/YYYY"
            left={<TextInput.Icon icon="calendar" />}
          />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <GradientButton
          title="Save Changes"
          onPress={handleSaveChanges}
          gradientColors={[colors.gradientStart, colors.gradientEnd]}
          style={styles.saveButton}
        />

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <LoadingSpinner visible={isLoading} message="Updating profile..." overlay />
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: SPACING.xl,
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
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
    backgroundColor: colors.surface,
    marginBottom: SPACING.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: AVATAR_SIZE.xxl,
    height: AVATAR_SIZE.xxl,
    borderRadius: AVATAR_SIZE.xxl / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  avatarInitials: {
    fontSize: FONT_SIZE.massive + 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.surface,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  changePhotoText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: colors.primary,
  },
  formSection: {
    paddingHorizontal: SPACING.xl,
  },
  successBanner: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 80,
    left: SPACING.xl,
    right: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successToastBg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    gap: 10,
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  successText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: colors.successToastText,
  },
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xxxl : SPACING.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    marginBottom: SPACING.md,
  },
  cancelButton: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FONT_SIZE.base,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});

export default EditProfileScreen;
