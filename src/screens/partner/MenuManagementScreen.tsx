import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather as Icon } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import PartnerTopNav from '../../components/partner/PartnerTopNav';
import { PartnerColors, PartnerSpacing, PartnerBorderRadius, PartnerTypography } from '../../constants/partnerTheme';
import { getStrings } from '../../constants/partnerStrings';
import Snackbar, { SnackbarType } from '../../components/Snackbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import { getUserNotifications } from '../../services/notification.service';
import {
  getDishes,
  getMenuCategories,
  createDish,
  updateDish,
  deleteDish,
  toggleDishAvailability,
  toggleDishPopular,
  createCategory,
  deleteCategory,
  Dish,
  MenuCategory,
} from '../../services/partner-menu.service';

const strings = getStrings('en');

// Using Dish interface from service

const MenuManagementScreen: React.FC = () => {
  const { t } = useLanguage();
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantLogo, setRestaurantLogo] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showManageCategoriesModal, setShowManageCategoriesModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Dish | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    isActive: true,
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);

  // Snackbar state
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<SnackbarType>('success');
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Processing...');

  const showSnackbar = (message: string, type: SnackbarType = 'success') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  // Get partner's restaurant ID
  useEffect(() => {
    const fetchRestaurantId = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Current user:', user?.email);
        if (!user) return;

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .eq('role', 'partner')
          .single();

        console.log('User data:', userData);
        console.log('User error:', userError);

        if (userData) {
          const { data: restaurantData, error: restaurantError } = await supabase
            .from('restaurants')
            .select('id, name, logo')
            .eq('partner_id', userData.id)
            .single();

          console.log('Restaurant data:', restaurantData);
          console.log('Restaurant error:', restaurantError);

          if (restaurantData) {
            console.log('Setting restaurant ID:', restaurantData.id, 'Name:', restaurantData.name);
            setRestaurantId(restaurantData.id);
            setRestaurantLogo(restaurantData.logo);
          }
        }

        // Fetch notifications
        if (user) {
          const notifications = await getUserNotifications(user.id);
          setUnreadCount(notifications.filter((n: any) => !n.read).length);
        }
      } catch (error) {
        console.error('Error fetching restaurant ID:', error);
      }
    };

    fetchRestaurantId();
  }, []);

  // Fetch categories and dishes
  const fetchData = useCallback(async () => {
    if (!restaurantId) {
      console.log('No restaurant ID yet');
      return;
    }

    console.log('Fetching menu data for restaurant:', restaurantId);
    console.log('Selected category:', selectedCategory);

    try {
      const [categoriesData, dishesData] = await Promise.all([
        getMenuCategories(restaurantId),
        getDishes(restaurantId, selectedCategory !== 'All' ? selectedCategory : undefined),
      ]);

      console.log('Categories loaded:', categoriesData.length);
      console.log('Dishes loaded:', dishesData.length);
      console.log('Dishes:', dishesData);

      setCategories(categoriesData);
      setDishes(dishesData);
    } catch (error) {
      console.error('Error fetching menu data:', error);
      showSnackbar('Failed to load menu data', 'error');
    } finally {
      setInitialLoading(false);
    }
  }, [restaurantId, selectedCategory]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time subscriptions for dishes and categories
  useEffect(() => {
    if (!restaurantId) return;

    console.log('MenuManagement: Setting up real-time subscriptions');

    // Subscribe to dishes changes
    const dishesSubscription = supabase
      .channel('menu-dishes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dishes',
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          console.log('MenuManagement: Dish update:', payload.eventType);
          fetchData();
        }
      )
      .subscribe();

    // Subscribe to categories changes
    const categoriesSubscription = supabase
      .channel('menu-categories')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'menu_categories',
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          console.log('MenuManagement: Category update:', payload.eventType);
          fetchData();
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      console.log('MenuManagement: Cleaning up real-time subscriptions');
      supabase.removeChannel(dishesSubscription);
      supabase.removeChannel(categoriesSubscription);
    };
  }, [restaurantId, fetchData]);

  const filteredItems = dishes.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category_id === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleItemStatus = async (id: string) => {
    const item = dishes.find(d => d.id === id);
    if (!item) return;

    setIsLoading(true);
    setLoadingMessage('Updating availability...');
    try {
      await toggleDishAvailability(id, !item.is_available);
      showSnackbar(
        item.is_available ? `${item.name} marked as unavailable` : `${item.name} is now available`,
        'info'
      );
      await fetchData();
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to update availability', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePopularStatus = async (id: string) => {
    const item = dishes.find(d => d.id === id);
    if (!item) return;

    setIsLoading(true);
    setLoadingMessage('Updating popular status...');
    try {
      await toggleDishPopular(id, !item.is_popular);
      showSnackbar(
        item.is_popular ? `${item.name} removed from popular` : `${item.name} marked as popular! 🌟`,
        'success'
      );
      await fetchData();
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to update popular status', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Image picker function
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        showSnackbar('Permission to access gallery is required!', 'error');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      showSnackbar('Failed to pick image', 'error');
    }
  };

  // Upload image to Supabase Storage
  const uploadImage = async (uri: string): Promise<string | null> => {
    try {
      setUploadingImage(true);

      // Create a unique filename
      const fileExt = uri.split('.').pop();
      const fileName = `${restaurantId}/${Date.now()}.${fileExt}`;

      // Fetch the image as a blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Convert blob to ArrayBuffer
      const arrayBuffer = await new Response(blob).arrayBuffer();

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('dish-images')
        .upload(fileName, arrayBuffer, {
          contentType: `image/${fileExt}`,
          upsert: false,
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('dish-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      showSnackbar('Failed to upload image', 'error');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEdit = (item: Dish) => {
    setEditingItem(item);
    setSelectedImage(item.image_url);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category_id: item.category_id || '',
      isActive: item.is_available,
    });
    setShowAddModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || !restaurantId) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }

    setIsLoading(true);
    setLoadingMessage(editingItem ? 'Updating item...' : 'Adding item...');

    try {
      // Upload image if a new one was selected
      let imageUrl = editingItem?.image_url || null;
      if (selectedImage && selectedImage !== editingItem?.image_url) {
        setLoadingMessage('Uploading image...');
        const uploadedUrl = await uploadImage(selectedImage);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      if (editingItem) {
        await updateDish(editingItem.id, {
          name: formData.name,
          description: formData.description || null,
          price: parseFloat(formData.price),
          category_id: formData.category_id || null,
          is_available: formData.isActive,
          image_url: imageUrl,
        });
        showSnackbar('Item updated successfully!', 'success');
      } else {
        await createDish({
          restaurant_id: restaurantId,
          name: formData.name,
          description: formData.description || null,
          price: parseFloat(formData.price),
          category_id: formData.category_id || null,
          is_available: formData.isActive,
          image_url: imageUrl,
        });
        showSnackbar('Item added successfully!', 'success');
      }

      setShowAddModal(false);
      setEditingItem(null);
      setSelectedImage(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category_id: '',
        isActive: true,
      });
      await fetchData();
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to save item', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            setLoadingMessage('Deleting item...');
            try {
              await deleteDish(id);
              showSnackbar('Item deleted', 'warning');
              await fetchData();
            } catch (error: any) {
              showSnackbar(error.message || 'Failed to delete item', 'error');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim() || !restaurantId) {
      showSnackbar('Please enter a category name', 'error');
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Creating category...');
    try {
      await createCategory({
        restaurant_id: restaurantId,
        name: newCategoryName.trim(),
      });
      showSnackbar(`Category "${newCategoryName.trim()}" created!`, 'success');
      setNewCategoryName('');
      setShowCategoryModal(false);
      await fetchData();
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to create category', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    Alert.alert(
      'Delete Category',
      `Delete "${categoryName}"? Items in this category will remain.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            setLoadingMessage('Deleting category...');
            try {
              await deleteCategory(categoryId);
              if (selectedCategory === categoryId) setSelectedCategory('All');
              showSnackbar(`Category "${categoryName}" deleted`, 'warning');
              await fetchData();
            } catch (error: any) {
              showSnackbar(error.message || 'Failed to delete category', 'error');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <PartnerTopNav
        title={t('partner.menuTitle')}
        showBranding={true}
        showDropdown={false}
        restaurantLogo={restaurantLogo}
        showNotification={true}
        unreadCount={unreadCount}
        onNotificationPress={() => (window as any).navigation?.navigate('PartnerNotifications')}
      />

      {/* Compact Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryScrollContent}
      >
        {/* All Category */}
        <TouchableOpacity
          style={[
            styles.categoryChip,
            selectedCategory === 'All' && styles.categoryChipActive,
          ]}
          onPress={() => setSelectedCategory('All')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.categoryChipText,
              selectedCategory === 'All' && styles.categoryChipTextActive,
            ]}
          >
            {t('partner.all')}
          </Text>
        </TouchableOpacity>

        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === category.id && styles.categoryChipTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
        
        {/* Add Category Chip */}
        <TouchableOpacity
          style={styles.addCategoryChip}
          onPress={() => setShowCategoryModal(true)}
          activeOpacity={0.7}
        >
          <Icon name="plus" size={14} color="#00A896" />
          <Text style={styles.addCategoryText}>{t('partner.category')}</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.searchBar}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={18} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('partner.searchMenuItems')}
            placeholderTextColor={PartnerColors.light.text.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
        {filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="package" size={64} color="#CCC" />
            <Text style={styles.emptyStateTitle}>No items found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? 'Try a different search term'
                : 'Start by adding your first dish!'}
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => setShowAddModal(true)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#FFB703', '#FB8500']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.emptyStateButtonGradient}
              >
                <Icon name="plus" size={18} color="#FFFFFF" />
                <Text style={styles.emptyStateButtonText}>{t('partner.addItem')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          filteredItems.map((item, index) => (
            <View key={item.id}>
              <View style={styles.menuItemCard}>
                <View style={styles.menuItemImage}>
                  {item.image_url ? (
                    <Image source={{ uri: item.image_url }} style={styles.itemImage} />
                  ) : (
                    <View style={styles.itemImagePlaceholder}>
                      <Icon name="image" size={24} color="#CCC" />
                    </View>
                  )}
                </View>

                <View style={styles.menuItemDetails}>
                  <View style={styles.menuItemHeader}>
                    <Text style={styles.menuItemName}>{item.name}</Text>
                    <View style={styles.statusDot}>
                      <View
                        style={[
                          styles.statusDotInner,
                          { backgroundColor: item.is_available ? '#3EB489' : '#E53935' },
                        ]}
                      />
                    </View>
                  </View>

                  <View style={styles.menuItemMeta}>
                    <Text style={styles.menuItemPrice}>{t('units.currencySymbol')} {item.price.toFixed(3)}</Text>
                    <Text style={styles.menuItemMetaDot}>•</Text>
                    <Text style={styles.menuItemCategory}>{item.menu_categories?.name || t('partner.uncategorized')}</Text>
                    {item.is_popular && (
                      <>
                        <Text style={styles.menuItemMetaDot}>•</Text>
                        <View style={styles.popularBadge}>
                          <Text style={styles.popularBadgeText}>{t('partner.popular')} 🟡</Text>
                        </View>
                      </>
                    )}
                    <Text style={styles.menuItemMetaDot}>•</Text>
                    <Text style={styles.statusText}>
                      {item.is_available ? t('partner.active') + ' 🟢' : t('partner.inactive') + ' ⚪'}
                    </Text>
                  </View>

                  <View style={styles.menuItemActions}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => handleEdit(item)}
                      activeOpacity={0.7}
                    >
                      <Icon name="edit-2" size={14} color="#00A896" />
                      <Text style={styles.editButtonText}>{t('partner.edit')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.popularButton,
                        item.is_popular && styles.popularButtonActive,
                      ]}
                      onPress={() => togglePopularStatus(item.id)}
                      activeOpacity={0.7}
                    >
                      <Icon 
                        name="star" 
                        size={14} 
                        color={item.is_popular ? "#FFB703" : "#999"} 
                      />
                      <Text
                        style={[
                          styles.popularButtonText,
                          item.is_popular && styles.popularButtonTextActive,
                        ]}
                      >
                        {t('partner.popular')}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.toggleButton,
                        !item.is_available && styles.toggleButtonActive,
                      ]}
                      onPress={() => toggleItemStatus(item.id)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.toggleButtonText,
                          !item.is_available && styles.toggleButtonTextActive,
                        ]}
                      >
                        {item.is_available ? t('partner.markUnavailable') : t('partner.markAvailable')}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDelete(item.id)}
                      activeOpacity={0.7}
                    >
                      <Icon name="trash-2" size={14} color="#E53935" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {index < filteredItems.length - 1 && <View style={styles.itemDivider} />}
            </View>
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action Bar (10/10 Design) */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.addItemButton}
          onPress={() => {
            setEditingItem(null);
            setFormData({
              name: '',
              description: '',
              price: '',
              category_id: categories.length > 0 ? categories[0].id : '',
              isActive: true,
            });
            setShowAddModal(true);
          }}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#00A896', '#00C7B1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addItemButtonGradient}
          >
            <Icon name="plus" size={18} color="#FFFFFF" />
            <Text style={styles.addItemButtonText}>{t('partner.addItem')}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.manageCategoriesButton}
          onPress={() => setShowManageCategoriesModal(true)}
          activeOpacity={0.7}
        >
          <Icon name="folder" size={18} color="#00A896" />
          <Text style={styles.manageCategoriesButtonText}>{t('partner.manageCategories')}</Text>
        </TouchableOpacity>
      </View>

      {/* Add Category Modal */}
      <Modal
        visible={showCategoryModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.centeredOverlay}>
          <LinearGradient
            colors={['rgba(255,255,255,0.9)', 'rgba(250,250,250,0.95)']}
            style={styles.glassModal}
          >
            <Text style={styles.glassModalTitle}>Add Category</Text>

            <TextInput
              style={styles.glassInput}
              placeholder="Category Name"
              placeholderTextColor="#999"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />

            <View style={styles.glassButtonRow}>
              <TouchableOpacity
                style={styles.glassCancelButton}
                onPress={() => {
                  setNewCategoryName('');
                  setShowCategoryModal(false);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.glassCancelText}>Cancel</Text>
              </TouchableOpacity>

              <LinearGradient
                colors={['#00A896', '#4ECDC4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.glassAddButton}
              >
                <TouchableOpacity
                  onPress={handleAddCategory}
                  activeOpacity={0.9}
                  style={styles.glassAddButtonInner}
                >
                  <Text style={styles.glassAddText}>Add</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </LinearGradient>
        </View>
      </Modal>

      {/* Manage Categories Modal */}
      <Modal
        visible={showManageCategoriesModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowManageCategoriesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('partner.manageCategories')}</Text>
              <TouchableOpacity onPress={() => setShowManageCategoriesModal(false)}>
                <Icon name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.categoryList} showsVerticalScrollIndicator={false}>
              {categories.map((category) => (
                <View key={category.id} style={styles.categoryListItem}>
                  <Text style={styles.categoryListItemText}>{category.name}</Text>
                  <TouchableOpacity
                    style={styles.deleteCategoryButton}
                    onPress={() => handleDeleteCategory(category.id, category.name)}
                    activeOpacity={0.7}
                  >
                    <Icon name="trash-2" size={18} color="#E53935" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add/Edit Item Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingItem ? t('partner.editMenuItem') : t('partner.addNewMenuItem')}
              </Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Icon name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <TouchableOpacity 
                style={styles.photoUpload} 
                activeOpacity={0.7}
                onPress={pickImage}
                disabled={uploadingImage}
              >
                {selectedImage ? (
                  <Image source={{ uri: selectedImage }} style={styles.uploadedImage} />
                ) : (
                  <>
                    <Icon name="camera" size={32} color="#999" />
                    <Text style={styles.photoUploadText}>{t('partner.uploadPhoto')}</Text>
                  </>
                )}
                {uploadingImage && (
                  <View style={styles.uploadingOverlay}>
                    <ActivityIndicator size="large" color="#00A896" />
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>{t('partner.itemName')} *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder={t('partner.itemNamePlaceholder')}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>{t('partner.description')}</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextArea]}
                  placeholder={t('partner.descriptionPlaceholder')}
                  multiline
                  numberOfLines={3}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>{t('partner.category')} *</Text>
                <View style={styles.categoryPicker}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryOption,
                        formData.category_id === cat.id && styles.categoryOptionActive,
                      ]}
                      onPress={() => setFormData({ ...formData, category_id: cat.id })}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.categoryOptionText,
                          formData.category_id === cat.id && styles.categoryOptionTextActive,
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>{t('partner.priceBD')} *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="0.000"
                  keyboardType="decimal-pad"
                  value={formData.price}
                  onChangeText={(text) => setFormData({ ...formData, price: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <View style={styles.toggleRow}>
                  <Text style={styles.formLabel}>{t('partner.available')}</Text>
                  <TouchableOpacity
                    style={[
                      styles.switch,
                      formData.isActive && styles.switchActive,
                    ]}
                    onPress={() =>
                      setFormData({ ...formData, isActive: !formData.isActive })
                    }
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.switchThumb,
                        formData.isActive && styles.switchThumbActive,
                      ]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>{t('partner.cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#00A896', '#4ECDC4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.saveButtonGradient}
                >
                  <Text style={styles.saveButtonText}>
                    {t('partner.save')}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  topSection: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.06)',
  },
  dateTimeBar: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.06)',
  },
  dateTimeText: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  categoryScroll: {
    backgroundColor: PartnerColors.light.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: PartnerColors.light.divider,
    maxHeight: 52,
    flexGrow: 0,
  },
  categoryScrollContent: {
    paddingHorizontal: PartnerSpacing.xl,
    paddingVertical: PartnerSpacing.sm,
    gap: PartnerSpacing.sm,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  categoryTabActive: {
    backgroundColor: '#00A896',
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
  categoryTabTextActive: {
    color: '#FFFFFF',
  },
  // Compact Category Chips (10/10 Design)
  categoryChip: {
    paddingHorizontal: PartnerSpacing.md,
    height: 36,
    borderRadius: PartnerBorderRadius.xxl,
    backgroundColor: PartnerColors.light.surface,
    borderWidth: 1,
    borderColor: PartnerColors.light.border,
    marginRight: PartnerSpacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryChipActive: {
    backgroundColor: PartnerColors.primary,
    borderColor: PartnerColors.primary,
  },
  categoryChipText: {
    fontSize: PartnerTypography.fontSize.base,
    fontWeight: PartnerTypography.fontWeight.medium,
    color: PartnerColors.light.text.secondary,
  },
  categoryChipTextActive: {
    color: PartnerColors.light.surface,
  },
  addCategoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#00A896',
    height: 36,
    gap: 4,
  },
  addCategoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#00A896',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PartnerSpacing.xl,
    paddingVertical: PartnerSpacing.sm,
    backgroundColor: PartnerColors.light.surfaceAlt,
    gap: PartnerSpacing.md,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6E6E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuList: {
    flex: 1,
    paddingTop: 0,
  },
  menuItemCard: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  menuItemImage: {
    width: 48,
    height: 48,
    borderRadius: 10,
    marginRight: 12,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemDetails: {
    flex: 1,
  },
  menuItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  menuItemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
  },
  statusDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  menuItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  menuItemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  menuItemMetaDot: {
    marginHorizontal: 6,
    color: '#CCC',
    fontSize: 13,
  },
  menuItemCategory: {
    fontSize: 13,
    color: '#777',
  },
  popularBadge: {
    backgroundColor: '#FFF4D1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  popularBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#C68600',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#777',
  },
  menuItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#00A896',
    gap: 4,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#00A896',
  },
  popularButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD',
    gap: 4,
  },
  popularButtonActive: {
    borderColor: '#FFB703',
    backgroundColor: '#FFF9E6',
  },
  popularButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
  },
  popularButtonTextActive: {
    color: '#FFB703',
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  toggleButtonActive: {
    borderColor: '#3EB489',
  },
  toggleButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  toggleButtonTextActive: {
    color: '#3EB489',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#EEE',
    marginHorizontal: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  emptyStateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 8,
  },
  emptyStateButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  floatingButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 8,
  },
  floatingButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Bottom Action Bar (10/10 Design)
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.06)',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },
  addItemButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#00A896',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  addItemButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    gap: 6,
  },
  addItemButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  manageCategoriesButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#00A896',
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  manageCategoriesButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#00A896',
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
    maxHeight: '90%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  modalForm: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 8,
  },
  photoUpload: {
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#FAFAFA',
    overflow: 'hidden',
  },
  photoUploadText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    fontWeight: '500',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  formInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
  },
  formTextArea: {
    height: 80,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  categoryPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryOptionActive: {
    backgroundColor: 'rgba(0, 168, 150, 0.1)',
    borderColor: '#00A896',
  },
  categoryOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  categoryOptionTextActive: {
    color: '#00A896',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switch: {
    width: 52,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#DDD',
    padding: 3,
    justifyContent: 'center',
  },
  switchActive: {
    backgroundColor: '#00A896',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Small Modal (Add Category)
  smallModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    maxWidth: 400,
    alignSelf: 'center',
  },
  smallModalActions: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  // Category List (Manage Categories Modal)
  categoryList: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  categoryListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  categoryListItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  deleteCategoryButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // --- Premium Add Category Modal Styles ---
  centeredOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  glassModal: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  glassModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
    textAlign: 'center',
  },
  glassInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    fontSize: 15,
    color: '#1A1A1A',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  glassButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  glassCancelButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#F4F4F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  glassAddButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  glassAddButtonInner: {
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassAddText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default MenuManagementScreen;
