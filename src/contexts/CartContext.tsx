/**
 * Cart Context
 * 
 * Global state management for shopping cart
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import {
  Cart,
  CartItem,
  getCart,
  addToCart as addToCartService,
  removeFromCart as removeFromCartService,
  updateCartItemQuantity as updateCartItemQuantityService,
  clearCart as clearCartService,
  getCartItemCount,
} from '../services/cart.service';

interface CartContextType {
  cart: Cart;
  itemCount: number;
  loading: boolean;
  addToCart: (
    dishId: string,
    restaurantId: string,
    restaurantName: string,
    name: string,
    price: number,
    quantity: number,
    addOns: Array<{ id: string; name: string; price: number }>,
    specialRequest?: string,
    image?: string
  ) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    restaurantId: null,
    restaurantName: null,
    subtotal: 0,
    deliveryFee: 0,
    total: 0,
  });
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const loadedCart = await getCart();
      setCart(loadedCart);
      const count = await getCartItemCount();
      setItemCount(count);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (
    dishId: string,
    restaurantId: string,
    restaurantName: string,
    name: string,
    price: number,
    quantity: number,
    addOns: Array<{ id: string; name: string; price: number }>,
    specialRequest?: string,
    image?: string
  ) => {
    try {
      const updatedCart = await addToCartService(
        dishId,
        restaurantId,
        restaurantName,
        name,
        price,
        quantity,
        addOns,
        specialRequest,
        image
      );
      setCart(updatedCart);
      const count = await getCartItemCount();
      setItemCount(count);
    } catch (error: any) {
      if (error.message === 'DIFFERENT_RESTAURANT') {
        Alert.alert(
          'Different Restaurant',
          'Your cart contains items from another restaurant. Would you like to clear your cart and add this item?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Clear Cart',
              style: 'destructive',
              onPress: async () => {
                await clearCart();
                await addToCart(
                  dishId,
                  restaurantId,
                  restaurantName,
                  name,
                  price,
                  quantity,
                  addOns,
                  specialRequest,
                  image
                );
              },
            },
          ]
        );
      } else {
        console.error('Error adding to cart:', error);
        Alert.alert('Error', 'Failed to add item to cart');
      }
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const updatedCart = await removeFromCartService(itemId);
      setCart(updatedCart);
      const count = await getCartItemCount();
      setItemCount(count);
    } catch (error) {
      console.error('Error removing from cart:', error);
      Alert.alert('Error', 'Failed to remove item from cart');
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const updatedCart = await updateCartItemQuantityService(itemId, quantity);
      setCart(updatedCart);
      const count = await getCartItemCount();
      setItemCount(count);
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', 'Failed to update quantity');
    }
  };

  const clearCart = async () => {
    try {
      await clearCartService();
      setCart({
        items: [],
        restaurantId: null,
        restaurantName: null,
        subtotal: 0,
        deliveryFee: 0,
        total: 0,
      });
      setItemCount(0);
    } catch (error) {
      console.error('Error clearing cart:', error);
      Alert.alert('Error', 'Failed to clear cart');
    }
  };

  const refreshCart = async () => {
    await loadCart();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
