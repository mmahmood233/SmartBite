/**
 * Categories Management Screen
 * Manage food categories for the platform
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
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PartnerColors, PartnerSpacing, PartnerBorderRadius, PartnerTypography } from '../../constants/partnerTheme';
import Snackbar, { SnackbarType } from '../../components/Snackbar';

interface Category {
  id: string;
  name: string;
  icon: string;
  restaurantCount: number;
  isActive: boolean;
}

const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Burgers', icon: '🍔', restaurantCount: 45, isActive: true },
  { id: '2', name: 'Pizza', icon: '🍕', restaurantCount: 32, isActive: true },
  { id: '3', name: 'Sushi', icon: '🍣', restaurantCount: 18, isActive: true },
  { id: '4', name: 'Desserts', icon: '🍰', restaurantCount: 28, isActive: true },
  { id: '5', name: 'Coffee', icon: '☕', restaurantCount: 22, isActive: true },
  { id: '6', name: 'Healthy', icon: '🥗', restaurantCount: 15, isActive: false },
];

const CategoriesManagementScreen: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('');
  
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<SnackbarType>('success');

  const showSnackbar = (message: string, type: SnackbarType = 'success') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryIcon('');
    setShowAddModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryIcon(category.icon);
    setShowAddModal(true);
  };

  const handleSaveCategory = () => {
    if (!categoryName.trim() || !categoryIcon.trim()) {
      showSnackbar('Please fill in all fields', 'error');
      return;
    }

    if (editingCategory) {
      setCategories(prev =>
        prev.map(cat =>
          cat.id === editingCategory.id
            ? { ...cat, name: categoryName, icon: categoryIcon }
            : cat
        )
      );
      showSnackbar('Category updated successfully!', 'success');
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: categoryName,
        icon: categoryIcon,
        restaurantCount: 0,
        isActive: true,
      };
      setCategories(prev => [...prev, newCategory]);
      showSnackbar('Category added successfully!', 'success');
    }

    setShowAddModal(false);
    setCategoryName('');
    setCategoryIcon('');
  };

  const handleToggleActive = (id: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === id ? { ...cat, isActive: !cat.isActive } : cat
      )
    );
    const category = categories.find(c => c.id === id);
    if (category) {
      showSnackbar(
        `${category.name} ${category.isActive ? 'deactivated' : 'activated'}`,
        'info'
      );
    }
  };

  const handleDeleteCategory = (id: string) => {
    const category = categories.find(c => c.id === id);
    if (!category) return;

    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${category.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setCategories(prev => prev.filter(cat => cat.id !== id));
            showSnackbar('Category deleted', 'warning');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Categories</Text>
          <Text style={styles.headerSubtitle}>{categories.length} total categories</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddCategory}
          activeOpacity={0.8}
        >
          <Icon name="plus" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <View key={category.id} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <View style={styles.categoryActions}>
                  <TouchableOpacity
                    onPress={() => handleEditCategory(category)}
                    style={styles.iconButton}
                  >
                    <Icon name="edit-2" size={16} color={PartnerColors.light.text.secondary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteCategory(category.id)}
                    style={styles.iconButton}
                  >
                    <Icon name="trash-2" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.restaurantCount}>
                {category.restaurantCount} restaurants
              </Text>

              <TouchableOpacity
                style={[
                  styles.statusButton,
                  category.isActive ? styles.activeButton : styles.inactiveButton,
                ]}
                onPress={() => handleToggleActive(category.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    category.isActive ? styles.activeButtonText : styles.inactiveButtonText,
                  ]}
                >
                  {category.isActive ? 'Active' : 'Inactive'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Icon name="x" size={24} color={PartnerColors.light.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category Name</Text>
                <TextInput
                  style={styles.input}
                  value={categoryName}
                  onChangeText={setCategoryName}
                  placeholder="e.g., Italian, Chinese"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Icon (Emoji)</Text>
                <TextInput
                  style={styles.input}
                  value={categoryIcon}
                  onChangeText={setCategoryIcon}
                  placeholder="e.g., 🍝, 🍜"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <TouchableOpacity
                style={styles.saveButtonWrapper}
                onPress={handleSaveCategory}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[PartnerColors.primary, PartnerColors.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.saveButton}
                >
                  <Text style={styles.saveButtonText}>
                    {editingCategory ? 'Update Category' : 'Add Category'}
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
  scrollView: {
    flex: 1,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: PartnerSpacing.lg,
    paddingTop: PartnerSpacing.lg,
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: PartnerSpacing.md,
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
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 32,
  },
  categoryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: PartnerColors.light.text.primary,
    marginBottom: 4,
  },
  restaurantCount: {
    fontSize: 13,
    color: PartnerColors.light.text.tertiary,
    marginBottom: 12,
  },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#ECFDF5',
  },
  inactiveButton: {
    backgroundColor: '#FEE2E2',
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: PartnerTypography.fontWeight.semibold,
  },
  activeButtonText: {
    color: '#10B981',
  },
  inactiveButtonText: {
    color: '#EF4444',
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
    maxHeight: '70%',
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
    padding: PartnerSpacing.xl,
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
    paddingVertical: PartnerSpacing.md,
    fontSize: 16,
    color: PartnerColors.light.text.primary,
    borderWidth: 1,
    borderColor: PartnerColors.light.borderLight,
  },
  saveButtonWrapper: {
    marginTop: PartnerSpacing.md,
  },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: '#FFFFFF',
  },
});

export default CategoriesManagementScreen;
