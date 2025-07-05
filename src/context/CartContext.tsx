import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import cartService from '../services/cartService';
import type { CartItem, Product } from '../types/api';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  useEffect(() => {
    // Load cart from local storage on initial render
    setItems(cartService.getCart());
  }, []);
  
  const addItem = (product: Product, quantity = 1) => {
    cartService.addToCart(product, quantity);
    setItems(cartService.getCart());
  };
  
  const removeItem = (productId: number) => {
    cartService.removeFromCart(productId);
    setItems(cartService.getCart());
  };
  
  const updateQuantity = (productId: number, quantity: number) => {
    cartService.updateCartItemQuantity(productId, quantity);
    setItems(cartService.getCart());
  };
  
  const clearCart = () => {
    cartService.clearCart();
    setItems([]);
  };
  
  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalPrice: cartService.getCartTotal(),
    itemCount: cartService.getCartItemCount()
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
