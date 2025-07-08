import apiService from './apiService';
import type { Product } from '../types/api';

class ProductService {
  async getAllProducts(): Promise<Product[]> {
    return apiService.get<Product[]>('/products');
  }
  
  async getProduct(id: number): Promise<Product> {
    return apiService.get<Product>(`/products/${id}`);
  }
  
  async createProduct(productData: FormData): Promise<Product> {
    return apiService.post<Product>('/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
  
  async updateProduct(id: number, productData: FormData): Promise<Product> {
    // For Laravel, we need to use POST with _method=PUT for form data
    // This is because browsers can't send FormData in PUT requests properly
    productData.append('_method', 'PUT');
    
    // Make sure we don't already have a _method entry to avoid duplication
    if (Array.from(productData.entries()).filter(([key]) => key === '_method').length > 1) {
      console.warn('Multiple _method entries found, removing duplicates');
      const entries = Array.from(productData.entries());
      productData = new FormData();
      let methodAdded = false;
      
      for (const [key, value] of entries) {
        if (key === '_method') {
          if (!methodAdded) {
            productData.append(key, value);
            methodAdded = true;
          }
        } else {
          productData.append(key, value);
        }
      }
    }
    
    console.log('Making update request to products API with FormData');
    return apiService.post<Product>(`/products/${id}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
  
  async deleteProduct(id: number): Promise<void> {
    return apiService.delete(`/products/${id}`);
  }
  
  async getHeroProducts(): Promise<Product[]> {
    console.log('Calling getHeroProducts API endpoint');
    try {
      // Try the original endpoint
      const response = await apiService.get<Product[]>('/products?is_hero=1');
      console.log('API response for hero products:', response);
      
      // If we get valid results, return them
      if (response && Array.isArray(response) && response.length > 0) {
        return response;
      }
      
      // If no results, try getting all products and filtering manually
      console.log('No hero products found, getting all products to filter');
      const allProducts = await this.getAllProducts();
      const heroProducts = allProducts.filter(product => Boolean(product.is_hero));
      
      console.log('Manually filtered hero products:', heroProducts);
      return heroProducts;
    } catch (error) {
      console.error('Error in getHeroProducts:', error);
      throw error;
    }
  }
  
  async getFlagshipProducts(): Promise<Product[]> {
    return apiService.get<Product[]>('/products?is_flagship=1');
  }
  
  async updateImageOrder(productId: number, orders: {id: number, order: number}[]): Promise<any> {
    return apiService.post<any>(`/products/${productId}/images/reorder`, { orders }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  
  async updateImage(productId: number, imageId: number, imageFile: File): Promise<any> {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return apiService.post<any>(`/products/${productId}/images/${imageId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async updateSpecialProducts(data: { featured: number[], hero: number[] }): Promise<any> {
    return apiService.post<any>('/products/update-special', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export default new ProductService();
