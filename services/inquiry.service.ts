import { apiClient } from '@/lib/api-client';

export interface IInquiry {
  _id: string;
  carId: {
    _id: string;
    title: string;
    slug: string;
    coverImage: string;
    brand: string;
    model: string;
    rentalPrice?: number;
    salePrice?: number;
    listingType: string;
    contactPhone?: string;
  };
  sellerId?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  senderId?: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  message: string;
  status: 'new' | 'replied' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export const inquiryService = {
  /**
   * Submit an inquiry on a car listing
   */
  async createInquiry(data: {
    carId: string;
    senderName: string;
    senderEmail: string;
    senderPhone: string;
    message: string;
  }): Promise<IInquiry> {
    const res = await apiClient.post<IInquiry>('/inquiries', data);
    return res.data;
  },

  /**
   * Get all incoming inquiries for the logged-in vehicle owner
   */
  async getMyInquiries(): Promise<IInquiry[]> {
    const res = await apiClient.get<IInquiry[]>('/inquiries/my-inquiries');
    return res.data || [];
  },

  /**
   * Update inquiry status
   */
  async updateStatus(id: string, status: 'new' | 'replied' | 'closed'): Promise<IInquiry> {
    const res = await apiClient.put<IInquiry>(`/inquiries/${id}/status`, { status });
    return res.data;
  },

  /**
   * Delete inquiry
   */
  async deleteInquiry(id: string): Promise<void> {
    await apiClient.delete(`/inquiries/${id}`);
  },
};
