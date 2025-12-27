/**
 * Edit Business Info Modal
 * Allows restaurant owners to update business information and operational settings
 */// @ts-nocheck


import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { PartnerColors, PartnerSpacing, PartnerBorderRadius, PartnerTypography } from '../../constants/partnerTheme';
import Snackbar, { SnackbarType } from '../../components/Snackbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import { getActiveCategories, Category } from '../../services/categories.service';

interface EditBusinessInfoModalProps {
  visible: boolean;
  onClose: () => void;
  restaurantId: string | null;
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

// Categories now loaded from database

const EditBusinessInfoModal: React.FC<EditBusinessInfoModalProps> = ({
  visible,
  onClose,
  restaurantId,
  businessData,
  onSave,
}) => {
  const { t } = useLanguage();
  
  // Status options with translated labels
  const STATUS_OPTIONS = [
    { id: 'open', label: t('partner.open'), icon: 'check-circle' as const, color: '#10B981' },
    { id: 'closed', label: t('partner.closed'), icon: 'x-circle' as const, color: '#EF4444' },
    { id: 'busy', label: t('partner.busy'), icon: 'alert-circle' as const, color: '#F59E0B' },
  ];
  
  const [name, setName] = useState(businessData.name);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    businessData.category.split(' • ')
  );
  const [description, setDescription] = useState(businessData.description);
  const [status, setStatus] = useState(businessData.status || 'closed');
  const [avgPrepTime, setAvgPrepTime] = useState(businessData.avgPrepTime);
  const [contactNumber, setContactNumber] = useState(businessData.contactNumber);
  const [address, setAddress] = useState(businessData.address);
  const [openingTime, setOpeningTime] = useState('09:00');
  const [closingTime, setClosingTime] = useState('22:00');
  const [autoStatusUpdate, setAutoStatusUpdate] = useState(true);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [logoUri, setLogoUri] = useState<string | null>(businessData.logo);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
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

  // Load categories from database with real-time updates
  useEffect(() => {
    loadCategories();

    // Subscribe to real-time category changes
    const categorySubscription = supabase
      .channel('partner-category-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'restaurant_categories',
        },
        () => {
          // Reload categories when they change
          loadCategories();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(categorySubscription);
    };
  }, []);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await getActiveCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const pickLogo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setUploadingLogo(true);
        const asset = result.assets[0];
        
