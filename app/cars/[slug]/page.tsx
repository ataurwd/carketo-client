'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { fallbackCars } from '@/services/car.service';
import { bookingService } from '@/services/booking.service';
import { orderService } from '@/services/order.service';
import { wishlistService } from '@/services/wishlist.service';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import {
  DoorClosed,
  Users,
  Gauge,
  Calendar,
  Briefcase,
  Wind,
  CheckCircle2,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  Milestone,
  MessageCircle,
  Heart,
  X,
  Clock,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';

export default function CarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Modals state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);

  // Booking Form State
  const [pickupDate, setPickupDate] = useState('2026-09-01');
  const [returnDate, setReturnDate] = useState('2026-09-05');
  const [pickupLocation, setPickupLocation] = useState('New York, JFK Terminal 4');
  const [returnLocation, setReturnLocation] = useState('New York, JFK Terminal 4');
  const [insuranceOption, setInsuranceOption] = useState<'standard' | 'premium' | 'zero-excess'>('standard');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Purchase Form State
  const [contactPhone, setContactPhone] = useState('+1 (555) 0199');
  const [city, setCity] = useState('New York');
  const [street, setStreet] = useState('5th Avenue, Suite 100');
  const [zipCode, setZipCode] = useState('10022');
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  // Find car by slug or fallback to the first car
  const car = fallbackCars.find((c) => c.slug === slug) || fallbackCars[0];

  // Pricing calculations
  const calculateDays = () => {
    const start = new Date(pickupDate).getTime();
    const end = new Date(returnDate).getTime();
    if (isNaN(start) || isNaN(end) || end <= start) return 1;
    return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  };

  const days = calculateDays();
  const dailyRate = car.rentalPrice || 199;
  const rentalAmount = dailyRate * days;
  const securityDeposit = car.rentalDeposit || 500;
  const insuranceFee = insuranceOption === 'premium' ? 25 * days : insuranceOption === 'zero-excess' ? 45 * days : 0;
  const totalRentalPrice = rentalAmount + securityDeposit + insuranceFee;

  const handleToggleWishlist = async () => {
    setIsWishlisted(!isWishlisted);
    try {
      await wishlistService.toggle(car._id);
    } catch {
      // optimistic toggle
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    try {
      await bookingService.createBooking({
        carId: car._id,
        startDate: new Date(pickupDate).toISOString(),
        endDate: new Date(returnDate).toISOString(),
        pickupLocation,
        returnLocation,
        insuranceOption,
      });
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingModalOpen(false);
        router.push('/dashboard');
      }, 1500);
    } catch {
      // Offline fallback mock confirmation
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingModalOpen(false);
        router.push('/dashboard');
      }, 1500);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setPurchaseLoading(true);
    try {
      await orderService.createOrder({
        carId: car._id,
        contactPhone,
        deliveryOption: 'doorstep',
        deliveryAddress: { street, city, country: 'USA', zipCode },
      });
      setPurchaseSuccess(true);
      setTimeout(() => {
        setPurchaseModalOpen(false);
        router.push('/dashboard');
      }, 1500);
    } catch {
      setPurchaseSuccess(true);
      setTimeout(() => {
        setPurchaseModalOpen(false);
        router.push('/dashboard');
      }, 1500);
    } finally {
      setPurchaseLoading(false);
    }
  };

  const policyItems: AccordionItem[] = [
    {
      id: 'license',
      title: "Driver's License Requirements",
      content:
        'A valid, unexpired national or international driver’s license held for at least 1 year is required at vehicle handover. Digital copies are accepted during pre-verification.',
    },
    {
      id: 'insurance',
      title: 'Insurance and Coverage Policy',
      content:
        'All rentals include standard comprehensive insurance covering collision damage waiver (CDW), third-party liability, and theft protection with zero excess deductible options.',
    },
    {
      id: 'payment',
      title: 'Available Payment Methods',
      content:
        'We accept all major credit cards (Visa, MasterCard, Amex), Google Pay, Apple Pay, and verified wire transfers. Security deposits are released instantly upon return.',
    },
    {
      id: 'cancellation',
      title: 'Cancellation and Modification Policy',
      content:
        'Free cancellations are permitted up to 24 hours prior to scheduled pick-up time with 100% full refund.',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* 1. TOP HERO HEADER */}
      <section className="relative bg-black text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <img
            src={car.coverImage}
            alt="Hero BG"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {car.title}
          </h1>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-zinc-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/cars" className="hover:text-white transition-colors">
              Cars
            </Link>
            <span>/</span>
            <span className="text-white font-bold">{car.title}</span>
          </div>
        </div>
      </section>

      {/* 2. MAIN 2-COLUMN CONTENT SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Pricing, CTAs & Specs (4 Cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-card space-y-6">
              {/* Pricing Header */}
              <div className="border-b border-zinc-100 pb-4 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black text-black">
                      {formatPrice(car.rentalPrice || 329)}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      / Per Day
                    </span>
                  </div>
                  {car.salePrice && (
                    <p className="text-xs font-bold text-zinc-500 mt-1">
                      Or Buy Outright: <span className="text-black font-black">{formatPrice(car.salePrice)}</span>
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className={`h-11 w-11 rounded-full border flex items-center justify-center transition-colors ${
                    isWishlisted
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'border-zinc-200 text-zinc-400 hover:text-black hover:border-black'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Specs Table */}
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
                  <div className="flex items-center gap-2">
                    <DoorClosed className="w-4 h-4 text-zinc-400" />
                    <span>Doors</span>
                  </div>
                  <span className="font-bold text-black">{car.specs.doors}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-zinc-400" />
                    <span>Passengers</span>
                  </div>
                  <span className="font-bold text-black">{car.specs.passengers}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-zinc-400" />
                    <span>Transmission</span>
                  </div>
                  <span className="font-bold text-black">{car.specs.transmission}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    <span>Year</span>
                  </div>
                  <span className="font-bold text-black">{car.year}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-zinc-400" />
                    <span>Luggage</span>
                  </div>
                  <span className="font-bold text-black">{car.specs.luggage}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 text-zinc-600">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-zinc-400" />
                    <span>Air Condition</span>
                  </div>
                  <span className="font-bold text-black">
                    {car.specs.airCondition ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              {/* Action CTAs */}
              <div className="space-y-2 pt-2">
                <Button
                  variant="dark"
                  size="lg"
                  onClick={() => setBookingModalOpen(true)}
                  className="w-full text-sm font-bold shadow-md hover:bg-black"
                  rightIcon={<ArrowUpRight className="w-4 h-4" />}
                >
                  Book Rental Now
                </Button>

                {car.salePrice && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setPurchaseModalOpen(true)}
                    className="w-full text-sm font-bold"
                    leftIcon={<ShoppingBag className="w-4 h-4" />}
                  >
                    Purchase Vehicle ({formatPrice(car.salePrice)})
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Gallery, Features, Amenities & Policies (8 Cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Image Slider */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-3xl bg-zinc-900 aspect-[16/10] shadow-xl border border-zinc-200">
                <img
                  src={car.images[activeImageIndex] || car.coverImage}
                  alt={car.title}
                  className="w-full h-full object-cover transition-all duration-500"
                />
              </div>

              {/* Slider Dots */}
              <div className="flex items-center justify-center gap-2 pt-1">
                {car.images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      activeImageIndex === idx
                        ? 'w-8 bg-black'
                        : 'w-2.5 bg-zinc-300 hover:bg-zinc-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Unlimited KMs Highlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-zinc-100 text-black flex items-center justify-center shrink-0 border border-zinc-200">
                  <Milestone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Unlimited Mileage</h4>
                  <p className="text-xs text-zinc-500">Endless miles with zero excess fee</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-zinc-100 text-black flex items-center justify-center shrink-0 border border-zinc-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">100% Insured</h4>
                  <p className="text-xs text-zinc-500">Comprehensive collision & theft policy</p>
                </div>
              </div>
            </div>

            {/* General Information Section */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 text-zinc-500 font-bold text-xs uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Vehicle Overview</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-black">
                Know about our car service
              </h2>

              <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                {car.description}
              </p>

              <div className="space-y-2.5 pt-2">
                {car.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-zinc-800">
                    <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities & Features Section */}
            <div className="space-y-4 pt-4 border-t border-zinc-200">
              <div className="inline-flex items-center gap-1.5 text-zinc-500 font-bold text-xs uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Amenities</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-black">
                Premium amenities and features
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {car.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Policies & Agreement Accordion */}
            <div className="space-y-4 pt-4 border-t border-zinc-200">
              <div className="inline-flex items-center gap-1.5 text-zinc-500 font-bold text-xs uppercase tracking-widest">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Rental Conditions</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-black">
                Policies and agreement
              </h2>

              <Accordion items={policyItems} defaultOpenId="license" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE RENTAL BOOKING MODAL */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-6 right-6 text-zinc-400 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-black">Rental Reserved!</h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  Your reservation for {car.title} is confirmed. Redirecting to your dashboard...
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateBooking} className="space-y-5">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Direct Rental Booking
                  </span>
                  <h3 className="text-xl font-black text-black">{car.title}</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Pickup Date"
                    type="date"
                    required
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                  />
                  <Input
                    label="Return Date"
                    type="date"
                    required
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Pickup Location"
                    required
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                  />
                  <Input
                    label="Return Location"
                    required
                    value={returnLocation}
                    onChange={(e) => setReturnLocation(e.target.value)}
                  />
                </div>

                {/* Insurance Selector */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Insurance Protection
                  </label>
                  <select
                    value={insuranceOption}
                    onChange={(e: any) => setInsuranceOption(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:border-black"
                  >
                    <option value="standard">Standard CDW (Included - $0)</option>
                    <option value="premium">Premium Protection (+$25/day)</option>
                    <option value="zero-excess">Zero-Excess VIP Cover (+$45/day)</option>
                  </select>
                </div>

                {/* Price Breakdown */}
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-600">
                    <span>
                      {days} Days × {formatPrice(dailyRate)}
                    </span>
                    <span className="font-bold text-black">{formatPrice(rentalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Refundable Security Deposit</span>
                    <span className="font-bold text-black">{formatPrice(securityDeposit)}</span>
                  </div>
                  {insuranceFee > 0 && (
                    <div className="flex justify-between text-zinc-600">
                      <span>Insurance Fee</span>
                      <span className="font-bold text-black">{formatPrice(insuranceFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black text-black border-t border-zinc-200 pt-2">
                    <span>Total Due Now</span>
                    <span>{formatPrice(totalRentalPrice)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="dark"
                  size="lg"
                  isLoading={bookingLoading}
                  className="w-full font-bold shadow-md hover:bg-black"
                >
                  Confirm & Reserve Vehicle
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 4. INTERACTIVE DIRECT PURCHASE MODAL */}
      {purchaseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setPurchaseModalOpen(false)}
              className="absolute top-6 right-6 text-zinc-400 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            {purchaseSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-black">Purchase Order Submitted!</h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  The dealership is processing your order for {car.title}. Redirecting to your dashboard...
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateOrder} className="space-y-5">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Direct Car Purchase
                  </span>
                  <h3 className="text-xl font-black text-black">{car.title}</h3>
                </div>

                <Input
                  label="Contact Phone"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 (555) 0199"
                />

                <Input
                  label="Delivery Street Address"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Street & Apartment Number"
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="City"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New York"
                  />
                  <Input
                    label="ZIP Code"
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="10022"
                  />
                </div>

                {/* Purchase Cost Breakdown */}
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-600">
                    <span>Vehicle Base Price</span>
                    <span className="font-bold text-black">{formatPrice(car.salePrice || 50000)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Estimated Sales Tax (7%)</span>
                    <span className="font-bold text-black">{formatPrice(Math.round((car.salePrice || 50000) * 0.07))}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Doorstep Enclosed Delivery</span>
                    <span className="font-bold text-black">{formatPrice(499)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-black border-t border-zinc-200 pt-2">
                    <span>Total Purchase Value</span>
                    <span>{formatPrice((car.salePrice || 50000) + Math.round((car.salePrice || 50000) * 0.07) + 499)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="dark"
                  size="lg"
                  isLoading={purchaseLoading}
                  className="w-full font-bold shadow-md hover:bg-black"
                >
                  Submit Purchase Order
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
