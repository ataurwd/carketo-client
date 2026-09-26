import { apiClient } from '@/lib/api-client';

export interface RecommendedCarCard {
  id: string;
  title: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  condition: string;
  listingType: string;
  rentalPrice?: number;
  salePrice?: number;
  price?: number;
  bodyType: string;
  fuelType: string;
  transmission: string;
  seats: number;
  location: string;
  coverImage: string;
  rating: number;
  availability: boolean;
  isAlternative: boolean;
  matchReasons: string[];
  differenceNote?: string;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'assistant';
  content: string;
  recommendedCars?: RecommendedCarCard[];
  timestamp?: string;
}

export interface SuggestedPrompt {
  id: string;
  category: string;
  label: string;
  prompt: string;
}

export const aiService = {
  async chat(messages: { role: 'user' | 'model' | 'assistant'; content: string }[]): Promise<{
    reply: string;
    recommendedCars?: RecommendedCarCard[];
    extractedIntent?: string;
  }> {
    const res: any = await apiClient.post(
      '/ai-assistant/chat',
      { messages },
      { timeout: 35000 }
    );
    return res.data || res;
  },

  async getPrompts(): Promise<SuggestedPrompt[]> {
    try {
      const res: any = await apiClient.get('/ai-assistant/prompts', { timeout: 8000 });
      return res.data || [];
    } catch {
      return [
        {
          id: 'rent-suv',
          category: 'Rental',
          label: '🚗 Rent an SUV in Dhaka',
          prompt: 'I need an SUV for rent in Dhaka for 3 days, budget around ৳15,000.',
        },
        {
          id: 'buy-toyota',
          category: 'Purchase',
          label: '💰 Buy a used Toyota under ৳3M',
          prompt: 'I want to buy a used Toyota sedan or SUV under ৳3,000,000.',
        },
        {
          id: 'hybrid-cars',
          category: 'Eco Cars',
          label: '⚡ Hybrid rental vehicles',
          prompt: 'What hybrid cars do you have available for rent?',
        },
        {
          id: 'sell-car',
          category: 'Selling',
          label: '🏷️ Sell a Car / গাড়ি বিক্রি',
          prompt: 'আমি গাড়ি বিক্রি করতে চাই, কীভাবে বিক্রি করবো?',
        },
        {
          id: 'compare-popular',
          category: 'Comparison',
          label: '⚖️ Compare Yaris vs Vezel',
          prompt: 'Can you compare the Toyota Yaris and Honda Vezel?',
        },
      ];
    }
  },
};
