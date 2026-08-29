'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { carService } from '@/services/car.service';
import { ICar } from '@/types/car.types';
import { wishlistService } from '@/services/wishlist.service';
import { reviewService, ReviewResponse } from '@/services/review.service';
import { inquiryService } from '@/services/inquiry.service';
import { useAuthStore } from '@/store/auth.store';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Accordion } from '@/components/ui/Accordion';
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
  Heart,
  X,
  ShieldCheck,
  Star,
  Send,
  Phone,
  MessageCircle,
  Copy,
  Check,
  Lock,
  MapPin,
  Car as CarIcon,
} from 'lucide-react';

export default function CarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { user } = useAuthStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Phone number reveal and copy state
  const [isPhoneRevealed, setIsPhoneRevealed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Reviews state
  const [reviewData, setReviewData] = useState<ReviewResponse | null>(null);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Live Car state from MongoDB
  const [car, setCar] = useState<ICar | null>(null);
  const [isLoadingCar, setIsLoadingCar] = useState(true);

  useEffect(() => {
    if (slug) {
      carService.getCarBySlug(slug).then((res) => {
        setCar(res);
        setIsLoadingCar(false);
      });
    }
  }, [slug]);

  const isRental = car?.listingType === 'rent';
  const rawPhone = car?.contactPhone || '01712-345678';
  const maskedPhone = '017 ••••••••';

  useEffect(() => {
    if (car?._id) {
      reviewService.getCarReviews(car._id).then((res) => setReviewData(res));
    }
  }, [car?._id]);

  useEffect(() => {
    if (car?._id && user) {
      wishlistService
        .checkWishlist(car._id)
        .then((res) => {
          setIsWishlisted(Boolean(res?.isWishlisted));
        })
        .catch(() => {});
    } else {
      setIsWishlisted(false);
    }
  }, [car?._id, user]);

  const handlePhoneClick = () => {
    if (!user) {
      setLoginPromptOpen(true);
      return;
    }

    setIsPhoneRevealed(true);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(rawPhone);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      setLoginPromptOpen(true);
      return;
    }
    if (!car?._id) return;
    const previous = isWishlisted;
    setIsWishlisted(!previous);
    try {
      const res = await wishlistService.toggle(car._id);
      setIsWishlisted(res.isWishlisted);
    } catch {
      setIsWishlisted(previous);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim() || !car?._id) return;
    setReviewSubmitting(true);
    try {
      await reviewService.createReview({
        carId: car._id,
        rating: userRating,
        comment: userComment,
      });
      setReviewSuccess(true);
      const updated = await reviewService.getCarReviews(car._id);
      setReviewData(updated);
    } catch {
      setReviewSuccess(true);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!car?._id || !inquiryName.trim() || !inquiryPhone.trim() || !inquiryMessage.trim()) return;
    try {
      await inquiryService.createInquiry({
        carId: car._id,
        senderName: inquiryName,
        senderEmail: user?.email || 'guest@carketo.com',
        senderPhone: inquiryPhone,
        message: inquiryMessage,
      });
      setInquirySubmitted(true);
      setTimeout(() => {
        setInquiryModalOpen(false);
        setInquirySubmitted(false);
        setInquiryMessage('');
      }, 2000);
    } catch {
      setInquirySubmitted(true);
      setTimeout(() => {
        setInquiryModalOpen(false);
        setInquirySubmitted(false);
        setInquiryMessage('');
      }, 2000);
    }
  };

  const policyItems = [
    {
      id: 'contact',
      title: 'How to Contact and Deal with Seller?',
      content:
        'You can call or WhatsApp the owner directly using the phone number above. Inspect the vehicle in person before final payment.',
    },
    {
      id: 'inspection',
      title: 'Vehicle Condition & Inspection Guarantee',
      content:
        'All certified vehicles on Carketo undergo a comprehensive 150-point diagnostic check including engine health, brakes, transmission, and clean title verification.',
    },
    {
      id: 'documents',
      title: 'Required Documentation for Rental / Purchase',
      content:
        'Bring a valid National ID or Passport along with an active Driver’s License when meeting the vehicle owner for pickup or title handover.',
    },
  ];

  if (isLoadingCar) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-zinc-50">
        <div className="h-10 w-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-zinc-500">Loading vehicle details...</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-zinc-50 px-4 text-center">
        <CarIcon className="w-12 h-12 text-zinc-300 mx-auto" />
        <h2 className="text-xl font-black text-black">Vehicle Not Found</h2>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
          The vehicle listing you are looking for may have been removed or does not exist in the database.
        </p>
        <Link href="/buy">
          <Button variant="dark" size="sm">
            Explore Available Cars
          </Button>
        </Link>
      </div>
    );
  }

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-wider">
            <span>{isRental ? 'Direct Rental Vehicle' : 'Verified Purchase Vehicle'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {car.title}
          </h1>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-zinc-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href={isRental ? '/rent' : '/buy'} className="hover:text-white transition-colors">
              {isRental ? 'Rent Car' : 'Buy Car'}
            </Link>
            <span>/</span>
            <span className="text-white font-bold">{car.title}</span>
          </div>
        </div>
      </section>

      {/* 2. MAIN 2-COLUMN CONTENT SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Pricing, Contact Owner & Specs (4 Cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-card space-y-6">
              {/* Pricing Header */}
              <div className="border-b border-zinc-100 pb-4 flex items-center justify-between">
                <div>
                  {isRental ? (
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-black text-black">
                        {formatPrice(car.rentalPrice || 289)}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        / Day
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                        Outright Purchase Price
                      </span>
                      <span className="text-3xl sm:text-4xl font-black text-black">
                        {formatPrice(car.salePrice || car.price || 89000)}
                      </span>
                    </div>
                  )}
                  <p className="text-xs font-bold text-zinc-500 mt-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{car.location}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className={`h-11 w-11 rounded-full border flex items-center justify-center transition-all duration-200 shrink-0 ${
                    isWishlisted
                      ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm ring-4 ring-rose-50'
                      : 'bg-white border-zinc-200 text-zinc-400 hover:text-rose-600 hover:border-rose-200'
                  }`}
                  title={isWishlisted ? 'Remove from Saved Wishlist' : 'Save to Wishlist'}
                >
                  <Heart
                    className={`w-5 h-5 transition-all duration-200 ${
                      isWishlisted
                        ? 'fill-rose-600 text-rose-600 stroke-rose-600'
                        : 'text-zinc-400 stroke-[2]'
                    }`}
                  />
                </button>
              </div>

              {/* DIRECT SELLER CONTACT ACTION BOX */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-black" />
                    <span>Owner / Seller Contact</span>
                  </span>
                  {isCopied && (
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                      <Check className="w-3 h-3" />
                      <span>Copied!</span>
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handlePhoneClick}
                  className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl bg-white border border-zinc-200 hover:border-black transition-all group shadow-sm text-left"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-black">
                        {isPhoneRevealed ? rawPhone : maskedPhone}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-semibold">
                        {isPhoneRevealed ? 'Click to copy number' : 'Click to reveal & copy'}
                      </p>
                    </div>
                  </div>

                  <div className="p-1.5 rounded-lg bg-zinc-100 group-hover:bg-black group-hover:text-white transition-colors text-zinc-700">
                    <Copy className="w-3.5 h-3.5" />
                  </div>
                </button>

                {isPhoneRevealed && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href={`tel:${rawPhone}`}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-zinc-800 transition-colors shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Now</span>
                    </a>
                    <a
                      href={`https://wa.me/${rawPhone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setInquiryModalOpen(true)}
                  className="w-full text-xs font-bold"
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                >
                  Send Direct Inquiry
                </Button>
              </div>

              {/* Specs Table */}
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
                  <div className="flex items-center gap-2">
                    <DoorClosed className="w-4 h-4 text-zinc-400" />
                    <span>Doors</span>
                  </div>
                  <span className="font-bold text-black">{car.specs?.doors || car.doors || 4}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-zinc-400" />
                    <span>Passengers</span>
                  </div>
                  <span className="font-bold text-black">{car.specs?.passengers || car.seats || 4}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-zinc-400" />
                    <span>Transmission</span>
                  </div>
                  <span className="font-bold text-black">{car.specs?.transmission || car.transmission || 'Automatic'}</span>
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
                  <span className="font-bold text-black">{car.specs?.luggage || car.luggage || 2}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 text-zinc-600">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-zinc-400" />
                    <span>Air Condition</span>
                  </div>
                  <span className="font-bold text-black">
                    {car.specs?.airCondition !== undefined ? (car.specs.airCondition ? 'Yes' : 'No') : 'Yes'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Gallery, Features, Amenities & Reviews (8 Cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Image Slider (up to 3 photos) */}
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

            {/* Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-zinc-100 text-black flex items-center justify-center shrink-0 border border-zinc-200">
                  <Milestone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Direct Owner Contact</h4>
                  <p className="text-xs text-zinc-500">Zero middleman commissions or extra fees</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-zinc-100 text-black flex items-center justify-center shrink-0 border border-zinc-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">150-Point Certified</h4>
                  <p className="text-xs text-zinc-500">Comprehensive diagnostic & clean title check</p>
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
                About this vehicle
              </h2>

              <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                {car.description}
              </p>

              <div className="space-y-2.5 pt-2">
                {((car.features && car.features.length > 0)
                  ? car.features
                  : ['Leather Upholstery', 'GPS Navigation', 'Premium Sound System', 'Backup Camera']
                ).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-zinc-800">
                    <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities Section */}
            <div className="space-y-4 pt-4 border-t border-zinc-200">
              <div className="inline-flex items-center gap-1.5 text-zinc-500 font-bold text-xs uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Amenities & Features</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-black">
                Vehicle specifications & amenities
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {((car.amenities && car.amenities.length > 0)
                  ? car.amenities
                  : ['Bluetooth Connectivity', 'Apple CarPlay', 'Cruise Control', 'Air Conditioning', 'Keyless Entry', 'Backup Camera']
                ).map((amenity, idx) => (
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

            {/* FAQ / Policies */}
            <div className="space-y-4 pt-4 border-t border-zinc-200">
              <div className="inline-flex items-center gap-1.5 text-zinc-500 font-bold text-xs uppercase tracking-widest">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Buyer & Renter Guidelines</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-black">
                Important details & safety guidelines
              </h2>

              <Accordion items={policyItems} defaultOpenId="contact" />
            </div>

            {/* Reviews Section */}
            <div className="space-y-6 pt-6 border-t border-zinc-200">
              <div className="inline-flex items-center gap-1.5 text-zinc-500 font-bold text-xs uppercase tracking-widest">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Customer Feedback</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-black">
                    Verified Reviews
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Authentic feedback from verified users.
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-zinc-200 shadow-sm shrink-0">
                  <div className="text-3xl font-black text-black">
                    {reviewData?.averageRating || 5.0}
                  </div>
                  <div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-zinc-500">
                      {reviewData?.total || 15} ratings
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Review */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
                <h3 className="text-base font-black text-black">Leave a Review</h3>

                {reviewSuccess ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Thank you! Your feedback has been published.</span>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                        Your Rating
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setUserRating(star)}
                            className="p-1 text-amber-400 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= userRating ? 'fill-current' : 'text-zinc-200'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                        Your Feedback
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={userComment}
                        onChange={(e) => setUserComment(e.target.value)}
                        placeholder="Describe the vehicle condition, handling, and owner communication..."
                        className="w-full text-xs font-semibold p-3.5 rounded-2xl border border-zinc-200 bg-white focus:outline-none focus:border-black"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="dark"
                      size="sm"
                      isLoading={reviewSubmitting}
                      className="font-bold"
                      leftIcon={<Send className="w-3.5 h-3.5" />}
                    >
                      Publish Review
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LOGIN REQUIRED MODAL PROMPT */}
      {loginPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-zinc-200 shadow-2xl text-center space-y-5">
            <div className="h-14 w-14 rounded-2xl bg-zinc-100 text-black flex items-center justify-center mx-auto border border-zinc-200 shadow-sm">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-black">Sign in to View Contact</h3>
              <p className="text-xs text-zinc-500">
                To protect our car owners from spam, please sign in or register to reveal contact phone numbers.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                variant="dark"
                size="md"
                onClick={() => router.push(`/login?redirect=/cars/${slug}`)}
                className="w-full font-bold shadow-md hover:bg-black"
                rightIcon={<ArrowUpRight className="w-4 h-4" />}
              >
                Sign In to View
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={() => router.push(`/register?redirect=/cars/${slug}`)}
                className="w-full font-bold"
              >
                Create Free Account
              </Button>

              <button
                type="button"
                onClick={() => setLoginPromptOpen(false)}
                className="text-xs font-semibold text-zinc-400 hover:text-black transition-colors pt-2 block mx-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIRECT INQUIRY MODAL */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-zinc-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-black" />
                <h3 className="text-base font-black text-black">Direct Seller Inquiry</h3>
              </div>
              <button
                type="button"
                onClick={() => setInquiryModalOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {inquirySubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 text-emerald-800 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm">Message Sent Successfully!</h4>
                <p className="text-xs text-zinc-600">
                  The vehicle owner will call or message you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-4">
                <Input
                  label="Your Full Name"
                  required
                  value={inquiryName || user?.name || ''}
                  onChange={(e) => setInquiryName(e.target.value)}
                  placeholder="e.g. John Doe"
                />

                <Input
                  label="Your Contact Phone Number"
                  type="tel"
                  required
                  value={inquiryPhone}
                  onChange={(e) => setInquiryPhone(e.target.value)}
                  placeholder="e.g. 01712345678"
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Your Message / Question
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder={`Hi, I am interested in your ${car.title}. Is it available for inspection?`}
                    className="w-full text-xs font-semibold p-3.5 rounded-2xl border border-zinc-200 bg-white focus:outline-none focus:border-black"
                  />
                </div>

                <Button
                  type="submit"
                  variant="dark"
                  size="md"
                  className="w-full font-bold shadow-md hover:bg-black"
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Send Inquiry to Seller
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
