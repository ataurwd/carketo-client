import { apiClient } from '@/lib/api-client';
import { ICar } from '@/types/car.types';

export const fallbackCars: ICar[] = [
  {
    _id: 'car-001',
    title: 'Viper SXT Coupe Sports',
    slug: 'viper-sxt-coupe-sports',
    brand: 'Dodge',
    model: 'Viper SXT',
    year: 2024,
    listingType: 'both',
    rentalPrice: 329,
    rentalDeposit: 1000,
    salePrice: 89000,
    price: 89000,
    coverImage:
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
    ],
    location: 'New York, JFK Terminal 4',
    status: 'published',
    specs: {
      passengers: 2,
      doors: 2,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      bodyType: 'Coupe',
      mileage: 4500,
      engineCapacity: '8.4L V10',
      horsepower: 645,
      acceleration0to100: 3.4,
      topSpeed: 332,
      luggage: 2,
      airCondition: true,
      age: 1,
    },
    features: [
      'Leather Sport Bucket Seats',
      'Harmon Kardon 12-Speaker Sound System',
      'Carbon Fiber Aero Package',
      'Launch Control & Track Mode Telemetry',
      'Active Adaptive Suspension',
    ],
    amenities: [
      'Apple CarPlay & Android Auto',
      'Keyless Entry & Push Button Start',
      'Reversing Camera & Parking Sensors',
      'Built-in GPS Navigation',
      'Bluetooth Wireless Audio',
      'Heated Steering Wheel',
    ],
    description:
      'The Dodge Viper SXT combines raw American supercar performance with precision track engineering. Featuring an 8.4-liter V10 powerhouse paired with adaptive aerodynamics, this vehicle offers unmatched thrills on highways and winding coastal roads alike.',
    rating: 4.9,
    totalReviews: 28,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'car-002',
    title: 'Porsche 911 Carrera 4S',
    slug: 'porsche-911-carrera-4s',
    brand: 'Porsche',
    model: '911 Carrera 4S',
    year: 2024,
    listingType: 'both',
    rentalPrice: 420,
    rentalDeposit: 1500,
    salePrice: 142000,
    price: 142000,
    coverImage:
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    ],
    location: 'Miami, South Beach Executive Hub',
    status: 'published',
    specs: {
      passengers: 4,
      doors: 2,
      transmission: 'Dual-Clutch',
      fuelType: 'Petrol',
      bodyType: 'Coupe',
      mileage: 2200,
      engineCapacity: '3.0L Twin-Turbo Flat-6',
      horsepower: 443,
      acceleration0to100: 3.2,
      topSpeed: 308,
      luggage: 2,
      airCondition: true,
      age: 1,
    },
    features: [
      'Porsche Doppelkupplung (PDK) 8-Speed',
      'Sport Chrono Package',
      'PASM Active Suspension Management',
      'Matrix LED Headlights with PDLS Plus',
    ],
    amenities: [
      'Wireless Apple CarPlay',
      'Bose Surround Sound System',
      'Panoramic Sunroof',
      'Adaptive Cruise Control',
      'Dual-Zone Climate Control',
      'Lane Keep Assist',
    ],
    description:
      'The iconic Porsche 911 Carrera 4S delivers everyday usability with precision German racing dynamics. With all-wheel drive stability and explosive twin-turbo acceleration, it represents timeless automotive perfection.',
    rating: 5.0,
    totalReviews: 42,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'car-003',
    title: 'BMW M4 Competition Coupe',
    slug: 'bmw-m4-competition-coupe',
    brand: 'BMW',
    model: 'M4 Competition',
    year: 2024,
    listingType: 'rent',
    rentalPrice: 289,
    rentalDeposit: 1000,
    coverImage:
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
    ],
    location: 'Los Angeles, LAX Airport Depot',
    status: 'published',
    specs: {
      passengers: 4,
      doors: 2,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      bodyType: 'Coupe',
      mileage: 6100,
      engineCapacity: '3.0L M TwinPower Turbo',
      horsepower: 503,
      acceleration0to100: 3.8,
      topSpeed: 290,
      luggage: 3,
      airCondition: true,
      age: 1,
    },
    features: [
      'M xDrive All-Wheel System',
      'Carbon Fiber Roof & Interior Trim',
      'M Sport Differential',
      'Head-Up Display',
    ],
    amenities: [
      'Harman Kardon Surround Sound',
      'Wireless Device Charging',
      'Heated M Sport Seats',
      'Parking Assistant Plus 360 Camera',
      'Apple CarPlay & Android Auto',
    ],
    description:
      'The BMW M4 Competition Coupe merges supreme luxury with ferocious M-power. Crafted for drivers who demand exhilarating track feedback combined with opulent grand touring comfort.',
    rating: 4.8,
    totalReviews: 19,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'car-004',
    title: 'Mercedes-AMG GT 4-Door Coupe',
    slug: 'mercedes-amg-gt-4-door-coupe',
    brand: 'Mercedes-Benz',
    model: 'AMG GT 4-Door',
    year: 2024,
    listingType: 'sale',
    salePrice: 118000,
    price: 118000,
    coverImage:
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
    ],
    location: 'Chicago, Downtown Showroom',
    status: 'published',
    specs: {
      passengers: 5,
      doors: 4,
      transmission: 'Automatic',
      fuelType: 'Hybrid',
      bodyType: 'Sedan',
      mileage: 1200,
      engineCapacity: '4.0L V8 Biturbo + EQ Boost',
      horsepower: 577,
      acceleration0to100: 3.3,
      topSpeed: 315,
      luggage: 4,
      airCondition: true,
      age: 1,
    },
    features: [
      'AMG Performance 4MATIC+',
      'Burmester High-End 3D Surround Sound',
      'Nappa Leather Executive Rear Console',
      'AMG Ride Control Air Suspension',
    ],
    amenities: [
      'MBUX Augmented Reality Navigation',
      'Panoramic Glass Roof',
      'Massaging Front & Rear Seats',
      'Ambient LED Interior Lighting (64 Colors)',
      'Wireless Charging',
    ],
    description:
      'The Mercedes-AMG GT 4-Door Coupe is the pinnacle of ultra-luxury performance sedans. Commanding performance and spacious seating make it the ultimate grand touring machine.',
    rating: 4.9,
    totalReviews: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const carService = {
  async getCars(params?: Record<string, any>) {
    try {
      const res: any = await apiClient.get('/cars', { params });
      return res.data;
    } catch {
      return fallbackCars;
    }
  },

  async getFeaturedCars(): Promise<ICar[]> {
    try {
      const res: any = await apiClient.get('/cars/featured');
      return res.data;
    } catch {
      return fallbackCars;
    }
  },

  async getCarBySlug(slug: string): Promise<ICar> {
    try {
      const res: any = await apiClient.get(`/cars/${slug}`);
      return res.data;
    } catch {
      const found = fallbackCars.find((c) => c.slug === slug);
      if (found) return found;
      return fallbackCars[0];
    }
  },

  async createCar(data: any): Promise<ICar> {
    const res: any = await apiClient.post('/cars', data);
    return res.data;
  },

  async updateCar(carId: string, data: any): Promise<ICar> {
    const res: any = await apiClient.put(`/cars/${carId}`, data);
    return res.data;
  },

  async deleteCar(carId: string): Promise<{ message: string }> {
    const res: any = await apiClient.delete(`/cars/${carId}`);
    return res.data;
  },

  async getMyFleet(): Promise<ICar[]> {
    try {
      const res: any = await apiClient.get('/cars/provider/my-fleet');
      return res.data;
    } catch {
      return fallbackCars;
    }
  },
};
