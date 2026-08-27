'use client';

import React from 'react';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { HelpCircle, Sparkles } from 'lucide-react';

export default function FAQPage() {
  const rentalFaqs: AccordionItem[] = [
    {
      id: 'license',
      title: 'What documents are required to rent a vehicle?',
      content:
        'You will need a valid driver’s license (held for at least 1 year), a passport or national ID, and a valid credit or debit card for the security deposit. International renters can present their home country license alongside an International Driving Permit (IDP).',
    },
    {
      id: 'insurance',
      title: 'Is insurance included in the rental price?',
      content:
        'Yes! All Carketo rentals include comprehensive insurance coverage (Collision Damage Waiver, Third-Party Liability, and Theft Protection). Additional zero-excess protection options are available during checkout.',
    },
    {
      id: 'deposit',
      title: 'When and how is my security deposit refunded?',
      content:
        'Security deposits are held as a temporary authorization on your card. Upon vehicle return and standard inspection, the hold is released immediately (typically reflecting in your bank account within 24 to 72 hours).',
    },
    {
      id: 'mileage',
      title: 'Are there mileage limits on rental cars?',
      content:
        'Most vehicles in our fleet feature Unlimited Mileage. Specific high-performance track-edition supercars come with a generous daily allowance of 250 miles per day with affordable per-mile rates thereafter.',
    },
    {
      id: 'cancellation',
      title: 'What is your cancellation and refund policy?',
      content:
        'You can cancel your booking up to 24 hours prior to the scheduled pickup time for a 100% full refund with zero cancellation penalties.',
    },
  ];

  const salesFaqs: AccordionItem[] = [
    {
      id: 'inspection',
      title: 'How are vehicles verified for sale on Carketo?',
      content:
        'Every vehicle listed for sale undergoes a mandatory certified 150-point mechanical, structural, and electrical diagnostic inspection with verified Carfax/Autocheck title history reports provided directly on the listing page.',
    },
    {
      id: 'financing',
      title: 'Do you offer financing and trade-in support?',
      content:
        'Yes, our certified dealership partners provide flexible financing rates and trade-in valuations. You can submit a financing inquiry directly through any car sales page.',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-zinc-200 text-zinc-800 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Help Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-black">Frequently Asked Questions</h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-lg mx-auto">
            Find answers to common questions regarding car rentals, vehicle purchases, insurance, and provider listings.
          </p>
        </div>

        {/* Rental FAQs */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-black border-b border-zinc-100 pb-3">
            Car Rental Inquiries
          </h2>
          <Accordion items={rentalFaqs} defaultOpenId="license" />
        </div>

        {/* Sales FAQs */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-black border-b border-zinc-100 pb-3">
            Vehicle Purchase & Financing
          </h2>
          <Accordion items={salesFaqs} defaultOpenId="inspection" />
        </div>
      </div>
    </div>
  );
}
