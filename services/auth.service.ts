import { apiClient } from '@/lib/api-client';
import { IUser } from '@/types/auth.types';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'provider';
  providerType?: 'seller' | 'rental' | 'both';
  phone?: string;
}

export interface AuthResponse {
  user: IUser;
  accessToken: string;
}

export const authService = {
  async register(data: RegisterDTO): Promise<AuthResponse> {
    const response: any = await apiClient.post('/auth/register', data);
    return response.data;
  },

  async login(data: LoginDTO): Promise<AuthResponse> {
    const response: any = await apiClient.post('/auth/login', data);
    return response.data;
  },

  async getMe(): Promise<IUser | null> {
    try {
      const response: any = await apiClient.get('/auth/me');
      return response.data as IUser;
    } catch {
      return null;
    }
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response: any = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const response: any = await apiClient.post('/auth/reset-password', { token, password });
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // ignore
    }
  },

  getGoogleAuthUrl(): string {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, '') || 'http://localhost:5000';
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    const originParam = currentOrigin ? `?origin=${encodeURIComponent(currentOrigin)}` : '';
    return `${backendUrl}/api/auth/google${originParam}`;
  },
};
