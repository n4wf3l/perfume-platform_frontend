export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
  role?: string; // Added to indicate the user's role (e.g., 'admin', 'user')
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  size_ml?: string;
  category_id: number;
  is_hero: boolean;
  is_flagship: boolean;
  olfactive_notes?: string;
  gender?: 'male' | 'female' | 'unisex';
  created_at?: string;
  updated_at?: string;
  category?: Category;
  images?: ProductImage[];
}

export interface ProductImage {
  id: number;
  product_id: number;
  path: string;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  paypal_order_id: string;
  total: number;
  status: 'pending' | 'paid' | 'shipped';
  created_at?: string;
  updated_at?: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at?: string;
  updated_at?: string;
  product?: Product;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
