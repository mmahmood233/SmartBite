// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';
import { Feather as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE, ICON_SIZE, AVATAR_SIZE } from '../../../constants';
import { getInitials, validateRequired, validateEmail, validatePhone } from '../../../utils';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Snackbar from '../../../components/Snackbar';
import { GradientButton, Input } from '../../../components';
import { supabase } from '../../../lib/supabase';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'warning' | 'info' }>({ visible: false, message: '', type: 'success' });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        navigation.replace('Auth');
        return;
      }

      setUserId(authUser.id);

      // Fetch user profile from users table
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) throw error;

      // Populate form with existing data
      setFullName(profile.full_name || '');
      setEmail(profile.email || authUser.email || '');
      setPhone(profile.phone || '');
      setDateOfBirth(profile.date_of_birth || '');
      setProfileImage(profile.avatar_url || '');
      
      // Set selected date if exists
      if (profile.date_of_birth) {
        setSelectedDate(new Date(profile.date_of_birth));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      showSnackbar('Failed to load profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showSnackbar = (message: string, type: 'success' | 'error' = 'success') => {
    setSnackbar({ visible: true, message, type });
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleDateChange = (day: number, month: number, year: number) => {
    // Ensure day is valid for the selected month
    const maxDays = getDaysInMonth(month, year);
    const validDay = Math.min(day, maxDays);
    
    // Create date using local timezone to avoid off-by-one errors
    const date = new Date(year, month, validDay);
    setSelectedDate(date);
    
    // Format date as YYYY-MM-DD for database
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    setDateOfBirth(formattedDate);
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const handleChangePhoto = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      showSnackbar('Permission to access gallery is required!', 'error');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
      
      // Upload to Supabase Storage
      try {
        setIsSaving(true);
        
        // Create file name
        const fileExt = imageUri.split('.').pop() || 'jpg';
        const fileName = `${userId}/${Date.now()}.${fileExt}`;
        
        // Create form data for React Native
        const formData = new FormData();
        formData.append('file', {
          uri: imageUri,
          name: fileName,
          type: `image/${fileExt}`,
        } as any);
        
        // Upload to storage using arraybuffer
        const response = await fetch(imageUri);
        const arrayBuffer = await response.arrayBuffer();
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, arrayBuffer, {
            contentType: `image/${fileExt}`,
            upsert: true,
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        // Update user profile with avatar URL
        const { error: updateError } = await supabase
          .from('users')
          .update({ avatar_url: publicUrl })
          .eq('id', userId);

        if (updateError) throw updateError;

        showSnackbar('Profile photo updated!', 'success');
      } catch (error) {
        console.error('Error uploading photo:', error);
        showSnackbar('Failed to upload photo', 'error');
      } finally {
        setIsSaving(false);
      }
    }
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

    if (phone && !validatePhone(phone)) {
      showSnackbar('Please enter a valid phone number', 'error');
      return;
    }

    setIsSaving(true);
    try {
      // Update user profile in database
      const { error } = await supabase
        .from('users')
        .update({
          full_name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          date_of_birth: dateOfBirth || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;

      showSnackbar('Profile updated successfully', 'success');
      setTimeout(() => navigation.goBack(), 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      showSnackbar('Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

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
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatar} />
            ) : (
              <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatar}
              >
                <Text style={styles.avatarInitials}>{getInitials(fullName)}</Text>
              </LinearGradient>
            )}
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={handleChangePhoto}
              activeOpacity={0.8}
            >
              <Icon name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleChangePhoto} activeOpacity={0.7}>
            <Text style={styles.changePhotoText}>
              {profileImage ? 'Change Photo' : 'Edit Photo'}
            </Text>
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

          {/* Date of Birth - Touchable Field */}
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
          >
            <View style={styles.datePickerContent}>
              <Icon name="calendar" size={20} color={colors.textSecondary} style={styles.dateIcon} />
              <View style={styles.dateTextContainer}>
                <Text style={styles.dateLabel}>Date of Birth (Optional)</Text>
                <Text style={styles.dateValue}>
                  {dateOfBirth ? formatDisplayDate(dateOfBirth) : 'Select date'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Date Picker Modal */}
          {showDatePicker && (
            <Modal
              transparent
              animationType="slide"
              visible={showDatePicker}
              onRequestClose={() => setShowDatePicker(false)}
            >
              <TouchableOpacity
                style={styles.datePickerModal}
                activeOpacity={1}
                onPress={() => setShowDatePicker(false)}
              >
                <View style={styles.datePickerContainer}>
                  <View style={styles.datePickerHeader}>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Text style={styles.datePickerCancel}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.datePickerTitle}>Select Date</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Text style={styles.datePickerDone}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.datePickerWheel}>
                    <View style={styles.datePickerRow}>
                      {/* Day Picker */}
                      <ScrollView style={styles.dateColumn} showsVerticalScrollIndicator={false}>
                        {Array.from({ 
                          length: getDaysInMonth(selectedDate.getMonth(), selectedDate.getFullYear()) 
                        }, (_, i) => i + 1).map(day => (
                          <TouchableOpacity
                            key={day}
                            style={styles.dateOption}
                            onPress={() => handleDateChange(day, selectedDate.getMonth(), selectedDate.getFullYear())}
                          >
                            <Text style={[
                              styles.dateText,
                              selectedDate.getDate() === day && styles.dateTextSelected
                            ]}>
                              {day}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>

                      {/* Month Picker */}
                      <ScrollView style={styles.dateColumn} showsVerticalScrollIndicator={false}>
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                          <TouchableOpacity
                            key={month}
                            style={styles.dateOption}
                            onPress={() => handleDateChange(selectedDate.getDate(), index, selectedDate.getFullYear())}
                          >
                            <Text style={[
                              styles.dateText,
                              selectedDate.getMonth() === index && styles.dateTextSelected
                            ]}>
                              {month}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>

                      {/* Year Picker */}
                      <ScrollView style={styles.dateColumn} showsVerticalScrollIndicator={false}>
                        {Array.from({ length: 100 }, (_, i) => {
                          const year = new Date().getFullYear() - i;
                          return (
                            <TouchableOpacity
                              key={year}
                              style={styles.dateOption}
                              onPress={() => handleDateChange(selectedDate.getDate(), selectedDate.getMonth(), year)}
                            >
                              <Text style={[
                                styles.dateText,
                                selectedDate.getFullYear() === year && styles.dateTextSelected
                              ]}>
                                {year}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <GradientButton
          title={isSaving ? "Saving..." : "Save Changes"}
          onPress={handleSaveChanges}
          gradientColors={[colors.gradientStart, colors.gradientEnd]}
          style={styles.saveButton}
          disabled={isSaving}
        />

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          disabled={isSaving}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
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
  datePickerButton: {
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  datePickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: SPACING.md,
  },
  dateTextContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: FONT_SIZE.xs,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: FONT_SIZE.md,
    color: colors.text,
    fontWeight: '500',
  },
  datePickerModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  datePickerContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.lg,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  datePickerCancel: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
  },
  datePickerTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: colors.text,
  },
  datePickerDone: {
    fontSize: FONT_SIZE.md,
    color: colors.primary,
    fontWeight: '600',
  },
  datePickerWheel: {
    height: 250,
    paddingVertical: SPACING.md,
  },
  datePickerRow: {
    flexDirection: 'row',
    flex: 1,
  },
  dateColumn: {
    flex: 1,
  },
  dateOption: {
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  dateText: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
  },
  dateTextSelected: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: FONT_SIZE.lg,
  },
});

export default EditProfileScreen;
