import apiService from './apiService';
import type { Order } from '../types/api';

class OrderService {
  async getAllOrders(): Promise<Order[]> {
    return apiService.get<Order[]>('/orders');
  }
  
  async getOrder(id: number): Promise<Order> {
    return apiService.get<Order>(`/orders/${id}`);
  }
  
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    return apiService.post<Order>('/orders', orderData);
  }
  
  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    return apiService.put<Order>(`/orders/${orderId}/status`, { status });
  }
  
  async deleteOrder(id: number): Promise<void> {
    return apiService.delete(`/orders/${id}`);
  }
}

export default new OrderService();