        // Upload to Supabase Storage
        const fileExt = asset.uri.split('.').pop();
        const fileName = `${restaurantId}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const formData = new FormData();
        formData.append('file', {
          uri: asset.uri,
          type: `image/${fileExt}`,
          name: fileName,
        } as any);

        const { data, error } = await supabase.storage
          .from('restaurant-images')
          .upload(filePath, formData, {
            contentType: `image/${fileExt}`,
            upsert: true,
          });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('restaurant-images')
          .getPublicUrl(filePath);

        setLogoUri(publicUrl);
        showSnackbar(t('partner.logoUploadedSuccess'), 'success');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      showSnackbar(t('partner.failedToUploadLogo'), 'error');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showSnackbar(t('partner.restaurantNameRequired'), 'error');
      return;
    }
    if (selectedCategories.length === 0) {
      showSnackbar(t('partner.selectAtLeastOneCategory'), 'error');
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

    // Validate operating hours
    if (openingTime === closingTime) {
      showSnackbar('Opening and closing times must be different', 'error');
      return;
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(openingTime)) {
      showSnackbar('Invalid opening time format. Use HH:MM (e.g., 09:00)', 'error');
      return;
    }
    if (!timeRegex.test(closingTime)) {
      showSnackbar('Invalid closing time format. Use HH:MM (e.g., 22:00)', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      if (!restaurantId) {
        throw new Error('Restaurant ID is missing');
      }

      // Update restaurant in database
      // @ts-ignore - Supabase types
      const { error } = await supabase
        .from('restaurants')
        .update({
          category: selectedCategories.join(' • '),
          description,
          status: status as 'open' | 'closed' | 'busy',
          phone: contactNumber,
          address,
          opening_time: openingTime,
          closing_time: closingTime,
          auto_status_update: autoStatusUpdate,
          logo: logoUri,
          updated_at: new Date().toISOString(),
        })
        .eq('id', restaurantId);

      if (error) throw error;

      const updatedData = {
        name,
        category: selectedCategories.join(' • '),
        description,
        isOpen: status === 'open',
        status,
        avgPrepTime,
        contactNumber,
        address,
        openingTime,
        closingTime,
        autoStatusUpdate,
        logo: logoUri,
      };

      onSave(updatedData);
      showSnackbar(t('partner.changesSavedSuccess'), 'success');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error('Error saving business info:', error);
      showSnackbar(error.message || t('partner.failedToSaveChanges'), 'error');
    } finally {
      setIsLoading(false);
    }
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
          <Text style={styles.title}>{t('partner.editBusinessInfo')}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Section 1: Basic Information */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="info" size={18} color={PartnerColors.light.text.secondary} />
                <Text style={styles.sectionTitle}>{t('partner.basicInformation')}</Text>
              </View>

              {/* Restaurant Name - Read Only */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>{t('partner.restaurantName')}</Text>
                <View style={[styles.inputContainer, styles.readOnlyContainer]}>
                  <Icon name="home" size={18} color={PartnerColors.light.text.secondary} style={styles.inputIcon} />
                  <Text style={styles.readOnlyText}>{name}</Text>
                </View>
                <Text style={styles.helperText}>{t('partner.restaurantNameCannotChange')}</Text>
              </View>

              {/* Category - Multi-select */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>{t('partner.categoriesSelectMultiple')}</Text>
                <TouchableOpacity
                  style={styles.dropdownContainer}
                  onPress={() => setShowCategoryPicker(true)}
                >
                  <Icon name="grid" size={18} color={PartnerColors.light.text.secondary} style={styles.inputIcon} />
                  <Text style={styles.dropdownText}>
                    {selectedCategories.length > 0 
                      ? selectedCategories.join(' • ') 
                      : t('partner.selectCategories')}
                  </Text>
                  <Icon name="chevron-down" size={18} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              {/* Description */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>{t('partner.descriptionLabel')}</Text>
                <View style={[styles.inputContainer, styles.textAreaContainer]}>
                  <Icon name="file-text" size={18} color={PartnerColors.light.text.secondary} style={[styles.inputIcon, styles.textAreaIcon]} />
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder={t('partner.descriptionPlaceholder')}
                    placeholderTextColor="#94A3B8"
                    multiline
                    numberOfLines={4}
                  />
                </View>
              </View>

              {/* Logo Upload */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>{t('partner.logoBanner')}</Text>
                <TouchableOpacity 
                  style={styles.uploadContainer} 
                  onPress={pickLogo}
                  disabled={uploadingLogo}
                >
                  {logoUri ? (
                    <Image source={{ uri: logoUri }} style={styles.logoPreview} />
                  ) : (
                    <View style={styles.logoPlaceholder}>
                      <Icon name="image" size={40} color={PartnerColors.light.text.tertiary} />
                      <Text style={styles.placeholderText}>{t('partner.noLogoUploaded')}</Text>
                    </View>
                  )}
                  <View style={styles.uploadOverlay}>
                    {uploadingLogo ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <Icon name="camera" size={24} color="#FFFFFF" />
                        <Text style={styles.uploadText}>{logoUri ? t('partner.changeImage') : t('partner.uploadLogo')}</Text>
                      </>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Section 2: Operating Details */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="clock" size={18} color={PartnerColors.light.text.secondary} />
                <Text style={styles.sectionTitle}>{t('partner.operatingDetails')}</Text>
              </View>

              {/* Status Options */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>{t('partner.status')}</Text>
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

              {/* Contact Number */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>{t('partner.contactNumber')}</Text>
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
                <Text style={styles.label}>{t('partner.address')}</Text>
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

              {/* Operating Hours */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>{t('partner.operatingHours')}</Text>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.label, { fontSize: 12, marginBottom: 6 }]}>{t('partner.openingTime')}</Text>
                    <View style={styles.inputContainer}>
                      <Icon name="clock" size={18} color={PartnerColors.light.text.secondary} style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        value={openingTime}
                        onChangeText={setOpeningTime}
                        placeholder="09:00"
                        placeholderTextColor="#94A3B8"
                      />
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.label, { fontSize: 12, marginBottom: 6 }]}>{t('partner.closingTime')}</Text>
                    <View style={styles.inputContainer}>
                      <Icon name="clock" size={18} color={PartnerColors.light.text.secondary} style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        value={closingTime}
                        onChangeText={setClosingTime}
                        placeholder="22:00"
                        placeholderTextColor="#94A3B8"
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* Auto Status Update Toggle */}
              <View style={styles.fieldGroup}>
                <View style={styles.toggleRow}>
                  <View>
                    <Text style={styles.label}>{t('partner.autoStatusUpdates')}</Text>
                    <Text style={styles.helperText}>{t('partner.autoStatusDesc')}</Text>
                  </View>
                  <Switch
                    value={autoStatusUpdate}
                    onValueChange={setAutoStatusUpdate}
                    trackColor={{ false: '#E0E0E0', true: PartnerColors.primary }}
                    thumbColor={autoStatusUpdate ? '#FFFFFF' : '#F5F5F5'}
                    ios_backgroundColor="#E0E0E0"
                  />
                </View>
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
              <Text style={styles.saveButtonText}>{t('partner.saveChanges')}</Text>
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
                <Text style={styles.pickerTitle}>{t('partner.selectCategoriesTitle')}</Text>
                <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
                  <Text style={styles.pickerDone}>Done</Text>
                </TouchableOpacity>
              </View>
              <ScrollView>
                {loadingCategories ? (
                  <ActivityIndicator size="large" color={PartnerColors.primary} style={{ marginTop: 20 }} />
                ) : (
                  categories.map((cat) => {
                    const isSelected = selectedCategories.includes(cat.name);
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        style={[styles.pickerOption, isSelected && styles.pickerOptionSelected]}
                        onPress={() => toggleCategory(cat.name)}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {cat.icon && <Text style={{ fontSize: 20, marginRight: 8 }}>{cat.icon}</Text>}
                        <Text style={[styles.pickerOptionText, isSelected && styles.pickerOptionTextSelected]}>
                          {cat.name}
                        </Text>
                      </View>
                      {isSelected && (
                        <Icon name="check" size={18} color={PartnerColors.primary} />
                      )}
                    </TouchableOpacity>
                  );
                })
              )}
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
  readOnlyContainer: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  readOnlyText: {
    flex: 1,
    fontSize: PartnerTypography.fontSize.base,
    color: PartnerColors.light.text.secondary,
    paddingVertical: PartnerSpacing.sm,
  },
  helperText: {
    fontSize: PartnerTypography.fontSize.xs,
    color: PartnerColors.light.text.tertiary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  logoPlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  placeholderText: {
    fontSize: PartnerTypography.fontSize.sm,
    color: PartnerColors.light.text.tertiary,
    marginTop: 8,
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
