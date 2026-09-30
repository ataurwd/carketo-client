import { apiClient } from '@/lib/api-client';

export interface IChatMessage {
  _id?: string;
  senderId?: string;
  senderRole: 'buyer' | 'seller';
  senderName: string;
  text: string;
  createdAt: string;
}

export interface IChatReport {
  _id?: string;
  reporterId?: string;
  reporterRole: 'buyer' | 'seller';
  reporterName: string;
  reporterPhone?: string;
  reportedUserId?: string;
  reportedUserName: string;
  reportedUserPhone?: string;
  category?: string;
  reason: string;
  alsoBlocked: boolean;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface IInquiry {
  _id: string;
  carId?: {
    _id: string;
    title: string;
    slug: string;
    coverImage: string;
    brand?: string;
    model?: string;
    rentalPrice?: number;
    salePrice?: number;
    listingType?: string;
    contactPhone?: string;
  };
  externalCarId?: string;
  carSnapshot?: {
    _id: string;
    title: string;
    slug: string;
    coverImage: string;
    brand?: string;
    model?: string;
    rentalPrice?: number;
    salePrice?: number;
    listingType?: string;
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
  messages?: IChatMessage[];
  status: 'new' | 'replied' | 'closed';
  isBlocked?: boolean;
  blockedByUserId?: string;
  blockedByRole?: 'buyer' | 'seller';
  blockedByName?: string;
  blockedReason?: string;
  blockedAt?: string;
  reports?: IChatReport[];
  createdAt: string;
  updatedAt: string;
}

export const inquiryService = {
  /**
   * Submit an inquiry or initial live chat message on a car listing
   */
  async createInquiry(data: {
    carId: string;
    carSnapshot?: {
      _id?: string;
      title: string;
      slug: string;
      coverImage: string;
      brand?: string;
      model?: string;
      listingType?: string;
      salePrice?: number;
      rentalPrice?: number;
      contactPhone?: string;
    };
    senderName: string;
    senderEmail: string;
    senderPhone: string;
    message: string;
  }): Promise<IInquiry> {
    const res = await apiClient.post<IInquiry>('/inquiries', data);
    return res.data;
  },

  /**
   * Get active live chat thread for a specific car and buyer
   */
  async getCarThread(carId: string, phone?: string): Promise<IInquiry | null> {
    const res = await apiClient.get<IInquiry | null>('/inquiries/thread', {
      params: { carId, ...(phone ? { phone } : {}) },
    });
    return res.data || null;
  },

  /**
   * Get a single inquiry/chat conversation by ID
   */
  async getInquiryById(id: string): Promise<IInquiry> {
    const res = await apiClient.get<IInquiry>(`/inquiries/${id}`);
    return res.data;
  },

  /**
   * Send a live chat message in an existing inquiry thread
   */
  async sendMessage(
    inquiryId: string,
    data: {
      text: string;
      senderName?: string;
      senderRole?: 'buyer' | 'seller';
    }
  ): Promise<IInquiry> {
    const res = await apiClient.post<IInquiry>(`/inquiries/${inquiryId}/messages`, data);
    return res.data;
  },

  /**
   * Block or unblock a conversation
   */
  async toggleBlock(
    inquiryId: string,
    data: {
      isBlocked: boolean;
      actorRole?: 'buyer' | 'seller';
      actorName?: string;
      reason?: string;
    }
  ): Promise<IInquiry> {
    const res = await apiClient.put<IInquiry>(`/inquiries/${inquiryId}/block`, data);
    return res.data;
  },

  /**
   * Report a user in a conversation with reason and optional block
   */
  async reportUser(
    inquiryId: string,
    data: {
      reason: string;
      category?: string;
      alsoBlock?: boolean;
      reporterRole?: 'buyer' | 'seller';
      reporterName?: string;
      reporterPhone?: string;
    }
  ): Promise<IInquiry> {
    const res = await apiClient.post<IInquiry>(`/inquiries/${inquiryId}/report`, data);
    return res.data;
  },

  /**
   * Get all inquiries/chat threads for the logged-in user (both as seller and buyer)
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
