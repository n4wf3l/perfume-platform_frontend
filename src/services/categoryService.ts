import apiService from './apiService';
import type { Category } from '../types/api';

// Interface to extend Category with product count
export interface CategoryWithCount extends Category {
  productCount: number;
  products_count?: number; // Pour gérer les cas où l'API renvoie products_count au lieu de productCount
}

class CategoryService {
  async getAllCategories(): Promise<Category[]> {
    return apiService.get<Category[]>('/categories');
  }
  
  // New method to get categories with product counts
  async getCategoriesWithProductCount(): Promise<CategoryWithCount[]> {
    return apiService.get<CategoryWithCount[]>('/categories/with-product-count');
  }
  
  async getCategory(id: number): Promise<Category> {
    return apiService.get<Category>(`/categories/${id}`);
  }
  
  async createCategory(categoryData: Partial<Category>): Promise<Category> {
    return apiService.post<Category>('/categories', categoryData);
  }
  
  async updateCategory(id: number, categoryData: Partial<Category>): Promise<Category> {
    return apiService.put<Category>(`/categories/${id}`, categoryData);
  }
  
  async deleteCategory(id: number): Promise<void> {
    return apiService.delete(`/categories/${id}`);
  }
}

export default new CategoryService();
