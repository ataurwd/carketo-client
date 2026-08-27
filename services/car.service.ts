import { apiClient } from '@/lib/api-client';
import { ICar, ICarFilters } from '@/types/car.types';

export const carService = {
  // Get all cars with optional filters
  async getCars(filters?: ICarFilters): Promise<{ cars: ICar[]; total: number }> {
    try {
      const response = await apiClient.get('/cars', { params: filters });
      return response.data as { cars: ICar[]; total: number };
    } catch {
      // Fallback mock data for demo / offline
      return { cars: fallbackCars, total: fallbackCars.length };
    }
  },

  // Get car by slug
  async getCarBySlug(slug: string): Promise<ICar | null> {
    try {
      const response = await apiClient.get(`/cars/${slug}`);
      return response.data as ICar;
    } catch {
      const found = fallbackCars.find((c) => c.slug === slug);
      return found || fallbackCars[0];
    }
  },
};

// Fallback mockup cars matching NovaRide designs for instant interactive UI
export const fallbackCars: ICar[] = [
  {
    _id: '1',
    slug: 'viper-sxt',
    title: 'Viper SXT Coupe Sports',
    brand: 'Dodge',
    model: 'Viper SXT',
    year: 2024,
    condition: 'new',
    listingType: 'rent',
    rentalPrice: 329,
    salePrice: 89500,
    location: 'Los Angeles, Downtown',
    description:
      'The Viper SXT combines sheer track power with road elegance. Featuring a roaring engine, premium leather trim, and razor-sharp steering dynamics.',
    specs: {
      doors: 4,
      passengers: 2,
      transmission: 'Automatic',
      age: 1,
      year: 2024,
      luggage: 3,
      airCondition: true,
      mileage: 4500,
      fuelType: 'Petrol',
      bodyType: 'Coupe',
      engineSize: '6.2L V8',
      horsePower: 645,
    },
    features: [
      '24/7 Roadside Assistance',
      'Free Cancellation & Return',
      'Rent Now Pay When You Arrive',
      'Unlimited KMs',
    ],
    amenities: [
      'Music System',
      'Toolkit',
      'Abs System',
      'Bluetooth',
      'Full Boot Space',
      'Usb Charger',
      'Aux Input',
      'Spare Tyre',
      'Power Steering',
      'Power Windows',
    ],
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
    ],
    coverImage:
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    provider: {
      id: 'prov-1',
      name: 'NovaRide Premium Fleet',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 4.9,
      totalReviews: 128,
      phone: '+1 (555) 234-5678',
    },
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-08-20T00:00:00.000Z',
  },
  {
    _id: '2',
    slug: 'bmw-m4-competition',
    title: 'BMW M4 Competition Coupe',
    brand: 'BMW',
    model: 'M4 Competition',
    year: 2024,
    condition: 'new',
    listingType: 'both',
    rentalPrice: 289,
    salePrice: 78000,
    location: 'Miami, South Beach',
    description:
      'Experience the pinnacle of German performance engineering with precision handling, adaptive M suspension, and head-turning aerodynamic lines.',
    specs: {
      doors: 2,
      passengers: 4,
      transmission: 'Automatic',
      year: 2024,
      luggage: 2,
      airCondition: true,
      mileage: 2200,
      fuelType: 'Petrol',
      bodyType: 'Coupe',
      engineSize: '3.0L Twin-Turbo',
      horsePower: 503,
    },
    features: ['Unlimited KMs', 'Free Delivery to Airport', 'Collision Damage Waiver Included'],
    amenities: [
      'Music System',
      'Harman Kardon Sound',
      'Bluetooth',
      'Heated Seats',
      'Wireless Apple CarPlay',
      'Backup Camera',
    ],
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    ],
    coverImage:
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    provider: {
      id: 'prov-2',
      name: 'Bavarian Luxury Motors',
      rating: 4.8,
      totalReviews: 95,
    },
    createdAt: '2026-02-15T00:00:00.000Z',
    updatedAt: '2026-08-22T00:00:00.000Z',
  },
  {
    _id: '3',
    slug: 'mercedes-amg-gt',
    title: 'Mercedes-Benz AMG GT Black Series',
    brand: 'Mercedes-Benz',
    model: 'AMG GT',
    year: 2023,
    condition: 'certified',
    listingType: 'sale',
    salePrice: 145000,
    rentalPrice: 450,
    location: 'New York, Manhattan',
    description:
      'Direct from the racetrack. Handcrafted AMG 4.0L V8 Biturbo engine producing extraordinary thrills.',
    specs: {
      doors: 2,
      passengers: 2,
      transmission: 'Automatic',
      year: 2023,
      luggage: 2,
      airCondition: true,
      mileage: 8900,
      fuelType: 'Petrol',
      bodyType: 'Supercar',
      engineSize: '4.0L V8 Biturbo',
      horsePower: 720,
    },
    features: ['Certified Pre-Owned', 'Single Owner', 'Extended 3-Year Warranty'],
    amenities: [
      'Burmester Surround Sound',
      'Ceramic Brakes',
      'Carbon Fiber Aero Package',
      'Navigation',
      'Keyless Go',
    ],
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
    ],
    coverImage:
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    provider: {
      id: 'prov-3',
      name: 'Manhattan Exotic Cars',
      rating: 5.0,
      totalReviews: 64,
    },
    createdAt: '2026-03-01T00:00:00.000Z',
    updatedAt: '2026-08-25T00:00:00.000Z',
  },
  {
    _id: '4',
    slug: 'porsche-taycan-turbo-s',
    title: 'Porsche Taycan Turbo S Electric',
    brand: 'Porsche',
    model: 'Taycan',
    year: 2024,
    condition: 'new',
    listingType: 'both',
    rentalPrice: 350,
    salePrice: 165000,
    location: 'San Francisco, CA',
    description:
      'Pure electric emotion. Accelerates from 0 to 60 mph in 2.6 seconds with launch control.',
    specs: {
      doors: 4,
      passengers: 4,
      transmission: 'Automatic',
      year: 2024,
      luggage: 3,
      airCondition: true,
      mileage: 1200,
      fuelType: 'Electric',
      bodyType: 'Sedan',
      horsePower: 750,
    },
    features: ['Fast DC Charging 800V', 'Zero Emissions', 'Porsche Connect Service'],
    amenities: [
      'Bose Surround Sound',
      'Panoramic Roof',
      'Adaptive Cruise Control',
      'Lane Keep Assist',
      'Air Suspension',
    ],
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    ],
    coverImage:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    provider: {
      id: 'prov-4',
      name: 'Silicon Valley Motors',
      rating: 4.9,
      totalReviews: 82,
    },
    createdAt: '2026-03-10T00:00:00.000Z',
    updatedAt: '2026-08-26T00:00:00.000Z',
  },
];
