/**
 * Add/Edit Promotion Screen
 * Create and manage platform-wide promotions
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PartnerColors, PartnerSpacing, PartnerTypography } from '../../constants/partnerTheme';
import { useLanguage } from '../../contexts/LanguageContext';
import Snackbar, { SnackbarType } from '../../components/Snackbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { createPromotion, updatePromotion, Promotion } from '../../services/promotions.service';

type PromotionType = 'percentage' | 'fixed' | 'free_delivery';

interface PromotionFormData {
  title: string;
  description: string;
  type: PromotionType;
  discountValue: string;
  minOrderAmount: string;
  validFrom: string;
  validUntil: string;
  maxUsage: string;
  isActive: boolean;
}

const PROMOTION_TYPES = [
  { id: 'percentage' as PromotionType, label: 'Percentage Off', icon: 'percent', color: '#FF9500' },
  { id: 'fixed' as PromotionType, label: 'Fixed Amount', icon: 'dollar-sign', color: '#10B981' },
  { id: 'free_delivery' as PromotionType, label: 'Free Delivery', icon: 'truck', color: '#007AFF' },
];

const AddPromotionScreen: React.FC = () => {
  const { t } = useLanguage();
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as any;
  const editingPromotion = params?.promotion;
  const isEditMode = !!editingPromotion;

  const [formData, setFormData] = useState<PromotionFormData>({
    title: editingPromotion?.title || '',
    description: editingPromotion?.description || '',
    type: editingPromotion?.type || 'percentage',
    discountValue: editingPromotion?.discount_value?.toString() || '',
    minOrderAmount: editingPromotion?.min_order_amount?.toString() || '',
    validFrom: editingPromotion?.valid_from ? new Date(editingPromotion.valid_from).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    validUntil: editingPromotion?.valid_until ? new Date(editingPromotion.valid_until).toISOString().split('T')[0] : '',
    maxUsage: editingPromotion?.max_usage?.toString() || '',
    isActive: editingPromotion?.is_active ?? true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<SnackbarType>('success');

  const showSnackbar = (message: string, type: SnackbarType = 'success') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  const handleSave = async () => {
    // Validation
    if (!formData.title.trim()) {
      showSnackbar('Promotion title is required', 'error');
      return;
    }
    if (!formData.description.trim()) {
      showSnackbar('Description is required', 'error');
      return;
    }
    if (formData.type !== 'free_delivery' && !formData.discountValue.trim()) {
      showSnackbar('Discount value is required', 'error');
      return;
    }
    if (!formData.validUntil.trim()) {
      showSnackbar('Valid until date is required', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      const promotionData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        discount_value: formData.type === 'free_delivery' ? 0 : parseFloat(formData.discountValue) || 0,
        min_order_amount: parseFloat(formData.minOrderAmount) || 0,
        valid_from: formData.validFrom ? new Date(formData.validFrom).toISOString() : new Date().toISOString(),
        valid_until: new Date(formData.validUntil).toISOString(),
        max_usage: formData.maxUsage ? parseInt(formData.maxUsage) : null,
        is_active: formData.isActive,
      };

      if (isEditMode) {
        await updatePromotion(editingPromotion.id, promotionData);
        showSnackbar('Promotion updated successfully!', 'success');
      } else {
        await createPromotion(promotionData as any);
        showSnackbar('Promotion created successfully!', 'success');
      }
      
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      console.error('Error saving promotion:', error);
      showSnackbar('Failed to save promotion', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeConfig = (type: PromotionType) => {
    return PROMOTION_TYPES.find(t => t.id === type) || PROMOTION_TYPES[0];
  };

  const selectedTypeConfig = getTypeConfig(formData.type);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={PartnerColors.light.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditMode ? 'Edit Promotion' : 'Create Promotion'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Promotion Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROMOTION TYPE</Text>
          <View style={styles.typeGrid}>
            {PROMOTION_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeCard,
                  formData.type === type.id && styles.typeCardActive,
                ]}
                onPress={() => setFormData({ ...formData, type: type.id })}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.typeIcon,
                    {
                      backgroundColor: formData.type === type.id ? `${type.color}20` : '#F9FAFB',
                    },
                  ]}
                >
                  <Icon
                    name={type.icon as any}
                    size={24}
                    color={formData.type === type.id ? type.color : PartnerColors.light.text.tertiary}
                  />
                </View>
                <Text
                  style={[
                    styles.typeLabel,
                    formData.type === type.id && { color: type.color },
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BASIC INFORMATION</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Promotion Title *</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="e.g., Weekend Special"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Describe the promotion..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Discount Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DISCOUNT DETAILS</Text>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>
                {formData.type === 'percentage' ? 'Percentage (%)' : 'Amount (BD)'} *
              </Text>
              <TextInput
                style={styles.input}
                value={formData.discountValue}
                onChangeText={(text) => setFormData({ ...formData, discountValue: text })}
                placeholder={formData.type === 'percentage' ? '20' : '5'}
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Min Order (BD)</Text>
              <TextInput
                style={styles.input}
                value={formData.minOrderAmount}
                onChangeText={(text) => setFormData({ ...formData, minOrderAmount: text })}
                placeholder="10"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Max Usage (Optional)</Text>
            <TextInput
              style={styles.input}
              value={formData.maxUsage}
              onChangeText={(text) => setFormData({ ...formData, maxUsage: text })}
              placeholder="e.g., 100 (leave empty for unlimited)"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
            />
          </View>
        </View>

        {/* Validity Period */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>VALIDITY PERIOD</Text>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Valid From</Text>
              <TextInput
                style={styles.input}
                value={formData.validFrom}
                onChangeText={(text) => setFormData({ ...formData, validFrom: text })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
              />
              <Text style={styles.helperText}>Format: YYYY-MM-DD (e.g., 2024-12-01)</Text>
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Valid Until *</Text>
              <TextInput
                style={styles.input}
                value={formData.validUntil}
                onChangeText={(text) => setFormData({ ...formData, validUntil: text })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
              />
              <Text style={styles.helperText}>Format: YYYY-MM-DD (e.g., 2024-12-31)</Text>
            </View>
          </View>
        </View>

        {/* Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>STATUS</Text>
          <TouchableOpacity
            style={styles.statusToggle}
            onPress={() => setFormData({ ...formData, isActive: !formData.isActive })}
            activeOpacity={0.7}
          >
            <View style={styles.statusToggleLeft}>
              <View
                style={[
                  styles.statusIcon,
                  { backgroundColor: formData.isActive ? '#ECFDF5' : '#FEE2E2' },
                ]}
              >
                <Icon
                  name={formData.isActive ? 'check-circle' : 'x-circle'}
                  size={20}
                  color={formData.isActive ? '#10B981' : '#EF4444'}
                />
              </View>
              <View>
                <Text style={styles.statusToggleTitle}>
                  {formData.isActive ? 'Active' : 'Inactive'}
                </Text>
                <Text style={styles.statusToggleSubtitle}>
                  {formData.isActive
                    ? 'Promotion will be visible to users'
                    : 'Promotion will be hidden from users'}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.toggleSwitch,
                formData.isActive && styles.toggleSwitchActive,
              ]}
            >
              <View
                style={[
                  styles.toggleKnob,
                  formData.isActive && styles.toggleKnobActive,
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Preview Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREVIEW</Text>
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <View
                style={[
                  styles.previewIcon,
                  { backgroundColor: `${selectedTypeConfig.color}15` },
                ]}
              >
                <Icon
                  name={selectedTypeConfig.icon as any}
                  size={20}
                  color={selectedTypeConfig.color}
                />
              </View>
            </View>
            <Text style={styles.previewTitle}>
              {formData.title || 'Promotion Title'}
            </Text>
            <Text style={styles.previewDescription}>
              {formData.description || 'Promotion description will appear here'}
            </Text>
            <View style={styles.previewDetails}>
              <View style={styles.previewDetailItem}>
                <Icon name="gift" size={14} color={PartnerColors.light.text.tertiary} />
                <Text style={styles.previewDetailText}>
                  {formData.discountValue
                    ? formData.type === 'percentage'
                      ? `${formData.discountValue}% off`
                      : `BD ${formData.discountValue} off`
                    : 'Discount'}
                </Text>
              </View>
              <View style={styles.previewDetailItem}>
                <Icon name="calendar" size={14} color={PartnerColors.light.text.tertiary} />
                <Text style={styles.previewDetailText}>
                  {formData.validUntil || 'Valid until'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButtonWrapper}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[PartnerColors.primary, PartnerColors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButton}
          >
            <Icon name="check-circle" size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>
              {isEditMode ? 'Update Promotion' : 'Create Promotion'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Snackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        type={snackbarType}
        onDismiss={() => setSnackbarVisible(false)}
      />

      <LoadingSpinner
        visible={isLoading}
        message={isEditMode ? "Updating promotion..." : "Creating promotion..."}
        overlay
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: PartnerTypography.fontSize.xl,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: PartnerColors.light.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: PartnerSpacing.xl,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: PartnerColors.light.text.secondary,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  typeCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: PartnerSpacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: PartnerColors.light.borderLight,
  },
  typeCardActive: {
    borderColor: PartnerColors.primary,
    backgroundColor: `${PartnerColors.primary}05`,
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: PartnerColors.light.text.secondary,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: PartnerSpacing.lg,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: PartnerColors.light.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: PartnerSpacing.md,
    paddingVertical: 14,
    fontSize: 16,
    color: PartnerColors.light.text.primary,
    borderWidth: 1,
    borderColor: PartnerColors.light.borderLight,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statusToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: PartnerSpacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PartnerColors.light.borderLight,
  },
  statusToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusToggleTitle: {
    fontSize: 16,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: PartnerColors.light.text.primary,
  },
  statusToggleSubtitle: {
    fontSize: 13,
    color: PartnerColors.light.text.tertiary,
    marginTop: 2,
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    padding: 2,
  },
  toggleSwitchActive: {
    backgroundColor: PartnerColors.primary,
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  toggleKnobActive: {
    transform: [{ translateX: 22 }],
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: PartnerSpacing.lg,
    borderWidth: 1,
    borderColor: PartnerColors.light.borderLight,
  },
  previewHeader: {
    marginBottom: 12,
  },
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: PartnerColors.light.text.primary,
    marginBottom: 6,
  },
  previewDescription: {
    fontSize: 14,
    color: PartnerColors.light.text.secondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  previewDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  previewDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  previewDetailText: {
    fontSize: 13,
    color: PartnerColors.light.text.tertiary,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: PartnerSpacing.xl,
    paddingVertical: PartnerSpacing.lg,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: PartnerColors.light.borderLight,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: PartnerColors.light.text.secondary,
  },
  saveButtonWrapper: {
    flex: 2,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: '#FFFFFF',
  },
  helperText: {
    fontSize: 12,
    color: PartnerColors.light.text.tertiary,
    marginTop: 4,
  },
});

export default AddPromotionScreen;
