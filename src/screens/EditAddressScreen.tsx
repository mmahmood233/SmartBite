import React, { useState } from 'react';
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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../constants';
import { validateRequired, validatePhone } from '../utils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'EditAddress'>;

const ADDRESS_TYPES = ['Home', 'Work', 'Other'];

const EditAddressScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();

  // Pre-filled data from route params (mock data for now)
  const [addressTitle, setAddressTitle] = useState('Home');
  const [customTitle, setCustomTitle] = useState('');
  const [building, setBuilding] = useState('Building 227, Flat 21');
  const [road, setRoad] = useState('Road 15');
  const [block, setBlock] = useState('');
  const [area, setArea] = useState('Manama');
  const [contactNumber, setContactNumber] = useState('+973 3356 0803');
  const [notes, setNotes] = useState('');
  const [isDefault, setIsDefault] = useState(true);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleUpdateAddress = () => {
    // Validation
    if (!validateRequired(building)) {
      Alert.alert('Required Field', 'Please enter building/flat number');
      return;
    }
    if (!validateRequired(area)) {
      Alert.alert('Required Field', 'Please enter area');
      return;
    }
    if (!validatePhone(contactNumber)) {
      Alert.alert('Invalid Phone', 'Please enter a valid contact number');
      return;
    }

    // TODO: Update backend/state
    Alert.alert(
      'Success',
      '✅ Address updated successfully',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const handleDeleteAddress = () => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to remove this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', '🗑 Address removed', [
              {
                text: 'OK',
                onPress: () => navigation.goBack(),
              },
            ]);
          },
        },
      ]
    );
  };

  const handlePickLocation = () => {
    Alert.alert(
      'Pick Location',
      'Map integration will be implemented here',
      [{ text: 'OK' }]
    );
  };

  const renderInput = (
    icon: string,
    placeholder: string,
    value: string,
    onChangeText: (text: string) => void,
    multiline: boolean = false,
    keyboardType: 'default' | 'numeric' | 'phone-pad' = 'default'
  ) => (
    <View style={styles.inputContainer}>
      <View style={styles.inputIconContainer}>
        <Icon name={icon} size={18} color={colors.primary} />
      </View>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        keyboardType={keyboardType}
      />
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
        <Text style={styles.headerTitle}>Edit Address</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          {/* Address Title */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Address Title</Text>
            <View style={styles.addressTypeContainer}>
              {ADDRESS_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.addressTypeButton,
                    addressTitle === type && styles.addressTypeButtonActive,
                  ]}
                  onPress={() => {
                    setAddressTitle(type);
                    if (type !== 'Other') {
                      setCustomTitle('');
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Icon
                    name={type === 'Home' ? 'home' : type === 'Work' ? 'briefcase' : 'map-pin'}
                    size={16}
                    color={addressTitle === type ? '#FFFFFF' : colors.primary}
                  />
                  <Text
                    style={[
                      styles.addressTypeText,
                      addressTitle === type && styles.addressTypeTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Custom Title Input (shown when "Other" is selected) */}
            {addressTitle === 'Other' && (
              <View style={styles.customTitleContainer}>
                {renderInput('edit-2', 'Enter custom name (e.g., "Mom\'s House")', customTitle, setCustomTitle)}
              </View>
            )}
          </View>

          {/* Building / Flat No. */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Building / Flat No. *</Text>
            {renderInput('home', 'e.g. Building 227, Flat 21', building, setBuilding)}
          </View>

          {/* Road */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Road</Text>
            {renderInput('navigation', 'e.g. Road 15', road, setRoad)}
          </View>

          {/* Block */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Block</Text>
            {renderInput('grid', 'e.g. Block 304', block, setBlock)}
          </View>

          {/* Area */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Area *</Text>
            {renderInput('map-pin', 'e.g. Manama', area, setArea)}
          </View>

          {/* Contact Number */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Contact Number *</Text>
            {renderInput('phone', '+973 3356 0803', contactNumber, setContactNumber, false, 'phone-pad')}
          </View>

          {/* Additional Notes */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Additional Notes</Text>
            {renderInput('edit-3', 'Landmark, delivery instructions...', notes, setNotes, true)}
          </View>

          {/* Set as Default */}
          <TouchableOpacity
            style={styles.defaultToggle}
            onPress={() => setIsDefault(!isDefault)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, isDefault && styles.checkboxActive]}>
              {isDefault && <Icon name="check" size={14} color="#FFFFFF" />}
            </View>
            <Text style={styles.defaultToggleText}>Set as Default Address</Text>
          </TouchableOpacity>

          {/* Pick Location on Map */}
          <TouchableOpacity
            style={styles.mapButton}
            onPress={handlePickLocation}
            activeOpacity={0.7}
          >
            <Icon name="map-pin" size={20} color={colors.primary} />
            <Text style={styles.mapButtonText}>Pick Location on Map</Text>
            <Icon name="chevron-right" size={20} color="#94A3B8" />
          </TouchableOpacity>

          {/* Delete Address */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAddress}
            activeOpacity={0.7}
          >
            <Icon name="trash-2" size={18} color={colors.error} />
            <Text style={styles.deleteButtonText}>Delete Address</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>

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
          style={styles.saveButton}
          onPress={handleUpdateAddress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButtonGradient}
          >
            <Text style={styles.saveButtonText}>Update Address</Text>
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
  addressTypeContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  addressTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: SPACING.xs,
  },
  addressTypeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  addressTypeText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
    color: colors.primary,
  },
  addressTypeTextActive: {
    color: '#FFFFFF',
  },
  customTitleContainer: {
    marginTop: SPACING.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    marginTop: 2,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.base,
    color: '#0F172A',
    padding: 0,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  defaultToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    marginBottom: SPACING.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  defaultToggleText: {
    fontSize: FONT_SIZE.base,
    color: '#0F172A',
    fontWeight: '500',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E6E9EE',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  mapButtonText: {
    flex: 1,
    fontSize: FONT_SIZE.base,
    fontWeight: '500',
    color: colors.primary,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  deleteButtonText: {
    fontSize: FONT_SIZE.base,
    fontWeight: '600',
    color: colors.error,
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
  saveButton: {
    flex: 2,
  },
  saveButtonGradient: {
    paddingVertical: SPACING.lg,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: FONT_SIZE.base,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default EditAddressScreen;
