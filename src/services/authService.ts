import apiService from './apiService';
import type { LoginRequest, LoginResponse, User } from '../types/api';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>('/login', credentials);
    
    // Store token and user in local storage for persistence
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  }
  
  async logout(): Promise<void> {
    await apiService.post('/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  
  async getCurrentUser(): Promise<User | null> {
    try {
      return await apiService.get<User>('/user');
    } catch (error) {
      return null;
    }
  }
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
  
  getStoredUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

export default new AuthService();
