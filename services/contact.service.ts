import { apiClient } from '@/lib/api-client';

export interface IContactSubmission {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface IContactMessageRecord {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
  updatedAt: string;
}

export const contactService = {
  /**
   * Submit a contact inquiry.
   */
  async submitContact(data: IContactSubmission): Promise<{ success: boolean; message: string; data: IContactMessageRecord }> {
    const res: any = await apiClient.post('/contact', data);
    return res;
  },
};
