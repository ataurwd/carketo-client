import { apiClient } from '@/lib/api-client';
import { IUser } from '@/types/auth.types';

export const authService = {
  async getMe(): Promise<IUser | null> {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data as IUser;
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // ignore
    }
  },
};
