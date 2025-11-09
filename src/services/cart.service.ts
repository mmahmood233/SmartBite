/**
 * Cart Service
 * 
 * Manages cart operations in local storage and Supabase
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_STORAGE_KEY = '@smartbite_cart';

export interface CartItem {
  id: string;
  dishId: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  addOns: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  specialRequest?: string;
  totalPrice: number;
}

export interface Cart {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

/**
 * Get cart from local storage
 */
export const getCart = async (): Promise<Cart> => {
  try {
    const cartJson = await AsyncStorage.getItem(CART_STORAGE_KEY);
    if (cartJson) {
      return JSON.parse(cartJson);
    }
  } catch (error) {
    console.error('Error getting cart:', error);
  }
  
  return {
    items: [],
    restaurantId: null,
    restaurantName: null,
    subtotal: 0,
    deliveryFee: 0,
    total: 0,
  };
};

/**
 * Save cart to local storage
 */
export const saveCart = async (cart: Cart): Promise<void> => {
  try {
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart:', error);
    throw error;
  }
};

/**
 * Calculate cart totals
 */
export const calculateCartTotals = (items: CartItem[], deliveryFee: number = 0): { subtotal: number; total: number } => {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const total = subtotal + deliveryFee;
  
  return { subtotal, total };
};

/**
 * Add item to cart
 */
export const addToCart = async (
  dishId: string,
  restaurantId: string,
  restaurantName: string,
  name: string,
  price: number,
  quantity: number,
  addOns: Array<{ id: string; name: string; price: number }>,
  specialRequest?: string,
  image?: string
): Promise<Cart> => {
  const cart = await getCart();
  
  // Check if cart has items from a different restaurant
  if (cart.items.length > 0 && cart.restaurantId !== restaurantId) {
    throw new Error('DIFFERENT_RESTAURANT');
  }
  
  // Calculate item total price
  const addOnsTotal = addOns.reduce((sum, addon) => sum + addon.price, 0);
  const itemTotalPrice = (price + addOnsTotal) * quantity;
  
  // Check if item already exists in cart
  const existingItemIndex = cart.items.findIndex(
    item => 
      item.dishId === dishId && 
      JSON.stringify(item.addOns) === JSON.stringify(addOns) &&
      item.specialRequest === specialRequest
  );
  
  if (existingItemIndex > -1) {
    // Update quantity
    cart.items[existingItemIndex].quantity += quantity;
    cart.items[existingItemIndex].totalPrice += itemTotalPrice;
  } else {
    // Add new item
    const newItem: CartItem = {
      id: `${dishId}-${Date.now()}`,
      dishId,
      restaurantId,
      restaurantName,
      name,
      price,
      quantity,
      image,
      addOns,
      specialRequest,
      totalPrice: itemTotalPrice,
    };
    cart.items.push(newItem);
  }
  
  // Update cart metadata
  cart.restaurantId = restaurantId;
  cart.restaurantName = restaurantName;
  
  // Recalculate totals
  const { subtotal, total } = calculateCartTotals(cart.items, cart.deliveryFee);
  cart.subtotal = subtotal;
  cart.total = total;
  
  await saveCart(cart);
  return cart;
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (itemId: string): Promise<Cart> => {
  const cart = await getCart();
  cart.items = cart.items.filter(item => item.id !== itemId);
  
  // Clear restaurant if cart is empty
  if (cart.items.length === 0) {
    cart.restaurantId = null;
    cart.restaurantName = null;
    cart.deliveryFee = 0;
  }
  
  // Recalculate totals
  const { subtotal, total } = calculateCartTotals(cart.items, cart.deliveryFee);
  cart.subtotal = subtotal;
  cart.total = total;
  
  await saveCart(cart);
  return cart;
};

/**
 * Update item quantity
 */
export const updateCartItemQuantity = async (itemId: string, quantity: number): Promise<Cart> => {
  const cart = await getCart();
  const item = cart.items.find(i => i.id === itemId);
  
  if (item) {
    if (quantity <= 0) {
      return removeFromCart(itemId);
    }
    
    const addOnsTotal = item.addOns.reduce((sum, addon) => sum + addon.price, 0);
    item.quantity = quantity;
    item.totalPrice = (item.price + addOnsTotal) * quantity;
  }
  
  // Recalculate totals
  const { subtotal, total } = calculateCartTotals(cart.items, cart.deliveryFee);
  cart.subtotal = subtotal;
  cart.total = total;
  
  await saveCart(cart);
  return cart;
};

/**
 * Clear entire cart
 */
export const clearCart = async (): Promise<void> => {
  await AsyncStorage.removeItem(CART_STORAGE_KEY);
};

/**
 * Get cart item count
 */
export const getCartItemCount = async (): Promise<number> => {
  const cart = await getCart();
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
};
