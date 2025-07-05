import type { CartItem, Product } from '../types/api';

const CART_STORAGE_KEY = 'perfume_cart';

class CartService {
  getCart(): CartItem[] {
    const cartJson = localStorage.getItem(CART_STORAGE_KEY);
    return cartJson ? JSON.parse(cartJson) : [];
  }
  
  saveCart(cart: CartItem[]): void {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }
  
  addToCart(product: Product, quantity = 1): void {
    const cart = this.getCart();
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }
    
    this.saveCart(cart);
  }
  
  updateCartItemQuantity(productId: number, quantity: number): void {
    const cart = this.getCart();
    const itemIndex = cart.findIndex(item => item.product.id === productId);
    
    if (itemIndex !== -1) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
      }
      this.saveCart(cart);
    }
  }
  
  removeFromCart(productId: number): void {
    const cart = this.getCart();
    const updatedCart = cart.filter(item => item.product.id !== productId);
    this.saveCart(updatedCart);
  }
  
  clearCart(): void {
    localStorage.removeItem(CART_STORAGE_KEY);
  }
  
  getCartTotal(): number {
    return this.getCart().reduce(
      (total, item) => total + item.product.price * item.quantity, 
      0
    );
  }
  
  getCartItemCount(): number {
    return this.getCart().reduce(
      (count, item) => count + item.quantity, 
      0
    );
  }
}

export default new CartService();
