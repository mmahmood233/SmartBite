import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
  PanResponder,
  Animated,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../../../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../../constants';
import { formatCurrency } from '../../../utils';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMAGE_HEIGHT = 240;

interface AddOn {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}

interface DishDetailModalProps {
  visible: boolean;
  onClose: () => void;
  dish: {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: any;
    rating?: number;
    reviewCount?: number;
    tags?: string[];
  };
  onAddToCart: (quantity: number, addOns: AddOn[], totalPrice: number) => void;
}

const DishDetailModal: React.FC<DishDetailModalProps> = ({
  visible,
  onClose,
  dish,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [specialRequest, setSpecialRequest] = useState('');
  const [addOns, setAddOns] = useState<AddOn[]>([
    { id: '1', name: 'Extra Chicken', price: 1.0, selected: false },
    { id: '2', name: 'Salad', price: 0.5, selected: false },
    { id: '3', name: 'Garlic Sauce', price: 0.3, selected: false },
  ]);

  const pan = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5; // Only respond to downward drags
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          pan.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          // If dragged down more than 100px, close
          onClose();
        } else {
          // Otherwise, spring back
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const toggleAddOn = (id: string) => {
    setAddOns(prev =>
      prev.map(addon =>
        addon.id === id ? { ...addon, selected: !addon.selected } : addon
      )
    );
  };

  const calculateTotal = () => {
    const basePrice = dish.price * quantity;
    const addOnsPrice = addOns
      .filter(addon => addon.selected)
      .reduce((sum, addon) => sum + addon.price * quantity, 0);
    return basePrice + addOnsPrice;
  };

  const handleAddToCart = () => {
    const total = calculateTotal();
    onAddToCart(quantity, addOns.filter(a => a.selected), total);
    onClose();
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <Animated.View 
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: pan }],
            },
          ]}
        >
          {/* Drag Handle */}
          <View style={styles.dragHandleContainer} {...panResponder.panHandlers}>
            <View style={styles.dragHandle} />
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            {/* Hero Image */}
            <View style={styles.imageContainer}>
              <Image 
                source={dish.image || require('../../../../assets/food.png')} 
                style={styles.dishImage} 
                resizeMode="cover" 
              />
              <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.95)']}
                style={styles.imageGradient}
              />
            </View>

            {/* Info Block */}
            <View style={styles.infoBlock}>
              <View style={styles.headerRow}>
                <Text style={styles.dishName}>{dish.name}</Text>
                <Text style={styles.dishPrice}>BD {dish.price.toFixed(2)}</Text>
              </View>

              <Text style={styles.description}>{dish.description}</Text>

              {/* Tags */}
              {dish.tags && dish.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {dish.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.divider} />

              {/* Add-ons Section */}
              <Text style={styles.sectionTitle}>Choose your add-ons (Optional)</Text>
              {addOns.map(addon => (
                <TouchableOpacity
                  key={addon.id}
                  style={styles.addOnItem}
                  onPress={() => toggleAddOn(addon.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.addOnLeft}>
                    <View style={[styles.checkbox, addon.selected && styles.checkboxActive]}>
                      {addon.selected && (
                        <Icon name="check" size={14} color="#FFFFFF" />
                      )}
                    </View>
                    <Text style={styles.addOnName}>{addon.name}</Text>
                  </View>
                  <Text style={styles.addOnPrice}>+BD {addon.price.toFixed(2)}</Text>
                </TouchableOpacity>
              ))}

              <View style={styles.divider} />

              {/* Quantity Selector */}
              <View style={styles.quantitySection}>
                <Text style={styles.sectionTitle}>Quantity</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={decrementQuantity}
                    activeOpacity={0.7}
                  >
                    <Icon name="minus" size={18} color={colors.primary} />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={incrementQuantity}
                    activeOpacity={0.7}
                  >
                    <Icon name="plus" size={18} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Special Request */}
              <View style={styles.specialRequestSection}>
                <Text style={styles.sectionTitle}>Special Request (Optional)</Text>
                <TextInput
                  style={styles.specialRequestInput}
                  placeholder="e.g., No onions, extra spicy, contactless delivery..."
                  placeholderTextColor="#9E9E9E"
                  value={specialRequest}
                  onChangeText={setSpecialRequest}
                  multiline
                  numberOfLines={3}
                  maxLength={200}
                  textAlignVertical="top"
                />
                <Text style={styles.characterCount}>{specialRequest.length}/200</Text>
              </View>

              {/* Spacing for sticky footer */}
              <View style={{ height: 100 }} />
            </View>
          </ScrollView>

          {/* Sticky Footer CTA */}
          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              <Text style={styles.footerQuantity}>{quantity} Item{quantity > 1 ? 's' : ''}</Text>
              <Text style={styles.footerTotal}>BD {calculateTotal().toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddToCart}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#00897B', '#26A69A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.addButtonGradient}
              >
                <Text style={styles.addButtonText}>Add to Order</Text>
                <Icon name="arrow-right" size={18} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: BORDER_RADIUS.xxl,
    borderTopRightRadius: BORDER_RADIUS.xxl,
    height: SCREEN_HEIGHT * 0.9,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 20,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: BORDER_RADIUS.xs,
    backgroundColor: colors.border,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: IMAGE_HEIGHT,
  },
  dishImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.lg,
    right: SPACING.lg,
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBlock: {
    padding: SPACING.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  dishName: {
    flex: 1,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: -0.3,
    marginRight: SPACING.md,
  },
  dishPrice: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: colors.primary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  ratingText: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
    marginLeft: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#F3F7F5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 126, 115, 0.15)',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A4D47',
    marginBottom: 12,
  },
  addOnItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  addOnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CFCFCF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  addOnName: {
    fontSize: 15,
    color: '#212121',
    fontWeight: '500',
  },
  addOnPrice: {
    fontSize: 15,
    color: '#6D6D6D',
    fontWeight: '500',
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: 'center',
  },
  specialRequestSection: {
    marginTop: 0,
  },
  specialRequestInput: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 12,
    fontSize: 14,
    color: '#212121',
    minHeight: 80,
    maxHeight: 120,
  },
  characterCount: {
    fontSize: 12,
    color: '#9E9E9E',
    textAlign: 'right',
    marginTop: 6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    elevation: 15,
  },
  footerLeft: {
    flex: 1,
  },
  footerQuantity: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 4,
  },
  footerTotal: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    lineHeight: 26,
  },
  addButton: {
    flex: 1,
    marginLeft: 16,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#00897B',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});

export default DishDetailModal;
