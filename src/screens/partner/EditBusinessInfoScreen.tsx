/**
 * Edit Business Info Modal
 * Allows restaurant owners to update business information and operational settings
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Modal,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PartnerColors, PartnerSpacing, PartnerBorderRadius, PartnerTypography } from '../../constants/partnerTheme';
import Snackbar, { SnackbarType } from '../../components/Snackbar';
import LoadingSpinner from '../../components/LoadingSpinner';

interface EditBusinessInfoModalProps {
  visible: boolean;
  onClose: () => void;
  businessData: {
    name: string;
    category: string;
    description: string;
    logo: any;
    isOpen: boolean;
    status?: 'open' | 'closed' | 'busy';
    avgPrepTime: string;
    contactNumber: string;
    address: string;
    rating: number;
    earnings: string;
  };
  onSave: (data: any) => void;
}

const CATEGORIES = [
  'Burgers & Sandwiches',
  'Pizza & Italian',
  'Arabic & Middle Eastern',
  'Asian Cuisine',
  'Healthy & Salads',
  'Desserts & Sweets',
  'Coffee & Beverages',
];

const STATUS_OPTIONS = [
  { id: 'open', label: 'Open', icon: 'check-circle' as const, color: '#10B981' },
  { id: 'closed', label: 'Closed', icon: 'x-circle' as const, color: '#EF4444' },
  { id: 'busy', label: 'Busy', icon: 'alert-circle' as const, color: '#F59E0B' },
];

const EditBusinessInfoModal: React.FC<EditBusinessInfoModalProps> = ({
  visible,
  onClose,
  businessData,
  onSave,
}) => {
  const [name, setName] = useState(businessData.name);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    businessData.category.split(' • ')
  );
  const [description, setDescription] = useState(businessData.description);
  const [status, setStatus] = useState(businessData.isOpen ? 'open' : 'closed');
  const [avgPrepTime, setAvgPrepTime] = useState(businessData.avgPrepTime);
  const [contactNumber, setContactNumber] = useState(businessData.contactNumber);
  const [address, setAddress] = useState(businessData.address);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  
  // Snackbar state
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<SnackbarType>('success');
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  const showSnackbar = (message: string, type: SnackbarType = 'success') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showSnackbar('Restaurant name is required', 'error');
      return;
    }
    if (selectedCategories.length === 0) {
      showSnackbar('Please select at least one category', 'error');
      return;
    }
    if (!contactNumber.trim()) {
      showSnackbar('Contact number is required', 'error');
      return;
    }
    if (!address.trim()) {
      showSnackbar('Address is required', 'error');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const updatedData = {
      name,
      category: selectedCategories.join(' • '),
      description,
      isOpen: status === 'open',
      status,
      avgPrepTime,
      contactNumber,
      address,
    };

    onSave(updatedData);
    setIsLoading(false);
    showSnackbar('Business information updated successfully!', 'success');
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.fullPageContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={PartnerColors.light.text.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Business Info</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Section 1: Basic Information */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="info" size={18} color={PartnerColors.light.text.secondary} />
                <Text style={styles.sectionTitle}>BASIC INFORMATION</Text>
              </View>

              {/* Restaurant Name */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Restaurant Name</Text>
                <View style={styles.inputContainer}>
                  <Icon name="home" size={18} color={PartnerColors.light.text.secondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter restaurant name"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              {/* Category - Multi-select */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Categories (Select multiple)</Text>
                <TouchableOpacity
                  style={styles.dropdownContainer}
                  onPress={() => setShowCategoryPicker(true)}
                >
                  <Icon name="grid" size={18} color={PartnerColors.light.text.secondary} style={styles.inputIcon} />
                  <Text style={styles.dropdownText}>
                    {selectedCategories.length > 0 
                      ? selectedCategories.join(' • ') 
                      : 'Select categories'}
                  </Text>
                  <Icon name="chevron-down" size={18} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              {/* Description */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Description</Text>
                <View style={[styles.inputContainer, styles.textAreaContainer]}>
                  <Icon name="file-text" size={18} color={PartnerColors.light.text.secondary} style={[styles.inputIcon, styles.textAreaIcon]} />
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Describe your restaurant..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    numberOfLines={4}
                  />
                </View>
              </View>

              {/* Logo Upload */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Logo / Banner</Text>
                <TouchableOpacity style={styles.uploadContainer}>
                  <Image source={businessData.logo} style={styles.logoPreview} />
                  <View style={styles.uploadOverlay}>
                    <Icon name="camera" size={24} color="#FFFFFF" />
                    <Text style={styles.uploadText}>Change Image</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Section 2: Operating Details */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="clock" size={18} color={PartnerColors.light.text.secondary} />
                <Text style={styles.sectionTitle}>OPERATING DETAILS</Text>
              </View>

              {/* Status Options */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Status</Text>
                <View style={styles.statusOptionsContainer}>
                  {STATUS_OPTIONS.map((option) => {
                    const isSelected = status === option.id;
                    return (
                      <TouchableOpacity
                        key={option.id}
                        style={[
                          styles.statusOption,
                          isSelected && { ...styles.statusOptionSelected, borderColor: option.color }
                        ]}
                        onPress={() => setStatus(option.id)}
                        activeOpacity={0.7}
                      >
                        <Icon
                          name={option.icon}
                          size={20}
                          color={isSelected ? option.color : '#94A3B8'}
                        />
                        <Text style={[
                          styles.statusOptionText,
                          isSelected && { ...styles.statusOptionTextSelected, color: option.color }
                        ]}>
                          {option.label}
                        </Text>
                        {isSelected && (
                          <Icon name="check-circle" size={18} color={option.color} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Average Prep Time */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Average Prep Time</Text>
                <View style={styles.inputContainer}>
                  <Icon name="clock" size={18} color={PartnerColors.light.text.secondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={avgPrepTime}
                    onChangeText={setAvgPrepTime}
                    placeholder="e.g., 20-25 min"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              {/* Contact Number */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Contact Number</Text>
                <View style={styles.inputContainer}>
                  <Icon name="phone" size={18} color={PartnerColors.light.text.secondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={contactNumber}
                    onChangeText={setContactNumber}
                    placeholder="+973 3999 8888"
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Address */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Address</Text>
                <View style={styles.inputContainer}>
                  <Icon name="map-pin" size={18} color={PartnerColors.light.text.secondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Seef Mall, Manama"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>
            </View>

            {/* Section 3: Financial / Insights (Read-only) */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="trending-up" size={18} color={PartnerColors.light.text.secondary} />
                <Text style={styles.sectionTitle}>FINANCIAL & INSIGHTS</Text>
              </View>

              {/* Rating */}
              <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <Icon name="star" size={18} color="#FFA500" />
                  <Text style={styles.infoLabel}>Rating</Text>
                </View>
                <Text style={styles.infoValue}>⭐ {businessData.rating.toFixed(1)}</Text>
              </View>

              {/* Earnings */}
              <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <Icon name="trending-up" size={18} color={PartnerColors.success} />
                  <Text style={styles.infoLabel}>Earnings (Last 7 days)</Text>
                </View>
                <Text style={[styles.infoValue, styles.earningsValue]}>{businessData.earnings}</Text>
              </View>
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>

        {/* Save Button */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleSave} activeOpacity={0.8}>
            <LinearGradient
              colors={[PartnerColors.primary, PartnerColors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveButton}
            >
              <Icon name="check-circle" size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Category Picker Modal */}
        <Modal
          visible={showCategoryPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCategoryPicker(false)}
        >
          <TouchableOpacity
            style={styles.pickerOverlay}
            activeOpacity={1}
            onPress={() => setShowCategoryPicker(false)}
          >
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Select Categories</Text>
                <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
                  <Text style={styles.pickerDone}>Done</Text>
                </TouchableOpacity>
              </View>
              <ScrollView>
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.pickerOption, isSelected && styles.pickerOptionSelected]}
                      onPress={() => toggleCategory(cat)}
                    >
                      <Text style={[styles.pickerOptionText, isSelected && styles.pickerOptionTextSelected]}>
                        {cat}
                      </Text>
                      {isSelected && (
                        <Icon name="check" size={18} color={PartnerColors.primary} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Snackbar */}
        <Snackbar
          visible={snackbarVisible}
          message={snackbarMessage}
          type={snackbarType}
          onDismiss={() => setSnackbarVisible(false)}
        />

        {/* Loading Spinner */}
        <LoadingSpinner
          visible={isLoading}
          message="Saving changes..."
          overlay
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullPageContainer: {
    flex: 1,
    backgroundColor: PartnerColors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PartnerSpacing.lg,
    paddingTop: Platform.OS === 'ios' ? 50 : PartnerSpacing.lg,
    paddingBottom: PartnerSpacing.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: PartnerColors.light.borderLight,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: PartnerTypography.fontSize.xl,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: PartnerColors.light.text.primary,
  },
  scrollContent: {
    paddingHorizontal: PartnerSpacing.xl,
  },
  section: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 0.5,
    borderTopColor: PartnerColors.light.borderLight,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: PartnerSpacing.sm,
    marginBottom: PartnerSpacing.lg,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: PartnerColors.light.text.secondary,
    letterSpacing: 0.3,
  },
  fieldGroup: {
    marginBottom: PartnerSpacing.lg,
  },
  label: {
    fontSize: PartnerTypography.fontSize.sm,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: PartnerColors.light.text.primary,
    marginBottom: PartnerSpacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: PartnerSpacing.md,
    paddingVertical: Platform.OS === 'ios' ? PartnerSpacing.md : 0,
    borderWidth: 1,
    borderColor: PartnerColors.light.borderLight,
  },
  inputIcon: {
    marginRight: PartnerSpacing.sm,
  },
  input: {
    flex: 1,
    fontSize: PartnerTypography.fontSize.base,
    color: PartnerColors.light.text.primary,
    paddingVertical: Platform.OS === 'android' ? PartnerSpacing.sm : 0,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingVertical: PartnerSpacing.md,
  },
  textAreaIcon: {
    marginTop: 2,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: PartnerSpacing.md,
    paddingVertical: PartnerSpacing.md,
    borderWidth: 1,
    borderColor: PartnerColors.light.borderLight,
  },
  dropdownText: {
    flex: 1,
    fontSize: PartnerTypography.fontSize.base,
    color: PartnerColors.light.text.primary,
    marginLeft: PartnerSpacing.sm,
  },
  uploadContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    height: 120,
    borderWidth: 1,
    borderColor: PartnerColors.light.borderLight,
  },
  logoPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: PartnerSpacing.xs,
  },
  uploadText: {
    color: '#FFFFFF',
    fontSize: PartnerTypography.fontSize.sm,
    fontWeight: PartnerTypography.fontWeight.medium,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: PartnerColors.light.surface,
    borderRadius: PartnerBorderRadius.md,
    paddingHorizontal: PartnerSpacing.md,
    paddingVertical: PartnerSpacing.md,
    borderWidth: 1,
    borderColor: PartnerColors.light.borderLight,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: PartnerSpacing.sm,
  },
  toggleRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: PartnerSpacing.md,
  },
  // Status Options
  statusOptionsContainer: {
    gap: PartnerSpacing.sm,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: PartnerSpacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: PartnerSpacing.md,
    paddingVertical: PartnerSpacing.md,
    borderWidth: 1.5,
    borderColor: PartnerColors.light.borderLight,
  },
  statusOptionSelected: {
    backgroundColor: `${PartnerColors.primary}08`,
    borderWidth: 1.5,
  },
  statusOptionText: {
    flex: 1,
    fontSize: PartnerTypography.fontSize.base,
    color: '#6B7280',
    fontWeight: PartnerTypography.fontWeight.medium,
  },
  statusOptionTextSelected: {
    fontWeight: PartnerTypography.fontWeight.semibold,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: PartnerSpacing.md,
    paddingVertical: PartnerSpacing.md,
    marginBottom: PartnerSpacing.sm,
    borderWidth: 1,
    borderColor: PartnerColors.light.borderLight,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: PartnerSpacing.sm,
  },
  infoLabel: {
    fontSize: PartnerTypography.fontSize.base,
    color: PartnerColors.light.text.secondary,
  },
  infoValue: {
    fontSize: PartnerTypography.fontSize.base,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: PartnerColors.light.text.primary,
  },
  earningsValue: {
    color: PartnerColors.success,
  },
  footer: {
    paddingHorizontal: PartnerSpacing.xl,
    paddingVertical: PartnerSpacing.lg,
    borderTopWidth: 1,
    borderTopColor: PartnerColors.light.borderLight,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: PartnerSpacing.sm,
    paddingVertical: 14,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: PartnerColors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  saveButtonText: {
    fontSize: PartnerTypography.fontSize.lg,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: '#FFFFFF',
  },
  // Category Picker
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: PartnerSpacing.xl,
  },
  pickerContainer: {
    backgroundColor: PartnerColors.light.surface,
    borderRadius: PartnerBorderRadius.xl,
    width: '100%',
    maxHeight: '60%',
    padding: PartnerSpacing.lg,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: PartnerSpacing.md,
  },
  pickerTitle: {
    fontSize: PartnerTypography.fontSize.xl,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: PartnerColors.light.text.primary,
  },
  pickerDone: {
    fontSize: PartnerTypography.fontSize.base,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: PartnerColors.primary,
  },
  pickerOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: PartnerSpacing.md,
    paddingHorizontal: PartnerSpacing.md,
    borderRadius: PartnerBorderRadius.md,
    marginBottom: PartnerSpacing.xs,
  },
  pickerOptionSelected: {
    backgroundColor: `${PartnerColors.primary}10`,
  },
  pickerOptionText: {
    fontSize: PartnerTypography.fontSize.base,
    color: PartnerColors.light.text.primary,
  },
  pickerOptionTextSelected: {
    color: PartnerColors.primary,
    fontWeight: PartnerTypography.fontWeight.semibold,
  },
});

export default EditBusinessInfoModal;
