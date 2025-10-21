/**
 * Restaurants Management Screen
 * Add, view, edit, and manage all restaurants on the platform
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { PartnerColors, PartnerSpacing, PartnerBorderRadius, PartnerTypography } from '../../constants/partnerTheme';
import Snackbar, { SnackbarType } from '../../components/Snackbar';
import LoadingSpinner from '../../components/LoadingSpinner';

// Types
interface Restaurant {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  logo: any;
  isActive: boolean;
  deliveryFee: number;
  minOrder: number;
  avgPrepTime: string;
  rating: number;
  totalOrders: number;
}

// Mock Data
const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'Burger Palace',
    category: 'Burgers',
    description: 'Best burgers in town',
    address: 'Building 123, Road 456, Manama',
    phone: '+973 3999 8888',
    email: 'contact@burgerpalace.com',
    logo: require('../../../assets/food.png'),
    isActive: true,
    deliveryFee: 1.5,
    minOrder: 5,
    avgPrepTime: '25-30 min',
    rating: 4.5,
    totalOrders: 1250,
  },
  {
    id: '2',
    name: 'Pizza Corner',
    category: 'Pizza',
    description: 'Authentic Italian pizza',
    address: 'Building 789, Road 101, Riffa',
    phone: '+973 3888 7777',
    email: 'info@pizzacorner.com',
    logo: require('../../../assets/food.png'),
    isActive: true,
    deliveryFee: 2.0,
    minOrder: 8,
    avgPrepTime: '30-35 min',
    rating: 4.7,
    totalOrders: 890,
  },
  {
    id: '3',
    name: 'Sushi House',
    category: 'Sushi',
    description: 'Fresh sushi daily',
    address: 'Building 456, Road 789, Muharraq',
    phone: '+973 3777 6666',
    email: 'hello@sushihouse.com',
    logo: require('../../../assets/food.png'),
    isActive: false,
    deliveryFee: 2.5,
    minOrder: 10,
    avgPrepTime: '35-40 min',
    rating: 4.3,
    totalOrders: 567,
  },
];

const RestaurantsManagementScreen: React.FC = () => {
  // State
  const [restaurants, setRestaurants] = useState<Restaurant[]>(MOCK_RESTAURANTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    deliveryFee: '',
    minOrder: '',
    avgPrepTime: '',
    imageUri: '',
    latitude: '',
    longitude: '',
  });
  
  // Snackbar
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<SnackbarType>('success');
  
  // Loading
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const showSnackbar = (message: string, type: SnackbarType = 'success') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  // Image Picker Handler
  const handlePickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      showSnackbar('Permission to access gallery is required!', 'error');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFormData({ ...formData, imageUri: result.assets[0].uri });
      showSnackbar('Logo selected successfully!', 'success');
    }
  };

  // Map Picker Handler (Mock for now)
  const handleSelectLocation = () => {
    // Mock coordinates for Bahrain
    const mockLat = '26.0667';
    const mockLng = '50.5577';
    
    setFormData({ 
      ...formData, 
      latitude: mockLat, 
      longitude: mockLng 
    });
    showSnackbar('Location selected: Manama, Bahrain', 'success');
  };

  // Action Handlers
  const handleToggleStatus = async (id: string) => {
    const restaurant = restaurants.find(r => r.id === id);
    if (!restaurant) return;

    setIsLoading(true);
    setLoadingMessage(restaurant.isActive ? 'Deactivating...' : 'Activating...');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setRestaurants(prev =>
      prev.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r)
    );
    
    setIsLoading(false);
    showSnackbar(
      `${restaurant.name} ${restaurant.isActive ? 'deactivated' : 'activated'}`,
      'info'
    );
  };

  const handleEdit = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setFormData({
      name: restaurant.name,
      category: restaurant.category,
      description: restaurant.description,
      address: restaurant.address,
      phone: restaurant.phone,
      email: restaurant.email,
      deliveryFee: restaurant.deliveryFee.toString(),
      minOrder: restaurant.minOrder.toString(),
      avgPrepTime: restaurant.avgPrepTime,
      imageUri: '',
      latitude: '',
      longitude: '',
    });
    setShowAddModal(true);
  };

  const handleAddNew = () => {
    setEditingRestaurant(null);
    setFormData({
      name: '',
      category: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      deliveryFee: '',
      minOrder: '',
      avgPrepTime: '',
      imageUri: '',
      latitude: '',
      longitude: '',
    });
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingRestaurant(null);
    setFormData({
      name: '',
      category: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      deliveryFee: '',
      minOrder: '',
      avgPrepTime: '',
      imageUri: '',
      latitude: '',
      longitude: '',
    });
  };

  const handleSaveRestaurant = async () => {
    // Validation
    if (!formData.name.trim()) {
      showSnackbar('Restaurant name is required', 'error');
      return;
    }
    if (!formData.category.trim()) {
      showSnackbar('Category is required', 'error');
      return;
    }
    if (!formData.phone.trim()) {
      showSnackbar('Phone number is required', 'error');
      return;
    }

    setIsLoading(true);
    setLoadingMessage(editingRestaurant ? 'Updating restaurant...' : 'Adding restaurant...');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (editingRestaurant) {
      // Update existing
      setRestaurants(prev =>
        prev.map(r =>
          r.id === editingRestaurant.id
            ? {
                ...r,
                name: formData.name,
                category: formData.category,
                description: formData.description,
                address: formData.address,
                phone: formData.phone,
                email: formData.email,
                deliveryFee: parseFloat(formData.deliveryFee) || 0,
                minOrder: parseFloat(formData.minOrder) || 0,
                avgPrepTime: formData.avgPrepTime,
              }
            : r
        )
      );
      showSnackbar('Restaurant updated successfully!', 'success');
    } else {
      // Add new
      const newRestaurant: Restaurant = {
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category,
        description: formData.description,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        logo: require('../../../assets/food.png'),
        isActive: true,
        deliveryFee: parseFloat(formData.deliveryFee) || 0,
        minOrder: parseFloat(formData.minOrder) || 0,
        avgPrepTime: formData.avgPrepTime,
        rating: 0,
        totalOrders: 0,
      };
      setRestaurants(prev => [newRestaurant, ...prev]);
      showSnackbar('Restaurant added successfully!', 'success');
    }

    setIsLoading(false);
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    const restaurant = restaurants.find(r => r.id === id);
    if (!restaurant) return;

    Alert.alert(
      'Delete Restaurant',
      `Are you sure you want to delete "${restaurant.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            setLoadingMessage('Deleting restaurant...');
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setRestaurants(prev => prev.filter(r => r.id !== id));
            setIsLoading(false);
            showSnackbar('Restaurant deleted', 'warning');
          },
        },
      ]
    );
  };

  // Filter restaurants
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'active' && restaurant.isActive) ||
                         (filterStatus === 'inactive' && !restaurant.isActive);
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Restaurants</Text>
          <Text style={styles.headerSubtitle}>{restaurants.length} total restaurants</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNew}
          activeOpacity={0.8}
        >
          <Icon name="plus" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color={PartnerColors.light.text.tertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants..."
            placeholderTextColor={PartnerColors.light.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="x" size={20} color={PartnerColors.light.text.tertiary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips */}
        <View style={styles.filterChips}>
          <TouchableOpacity
            style={[styles.filterChip, filterStatus === 'all' && styles.filterChipActive]}
            onPress={() => setFilterStatus('all')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterChipText, filterStatus === 'all' && styles.filterChipTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filterStatus === 'active' && styles.filterChipActive]}
            onPress={() => setFilterStatus('active')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterChipText, filterStatus === 'active' && styles.filterChipTextActive]}>
              Active
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filterStatus === 'inactive' && styles.filterChipActive]}
            onPress={() => setFilterStatus('inactive')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterChipText, filterStatus === 'inactive' && styles.filterChipTextActive]}>
              Inactive
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Restaurants List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.restaurantsList}>
          {filteredRestaurants.map((restaurant) => (
            <View key={restaurant.id} style={styles.restaurantCard}>
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <Image source={restaurant.logo} style={styles.restaurantLogo} />
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  <View style={styles.categoryBadge}>
                    <Icon name="tag" size={12} color={PartnerColors.primary} />
                    <Text style={styles.categoryText}>{restaurant.category}</Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    restaurant.isActive ? styles.statusBadgeActive : styles.statusBadgeInactive,
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: restaurant.isActive ? '#10B981' : '#EF4444' },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      { color: restaurant.isActive ? '#10B981' : '#EF4444' },
                    ]}
                  >
                    {restaurant.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>

              {/* Stats Row */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Icon name="star" size={14} color="#FF9500" />
                  <Text style={styles.statText}>{restaurant.rating}</Text>
                </View>
                <View style={styles.statItem}>
                  <Icon name="shopping-bag" size={14} color={PartnerColors.light.text.tertiary} />
                  <Text style={styles.statText}>{restaurant.totalOrders} orders</Text>
                </View>
                <View style={styles.statItem}>
                  <Icon name="clock" size={14} color={PartnerColors.light.text.tertiary} />
                  <Text style={styles.statText}>{restaurant.avgPrepTime}</Text>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Actions Row */}
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEdit(restaurant)}
                  activeOpacity={0.7}
                >
                  <Icon name="edit-2" size={16} color={PartnerColors.primary} />
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDelete(restaurant.id)}
                  activeOpacity={0.7}
                >
                  <Icon name="trash-2" size={16} color="#EF4444" />
                  <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleToggleStatus(restaurant.id)}
                  activeOpacity={0.7}
                >
                  <Icon
                    name={restaurant.isActive ? 'eye-off' : 'eye'}
                    size={16}
                    color={PartnerColors.light.text.secondary}
                  />
                  <Text style={styles.actionButtonText}>
                    {restaurant.isActive ? 'Deactivate' : 'Activate'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {filteredRestaurants.length === 0 && (
            <View style={styles.emptyState}>
              <Icon name="search" size={48} color={PartnerColors.light.text.tertiary} />
              <Text style={styles.emptyStateText}>No restaurants found</Text>
              <Text style={styles.emptyStateSubtext}>
                {searchQuery ? 'Try a different search term' : 'Add your first restaurant'}
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingRestaurant ? 'Edit Restaurant' : 'Add Restaurant'}
              </Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Icon name="x" size={24} color={PartnerColors.light.text.primary} />
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Image Upload */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Restaurant Logo</Text>
                {formData.imageUri ? (
                  <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: formData.imageUri }} style={styles.imagePreview} />
                    <TouchableOpacity
                      style={styles.changeImageButton}
                      onPress={handlePickImage}
                      activeOpacity={0.7}
                    >
                      <Icon name="edit-2" size={16} color="#FFFFFF" />
                      <Text style={styles.changeImageText}>Change</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.imageUploadButton}
                    onPress={handlePickImage}
                    activeOpacity={0.7}
                  >
                    <Icon name="camera" size={24} color={PartnerColors.primary} />
                    <Text style={styles.imageUploadText}>Upload Logo</Text>
                    <Text style={styles.imageUploadSubtext}>Tap to select from gallery</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Restaurant Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Restaurant Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="e.g., Burger Palace"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Category */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.category}
                  onChangeText={(text) => setFormData({ ...formData, category: text })}
                  placeholder="e.g., Burgers, Pizza"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Description */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder="Brief description..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Phone */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  placeholder="+973 3999 8888"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  placeholder="contact@restaurant.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Address */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Address</Text>
                <TextInput
                  style={styles.input}
                  value={formData.address}
                  onChangeText={(text) => setFormData({ ...formData, address: text })}
                  placeholder="Building, Road, Area"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Map Location Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Location</Text>
                <TouchableOpacity
                  style={styles.mapButton}
                  onPress={handleSelectLocation}
                  activeOpacity={0.7}
                >
                  <Icon name="map-pin" size={20} color={PartnerColors.primary} />
                  <Text style={styles.mapButtonText}>
                    {formData.latitude && formData.longitude
                      ? `Selected: ${formData.latitude}, ${formData.longitude}`
                      : 'Select Location on Map'}
                  </Text>
                </TouchableOpacity>
                {formData.latitude && formData.longitude && (
                  <Text style={styles.locationHint}>
                    Coordinates will be used for delivery tracking
                  </Text>
                )}
              </View>

              {/* Row: Delivery Fee & Min Order */}
              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Delivery Fee (BD)</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.deliveryFee}
                    onChangeText={(text) => setFormData({ ...formData, deliveryFee: text })}
                    placeholder="1.5"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Min Order (BD)</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.minOrder}
                    onChangeText={(text) => setFormData({ ...formData, minOrder: text })}
                    placeholder="5"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              {/* Avg Prep Time */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Avg Prep Time</Text>
                <TextInput
                  style={styles.input}
                  value={formData.avgPrepTime}
                  onChangeText={(text) => setFormData({ ...formData, avgPrepTime: text })}
                  placeholder="25-30 min"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={{ height: 20 }} />
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCloseModal}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButtonWrapper}
                onPress={handleSaveRestaurant}
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
                    {editingRestaurant ? 'Update' : 'Add'} Restaurant
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      <Snackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        type={snackbarType}
        onDismiss={() => setSnackbarVisible(false)}
      />
      
      <LoadingSpinner
        visible={isLoading}
        message={loadingMessage}
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
    paddingHorizontal: PartnerSpacing.xl,
    paddingTop: Platform.OS === 'ios' ? 50 : PartnerSpacing.lg,
    paddingBottom: PartnerSpacing.lg,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: PartnerColors.light.borderLight,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: PartnerColors.light.text.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: PartnerColors.light.text.secondary,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: PartnerColors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: PartnerSpacing.xl,
    paddingVertical: PartnerSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: PartnerColors.light.borderLight,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: PartnerSpacing.md,
    paddingVertical: 12,
    gap: 10,
    marginBottom: PartnerSpacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: PartnerColors.light.text.primary,
  },
  filterChips: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: PartnerColors.light.borderLight,
  },
  filterChipActive: {
    backgroundColor: `${PartnerColors.primary}15`,
    borderColor: PartnerColors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: PartnerColors.light.text.secondary,
  },
  filterChipTextActive: {
    color: PartnerColors.primary,
  },
  scrollView: {
    flex: 1,
  },
  restaurantsList: {
    paddingHorizontal: PartnerSpacing.xl,
    paddingTop: PartnerSpacing.lg,
  },
  restaurantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: PartnerSpacing.lg,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  restaurantLogo: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 12,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: PartnerColors.light.text.primary,
    marginBottom: 4,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${PartnerColors.primary}10`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: PartnerColors.primary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusBadgeActive: {
    backgroundColor: '#ECFDF5',
  },
  statusBadgeInactive: {
    backgroundColor: '#FEE2E2',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: PartnerTypography.fontWeight.semibold,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: PartnerColors.light.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: PartnerColors.light.borderLight,
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: PartnerColors.light.text.secondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: PartnerColors.light.text.primary,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: PartnerColors.light.text.tertiary,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PartnerSpacing.xl,
    paddingVertical: PartnerSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: PartnerColors.light.borderLight,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: PartnerColors.light.text.primary,
  },
  modalBody: {
    paddingHorizontal: PartnerSpacing.xl,
    paddingTop: PartnerSpacing.lg,
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
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: PartnerSpacing.xl,
    paddingVertical: PartnerSpacing.lg,
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
  imageUploadButton: {
    backgroundColor: `${PartnerColors.primary}10`,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: PartnerColors.primary,
    borderStyle: 'dashed',
    paddingVertical: 24,
    alignItems: 'center',
    gap: 8,
  },
  imageUploadText: {
    fontSize: 16,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: PartnerColors.primary,
  },
  imageUploadSubtext: {
    fontSize: 13,
    color: PartnerColors.light.text.tertiary,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: `${PartnerColors.primary}10`,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PartnerColors.primary,
    paddingVertical: 14,
  },
  mapButtonText: {
    fontSize: 15,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: PartnerColors.primary,
  },
  mapButtonSubtext: {
    fontSize: 12,
    color: PartnerColors.light.text.tertiary,
  },
  imagePreviewContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: PartnerColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  changeImageText: {
    fontSize: 13,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: '#FFFFFF',
  },
  locationHint: {
    fontSize: 12,
    color: PartnerColors.light.text.tertiary,
    marginTop: 8,
  },
});

export default RestaurantsManagementScreen;
